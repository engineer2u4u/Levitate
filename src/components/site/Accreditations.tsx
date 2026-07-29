"use client";

import Reveal from "@/components/home/Reveal";
import { byKey, CredentialIcon } from "./credentialIcons";

/** Accreditations — official registrations and certifications. */
const SHOWN = ["iso", "dpiit", "udyam"].map(byKey);

export default function Accreditations() {
  return (
    <div className="site-page-sec" style={{ background: "#fff", padding: "76px 48px" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <Reveal style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 }}>Accreditations</div>
          <h2 style={{ font: "700 clamp(26px,2.8vw,36px)/1.15 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: 0, letterSpacing: "-.02em" }}>Recognised practice, Credentialled faculty</h2>
        </Reveal>

        <div className="site-accred-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22, maxWidth: 900, margin: "0 auto" }}>
          {SHOWN.map((c) => (
            <Reveal
              key={c.key}
              style={{
                background: "#f7fafc",
                border: "1px solid #e3eaf0",
                borderRadius: 18,
                padding: "32px 24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
                textAlign: "center",
                boxShadow: "0 2px 6px rgba(10,27,51,.05)",
              }}
            >
              <CredentialIcon c={c} size={64} />
              <div>
                <div style={{ font: "700 16px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{c.label}</div>
                <div style={{ font: "500 12.5px/1.5 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", marginTop: 5 }}>{c.sub}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
