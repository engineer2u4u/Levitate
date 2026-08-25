/**
 * Site-wide SHRM recertification ticker.
 *
 * Sits above everything in the root layout so it appears on every page. The
 * track holds two copies of the message and translates -50%, which is what
 * makes the loop seamless; `marquee` is the shared keyframe in globals.css.
 */
const MESSAGE =
  "Levitate PeopleSoft is now a SHRM Recertification Provider — recognised by one of the world's leading HR professional bodies, with eligible programmes offering SHRM Professional Development Credits (PDCs).";

export default function ShrmMarquee() {
  return (
    <div
      className="site-shrm-bar"
      style={{ background: "linear-gradient(120deg,#0c2a45,#0a1f38)", overflow: "hidden", borderBottom: "1px solid rgba(127,227,220,.25)" }}
    >
      {/* The text is announced once; the visual duplicate is hidden from AT. */}
      <span className="sr-only">{MESSAGE}</span>
      <div
        className="site-shrm-track lp-marquee-pause"
        aria-hidden="true"
        style={{ display: "flex", width: "max-content", animation: "marquee 46s linear infinite" }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} style={{ display: "flex", alignItems: "center" }}>
            <span style={{ font: "600 12.5px/1 'Plus Jakarta Sans',sans-serif", color: "#e6f6f4", padding: "9px 0", whiteSpace: "nowrap" }}>
              {MESSAGE}
            </span>
            <span aria-hidden style={{ color: "#7fe3dc", padding: "0 26px" }}>•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
