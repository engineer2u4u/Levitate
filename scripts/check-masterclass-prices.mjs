/**
 * Does every masterclass still on sale have a price the payment server can
 * charge?
 *
 * A masterclass page always shows its fee: it comes from src/lib/masterclass.ts
 * and is rendered into the static HTML. The order endpoint ignores that and
 * asks the catalogue (public/api/razorpay-common.php → rzp_price_for), which
 * refuses anything the database does not return as live, enrolling and priced.
 * When the two disagree the page takes the click and the server turns it down.
 *
 * Checked at deploy time rather than at build time, because the answer is the
 * database's and can change after a build — and because a deploy is the moment
 * a page starts offering something.
 *
 * Exit 1 means at least one masterclass would sell what cannot be bought.
 * A masterclass whose session has passed is skipped: its page has closed
 * registration itself, so the catalogue no longer has to agree.
 */
import fs from "node:fs";

const src = fs.readFileSync(new URL("../src/lib/masterclass.ts", import.meta.url), "utf8");

/** Each offer declares its slug, then its start, in that order. */
const offers = [...src.matchAll(/^ {2}slug: "([a-z0-9-]+)",[\s\S]*?^ {2}startsAt: "([^"]+)",/gm)].map(
  ([, slug, startsAt]) => ({ slug, startsAt }),
);

if (!offers.length) {
  console.error("    could not read any masterclass out of src/lib/masterclass.ts");
  process.exit(1);
}

const env = fs.existsSync(".env.local") ? fs.readFileSync(".env.local", "utf8") : "";
const read = (key) => (env.match(new RegExp(`^${key}=(.*)$`, "m"))?.[1] ?? "").trim();
const url = read("NEXT_PUBLIC_SUPABASE_URL").replace(/\/+$/, "");
const key = read("NEXT_PUBLIC_SUPABASE_ANON_KEY");

if (!url || !key) {
  console.log("    no catalogue credentials here — skipped");
  process.exit(0);
}

let bad = 0;
for (const { slug, startsAt } of offers) {
  if (Date.parse(startsAt) < Date.now()) {
    console.log(`    ${slug}: already run — skipped`);
    continue;
  }
  let rows;
  try {
    const res = await fetch(
      `${url}/rest/v1/courses?slug=eq.${slug}&status=eq.live&select=site_status,price_paise,price_on_request`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(15000) },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    rows = await res.json();
  } catch (e) {
    // The catalogue being unreachable from here says nothing about the server,
    // which keeps its own cache. Not a reason to stop a deploy.
    console.log(`    ${slug}: catalogue unreachable (${e.message}) — skipped`);
    continue;
  }

  const c = Array.isArray(rows) ? rows[0] : null;
  // The same three conditions as rzp_price_for().
  const why = !c
    ? "the catalogue has no live course with this slug"
    : c.site_status !== "enrolling"
      ? `the catalogue has it as "${c.site_status}", not enrolling`
      : c.price_on_request
        ? "its fee is set to on request"
        : !(c.price_paise > 0)
          ? "its fee is zero"
          : "";
  if (why) {
    console.error(`    ${slug}: the page would take payment but ${why}`);
    bad += 1;
  } else {
    console.log(`    ${slug}: ₹${(c.price_paise / 100).toLocaleString("en-IN")} — payable`);
  }
}

process.exit(bad ? 1 : 0);
