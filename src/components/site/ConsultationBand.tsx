import Link from "next/link";
import { contact } from "@/lib/site";

/**
 * "Talk it through with us before you decide."
 *
 * Runs on every page, and twice on the long ones — a visitor who has read to
 * the bottom of a programme page should not have to scroll back up to find a
 * way to book. The header's CTA is hidden on phones, so without this a page
 * has no visible way to book that does not start with opening the menu.
 */
export default function ConsultationBand({
  subject,
  background = "#f4f7f9",
  padding = "0 48px 72px",
}: {
  /** What the conversation would be about — the programme, or the work. */
  subject?: string;
  background?: string;
  padding?: string;
}) {
  return (
    <div className="site-page-sec" style={{ background, padding }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div className="lms-cta-band" style={{ background: "linear-gradient(120deg,#0c2a45,#0a1f38)", borderRadius: 22, padding: "36px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 28, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ font: "700 11px 'Plus Jakarta Sans',sans-serif", color: "#7fe3dc", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 10 }}>
              Not sure if this is the right fit?
            </div>
            <div style={{ font: "700 22px/1.3 'Plus Jakarta Sans',sans-serif", color: "#fff", letterSpacing: "-.01em" }}>
              Talk it through with us before you decide.
            </div>
            <p style={{ font: "400 14px/1.7 'Plus Jakarta Sans',sans-serif", color: "rgba(255,255,255,.72)", margin: "8px 0 0", maxWidth: 520 }}>
              {subject
                ? `We will walk you through the curriculum, the batch dates and whether ${subject} suits where you are heading.`
                : "Tell us what your team or your career needs, and we will point you to the right programme — or tell you honestly if we are not it."}
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/contact" className="lp-btn-white" style={{ background: "#fff", color: "#0a1b33", font: "700 15px 'Plus Jakarta Sans',sans-serif", padding: "16px 30px", borderRadius: 999, whiteSpace: "nowrap" }}>
              Book a Consultation
            </Link>
            <a href={`tel:${contact.tel}`} className="lp-btn-outline-light" style={{ border: "1.5px solid rgba(255,255,255,.45)", color: "#fff", font: "700 15px 'Plus Jakarta Sans',sans-serif", padding: "16px 26px", borderRadius: 999, whiteSpace: "nowrap" }}>
              {contact.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
