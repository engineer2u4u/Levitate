/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import Reveal from "@/components/home/Reveal";
import { contact, services, type ServiceKey } from "@/lib/site";
import { PAGES } from "@/lib/serviceData";
import { submitEnquiry } from "@/lib/submitEnquiry";
import PoshSection from "./PoshSection";

const eyebrow: CSSProperties = { font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 };
const check = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1b8f88" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 2 }}>
    <path d="M5 13l4 4 10-10" />
  </svg>
);

export default function ServicePage({
  pageKey,
  showProcess = true,
  showCredential = true,
  showPosh = false,
}: {
  pageKey: ServiceKey;
  showProcess?: boolean;
  showCredential?: boolean;
  showPosh?: boolean;
}) {
  const p = PAGES[pageKey];
  const [opt, setOpt] = useState(0);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState(0);
  const other = services.filter((s) => s.key !== pageKey);

  return (
    <>
      {/* HERO */}
      <div className="site-page-sec" style={{ position: "relative", overflow: "hidden", background: "#eef4f7", padding: "80px 48px 72px" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(27,143,136,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(27,143,136,.06) 1px,transparent 1px)",
            backgroundSize: "56px 56px",
            animation: "gridDrift 6s linear infinite",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 78% 42%,rgba(47,196,188,.14),transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 90, background: "linear-gradient(180deg,transparent,#f7fafc)" }} />
        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ font: "500 12.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginBottom: 18 }}>
            <Link href="/" style={{ color: "#8296a9" }}>
              Home
            </Link>{" "}
            /{" "}
            <Link href={services[0].href} style={{ color: "#8296a9" }}>
              Services
            </Link>{" "}
            / <span style={{ color: "#1b8f88" }}>{p.crumb}</span>
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "1px solid rgba(27,143,136,.45)",
              color: "#1b8f88",
              font: "600 12px 'Plus Jakarta Sans',sans-serif",
              letterSpacing: ".16em",
              textTransform: "uppercase",
              padding: "8px 16px",
              borderRadius: 999,
              background: "rgba(255,255,255,.6)",
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#2fc4bc" }} />
            {p.eyebrow}
          </div>
          <h1 style={{ font: "700 clamp(32px,3.9vw,52px)/1.12 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", letterSpacing: "-.02em", maxWidth: 880, margin: "22px 0 18px" }}>{p.title}</h1>
          <p style={{ font: "400 16.5px/1.75 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", maxWidth: 720, margin: "0 0 26px", textWrap: "pretty" } as CSSProperties}>{p.lede}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            {p.facts.map((f) => (
              <div key={f.k} style={{ background: "rgba(255,255,255,.75)", border: "1px solid #dbe5ec", borderRadius: 14, padding: "14px 20px", minWidth: 150 }}>
                <div style={{ font: "600 10.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", letterSpacing: ".14em", textTransform: "uppercase" }}>{f.k}</div>
                <div style={{ font: "700 15.5px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", marginTop: 4 }}>{f.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* INTRO */}
      <div className="site-page-sec" style={{ background: "#fff", padding: "80px 48px" }}>
        <div className="site-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 60, alignItems: "start" }}>
          <Reveal>
            <h2 style={{ font: "700 clamp(24px,2.6vw,34px)/1.2 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", letterSpacing: "-.02em", margin: "0 0 20px" }}>{p.introHeading}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 15, font: "400 15.5px/1.8 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>
              {p.intro.map((para, i) => (
                <p key={i} style={{ margin: 0, textWrap: "pretty" } as CSSProperties}>
                  {para}
                </p>
              ))}
            </div>
            {p.outcomes && (
              <div className="site-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 22 }}>
                {p.outcomes.map((o) => (
                  <div key={o} style={{ display: "flex", gap: 11, alignItems: "flex-start", background: "#f7fafc", border: "1px solid #e3eaf0", borderRadius: 14, padding: "16px 18px" }}>
                    {check}
                    <div style={{ font: "600 13.5px/1.6 'Plus Jakarta Sans',sans-serif", color: "#3d5064" }}>{o}</div>
                  </div>
                ))}
              </div>
            )}
          </Reveal>
          <Reveal style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <img src={p.img} alt={p.crumb} style={{ width: "100%", borderRadius: 18, border: "1px solid #e3eaf0", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
            <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 16, padding: "22px 24px" }}>
              <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 14 }}>{p.deliverTitle}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                {p.deliverables.map((d) => (
                  <div key={d} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                    <span style={{ width: 6, height: 6, flex: "none", marginTop: 7, borderRadius: "50%", background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)" }} />
                    <div style={{ font: "500 13.5px/1.6 'Plus Jakarta Sans',sans-serif", color: "#3d5064" }}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <div style={{ gridColumn: "1 / -1", background: "#f4f7f9", border: "1px solid rgba(27,143,136,.35)", borderRadius: 16, padding: "26px 30px", display: "flex", gap: 28, flexWrap: "wrap" }}>
            <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".14em", textTransform: "uppercase", flex: "none" }}>Best suited for</div>
            <div style={{ font: "400 15px/1.75 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", flex: 1, minWidth: 260 }}>{p.bestFor}</div>
          </div>
        </div>
      </div>

      {/* OFFER / ITEMS */}
      <div className="site-page-sec" style={{ background: "#f4f7f9", padding: "80px 48px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Reveal style={{ maxWidth: 700, marginBottom: 40 }}>
            <div style={eyebrow}>{p.listEyebrow}</div>
            <h2 style={{ font: "700 clamp(26px,2.8vw,36px)/1.15 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: 0, letterSpacing: "-.02em" }}>{p.listHeading}</h2>
          </Reveal>
          <div className="site-offer" style={{ display: "grid", gridTemplateColumns: p.listGrid, gap: 18 }}>
            {p.items.map((it) => (
              <Reveal
                key={it.num}
                className="site-card"
                style={{
                  background: "#fff",
                  border: "1px solid #e3eaf0",
                  borderRadius: 18,
                  padding: "28px 26px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  boxShadow: "0 2px 6px rgba(10,27,51,.05)",
                  position: "relative",
                }}
              >
                <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "rgba(10,27,51,.22)" }}>{it.num}</div>
                <div style={{ font: "700 17px/1.32 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{it.t}</div>
                <div style={{ font: "400 13.5px/1.7 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>{it.d}</div>
                {/* A certification pathway opens its own program page. The link
                    covers the whole card, so the click target is the card
                    rather than a few words at the bottom of it. */}
                {it.href && (
                  <Link href={it.href} style={{ position: "absolute", inset: 0, borderRadius: 18 }} aria-label={`Open the ${it.t} page`} />
                )}
                {it.href && (
                  <div aria-hidden style={{ marginTop: "auto", paddingTop: 4, font: "700 12.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88" }}>View program →</div>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* POSH */}
      {showPosh && <PoshSection />}

      {/* PROCESS */}
      {showProcess && (
        <div className="site-page-sec" style={{ background: "#fff", padding: "80px 48px" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <Reveal style={{ maxWidth: 720, marginBottom: 40 }}>
              <div style={eyebrow}>{p.processEyebrow}</div>
              <h2 style={{ font: "700 clamp(26px,2.8vw,36px)/1.15 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: 0, letterSpacing: "-.02em" }}>{p.processHeading}</h2>
            </Reveal>
            <div className="site-process" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
              {p.process.map((s) => (
                <Reveal key={s.num} style={{ position: "relative", background: "#f7fafc", border: "1px solid #e3eaf0", borderRadius: 16, padding: "28px 24px" }}>
                  <div style={{ position: "absolute", top: 0, left: 20, right: 20, height: 3, background: "linear-gradient(90deg,#2fc4bc,#2f7fd6)" }} />
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)",
                      color: "#fff",
                      font: "700 16px 'Plus Jakarta Sans',sans-serif",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                    }}
                  >
                    {s.num}
                  </div>
                  <div style={{ font: "700 18px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", marginBottom: 6 }}>{s.title}</div>
                  <div style={{ font: "400 13.5px/1.7 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>{s.desc}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CREDENTIAL */}
      {/* {showCredential && (
        <div className="site-page-sec" style={{ background: "#f4f7f9", padding: "80px 48px" }}>
          <div className="site-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <Reveal>
              <div style={eyebrow}>{p.certEyebrow}</div>
              <h2 style={{ font: "700 clamp(26px,2.8vw,36px)/1.18 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 16px", letterSpacing: "-.02em" }}>{p.certHeading}</h2>
              <p style={{ font: "400 15.5px/1.75 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: "0 0 22px" }}>{p.certBody}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {(p.certNotes ?? []).map((n) => (
                  <div key={n.t} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#fff", border: "1px solid #e3eaf0", borderRadius: 14, padding: "16px 18px" }}>
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        flex: "none",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3z" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ font: "700 14.5px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{n.t}</div>
                      <div style={{ font: "400 13px/1.6 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", marginTop: 3 }}>{n.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal style={{ position: "relative" }}>
              <div className="site-glow" style={{ position: "absolute", inset: -30, background: "radial-gradient(circle at 50% 40%,rgba(47,196,188,.18),transparent 70%)" }} />
              <div style={{ position: "relative", background: "#fdfefe", border: "1px solid #dbe5ec", borderRadius: 6, boxShadow: "0 30px 70px rgba(10,27,51,.18)", padding: "36px 40px" }}>
                <div style={{ border: "2px solid #0a1b33", outline: "1px solid #2fc4bc", outlineOffset: 5, padding: "32px 28px", textAlign: "center" }}>
                  <img src="/assets/logo.png" alt="Levitate PeopleSoft" style={{ height: 32, margin: "0 auto 16px", display: "block" }} />
                  <div style={{ font: "600 10.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".3em", textTransform: "uppercase", marginBottom: 14 }}>{p.certLabel}</div>
                  <div style={{ font: "400 12.5px 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>{p.certLine1}</div>
                  <div style={{ font: "700 24px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", borderBottom: "1px solid #cfdbe4", padding: "8px 0", margin: "6px 20px 12px" }}>{p.certName}</div>
                  <div style={{ font: "400 12.5px/1.6 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", marginBottom: 18 }}>
                    {p.certLine2}
                    <br />
                    <strong style={{ color: "#0a1b33" }}>{p.certProgram}</strong>
                    <br />
                    {p.certLine3}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 24, padding: "0 8px" }}>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", borderTop: "1px solid #cfdbe4", paddingTop: 6 }}>Parichita Kotnala</div>
                      <div style={{ font: "400 10.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9" }}>Founder &amp; Managing Partner</div>
                    </div>
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        border: "2px solid #2fc4bc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        font: "700 9px 'Plus Jakarta Sans',sans-serif",
                        color: "#1b8f88",
                        textAlign: "center",
                        letterSpacing: ".08em",
                      }}
                    >
                      LPS
                      <br />
                      SEAL
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      )} */}

      {/* ENQUIRY */}
      <div id="enquire" className="site-page-sec" style={{ background: "#fff", padding: "80px 48px", scrollMarginTop: 100 }}>
        <div className="site-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 34, alignItems: "start" }}>
          {/* Form */}
          <div style={{ background: "#f7fafc", border: "1px solid #e3eaf0", borderRadius: 22, padding: "40px 42px" }}>
            {sent ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14, padding: "40px 20px" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4 10-10" />
                  </svg>
                </div>
                <div style={{ font: "700 24px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>Thank you — enquiry received</div>
                <div style={{ font: "400 15px/1.7 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", maxWidth: 420 }}>
                  We&apos;ll review your requirement and respond within one working day. For anything urgent, WhatsApp us on {contact.phone}.
                </div>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="lp-btn-outline"
                  style={{
                    marginTop: 8,
                    border: "1.5px solid rgba(10,27,51,.22)",
                    background: "transparent",
                    color: "#0a1b33",
                    font: "700 14px 'Plus Jakarta Sans',sans-serif",
                    padding: "12px 24px",
                    borderRadius: 999,
                    cursor: "pointer",
                  }}
                >
                  Submit another enquiry
                </button>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (sending) return;
                  const form = e.currentTarget;
                  setSending(true);
                  setError(null);
                  const res = await submitEnquiry(form, { intent: `${p.crumb} — ${p.options[opt]}` });
                  setSending(false);
                  if (res.ok) {
                    setSent(true);
                    form.reset();
                    if (typeof window !== "undefined") window.scrollTo({ top: 240, behavior: "smooth" });
                  } else {
                    setError(res.error);
                  }
                }}
              >
                {/* honeypot — hidden from people, tempting to bots */}
                <input type="checkbox" name="hp_zx" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
                <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 10 }}>Enquiry form</div>
                <div style={{ font: "700 26px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", marginBottom: 6 }}>{p.formHeading}</div>
                <div style={{ font: "400 14px/1.7 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", marginBottom: 24 }}>{p.formSub}</div>
                <div className="site-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                  <Field label="Full name *">
                    <input required name="name" type="text" placeholder="Your name" style={inputStyle} />
                  </Field>
                  <Field label="Email *">
                    <input required name="email" type="email" placeholder="you@company.com" style={inputStyle} />
                  </Field>
                  <Field label="Phone / WhatsApp *">
                    <input required name="phone" type="tel" placeholder="+91" style={inputStyle} />
                  </Field>
                  <Field label={p.orgLabel}>
                    <input name="organization" type="text" placeholder={p.orgPlaceholder} style={inputStyle} />
                  </Field>
                </div>
                <div style={{ marginTop: 22 }}>
                  <div style={{ font: "600 12.5px 'Plus Jakarta Sans',sans-serif", color: "#3d5064", marginBottom: 10 }}>{p.pickLabel}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {p.options.map((o, i) => {
                      const on = i === opt;
                      return (
                        <button
                          type="button"
                          key={o}
                          onClick={() => setOpt(i)}
                          style={{
                            border: `1px solid ${on ? "rgba(27,143,136,.5)" : "#dbe5ec"}`,
                            background: on ? "linear-gradient(120deg,#2fc4bc,#2f7fd6)" : "#fff",
                            color: on ? "#fff" : "#3d5064",
                            font: "600 13px 'Plus Jakarta Sans',sans-serif",
                            padding: "10px 18px",
                            borderRadius: 999,
                            cursor: "pointer",
                            transition: "all .2s ease",
                          }}
                        >
                          {o}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {(!p.hideFormParticipants || !p.hideFormMode) && (
                  <div className="site-grid-2" style={{ display: "grid", gridTemplateColumns: p.hideFormParticipants || p.hideFormMode ? "1fr" : "1fr 1fr", gap: 18, marginTop: 22 }}>
                    {!p.hideFormParticipants && (
                      <Field label="Approx. participants">
                        <select name="participants" style={inputStyle}>
                          <option>Individual</option>
                          <option>2 – 15</option>
                          <option>16 – 40</option>
                          <option>41 – 100</option>
                          <option>100+</option>
                        </select>
                      </Field>
                    )}
                    {!p.hideFormMode && (
                      <Field label="Preferred mode">
                        <select name="mode" style={inputStyle}>
                          <option>In-person</option>
                          <option>Virtual / live online</option>
                          <option>Blended</option>
                          <option>Not sure yet</option>
                        </select>
                      </Field>
                    )}
                  </div>
                )}
                <label style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 22 }}>
                  <span style={{ font: "600 12.5px 'Plus Jakarta Sans',sans-serif", color: "#3d5064" }}>Your requirement</span>
                  <textarea name="message" rows={5} placeholder={p.msgPlaceholder} style={{ ...inputStyle, resize: "vertical" }} />
                </label>
                <button
                  type="submit"
                  disabled={sending}
                  className="lp-btn-grad"
                  style={{
                    marginTop: 26,
                    background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)",
                    color: "#fff",
                    font: "700 15px 'Plus Jakarta Sans',sans-serif",
                    padding: "16px 30px",
                    borderRadius: 999,
                    border: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: sending ? "wait" : "pointer",
                    opacity: sending ? 0.72 : 1,
                    boxShadow: "0 12px 28px rgba(27,143,136,.26)",
                  }}
                >
                  {sending ? "Sending…" : p.formButton} <span>→</span>
                </button>
                {error && (
                  <div role="alert" style={{ marginTop: 16, background: "#fff5f5", border: "1px solid #f3c9c9", color: "#8f2828", borderRadius: 12, padding: "13px 16px", font: "500 13px/1.6 'Plus Jakarta Sans',sans-serif" }}>
                    {error} You can also email us at{" "}
                    <a href={`mailto:${contact.email}`} style={{ color: "#8f2828", textDecoration: "underline" }}>
                      {contact.email}
                    </a>
                    .
                  </div>
                )}
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 18, background: "#fff", border: "1px solid #e3eaf0", borderRadius: 12, padding: "14px 16px" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1b8f88" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 1 }}>
                    <path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  <div style={{ font: "500 12px/1.65 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>
                    As per our data privacy policy, we do not share your personal information with anyone. Your details remain securely in our database and are used only to respond to your enquiry.
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "26px 28px", boxShadow: "0 2px 6px rgba(10,27,51,.05)" }}>
              <div style={{ font: "700 18px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", marginBottom: 16 }}>Talk to us directly</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <ContactRow href={`mailto:${contact.email}`} title="Email" sub={contact.email} />
                <ContactRow href={`tel:${contact.tel}`} title="Phone" sub={contact.phone} />
                <ContactRow href={contact.whatsapp} title="WhatsApp" sub="Chat with our team →" />
              </div>
              <div style={{ borderTop: "1px solid #e3eaf0", marginTop: 18, paddingTop: 14, font: "500 12.5px/1.6 'Plus Jakarta Sans',sans-serif", color: "#8296a9" }}>
                Response within one working day
                <br />
                {contact.hours}
              </div>
            </div>

            <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "26px 28px", boxShadow: "0 2px 6px rgba(10,27,51,.05)" }}>
              <div style={{ font: "700 18px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", marginBottom: 14 }}>FAQ</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {p.faqs.map((f, i) => {
                  const on = i === openFaq;
                  return (
                    <div key={f.q} style={{ borderBottom: "1px solid #eef3f7", paddingBottom: 8 }}>
                      <button
                        type="button"
                        onClick={() => setOpenFaq(on ? -1 : i)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 12,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                          padding: "6px 0",
                        }}
                      >
                        <span style={{ font: "700 13.5px/1.4 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{f.q}</span>
                        <span
                          style={{
                            flex: "none",
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            background: on ? "linear-gradient(135deg,#2fc4bc,#2f7fd6)" : "#eef3f7",
                            color: on ? "#fff" : "#5b6e82",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            font: "700 15px 'Plus Jakarta Sans',sans-serif",
                          }}
                        >
                          {on ? "−" : "+"}
                        </span>
                      </button>
                      {on && <div style={{ font: "400 13px/1.7 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", padding: "2px 0 8px" }}>{f.a}</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "26px 28px", boxShadow: "0 2px 6px rgba(10,27,51,.05)" }}>
              <div style={{ font: "700 18px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", marginBottom: 14 }}>Who this is for</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {p.audience.map((a) => (
                  <div key={a} style={{ background: "#fff", border: "1px solid #dbe5ec", color: "#3d5064", font: "600 12px 'Plus Jakarta Sans',sans-serif", padding: "7px 13px", borderRadius: 999 }}>
                    {a}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OTHER SERVICES */}
      <div className="site-page-sec" style={{ background: "#f4f7f9", padding: "72px 48px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ ...eyebrow, marginBottom: 24 }}>Explore other verticals</div>
          <div className="site-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {other.map((s) => (
              <Link
                key={s.key}
                href={s.href}
                className="site-card"
                style={{
                  background: "#fff",
                  border: "1px solid #e3eaf0",
                  borderRadius: 18,
                  padding: "26px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  boxShadow: "0 2px 6px rgba(10,27,51,.05)",
                }}
              >
                <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "rgba(10,27,51,.25)" }}>{s.num}</div>
                <div style={{ font: "700 17px/1.32 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{s.label}</div>
                <div style={{ font: "700 13.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", marginTop: 4 }}>Explore →</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const inputStyle: CSSProperties = {
  background: "#fff",
  border: "1px solid #dbe5ec",
  borderRadius: 11,
  padding: "13px 15px",
  fontSize: "14.5px",
  color: "#0a1b33",
  fontFamily: "'Plus Jakarta Sans',sans-serif",
  width: "100%",
  boxSizing: "border-box",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <span style={{ font: "600 12.5px 'Plus Jakarta Sans',sans-serif", color: "#3d5064" }}>{label}</span>
      {children}
    </label>
  );
}

function ContactRow({ href, title, sub }: { href: string; title: string; sub: string }) {
  return (
    <a href={href} style={{ display: "flex", gap: 14, alignItems: "flex-start", color: "inherit" }}>
      <div
        style={{
          width: 38,
          height: 38,
          flex: "none",
          borderRadius: 11,
          background: "rgba(47,196,188,.12)",
          border: "1px solid rgba(27,143,136,.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1b8f88" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16v16H4z" opacity="0" />
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z" />
        </svg>
      </div>
      <div>
        <div style={{ font: "700 13.5px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{title}</div>
        <div style={{ font: "500 13px 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", marginTop: 2 }}>{sub}</div>
      </div>
    </a>
  );
}
