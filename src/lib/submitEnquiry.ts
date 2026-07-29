/**
 * Posts an enquiry form to the PHP handler that relays through Microsoft 365.
 *
 * The endpoint is a plain PHP file shipped in /public, so it survives the
 * static export and runs on SiteGround's Apache. Override with
 * NEXT_PUBLIC_ENQUIRY_ENDPOINT if the handler moves.
 */
export const ENQUIRY_ENDPOINT = process.env.NEXT_PUBLIC_ENQUIRY_ENDPOINT ?? "/api/enquiry.php";

export type EnquiryResult = { ok: true } | { ok: false; error: string };

export async function submitEnquiry(form: HTMLFormElement, extra: Record<string, string> = {}): Promise<EnquiryResult> {
  const data = new FormData(form);
  for (const [k, v] of Object.entries(extra)) data.set(k, v);
  if (typeof window !== "undefined") data.set("source", window.location.pathname);

  try {
    const res = await fetch(ENQUIRY_ENDPOINT, { method: "POST", body: data });

    // A misconfigured host can return HTML (or the raw PHP file); don't blow up on it.
    let payload: { ok?: boolean; error?: string } = {};
    try {
      payload = await res.json();
    } catch {
      return { ok: false, error: "The form could not be submitted right now. Please email us directly." };
    }

    if (res.ok && payload.ok) return { ok: true };
    return { ok: false, error: payload.error || "We could not send your enquiry. Please email us directly." };
  } catch {
    return { ok: false, error: "Network error — please check your connection and try again." };
  }
}
