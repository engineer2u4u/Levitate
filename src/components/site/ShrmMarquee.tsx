/**
 * Site-wide accreditation ticker.
 *
 * Sits above everything in the root layout so it appears on every page. The
 * track holds two copies of the full run of messages and translates -50%,
 * which is what makes the loop seamless; `marquee` is the shared keyframe in
 * globals.css.
 */
const MESSAGES = [
  "Levitate PeopleSoft is now a SHRM Recertification Provider — recognised by one of the world's leading HR professional bodies, with eligible programmes offering SHRM Professional Development Credits (PDCs).",
  "Levitate PeopleSoft is a recognised CPD Provider, with eligible programmes offering approved CPD hours and participant certificates.",
];

/**
 * Paced by how much text there is, so adding a message slows the loop rather
 * than speeding the whole thing up — roughly 4.3 characters a second, which is
 * what the single message read at.
 */
const DURATION = Math.round(MESSAGES.join("").length / 4.3);

export default function ShrmMarquee() {
  return (
    <div
      className="site-shrm-bar"
      style={{ background: "linear-gradient(120deg,#0c2a45,#0a1f38)", overflow: "hidden", borderBottom: "1px solid rgba(127,227,220,.25)" }}
    >
      {/* Announced once each; the visual duplicates are hidden from AT. */}
      <span className="sr-only">{MESSAGES.join(" ")}</span>
      <div
        className="site-shrm-track lp-marquee-pause"
        aria-hidden="true"
        style={{ display: "flex", width: "max-content", animation: `marquee ${DURATION}s linear infinite` }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} style={{ display: "flex", alignItems: "center" }}>
            {MESSAGES.map((message) => (
              <div key={message} style={{ display: "flex", alignItems: "center" }}>
                <span style={{ font: "600 15.5px/1 'Plus Jakarta Sans',sans-serif", color: "#e6f6f4", padding: "12px 0", whiteSpace: "nowrap" }}>
                  {message}
                </span>
                <span aria-hidden style={{ color: "#7fe3dc", padding: "0 26px" }}>•</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
