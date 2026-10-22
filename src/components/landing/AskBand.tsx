"use client";

/**
 * The ask, set between the programme detail and the marks.
 *
 * A landing page closes on the consultation band, but by the time a reader
 * reaches the accreditations they have read the whole programme and are at the
 * point of deciding — which is a moment too early to make them scroll for
 * somewhere to say so.
 */
export default function AskBand({ onEnquire }: { onEnquire: () => void }) {
  const SANS = "'Plus Jakarta Sans',sans-serif";
  return (
    <div className="site-page-sec" style={{ background: "#f7fafc", padding: "64px 48px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ font: `800 clamp(24px,2.8vw,34px)/1.25 ${SANS}`, color: "#0a1b33", margin: "0 0 12px", letterSpacing: "-.02em" }}>
          Want the outline, the dates and the fee?
        </h2>
        <p style={{ font: `400 15px/1.8 ${SANS}`, color: "#5b6e82", margin: "0 0 24px" }}>
          Tell us where to reach you and we will send everything across, and answer whatever you want to ask first.
        </p>
        <button
          type="button"
          onClick={onEnquire}
          className="lp-btn-grad"
          style={{ border: "none", background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: `700 15px ${SANS}`, padding: "15px 34px", borderRadius: 999, cursor: "pointer" }}
        >
          Book a Consultation
        </button>
      </div>
    </div>
  );
}
