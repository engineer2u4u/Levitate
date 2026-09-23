import { getClient, supabaseConfigured } from "./supabase";

/**
 * The certificate register.
 *
 * A certificate is a record before it is a picture: the number has to come
 * from somewhere that can answer "is this real?" later. `issue_certificate`
 * is that somewhere — it checks the learner has paid and finished, takes the
 * number from a monthly sequence, and snapshots the name, the course title,
 * the hours and the completion date as they stood at that moment.
 *
 * The snapshot is the point. Someone who corrects their name next year must
 * not silently change a certificate already in circulation, so everything
 * printed comes from the row rather than from the profile or the catalogue.
 */
export type Certificate = {
  id: string;
  cert_no: string;
  recipient_name: string;
  course_title: string;
  hours: string | null;
  completed_on: string | null;
  issued_at: string;
  revoked_at: string | null;
  revoked_reason: string | null;
};

/**
 * Why there is no certificate to show.
 *
 * The reason matters, because two of these are not alike. "not-finished" is
 * the learner's own state and the one thing that should hold a certificate
 * back. "no-register" is ours — the register has not been created yet, or
 * this build has no database — and holding someone's certificate for a gap at
 * our end would be punishing them for our plumbing.
 */
export type CertificateGap = "not-finished" | "no-register" | "failed";

export type CertificateResult =
  | { ok: true; certificate: Certificate }
  | { ok: false; reason: CertificateGap; message: string };

/** The register is not installed until its migration has been run. */
const missingFunction = (code?: string, message?: string) =>
  code === "PGRST202" || /could not find the function|schema cache/i.test(message ?? "");

/**
 * Issues this learner's certificate, or hands back the one they already have.
 *
 * Idempotent on the server, so opening the page twice or clicking twice
 * cannot mint a second number.
 */
export async function issueCertificate(courseSlug: string, name?: string): Promise<CertificateResult> {
  if (!supabaseConfigured) {
    return { ok: false, reason: "no-register", message: "Certificate numbers are issued from the live site." };
  }
  try {
    const supabase = await getClient();
    const { data, error } = await supabase.rpc("issue_certificate", {
      p_course_slug: courseSlug,
      ...(name ? { p_name: name } : {}),
    });

    if (error) {
      if (missingFunction(error.code, error.message)) {
        return { ok: false, reason: "no-register", message: "Certificate numbers are not being issued yet." };
      }
      // A course whose lesson list is not set up cannot be checked for
      // completion, which is a gap at our end, not a refusal to the learner.
      if (/no lesson list/i.test(error.message)) {
        return { ok: false, reason: "no-register", message: "Certificate numbers for this programme are issued by the office." };
      }
      return {
        ok: false,
        reason: /not finished/i.test(error.message) ? "not-finished" : "failed",
        message: error.message,
      };
    }

    const row = (Array.isArray(data) ? data[0] : data) as Certificate | null;
    if (!row) return { ok: false, reason: "no-register", message: "No certificate has been issued yet." };
    return { ok: true, certificate: row };
  } catch (e) {
    return { ok: false, reason: "failed", message: (e as Error).message };
  }
}

/** A withdrawn certificate is still a record — it just is not valid. */
export const isRevoked = (c: Certificate) => Boolean(c.revoked_at);
