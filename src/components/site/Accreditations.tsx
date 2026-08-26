/* eslint-disable @next/next/no-img-element */
"use client";

import { Fragment } from "react";
import Reveal from "@/components/home/Reveal";
import { byKey, CredentialIcon } from "./credentialIcons";

/** Accreditations — official registrations and certifications. */
const SHOWN = ["iso", "dpiit", "udyam"].map(byKey);

/** Issued badges, each shown with the statement its awarding body allows. */
const BADGES = [
  {
    src: "/assets/accreditations/shrm.png",
    alt: "SHRM Recertification Provider — SHRM-CP and SHRM-SCP",
    width: 215,
    statement:
      "Levitate PeopleSoft is recognised by SHRM to offer Professional Development Credits for SHRM-CP and SHRM-SCP.",
  },
  {
    src: "/assets/accreditations/cpd-member.png",
    alt: "CPD Member — The CPD Certification Service",
    width: 215,
    statement:
      "Levitate PeopleSoft is a recognised CPD Provider, with eligible programmes offering approved CPD hours and participant certificates.",
  },
];

/**
 * `spaceBelow` adds the bottom padding the section normally goes without.
 * The homepage runs straight into the next section and wants the gap closed;
 * above the footer the SHRM line would otherwise sit flush against it.
 */
export default function Accreditations({ spaceBelow = false }: { spaceBelow?: boolean }) {
  return (
    <div className="site-page-sec" style={{ background: "#fff", padding: `76px 48px ${spaceBelow ? 76 : 0}px` }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <Reveal style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 }}>Accreditations</div>
          <h2 style={{ font: "700 clamp(26px,2.8vw,36px)/1.15 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: 0, letterSpacing: "-.02em" }}>Accreditation | Global and Industry Recognition</h2>
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

        {/* SHRM and CPD sit on their own line: they are issued badges, each
            with its own recognition statement, not monoline registration
            marks like the three above. */}
        <Reveal className="site-accred-badges" style={{ display: "grid", gridTemplateColumns: "1fr 1px 1fr", gap: 44, marginTop: 48, alignItems: "stretch" }}>
          {BADGES.map((badge, i) => (
            <Fragment key={badge.src}>
              {/* Fades at both ends rather than butting into the whitespace. */}
              {i > 0 && <div className="site-accred-rule" aria-hidden />}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              {/* Both marks set to the same width and vertically centred in a
                  common box, so two different proportions still read as a
                  matched pair. Explicit width, not a percentage: the marks
                  should not grow with the column. */}
              <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={badge.src} alt={badge.alt} style={{ display: "block", width: badge.width, maxWidth: "100%", height: "auto" }} />
              </div>
              <p style={{ font: "italic 400 14.5px/1.7 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", maxWidth: 480, margin: "18px 0 0" }}>
                {badge.statement}
              </p>
            </div>
            </Fragment>
          ))}
        </Reveal>
      </div>
    </div>
  );
}
