"use client";

import Reveal from "@/components/home/Reveal";
import { CREDENTIALS, CredentialIcon } from "./credentialIcons";

/** Credentials strip (light) — ported from the supplied credential-icons.html. */
export default function CredentialsStrip() {
  return (
    <div className="site-page-sec" style={{ background: "#f7fafc", borderTop: "1px solid #e3eaf0", borderBottom: "1px solid #e3eaf0", padding: "40px 48px" }}>
      <Reveal
        className="site-credentials"
        style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "28px 40px", alignItems: "center", justifyContent: "center" }}
      >
        {CREDENTIALS.map((c) => (
          <div key={c.key} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <CredentialIcon c={c} size={34} />
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
