/**
 * Throws away the prerendered pages before a build.
 *
 * The catalogue — titles, fees, batch dates — is fetched once while the site
 * is being built and written into the HTML. Next, reasonably, only re-renders
 * a page whose own source has changed, so a page nobody edited keeps the
 * prices it was built with however long ago that was. Nothing in the repo
 * changes when the admin changes a fee, so nothing tells it to re-render.
 *
 * The result was a page that shipped last month's prices and then corrected
 * itself a moment later, once the browser had fetched the catalogue for
 * itself — a flash of the wrong fee on every first visit, and the wrong fee
 * full stop for anyone reading the HTML without running the script.
 *
 * So the rendered output goes before every build and every page is rendered
 * against the catalogue as it stands now. The compiler cache stays, which is
 * what makes a build fast; only the pages themselves are thrown away.
 */
import { rm, access } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

// The rendered pages and the manifests that say they are still good. The
// compiler's own cache (.next/cache) is deliberately not in this list.
const stale = ["server/app", "server/pages", "static", "export", "prerender-manifest.json", "app-build-manifest.json"];

// The export too. next build writes into out/ without emptying it, so a chunk
// from an earlier build stays there — and a chunk from an earlier *testing*
// build is the one thing the deploy exists to keep off the server.
let removed = 0;
for (const path of [...stale.map((p) => join(".next", p)), "out"]) {
  const full = join(root, path);
  try {
    await access(full);
  } catch {
    continue;
  }
  await rm(full, { recursive: true, force: true });
  removed += 1;
}

console.log(
  removed
    ? `[build] cleared ${removed} prerendered artefact(s) — pages will be rendered against the catalogue as it stands now`
    : "[build] nothing prerendered to clear",
);
