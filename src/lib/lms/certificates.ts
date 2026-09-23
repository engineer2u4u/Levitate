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
 * `pending` covers the states that are nobody's fault and will resolve on
 * their own — the course is not finished, or the register has not been
 * created yet — as against a real failure worth showing as an error.
 */
export type CertificateResult =
  | { ok: true; certificate: Certificate }
  | { ok: false; pending: boolean; message: string };

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
    return { ok: false, pending: true, message: "Certificates are issued from the live site." };
  }
  try {
    const supabase = await getClient();
    const { data, error } = await supabase.rpc("issue_certificate", {
      p_course_slug: courseSlug,
      ...(name ? { p_name: name } : {}),
    });

    if (error) {
      if (missingFunction(error.code, error.message)) {
        return { ok: false, pending: true, message: "Certificate numbers are not being issued yet." };
      }
      // A course whose lesson list is not set up cannot be checked for
      // completion, which is a gap at our end, not a refusal to the learner.
      if (/no lesson list/i.test(error.message)) {
        return { ok: false, pending: true, message: "Certificates for this programme are issued by the office." };
      }
      return { ok: false, pending: /not finished/i.test(error.message), message: error.message };
    }

    const row = (Array.isArray(data) ? data[0] : data) as Certificate | null;
    if (!row) return { ok: false, pending: true, message: "No certificate has been issued yet." };
    return { ok: true, certificate: row };
  } catch (e) {
    return { ok: false, pending: false, message: (e as Error).message };
  }
}

/** A withdrawn certificate is still a record — it just is not valid. */
export const isRevoked = (c: Certificate) => Boolean(c.revoked_at);
