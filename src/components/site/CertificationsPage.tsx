/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import Reveal from "@/components/home/Reveal";
import { included, programs } from "@/lib/programs";
import UpcomingBatches from "@/components/site/UpcomingBatches";
import BrandText from "@/components/site/BrandText";

const why = [
  { t: "Global content with workplace relevance", d: "Global workplace content, practical HR insights and real-world application for evolving workplace realities." },
  { t: "Practice-led learning", d: "Cases, reflection, discussion, role plays and facilitation practice — not only theory." },
  { t: "Designed for sensitive conversations", d: "Leadership, DEI, wellbeing, PoSH and POCSO facilitated with confidence, clarity and care." },
  { t: "Trainer toolkits included", d: "Templates, case studies, facilitation guides, sample session plans, FAQs and workplace-ready tools." },
  { t: "Assessment-based certification", d: "Linked to participation, practice, reflection and assessment — not just attendance." },
];

const eyebrow: CSSProperties = { font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 };

function CertIcon({ d }: { d: React.ReactNode }) {
  return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1b8f88" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", margin: "0 auto" }}>{d}</svg>;
}

export default function CertificationsPage() {
  // Mobile-only accordion: cards collapse below 640px. Desktop always expanded.
  const [isMobile, setIsMobile] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Open the program targeted by the URL hash (e.g. /certifications#posh).
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace("#", "");
      if (programs.some((p) => p.id === id)) setOpenId(id);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  return (
    <>
      {/* HERO */}
      <div className="site-page-sec" style={{ position: "relative", overflow: "hidden", background: "#eef4f7", padding: "82px 48px 74px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(27,143,136,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(27,143,136,.06) 1px,transparent 1px)", backgroundSize: "56px 56px", animation: "gridDrift 6s linear infinite" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 78% 45%,rgba(47,127,214,.13),transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 90, background: "linear-gradient(180deg,transparent,#f7fafc)" }} />
        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ font: "500 12.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginBottom: 18 }}>
            <Link href="/" style={{ color: "#8296a9" }}>Home</Link> / <span style={{ color: "#1b8f88" }}>TTT Certification</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(27,143,136,.45)", color: "#1b8f88", font: "600 12px 'Plus Jakarta Sans',sans-serif", letterSpacing: ".16em", textTransform: "uppercase", padding: "8px 16px", borderRadius: 999, background: "rgba(255,255,255,.6)", marginBottom: 24 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#2fc4bc" }} />TTT Certification
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 320 }}>
              <h1 style={{ font: "700 clamp(34px,4vw,54px)/1.12 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 20px", letterSpacing: "-.02em", maxWidth: 820 }}>Choose Your TTT Certification Pathway</h1>
              <p style={{ font: "400 16.5px/1.75 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", maxWidth: 740, margin: 0, textWrap: "pretty" } as CSSProperties}>Whether you are an HR professional, L&amp;D leader, educator, consultant, coach, manager or aspiring corporate trainer, Levitate PeopleSoft helps you build facilitation capability for the workplace conversations that matter most.</p>
            </div>
            <a href="#upcoming" className="lp-btn-grad" style={{ display: "inline-flex", alignItems: "center", gap: 14, background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", borderRadius: 999, padding: "22px 38px", font: "800 18px/1.25 'Plus Jakarta Sans',sans-serif", color: "#fff", maxWidth: 340, animation: "pulse 2.4s infinite", boxShadow: "0 16px 36px rgba(27,143,136,.36)" }}>
              {/* <span style={{ width: 44, height: 44, flex: "none", borderRadius: 13, background: "rgba(255,255,255,.2)", border: "1px solid rgba(255,255,255,.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 11h18" /><path d="M9 16l2 2 4-4" /></svg>
              </span> */}
              Check out our upcoming certification programs <span style={{ fontSize: 22 }}>→</span>
            </a>
          </div>
        </div>
      </div>

      {/* QUICK NAV */}
      <div className="site-page-sec" style={{ background: "#f4f7f9", padding: "24px 48px 60px" }}>
        <div className="site-grid-6" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12 }}>
          {/* Each card opens that program's own page rather than scrolling to
              an anchor on this one. */}
          {programs.map((p) => (
            <Link key={p.id} href={`/lms/course/${p.slug}`} className="site-card" style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 14, padding: "16px 16px", display: "flex", flexDirection: "column", gap: 6, boxShadow: "0 2px 6px rgba(10,27,51,.05)" }}>
              <div style={{ font: "700 10.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".13em", textTransform: "uppercase" }}><BrandText>{p.tag}</BrandText></div>
              <div style={{ font: "700 13px/1.35 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{p.short}</div>
              <div style={{ marginTop: "auto", paddingTop: 6, font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88" }}>View program →</div>
            </Link>
          ))}
        </div>
      </div>

      {/* PROGRAM DETAILS */}
      <div className="site-page-sec" style={{ background: "#fff", padding: "20px 48px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: 26 }}>
          {programs.map((p) => {
            const collapsed = isMobile && openId !== p.id;
            return (
            <Reveal key={p.id} className="site-cert-card" style={{ background: "#f7fafc", border: "1px solid #e3eaf0", borderRadius: 22, padding: "42px 44px", boxShadow: "0 2px 8px rgba(10,27,51,.05)", scrollMarginTop: 110 }}>
              <div id={p.id} style={{ position: "relative", top: -110 }} />
              <div className="site-stack" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 48, alignItems: "stretch" }}>
                <div>
                  <div
                    onClick={isMobile ? () => setOpenId(collapsed ? p.id : null) : undefined}
                    role={isMobile ? "button" : undefined}
                    aria-expanded={isMobile ? !collapsed : undefined}
                    style={{ cursor: isMobile ? "pointer" : "default" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                      <div style={{ width: 46, height: 46, flex: "none", borderRadius: 13, background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 16px 'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 22px rgba(27,143,136,.3)" }}>{p.num}</div>
                      <div style={{ font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".15em", textTransform: "uppercase", border: "1px solid rgba(27,143,136,.4)", borderRadius: 999, padding: "6px 14px" }}><BrandText>{p.tag}</BrandText></div>
                      <span className="site-cert-chev" style={{ marginLeft: "auto", flex: "none", width: 30, height: 30, borderRadius: "50%", background: collapsed ? "#eef3f7" : "linear-gradient(135deg,#2fc4bc,#2f7fd6)", color: collapsed ? "#5b6e82" : "#fff", alignItems: "center", justifyContent: "center" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" style={{ transform: collapsed ? "rotate(0deg)" : "rotate(180deg)", transition: "transform .3s ease" }}><path d="M6 9l6 6 6-6" /></svg>
                      </span>
                    </div>
                    {/* The name opens the program's page. Not on mobile, where
                        this same block is the accordion's toggle — a tap there
                        has to expand the card, not navigate away from it. */}
                    <h2 style={{ font: "700 clamp(24px,2.5vw,32px)/1.2 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 6px", letterSpacing: "-.02em" }}>
                      {isMobile ? p.title : <Link href={`/lms/course/${p.slug}`} style={{ color: "inherit" }}>{p.title}</Link>}
                    </h2>
                    <div style={{ font: "600 14px 'Plus Jakarta Sans',sans-serif", color: "#2f7fd6", marginBottom: collapsed ? 0 : 18 }}>{p.sub}</div>
                  </div>
                  {!collapsed && (
                  <>
                  <p style={{ font: "400 15px/1.75 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: "0 0 14px", maxWidth: 640, textWrap: "pretty" } as CSSProperties}>{p.p1}</p>
                  <p style={{ font: "400 15px/1.75 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: 0, maxWidth: 640, textWrap: "pretty" } as CSSProperties}>{p.p2}</p>
                  <div style={{ marginTop: 24, background: "#fff", border: "1px solid rgba(27,143,136,.35)", borderRadius: 16, padding: "24px 26px" }}>
                    <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 16 }}><BrandText>{p.pillarTitle}</BrandText></div>
                    <div className="site-pillars" style={{ display: "grid", gridTemplateColumns: `repeat(${p.pillars.length},minmax(0,1fr))`, gap: 12 }}>
                      {p.pillars.map((h, i) => (
                        <div key={i} style={{ position: "relative", background: "linear-gradient(165deg,#f7fafc,#eef4f7)", border: "1px solid #e3eaf0", borderRadius: 12, padding: "16px 13px 14px", overflow: "hidden" }}>
                          <div style={{ position: "absolute", top: 0, left: 12, right: 12, height: 2, background: "linear-gradient(90deg,#2fc4bc,#2f7fd6)" }} />
                          <div style={{ font: "700 30px/1 'Plus Jakarta Sans',sans-serif", background: "linear-gradient(120deg,#1b8f88,#2f7fd6)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", letterSpacing: "-.02em" }}>{h.k}</div>
                          <div style={{ font: "600 12px/1.4 'Plus Jakarta Sans',sans-serif", color: "#3d5064", marginTop: 7 }}>{h.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {p.curriculum && (
                    <div style={{ marginTop: 14, background: "#fff", border: "1px solid #e3eaf0", borderRadius: 16, padding: "24px 26px" }}>
                      <p style={{ font: "500 14.5px/1.7 'Plus Jakarta Sans',sans-serif", color: "#3d5064", margin: "0 0 16px", maxWidth: 640, textWrap: "pretty" } as CSSProperties}>{p.curriculum.intro}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
                        {p.curriculum.facts.map((f) => (
                          <div key={f.k} style={{ border: "1px solid rgba(27,143,136,.4)", background: "rgba(47,196,188,.08)", borderRadius: 999, padding: "7px 16px", font: "600 12.5px 'Plus Jakarta Sans',sans-serif", color: "#136f6a" }}>
                            {f.k}: <span style={{ color: "#0a1b33" }}>{f.v}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 14 }}>Programme Modules</div>
                      <ol className="site-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 26px", listStyle: "none", margin: 0, padding: 0, counterReset: "mod" }}>
                        {p.curriculum.modules.map((m, i) => (
                          <li key={m} style={{ display: "flex", gap: 12, alignItems: "baseline", padding: "11px 0", borderBottom: "1px solid #eef3f7" }}>
                            <span style={{ flex: "none", font: "700 12.5px 'Plus Jakarta Sans',sans-serif", color: "#2f7fd6", fontVariantNumeric: "tabular-nums" }}>{String(i + 1).padStart(2, "0")}</span>
                            <span style={{ font: "500 13.5px/1.5 'Plus Jakarta Sans',sans-serif", color: "#3d5064" }}>{m}</span>
                          </li>
                        ))}
                      </ol>
                      <div style={{ font: "700 13px/1.6 'Plus Jakarta Sans',sans-serif", color: "#136f6a", marginTop: 18 }}>{p.curriculum.closing}</div>
                    </div>
                  )}
                  </>
                  )}
                </div>
                {!collapsed && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14, height: "100%" }}>
                  <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 16, padding: "22px 22px" }}>
                    <div style={{ font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 10 }}>Ideal for</div>
                    <div style={{ font: "400 13.5px/1.7 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>{p.ideal}</div>
                  </div>
                  <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 16, padding: "22px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".14em", textTransform: "uppercase" }}>What&apos;s included</div>
                    {included.map((inc) => (
                      <div key={inc} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1b8f88" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 2 }}><path d="M5 13l4 4 10-10" /></svg>
                        <div style={{ font: "500 13px/1.55 'Plus Jakarta Sans',sans-serif", color: "#3d5064" }}>{inc}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: "auto" }}>
                    <Link href={`/lms/course/${p.slug}`} className="lp-btn-grad" style={{ background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", padding: "14px 22px", borderRadius: 999, textAlign: "center" }}>View full program page →</Link>
                    <Link href="/contact" className="lp-btn-outline" style={{ border: "1.5px solid rgba(10,27,51,.28)", color: "#0a1b33", font: "700 14px 'Plus Jakarta Sans',sans-serif", padding: "13px 22px", borderRadius: 999, textAlign: "center", background: "#fff" }}>Book a Consultation</Link>
                  </div>
                </div>
                )}
              </div>
            </Reveal>
            );
          })}
        </div>
      </div>

      {/* UPCOMING BATCHES */}
      <UpcomingBatches />

      {/* WHY CERTIFY */}
      <div className="site-page-sec" style={{ background: "#fff", padding: "88px 48px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Reveal style={{ maxWidth: 760, marginBottom: 44 }}>
            <div style={eyebrow}>Why Get Certified With Us</div>
            <h2 style={{ font: "700 clamp(28px,3vw,40px)/1.15 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 16px", letterSpacing: "-.02em" }}>Built for professionals who refuse to remain slide-based trainers</h2>
            <p style={{ font: "400 15.5px/1.75 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: 0 }}>Our programs help participants become confident, credible and responsible workplace facilitators.</p>
          </Reveal>
          <div className="site-grid-5" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16 }}>
            {why.map((w) => (
              <Reveal key={w.t} style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 16, padding: "26px 22px", display: "flex", flexDirection: "column", gap: 10, boxShadow: "0 2px 6px rgba(10,27,51,.05)" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4 10-10" /></svg>
                </div>
                <div style={{ font: "700 15.5px/1.3 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{w.t}</div>
                <div style={{ font: "400 13.5px/1.65 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", textWrap: "pretty" } as CSSProperties}>{w.d}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* CERTIFICATE PREVIEW */}
      <div className="site-page-sec" style={{ background: "#fff", padding: "88px 48px" }}>
        <div className="site-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <Reveal>
            <div style={eyebrow}>Certificate Preview</div>
            <h2 style={{ font: "700 clamp(26px,2.8vw,36px)/1.18 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 16px", letterSpacing: "-.02em" }}>A credential that reflects practice, not just attendance</h2>
            <p style={{ font: "400 15.5px/1.75 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: "0 0 26px" }}>Certificates are issued upon successful completion of program requirements, including participation, practice activities and assessment where applicable.</p>
            <div className="site-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
              <div style={{ background: "#f7fafc", border: "1px solid #e3eaf0", borderRadius: 14, padding: "16px 14px", textAlign: "center" }}>
                <CertIcon d={<><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></>} />
                <div style={{ font: "700 12.5px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", marginTop: 8 }}>Assessment-based</div>
              </div>
              <div style={{ background: "#f7fafc", border: "1px solid #e3eaf0", borderRadius: 14, padding: "16px 14px", textAlign: "center" }}>
                <CertIcon d={<><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8.5" cy="11" r="2" /><path d="M5.5 16c.6-1.4 1.7-2 3-2s2.4.6 3 2" /><path d="M14 9h5M14 12h5M14 15h3" /></>} />
                <div style={{ font: "700 12.5px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", marginTop: 8 }}>Verifiable ID</div>
              </div>
              <div style={{ background: "#f7fafc", border: "1px solid #e3eaf0", borderRadius: 14, padding: "16px 14px", textAlign: "center" }}>
                <CertIcon d={<><rect x="3" y="8" width="18" height="12" rx="2" /><path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M3 13h18" /><path d="M11 13v2h2v-2" /></>} />
                <div style={{ font: "700 12.5px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", marginTop: 8 }}>Trainer toolkit</div>
              </div>
            </div>
          </Reveal>
          <Reveal style={{ position: "relative" }}>
            <div className="site-glow" style={{ position: "absolute", inset: -30, background: "radial-gradient(circle at 50% 40%,rgba(47,196,188,.18),transparent 70%)" }} />
            <div style={{ position: "relative", background: "#fdfefe", border: "1px solid #dbe5ec", borderRadius: 6, boxShadow: "0 30px 70px rgba(10,27,51,.18)", padding: "38px 42px" }}>
              <div style={{ border: "2px solid #0a1b33", outline: "1px solid #2fc4bc", outlineOffset: 5, padding: "34px 30px", textAlign: "center" }}>
                <img src="/assets/logo.png" alt="Levitate PeopleSoft" style={{ height: 34, margin: "0 auto 18px", display: "block" }} />
                <div style={{ font: "600 10.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".3em", textTransform: "uppercase", marginBottom: 14 }}>Certificate of Completion</div>
                <div style={{ font: "400 12.5px 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>This certifies that</div>
                <div style={{ font: "700 26px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", borderBottom: "1px solid #cfdbe4", padding: "8px 0", margin: "6px 24px 12px" }}>Participant Name</div>
                <div style={{ font: "400 12.5px/1.6 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", marginBottom: 18 }}>has successfully completed the<br /><strong style={{ color: "#0a1b33" }}>Corporate Leadership Facilitator Program (CLF TTT)</strong><br />including participation, practice and assessment</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 26, padding: "0 8px" }}>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", borderTop: "1px solid #cfdbe4", paddingTop: 6 }}>Parichita Kotnala</div>
                    <div style={{ font: "400 10.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9" }}>Founder &amp; Managing Partner</div>
                  </div>
                  <div style={{ width: 58, height: 58, borderRadius: "50%", border: "2px solid #2fc4bc", display: "flex", alignItems: "center", justifyContent: "center", font: "700 9px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", textAlign: "center", letterSpacing: ".08em" }}>LPS<br />SEAL</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* CTA */}
      <div className="site-page-sec" style={{ position: "relative", background: "#fff", padding: "20px 48px 110px", overflow: "hidden" }}>
        <Reveal style={{ position: "relative", maxWidth: 1100, margin: "0 auto", background: "linear-gradient(135deg,#0c2a45,#0a1f38)", border: "1px solid rgba(47,196,188,.35)", borderRadius: 26, padding: "60px 56px", textAlign: "center", overflow: "hidden", boxShadow: "0 30px 70px rgba(10,27,51,.25)" }}>
          <div style={{ position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse,rgba(47,196,188,.25),transparent 70%)", filter: "blur(20px)" }} />
          <h2 style={{ position: "relative", font: "700 clamp(26px,3vw,40px)/1.2 'Plus Jakarta Sans',sans-serif", color: "#f2f7fb", margin: "0 0 16px", letterSpacing: "-.02em" }}>Not sure which pathway fits you?</h2>
          <p style={{ position: "relative", font: "400 16px/1.7 'Plus Jakarta Sans',sans-serif", color: "#a9bcd0", maxWidth: 600, margin: "0 auto 32px" }}>Book a short discovery call and we&apos;ll map your experience and goals to the right certification.</p>
          <div style={{ position: "relative", display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" className="lp-btn-grad" style={{ background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 15px 'Plus Jakarta Sans',sans-serif", padding: "16px 30px", borderRadius: 999 }}>Book a Consultation</Link>
            <Link href="/services/train-the-trainer" className="lp-btn-outline-light" style={{ border: "1.5px solid rgba(255,255,255,.25)", color: "#e8f1f8", font: "700 15px 'Plus Jakarta Sans',sans-serif", padding: "16px 30px", borderRadius: 999 }}>Explore All Services</Link>
          </div>
        </Reveal>
      </div>
    </>
  );
}
