#!/usr/bin/env node
/**
 * Checkout on localhost, against Razorpay TEST keys.
 *
 *   npm run dev:pay
 *
 * `next dev` cannot run the PHP payment endpoints, and the deployed ones hold
 * live keys — they refuse localhost for exactly that reason, so a laptop can
 * never take real money. This runs both halves here instead:
 *
 *   - PHP's built-in server on 127.0.0.1:8000, serving public/ — the same
 *     api/razorpay-*.php the site deploys — with the test keys passed in as
 *     environment variables, which razorpay-common.php reads before its
 *     config file;
 *   - `next dev`, pointed at that server and given the test key id.
 *
 * The test keys live in .env.razorpay-test at the repo root (git-ignored by
 * the .env* rule, and not a file Next loads on its own):
 *
 *   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
 *   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
 *
 * Any other key razorpay-config.php takes (SUPABASE_URL, …) may go there too;
 * anything not set falls back to razorpay-config.php as usual.
 *
 * It refuses to start with anything but a test key. Production is unaffected:
 * `next build` never reads this file, and the server's own config is untouched.
 */

import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const KEYS_FILE = path.join(ROOT, ".env.razorpay-test");
const PORT = Number(process.env.PAY_API_PORT || 8000);
const API_BASE = `http://127.0.0.1:${PORT}`;

const die = (msg) => {
  console.error(`\n[dev:pay] ${msg}\n`);
  process.exit(1);
};

/* ------------------------------------------------------------ test keys */

if (!existsSync(KEYS_FILE)) {
  die(
    "No .env.razorpay-test at the repo root. Create it with your Razorpay TEST keys\n" +
      "(Dashboard → switch to Test Mode → Account & Settings → API Keys):\n\n" +
      "  RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx\n" +
      "  RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx",
  );
}

/** KEY=VALUE lines; # comments; optional surrounding quotes. */
const keys = {};
for (const raw of readFileSync(KEYS_FILE, "utf8").split(/\r?\n/)) {
  const line = raw.trim();
  if (!line || line.startsWith("#")) continue;
  const eq = line.indexOf("=");
  if (eq < 1) continue;
  keys[line.slice(0, eq).trim()] = line.slice(eq + 1).trim().replace(/^(["'])(.*)\1$/, "$2");
}

if (!keys.RAZORPAY_KEY_ID?.startsWith("rzp_test_")) {
  die(
    keys.RAZORPAY_KEY_ID?.startsWith("rzp_live_")
      ? "RAZORPAY_KEY_ID in .env.razorpay-test is a LIVE key. Refusing — localhost testing must never take real money."
      : "RAZORPAY_KEY_ID in .env.razorpay-test must be a test key (rzp_test_…).",
  );
}
if (!keys.RAZORPAY_KEY_SECRET) die("RAZORPAY_KEY_SECRET is missing from .env.razorpay-test.");

/* ------------------------------------------------------------------ php */

/** PHP on PATH, then XAMPP's; PHP_BIN wins over both. */
function findPhp() {
  const candidates = [process.env.PHP_BIN, "php", "C:\\xampp\\php\\php.exe"].filter(Boolean);
  for (const bin of candidates) {
    const probe = spawnSync(bin, ["-r", "echo PHP_VERSION;"], { encoding: "utf8" });
    if (probe.status === 0 && probe.stdout) return { bin, version: probe.stdout.trim() };
  }
  return null;
}

const php = findPhp();
if (!php) die("PHP not found. Install it, add it to PATH, or set PHP_BIN to php.exe.");
const [major, minor] = php.version.split(".").map(Number);
if (major < 8 || (major === 8 && minor < 1)) die(`PHP ${php.version} is too old; the endpoints need 8.1 or later.`);

/* ------------------------------------------------------------ processes */

const children = [];

function run(name, cmd, args, env) {
  const child = spawn(cmd, args, { cwd: ROOT, env: { ...process.env, ...env }, stdio: ["ignore", "pipe", "pipe"] });
  const prefix = (chunk) =>
    chunk
      .toString()
      .split(/\r?\n/)
      .filter(Boolean)
      .map((l) => `[${name}] ${l}`)
      .join("\n");
  child.stdout.on("data", (d) => console.log(prefix(d)));
  child.stderr.on("data", (d) => console.error(prefix(d)));
  child.on("exit", (code) => {
    console.log(`[${name}] exited (${code ?? "signal"}) — stopping the other process.`);
    shutdown(code ?? 0);
  });
  children.push(child);
  return child;
}

let stopping = false;
function shutdown(code) {
  if (stopping) return;
  stopping = true;
  for (const c of children) if (c.exitCode === null) c.kill();
  process.exit(code);
}
process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

console.log(`[dev:pay] PHP ${php.version} · Razorpay TEST key ${keys.RAZORPAY_KEY_ID.slice(0, 14)}… · payment API ${API_BASE}`);

// The whole keys file goes to PHP: it may carry more than the two Razorpay
// keys, and each entry overrides razorpay-config.php for this run only.
run("php", php.bin, ["-S", `127.0.0.1:${PORT}`, "-t", "public"], keys);

// Process environment outranks every .env file Next loads, so these override
// whatever .env.local says for this run, and only for it.
run("next", process.execPath, [path.join(ROOT, "node_modules", "next", "dist", "bin", "next"), "dev", "--webpack"], {
  NEXT_PUBLIC_PAYMENT_API_BASE: API_BASE,
  NEXT_PUBLIC_RAZORPAY_KEY_ID: keys.RAZORPAY_KEY_ID,
});
