"use client";

import { useState } from "react";

/**
 * DEMO ONLY — remove later.
 * Floating button (above the WhatsApp float) that cycles the whole site's
 * font-family between the original pairing and two alternates.
 */
const FONTS = [
  { key: "default", label: "Space Grotesk + Manrope" },
  { key: "work", label: "Work Sans" },
  { key: "jakarta", label: "Plus Jakarta Sans" },
] as const;

export default function FontToggle() {
  const [i, setI] = useState(0);

  const cycle = () => {
    const next = (i + 1) % FONTS.length;
    setI(next);
    const key = FONTS[next].key;
    if (key === "default") delete document.documentElement.dataset.font;
    else document.documentElement.dataset.font = key;
  };

  return (
    <div
      className="lp-fonttoggle"
      style={{ position: "fixed", right: 26, bottom: 92, zIndex: 90, display: "flex", alignItems: "center", gap: 10 }}
    >
      <div
        style={{
          background: "#fff",
          color: "#0a1b33",
          font: "600 12px/1.3 'Manrope',sans-serif",
          padding: "8px 14px",
          borderRadius: 10,
          border: "1px solid rgba(47,196,188,.45)",
          boxShadow: "0 8px 24px rgba(10,27,51,.14)",
          whiteSpace: "nowrap",
        }}
      >
        Font: {FONTS[i].label}
      </div>
      <button
        type="button"
        onClick={cycle}
        aria-label={`Change font (current: ${FONTS[i].label})`}
        title="Demo: cycle site font"
        style={{
          width: 54,
          height: 54,
          borderRadius: "50%",
          border: "1px solid rgba(47,196,188,.4)",
          background: "linear-gradient(135deg,#0c2a45,#0a1f38)",
          color: "#fff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 10px 26px rgba(10,27,51,.25)",
        }}
      >
        <span style={{ font: "700 20px/1 'Space Grotesk',sans-serif", letterSpacing: "-.02em" }}>Aa</span>
      </button>
    </div>
  );
}
