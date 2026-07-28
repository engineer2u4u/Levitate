"use client";

import Link from "next/link";
import { type CSSProperties } from "react";
import Reveal from "@/components/home/Reveal";
import type { LegalDoc } from "@/lib/legalData";

export default function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      {/* HERO */}
      <div className="site-page-sec" style={{ position: "relative", overflow: "hidden", background: "#eef4f7", padding: "72px 48px 60px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(27,143,136,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(27,143,136,.06) 1px,transparent 1px)", backgroundSize: "56px 56px", animation: "gridDrift 6s linear infinite" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(180deg,transparent,#f7fafc)" }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          <div style={{ font: "500 12.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginBottom: 18 }}>
            <Link href="/" style={{ color: "#8296a9" }}>Home</Link> / <span style={{ color: "#1b8f88" }}>{doc.title}</span>
          </div>
          <h1 style={{ font: "700 clamp(30px,3.6vw,46px)/1.14 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 16px", letterSpacing: "-.02em" }}>{doc.title}</h1>
          <p style={{ font: "400 16px/1.75 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: 0, textWrap: "pretty" } as CSSProperties}>{doc.intro}</p>
        </div>
      </div>

      {/* BODY */}
      <div className="site-page-sec" style={{ background: "#fff", padding: "64px 48px 90px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 34 }}>
          {doc.sections.map((s) => (
            <Reveal key={s.h}>
              <h2 style={{ font: "700 21px/1.35 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 12px", letterSpacing: "-.01em" }}>{s.h}</h2>
              {s.p?.map((para, i) => (
                <p key={i} style={{ font: "400 15.5px/1.8 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: "0 0 12px", textWrap: "pretty" } as CSSProperties}>
                  {para}
                </p>
              ))}
              {s.list && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                  {s.list.map((li) => (
                    <div key={li} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                      <span style={{ width: 6, height: 6, flex: "none", marginTop: 9, borderRadius: "50%", background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)" }} />
                      <div style={{ font: "400 15px/1.7 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>{li}</div>
                    </div>
                  ))}
                </div>
              )}
            </Reveal>
          ))}

          <div style={{ borderTop: "1px solid #e3eaf0", paddingTop: 22, font: "500 12.5px/1.7 'Plus Jakarta Sans',sans-serif", color: "#8296a9" }}>
            This page sets out general terms for this website. For anything specific to your organization or engagement, please contact us directly.
          </div>
        </div>
      </div>
    </>
  );
}
