/* eslint-disable @next/next/no-img-element */
"use client";

import Reveal from "@/components/home/Reveal";
import { trustedLogos } from "@/lib/site";

/**
 * "Trusted Across Organizations and Institutions" — client and institution
 * logos supplied in the content doc. Logos arrive with mixed backgrounds, so
 * each sits in its own white card to keep the row visually even.
 */
export default function TrustedBy() {
  return (
    <div className="site-page-sec" style={{ background: "#f4f7f9", padding: "80px 48px" }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <Reveal style={{ textAlign: "center", marginBottom: 44 }}>
          <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 }}>Our Clients &amp; Partners</div>
          <h2 style={{ font: "700 clamp(26px,2.8vw,36px)/1.15 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: 0, letterSpacing: "-.02em" }}>
            Trusted Across Organizations and Institutions
          </h2>
        </Reveal>

        <div className="site-logo-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 18 }}>
          {trustedLogos.map((l) => (
            <Reveal
              key={l.name}
              style={{
                background: "#fff",
                border: "1px solid #e3eaf0",
                borderRadius: 16,
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 110,
                boxShadow: "0 2px 6px rgba(10,27,51,.05)",
              }}
            >
              <img
                src={l.src}
                alt={l.name}
                title={l.name}
                loading="lazy"
                style={{ maxWidth: "100%", maxHeight: 66, width: "auto", height: "auto", objectFit: "contain", display: "block" }}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
