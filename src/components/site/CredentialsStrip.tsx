"use client";

import Reveal from "@/components/home/Reveal";

/**
 * Credentials strip (light) — monoline 64x64 marks on a single grid, 3.5 stroke,
 * round caps, drawn with currentColor so the colour comes from CSS.
 * Ported from the supplied credential-icons.html.
 */

const iconProps = {
  viewBox: "0 0 64 64",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 3.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  style: { width: "100%", height: "100%", display: "block" as const },
};

const CREDENTIALS = [
  {
    label: "ISO Certified",
    sub: "ISO 9001:2015",
    title: "ISO certified",
    paths: (
      <>
        <path d="M 32.00 6.00 L 35.56 9.40 L 40.24 7.88 L 41.98 12.49 L 46.85 13.15 L 46.42 18.06 L 50.52 20.77 L 48.00 25.00 L 50.52 29.23 L 46.42 31.94 L 46.85 36.85 L 41.98 37.51 L 40.24 42.12 L 35.56 40.60 L 32.00 44.00 L 28.44 40.60 L 23.76 42.12 L 22.02 37.51 L 17.15 36.85 L 17.58 31.94 L 13.48 29.23 L 16.00 25.00 L 13.48 20.77 L 17.58 18.06 L 17.15 13.15 L 22.02 12.49 L 23.76 7.88 L 28.44 9.40 Z" />
        <path d="M23.5 25.5 L29.5 31.5 L40.5 20.5" />
        <path d="M23 40 V56 L32 50.5 L41 56 V40" />
      </>
    ),
  },
  {
    label: "DPIIT Recognised",
    sub: "Startup India",
    title: "DPIIT recognised startup",
    paths: (
      <>
        <path d="M32 6 L53 13.5 V31 C53 43.5 44 51.5 32 58 C20 51.5 11 43.5 11 31 V13.5 Z" />
        <path d="M21 37.5 L28.5 30 L34 35.5 L43 25.5" />
        <path d="M35.5 25.5 H43 V33" />
      </>
    ),
  },
  {
    label: "MSME Registered",
    sub: "Micro / Small / Medium",
    title: "MSME registered",
    paths: (
      <>
        <path d="M6 54 H58" />
        <path d="M11 54 V38 A3 3 0 0 1 14 35 H21 A3 3 0 0 1 24 38 V54" />
        <path d="M26 54 V28 A3 3 0 0 1 29 25 H36 A3 3 0 0 1 39 28 V54" />
        <path d="M41 54 V17 A3 3 0 0 1 44 14 H51 A3 3 0 0 1 54 17 V54" />
        <path d="M17.5 43 v0.1" />
        <path d="M32.5 33 v0.1" />
        <path d="M47.5 22 v0.1" />
      </>
    ),
  },
  {
    label: "Udyam Registration",
    sub: "UDYAM-XX-00-0000000",
    title: "Udyam registration",
    paths: (
      <>
        <path d="M11 12 A4 4 0 0 1 15 8 H32 L40 16 V48 A4 4 0 0 1 36 52 H15 A4 4 0 0 1 11 48 Z" />
        <path d="M32 8 V16 H40" />
        <path d="M18 25 H31" />
        <path d="M18 33 H27" />
        <circle cx="49" cy="38" r="9" />
        <path d="M44.5 45.5 V58 L49 54.5 L53.5 58 V45.5" />
      </>
    ),
  },
];

export default function CredentialsStrip() {
  return (
    <div className="site-page-sec" style={{ background: "#f7fafc", borderTop: "1px solid #e3eaf0", borderBottom: "1px solid #e3eaf0", padding: "40px 48px" }}>
      <Reveal
        className="site-credentials"
        style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "28px 40px", alignItems: "center", justifyContent: "center" }}
      >
        {CREDENTIALS.map((c) => (
          <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ display: "block", width: 34, height: 34, color: "#1b8f88", flex: "none" }}>
              <svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label={c.title} {...iconProps}>
                <title>{c.title}</title>
                {c.paths}
              </svg>
            </span>
            <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
              <strong style={{ font: "600 13.5px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{c.label}</strong>
              <em style={{ fontStyle: "normal", font: "400 11.5px 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>{c.sub}</em>
            </span>
          </div>
        ))}
      </Reveal>
    </div>
  );
}
