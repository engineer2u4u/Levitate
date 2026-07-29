"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import Reveal from "@/components/home/Reveal";
import YouTubeEmbed from "./YouTubeEmbed";

const POINTS = [
  "Employee awareness sessions that explain the law in plain language",
  "Manager and leader sensitisation on handling disclosures responsibly",
  "Internal Committee (IC) capability building — role, process and documentation",
  "Workplace case discussions drawn from real situations, not generic examples",
  "Guidance on respectful workplace behaviour and everyday dignity at work",
];

export default function PoshSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <div id="POSH" className="site-page-sec" style={{ background: "#fff", padding: "80px 48px" }}>
      <div className="site-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
        {/* Content — left */}
        <Reveal>
          <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 }}>POSH &amp; Workplace Dignity</div>
          <h2 style={{ font: "700 clamp(26px,2.8vw,36px)/1.18 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 18px", letterSpacing: "-.02em" }}>
            POSH programs delivered with legal clarity and facilitation maturity
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, font: "400 15.5px/1.8 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>
            <p style={{ margin: 0, textWrap: "pretty" } as CSSProperties}>
              Prevention of Sexual Harassment is not a tick-box session. Our POSH programs help organizations meet their obligations while genuinely shifting how people behave — combining accurate
              legal grounding with the sensitivity these conversations demand.
            </p>
            <p style={{ margin: 0, textWrap: "pretty" } as CSSProperties}>
              Sessions are led by an internationally certified POSH educator and trainer, empanelled on the SHe-Box portal of the Ministry of Women and Child Development, Government of India.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 11, marginTop: 22 }}>
            {POINTS.map((pt) => (
              <div key={pt} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1b8f88" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 4 }}>
                  <path d="M5 13l4 4 10-10" />
                </svg>
                <div style={{ font: "500 14.5px/1.65 'Plus Jakarta Sans',sans-serif", color: "#3d5064" }}>{pt}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 28 }}>
            <Link
              href="/contact"
              className="lp-btn-grad"
              style={{ background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 14.5px 'Plus Jakarta Sans',sans-serif", padding: "14px 26px", borderRadius: 999 }}
            >
              Discuss a POSH program
            </Link>
            <Link
              href="/services/advisory"
              className="lp-btn-outline"
              style={{ border: "1.5px solid rgba(10,27,51,.24)", color: "#0a1b33", font: "700 14.5px 'Plus Jakarta Sans',sans-serif", padding: "14px 26px", borderRadius: 999 }}
            >
              POSH &amp; IC advisory
            </Link>
          </div>
        </Reveal>

        {/* Video — right. The cover always shows; clicking opens the video in a
            modal, matching the founder video on the home page. */}
        <Reveal>
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label="Play the POSH programme video"
            className="lp-posh-play"
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              width: "100%",
              aspectRatio: "16/9",
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid #e3eaf0",
              padding: 0,
              cursor: "pointer",
              backgroundImage: "url('/assets/posh-cover.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              boxShadow: "0 24px 60px rgba(10,27,51,.18)",
            }}
          >
            {/* scrim keeps the play control legible over the frame */}
            <span style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(10,27,51,.18),rgba(10,27,51,.52))" }} />
            <span
              style={{
                position: "relative",
                width: 78,
                height: 78,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 14px 34px rgba(10,27,51,.45)",
              }}
            >
              <span style={{ width: 0, height: 0, borderLeft: "22px solid #fff", borderTop: "13px solid transparent", borderBottom: "13px solid transparent", marginLeft: 6 }} />
            </span>
            <span style={{ position: "relative", font: "700 16px 'Plus Jakarta Sans',sans-serif", color: "#fff", textShadow: "0 2px 12px rgba(10,27,51,.5)" }}>Watch a POSH session</span>
          </button>
        </Reveal>
      </div>

      {/* VIDEO MODAL */}
      {playing && (
        <div
          onClick={() => setPlaying(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(10,27,51,.55)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 48,
            animation: "fadeUp .3s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "min(960px,100%)",
              aspectRatio: "16/9",
              background: "#050d1a",
              border: "1px solid rgba(47,196,188,.4)",
              borderRadius: 18,
              overflow: "hidden",
              boxShadow: "0 40px 120px rgba(10,27,51,.45)",
            }}
          >
            <YouTubeEmbed id="wfGzTNtutXs" title="POSH &amp; Workplace Dignity — Levitate PeopleSoft" />
            <div
              onClick={() => setPlaying(false)}
              className="lp-close-btn"
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "rgba(255,255,255,.1)",
                border: "1px solid rgba(255,255,255,.25)",
                color: "#fff",
                font: "600 18px 'Plus Jakarta Sans',sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 2,
              }}
            >
              ✕
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
