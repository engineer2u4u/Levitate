"use client";

import Reveal from "./Reveal";
import { testimonials } from "@/lib/homeData";

/**
 * Testimonials marquee — three cards visible at a time, continuously
 * auto-scrolling (paused on hover). No arrows or dots, matching the
 * ticker / gallery sections.
 */
export default function TestimonialsCarousel() {
  // Duplicate the list so the -50% translate loops seamlessly.
  const loop = [...testimonials, ...testimonials];

  return (
    <div
      data-screen-label="Testimonials"
      style={{ background: "#f4f7f9", padding: "96px 0", overflow: "hidden" }}
    >
      <Reveal style={{ textAlign: "center", marginBottom: 52, padding: "0 48px" }}>
        <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 }}>Testimonials</div>
        <h2 style={{ font: "700 clamp(28px,3vw,40px)/1.15 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: 0, letterSpacing: "-.02em" }}>What our participants say</h2>
      </Reveal>

      <div
        style={{
          position: "relative",
          maskImage: "linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)",
          WebkitMaskImage: "linear-gradient(90deg,transparent,#000 5%,#000 95%,transparent)",
        }}
      >
        <div
          className="lp-marquee-pause"
          style={{ display: "flex", width: "max-content", animation: "marquee 45s linear infinite" }}
        >
          {loop.map((t, i) => (
            <div
              key={i}
              className="lp-tcard"
              style={{
                width: 400,
                flex: "none",
                marginRight: 24,
                background: "#fff",
                border: "1px solid #e3eaf0",
                borderRadius: 18,
                padding: "32px 30px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                boxShadow: "0 10px 30px rgba(10,27,51,.06)",
                boxSizing: "border-box",
              }}
            >
              <div style={{ color: "#f5b942", fontSize: 16, letterSpacing: 2 }}>★★★★★</div>
              <p style={{ font: "400 14.5px/1.7 'Plus Jakarta Sans',sans-serif", color: "#3d5064", margin: 0, flex: 1, textWrap: "pretty" } as React.CSSProperties}>“{t.quote}”</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, flex: "none", borderRadius: "50%", background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 15px 'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>{t.initials}</div>
                <div>
                  <div style={{ font: "700 14px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{t.name}</div>
                  <div style={{ font: "500 12px 'Plus Jakarta Sans',sans-serif", color: "#8296a9" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
