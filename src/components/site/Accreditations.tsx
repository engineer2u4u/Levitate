/* eslint-disable @next/next/no-img-element */
"use client";

import Reveal from "@/components/home/Reveal";
import { accreditationLogos } from "@/lib/site";

/** Accreditations strip — client-supplied recognition badges. */
export default function Accreditations() {
  return (
    <div className="site-page-sec" style={{ background: "#fff", padding: "76px 48px" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <Reveal style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 }}>Accreditations</div>
          <h2 style={{ font: "700 clamp(26px,2.8vw,36px)/1.15 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: 0, letterSpacing: "-.02em" }}>Recognised practice, Credentialled faculty</h2>
        </Reveal>

        <div className="site-accred-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22, maxWidth: 900, margin: "0 auto" }}>
          {accreditationLogos.map((a) => (
            <Reveal
              key={a.name}
              style={{
                background: "#f7fafc",
                border: "1px solid #e3eaf0",
                borderRadius: 18,
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
                textAlign: "center",
                boxShadow: "0 2px 6px rgba(10,27,51,.05)",
              }}
            >
              <img src={a.src} alt={a.name} title={a.name} loading="lazy" style={{ height: 96, width: "auto", maxWidth: "100%", objectFit: "contain", display: "block" }} />
              <div style={{ font: "500 12px/1.5 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>{a.note}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
