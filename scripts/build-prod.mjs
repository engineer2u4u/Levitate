/**
 * The production build, in a form no shell can get wrong.
 *
 * The flags that make a build a testing build live in .env.local, and the
 * usual way to neutralise them — setting them empty on the command line —
 * does not mean the same thing in every shell:
 *
 *   bash        FLAG= next build      the child sees ""        .env.local is overridden
 *   PowerShell  $env:FLAG = ""        the child sees nothing   .env.local wins
 *
 * PowerShell's assignment of an empty string deletes the variable, so the
 * careful-looking incantation quietly hands control back to the file it was
 * meant to override. Two sessions have now been caught by that, and the
 * second one shipped a chunk with the live-key requirement dropped, which
 * would have let a test card buy a real seat.
 *
 * Setting them here removes the question. Next does not overwrite a variable
 * the process already has, so these win wherever this is run from — and a
 * value is written rather than deleted, which is the whole difference.
 */
import { spawn } from "node:child_process";

/**
 * What production means, stated rather than implied by absence.
 *
 * LMS_TESTING is compared against "1", so "0" is off. The other three are
 * deliberately empty: production has no Razorpay key in the bundle, because
 * the order endpoint hands the live key to the checkout itself, and no API
 * base, because the endpoints are same-origin.
 */
const PRODUCTION = {
  NEXT_PUBLIC_LMS_TESTING: "0",
  NEXT_PUBLIC_PAYMENT_MODE: "",
  NEXT_PUBLIC_RAZORPAY_KEY_ID: "",
  NEXT_PUBLIC_PAYMENT_API_BASE: "",
};

// The pages go before the build, so every one is rendered against the
// catalogue as it stands rather than reused from whenever it last changed.
await import("./clear-prerender.mjs");

for (const [k, v] of Object.entries(PRODUCTION)) process.env[k] = v;
console.log("[build] production flags set here, not by the shell:", Object.keys(PRODUCTION).join(", "));

const next = spawn(process.execPath, ["node_modules/next/dist/bin/next", "build", "--webpack"], {
  stdio: "inherit",
  env: process.env,
});
next.on("exit", (code) => process.exit(code ?? 1));
