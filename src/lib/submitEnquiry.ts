import emailjs from "@emailjs/browser";
import { supabaseConfig, supabaseConfigured } from "@/lib/lms/auth";

/**
 * Sends an enquiry two ways: an EmailJS email to the office, and a row in the
 * `enquiries` table the admin portal reads.
 *
 * EmailJS connects to the Outlook mailbox over OAuth rather than SMTP AUTH,
 * so it works even with Microsoft 365 Security Defaults enabled (which block
 * legacy SMTP authentication outright).
 *
 * The table exists because an email is not a record. Nobody can filter an
 * inbox by programme or export it to a spreadsheet, and an email that fails
 * to arrive is an enquiry lost without trace.
 *
 * The two run side by side and the enquiry counts as received if EITHER
 * lands. Telling a visitor their message failed when it is sitting safely in
 * the database — or in the inbox — would send them away for nothing.
 *
 * The EmailJS public key is meant to be visible in the browser — restrict
 * usage in the EmailJS dashboard by allow-listing levitatepeoplesoft.com.
 */
// These are not secrets — EmailJS ships them to the browser by design, so they
// live here to keep builds reproducible. Abuse is prevented by allow-listing
// levitatepeoplesoft.com under Account -> Security in the EmailJS dashboard.
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "service_aec5743";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "template_or84baf";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "565sP1Y5l58ASCMJe";

export type EnquiryResult = { ok: true } | { ok: false; error: string };

/** Which form an enquiry came from. Matches the check constraint on the table. */
export type EnquiryForm = "popup" | "contact" | "service" | "kit" | "masterclass" | "other";

const val = (data: FormData, key: string) => {
  const v = data.get(key);
  return typeof v === "string" ? v.trim() : "";
};

/**
 * A client with no session of its own. An enquiry is anonymous by nature,
 * and the insert policy admits the anon role — borrowing a signed-in
 * learner's session would only tie their account to a public form for no
 * reason.
 */
let dbPromise: Promise<import("@supabase/supabase-js").SupabaseClient> | null = null;
function db() {
  dbPromise ??= import("@supabase/supabase-js").then((m) =>
    m.createClient(supabaseConfig.url, supabaseConfig.anonKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    }),
  );
  return dbPromise;
}

/** Trims to the column's limit, so one overlong field cannot fail the row. */
const cap = (v: string, n: number) => (v.length > n ? v.slice(0, n) : v);

async function record(row: Record<string, string>): Promise<boolean> {
  if (!supabaseConfigured) return false;
  try {
    const client = await db();
    // return=minimal: the anon role may insert but not read, so asking for
    // the row back would fail the whole request.
    let { error } = await client.from("enquiries").insert(row);
    // 23514 is a check violation: a form name newer than the database's list
    // of them. The row is kept under "other" rather than lost while the
    // migration that adds the name is still to be run.
    if (error?.code === "23514" && row.form !== "other") {
      ({ error } = await client.from("enquiries").insert({ ...row, form: "other" }));
    }
    if (error) console.error("[enquiry] could not record:", error.message);
    return !error;
  } catch (err) {
    console.error("[enquiry] could not record:", err);
    return false;
  }
}

async function email(params: Record<string, string>): Promise<{ ok: boolean; detail: string }> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) return { ok: false, detail: "" };
  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, { publicKey: PUBLIC_KEY });
    return { ok: true, detail: "" };
  } catch (err: unknown) {
    const detail =
      typeof err === "object" && err !== null && "text" in err && typeof (err as { text: unknown }).text === "string"
        ? (err as { text: string }).text
        : "";
    console.error("[enquiry] EmailJS send failed:", err);
    return { ok: false, detail };
  }
}

export async function submitEnquiry(
  form: HTMLFormElement,
  extra: Record<string, string> = {},
  opts: {
    /** Which form this is — drives the admin's filter. */
    form?: EnquiryForm;
    /**
     * False for submissions that use this path to send an email but are not
     * enquiries — a signed learner acknowledgement, say. They would be noise
     * in a list of people asking about programmes.
     */
    store?: boolean;
  } = {},
): Promise<EnquiryResult> {
  const data = new FormData(form);

  // Honeypot. It is a CHECKBOX on purpose: Chrome autofill populates every text
  // input in a form regardless of name or visibility, which silently swallowed
  // real enquiries. Autofill never ticks checkboxes, but bots that fill every
  // input will. An unticked checkbox is absent from FormData entirely.
  if (data.get("hp_zx") !== null) {
    console.warn("[enquiry] honeypot triggered — nothing sent.");
    return { ok: true };
  }

  const page = extra.source || (typeof window !== "undefined" ? window.location.pathname : "");
  const intent = extra.intent || val(data, "intent");
  const message = extra.message || val(data, "message");

  // Keys here must match the {{variables}} used in the EmailJS template.
  const params: Record<string, string> = {
    from_name: val(data, "name"),
    from_email: val(data, "email"),
    phone: val(data, "phone") || "—",
    organization: val(data, "organization") || "—",
    intent: intent || "—",
    participants: val(data, "participants") || "—",
    mode: val(data, "mode") || "—",
    message: message || "—",
    // A form may name where it came from; otherwise the page it sits on.
    source: page,
    subject: `Website enquiry: ${intent || "General"}`,
  };

  const [mailed, stored] = await Promise.all([
    email(params),
    opts.store === false
      ? Promise.resolve(false)
      : record({
          form: opts.form ?? "other",
          name: cap(val(data, "name"), 200),
          email: cap(val(data, "email"), 320),
          phone: cap(val(data, "phone"), 40),
          organization: cap(val(data, "organization"), 200),
          intent: cap(intent, 300),
          participants: cap(val(data, "participants"), 60),
          mode: cap(val(data, "mode"), 60),
          message: cap(message, 5000),
          page: cap(page, 300),
        }),
  ]);

  if (mailed.ok || stored) return { ok: true };

  return {
    ok: false,
    error: mailed.detail ? `We could not send your enquiry (${mailed.detail}).` : "We could not send your enquiry just now.",
  };
}
