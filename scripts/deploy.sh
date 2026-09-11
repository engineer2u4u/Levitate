#!/usr/bin/env bash
#
# Deploys the static export in out/ to levitatepeoplesoft.com on SiteGround.
#
#   npm run build       (with the production flags — see "Build" below)
#   scripts/deploy.sh
#   DRY_RUN=1 scripts/deploy.sh    (checks and verification only; changes nothing)
#
# The site shares its web root with things it does not own. The main one is
# the LMS admin portal at /admin-panel/, built and uploaded separately from its
# own repository. A deploy that removed or overwrote any of them would take
# them down with no warning, so this script is built around not doing that:
#
#   - Files are ADDED and REPLACED, never deleted. There is no rsync --delete
#     and no "clear the folder first". Anything on the server that is not in
#     out/ is left exactly as it is.
#   - The one deletion — pruning old build chunks — is confined to
#     public_html/_next/static/, which only this site writes to. The admin
#     builds with basePath /admin-panel, so its chunks live in
#     admin-panel/_next/static/ and are never inside the pruned folder.
#   - Paths in PRESERVE are excluded on extraction as well, so even a future
#     route that happened to share a name could not overwrite them.
#   - The root .htaccess is not overwritten if the live one differs from the
#     repo's. /admin-panel inherits its HTTPS and trailing-slash redirects from
#     it, so a hand edit on the server — or a careless one here — matters to
#     more than this site. Set ALLOW_HTACCESS=1 to ship a deliberate change.
#
# Build: payments and the LMS stay closed on the public site unless and until
# that is decided, so production builds unset the testing and payment flags:
#
#   NEXT_PUBLIC_LMS_TESTING= NEXT_PUBLIC_PAYMENT_MODE= \
#   NEXT_PUBLIC_RAZORPAY_KEY_ID= NEXT_PUBLIC_PAYMENT_API_BASE= npm run build

set -euo pipefail

HOST="u47-jossnzylkm8o@35.213.176.216"
PORT=18765
KEY="${HOME}/.ssh/levitate-deploy"
SITE="www/levitatepeoplesoft.com"
ROOT="${SITE}/public_html"
ORIGIN="https://levitatepeoplesoft.com"

# Owned by something other than this build. Never removed, never overwritten.
PRESERVE=(admin-panel .well-known api/php_errorlog)

ssh_() { ssh -o BatchMode=yes -o ConnectTimeout=25 -o ServerAliveInterval=15 -p "$PORT" -i "$KEY" -o IdentitiesOnly=yes "$HOST" "$@"; }
die() { echo "ABORT: $*" >&2; exit 1; }
say() { echo "--> $*"; }

cd "$(dirname "$0")/.."

# ------------------------------------------------------------------ checks
[ -f out/index.html ] || die "out/ has no index.html — run the production build first."

for p in "${PRESERVE[@]}"; do
  [ -e "out/$p" ] && die "out/$p exists. That path belongs to something else on the server and this deploy would overwrite it."
done

# A testing build puts the LMS in the public nav. It is never right for production.
grep -q 'href="/lms/"' out/index.html && die "this is a testing build (the LMS is in the nav). Rebuild with NEXT_PUBLIC_LMS_TESTING unset."

# Verification builds switch the Google Ads tag off so scripted runs do not
# count as visits, and leave out/ in that state. Shipping one would silently
# stop conversion tracking and the remarketing audience.
grep -q "AW-18437850806" out/index.html || die "out/ has no Google Ads tag — it was built with NEXT_PUBLIC_ANALYTICS_OFF=1. Rebuild without it."

say "comparing the live root .htaccess with the build's"
LIVE_HT="$(mktemp)"; trap 'rm -f "$LIVE_HT"' EXIT
ssh_ "cat ${ROOT}/.htaccess" | tr -d '\r' > "$LIVE_HT"
if ! diff -q "$LIVE_HT" <(tr -d '\r' < out/.htaccess) > /dev/null; then
  if [ "${ALLOW_HTACCESS:-}" = "1" ]; then
    say "root .htaccess changes (ALLOW_HTACCESS=1):"; diff "$LIVE_HT" <(tr -d '\r' < out/.htaccess) || true
  else
    diff "$LIVE_HT" <(tr -d '\r' < out/.htaccess) || true
    die "the live root .htaccess differs from the build's. /admin-panel depends on it. Review the diff above; re-run with ALLOW_HTACCESS=1 if the change is intended."
  fi
fi

STAMP="(none — dry run)"
if [ "${DRY_RUN:-}" = "1" ]; then
  say "DRY_RUN: checks passed — skipping backup, upload and prune"
else

# ------------------------------------------------------------------ backup
STAMP="$(date +%Y%m%d-%H%M%S)"
say "backing up public_html (admin-panel included) to backup-public_html-${STAMP}.tar.gz"
ssh_ "cd ${SITE} && tar czf backup-public_html-${STAMP}.tar.gz public_html && ls -lh backup-public_html-${STAMP}.tar.gz"

# ------------------------------------------------------------------ upload
# Apache and PHP on the host want LF; Windows checkouts produce CRLF.
for f in out/api/*.php out/.htaccess; do
  [ -f "$f" ] && node -e "const fs=require('fs');const p=process.argv[1];fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n'))" "$f"
done

EXCLUDES=""
for p in "${PRESERVE[@]}"; do EXCLUDES+=" --exclude=./${p} --exclude=./${p}/*"; done

say "uploading $(find out -type f | wc -l | tr -d ' ') files"
tar -C out -czf - . | ssh_ "cat > ~/lvt-deploy.tgz"
# Extract over the top. No --delete: whatever out/ does not contain survives.
ssh_ "cd ${ROOT} && tar xzf ~/lvt-deploy.tgz ${EXCLUDES} && rm -f ~/lvt-deploy.tgz"

# ------------------------------------------------------------------- prune
# Only inside the site's own static folder, and only what the new build does
# not reference.
BUILD="$(ls out/_next/static/ | grep -vE '^(chunks|media|css)$' | head -1)"
[ -n "$BUILD" ] || die "could not find the build id in out/_next/static/"
say "pruning superseded builds and chunks in _next/static/ (keeping ${BUILD})"
(cd out/_next/static/chunks && ls) | ssh_ "cat > ~/keep.txt"
ssh_ "set -e
  cd ${ROOT}/_next/static
  ls | grep -vE '^(chunks|media|css)$' | grep -vx '${BUILD}' | xargs -r rm -rf
  cd chunks
  ls | grep -vxF -f ~/keep.txt > ~/stale.txt || true
  # Refuse outright if anything on the delete list is part of the new build.
  if grep -qxF -f ~/keep.txt ~/stale.txt; then echo 'overlap with the new build — not pruning'; exit 1; fi
  xargs -r rm -f < ~/stale.txt
  echo \"   removed \$(wc -l < ~/stale.txt) stale chunk(s)\"
  rm -f ~/keep.txt ~/stale.txt"

fi  # DRY_RUN

# ------------------------------------------------------------------ verify
say "verifying"
FAIL=0
check() {
  local code; code="$(curl -s -o /dev/null -w '%{http_code}' "$ORIGIN$1")"
  printf "   %-34s %s\n" "$1" "$code"
  [ "$code" = "$2" ] || FAIL=1
}
check /                                        200
check /certifications/                         200
check /posh-train-the-trainer-certification/   200
check /contact/                                200
check /admin-panel/                            200
check /admin-panel/enquiries/                  200
ADMIN_CHUNK="$(curl -s "$ORIGIN/admin-panel/" | grep -o '/admin-panel/_next/static/chunks/[^"]*\.js' | head -1)"
[ -n "$ADMIN_CHUNK" ] && check "$ADMIN_CHUNK" 200 || { echo "   admin-panel page references no chunks"; FAIL=1; }
ssh_ "test -d ${ROOT}/.well-known" && echo "   .well-known/                       present" || { echo "   .well-known/ MISSING"; FAIL=1; }

[ "$FAIL" = "0" ] || die "post-deploy checks failed — the backup is backup-public_html-${STAMP}.tar.gz"
say "done"
