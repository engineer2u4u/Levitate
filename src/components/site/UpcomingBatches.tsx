"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import Reveal from "@/components/home/Reveal";
import { batches } from "@/lib/site";

/**
 * Live cohorts open for enrolment.
 *
 * Extracted from the certifications page so every program page can carry the
 * same block — one set of dates and fees, rendered wherever a visitor is
 * deciding, rather than a copy per page that drifts the moment a batch moves.
 */
const eyebrow: CSSProperties = {
  font: "700 12px 'Plus Jakarta Sans',sans-serif",
  color: "#1b8f88",
  letterSpacing: ".18em",
  textTransform: "uppercase",
  marginBottom: 14,
};

export default function UpcomingBatches({ background = "#f4f7f9" }: { background?: string }) {
  return (
    <div id="upcoming" className="site-page-sec" style={{ background, padding: "88px 48px", scrollMarginTop: 110 }}>
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <Reveal style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 32, flexWrap: "wrap", marginBottom: 44 }}>
          <div style={{ maxWidth: 700 }}>
            <div style={eyebrow}>Upcoming Batches</div>
            <h2 style={{ font: "700 clamp(28px,3vw,40px)/1.15 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 14px", letterSpacing: "-.02em" }}>Live cohorts open for enrolment</h2>
            <p style={{ font: "400 15.5px/1.75 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: 0 }}>Seats are limited per batch to keep facilitation practice and feedback meaningful. Enrolment closes once a cohort fills.</p>
          </div>
          <Link href="/contact" className="lp-btn-grad" style={{ background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", padding: "14px 26px", borderRadius: 999, whiteSpace: "nowrap" }}>Reserve a seat</Link>
        </Reveal>
        <div className="site-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 22 }}>
          {batches.map((b) => (
            <Reveal key={b.title} className="site-card" style={{ position: "relative", background: "#fff", border: `1px solid ${b.open ? "rgba(27,143,136,.45)" : "#e3eaf0"}`, borderRadius: 20, padding: "32px 34px", display: "flex", flexDirection: "column", gap: 18, boxShadow: "0 2px 8px rgba(10,27,51,.05)", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 26, right: 26, height: 3, borderRadius: "0 0 4px 4px", background: b.open ? "linear-gradient(90deg,#2fc4bc,#2f7fd6)" : "linear-gradient(90deg,#c9d6e0,#dbe5ec)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 18 }}>
                <div>
                  <div style={{ font: "700 11px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 8 }}>{b.tag}</div>
                  <div style={{ font: "700 21px/1.28 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{b.title}</div>
                </div>
                <div style={{ flex: "none", background: b.open ? "rgba(47,196,188,.12)" : "#f4f7f9", border: `1px solid ${b.open ? "rgba(27,143,136,.4)" : "#dbe5ec"}`, color: b.open ? "#136f6a" : "#5b6e82", font: "700 11px 'Plus Jakarta Sans',sans-serif", letterSpacing: ".1em", textTransform: "uppercase", padding: "7px 13px", borderRadius: 999, whiteSpace: "nowrap" }}>{b.status}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 12 }}>
                {b.rows.map((r) => (
                  <div key={r.k} style={{ background: "#f7fafc", border: "1px solid #e3eaf0", borderRadius: 12, padding: "13px 15px" }}>
                    <div style={{ font: "600 10.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", letterSpacing: ".13em", textTransform: "uppercase" }}>{r.k}</div>
                    <div style={{ font: "700 14.5px/1.35 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", marginTop: 5 }}>{r.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 18, flexWrap: "wrap", marginTop: "auto", paddingTop: 6 }}>
                <div>
                  <div style={{ font: "600 10.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", letterSpacing: ".13em", textTransform: "uppercase" }}>Program fee</div>
                  <div style={{ font: "700 26px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", marginTop: 4 }}>{b.fee}</div>
                  <div style={{ font: "500 11.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginTop: 2 }}>{b.feeNote}</div>
                </div>
                <Link href="/contact" className="lp-btn-outline" style={{ border: "1.5px solid rgba(27,143,136,.5)", color: "#1b8f88", font: "700 13.5px 'Plus Jakarta Sans',sans-serif", padding: "12px 22px", borderRadius: 999, whiteSpace: "nowrap" }}>{b.cta}</Link>
              </div>
            </Reveal>
          ))}
        </div>
        <div style={{ font: "500 12.5px/1.7 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginTop: 20 }}>All sessions run live online unless otherwise agreed. Fees are inclusive of taxes and cover the trainer toolkit, assessment and certification.</div>
      </div>
    </div>
  );
}
