import emailjs from "@emailjs/browser";

/**
 * Sends enquiry forms via EmailJS.
 *
 * EmailJS connects to the Outlook mailbox over OAuth rather than SMTP AUTH,
 * so it works even with Microsoft 365 Security Defaults enabled (which block
 * legacy SMTP authentication outright).
 *
 * The public key is meant to be visible in the browser — restrict usage in the
 * EmailJS dashboard by allow-listing levitatepeoplesoft.com.
 */
// These are not secrets — EmailJS ships them to the browser by design, so they
// live here to keep builds reproducible. Abuse is prevented by allow-listing
// levitatepeoplesoft.com under Account -> Security in the EmailJS dashboard.
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "service_aec5743";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "template_or84baf";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "565sP1Y5l58ASCMJe";

export type EnquiryResult = { ok: true } | { ok: false; error: string };

const val = (data: FormData, key: string) => {
  const v = data.get(key);
  return typeof v === "string" ? v.trim() : "";
};

export async function submitEnquiry(form: HTMLFormElement, extra: Record<string, string> = {}): Promise<EnquiryResult> {
  const data = new FormData(form);

  // Honeypot. It is a CHECKBOX on purpose: Chrome autofill populates every text
  // input in a form regardless of name or visibility, which silently swallowed
  // real enquiries. Autofill never ticks checkboxes, but bots that fill every
  // input will. An unticked checkbox is absent from FormData entirely.
  if (data.get("hp_zx") !== null) {
    console.warn("[enquiry] honeypot triggered — nothing sent.");
    return { ok: true };
  }

  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    return { ok: false, error: "The enquiry form is not configured yet." };
  }

  // Keys here must match the {{variables}} used in the EmailJS template.
  const params: Record<string, string> = {
    from_name: val(data, "name"),
    from_email: val(data, "email"),
    phone: val(data, "phone"),
    organization: val(data, "organization") || "—",
    intent: extra.intent || val(data, "intent") || "—",
    participants: val(data, "participants") || "—",
    mode: val(data, "mode") || "—",
    message: val(data, "message") || "—",
    source: typeof window !== "undefined" ? window.location.pathname : "",
    subject: `Website enquiry: ${extra.intent || val(data, "intent") || "General"}`,
  };

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, { publicKey: PUBLIC_KEY });
    return { ok: true };
  } catch (err: unknown) {
    const detail =
      typeof err === "object" && err !== null && "text" in err && typeof (err as { text: unknown }).text === "string"
        ? (err as { text: string }).text
        : "";
    console.error("[enquiry] EmailJS send failed:", err);
    return { ok: false, error: detail ? `We could not send your enquiry (${detail}).` : "We could not send your enquiry just now." };
  }
}
