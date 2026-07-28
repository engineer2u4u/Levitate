/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import Reveal from "@/components/home/Reveal";
import { contact } from "@/lib/site";

const INTENTS = ["Certification program (individual)", "Corporate training intervention", "Institutional / student program", "HR advisory & culture consulting", "Something else"];

const WHO = [
  "Individual professionals becoming credible facilitators",
  "Organizations looking for customized training interventions",
  "Colleges, universities and business schools turning academic learning into corporate readiness",
  "Growing organizations seeking HR advisory support",
];

const FAQS = [
  {
    q: "Who are the certification programs designed for?",
    a: "HR professionals, L&D leaders, managers, educators, consultants, coaches, trainers, psychologists, counsellors, HR students and aspiring workplace facilitators. Each program page lists the ideal participant profile.",
  },
  {
    q: "How is certification awarded?",
    a: "Certification is linked to participation, practice, reflection and assessment — not just attendance. Certificates are issued on successful completion of program requirements, including practice activities and assessment where applicable.",
  },
  {
    q: "Can programs be customized for our organization?",
    a: "Yes. Every corporate intervention begins with understanding your business context, participant profile, team challenges and desired behavioural outcomes, then follows our Diagnose → Design → Facilitate → Measure blueprint.",
  },
  {
    q: "Do you deliver virtually as well as in person?",
    a: "Yes — in-person, live online and blended formats are all available. We recommend a format based on participant numbers, geography and the depth of practice required.",
  },
  {
    q: "What do participants take away besides the certificate?",
    a: "A trainer toolkit: templates, case studies, facilitation guides, sample session plans, FAQs and workplace-ready tools they can use in their own sessions immediately.",
  },
];

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

export default function ContactPage() {
  const [intent, setIntent] = useState(0);
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <>
      {/* HERO */}
      <div className="site-page-sec" style={{ position: "relative", overflow: "hidden", background: "#eef4f7", padding: "76px 48px 64px" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(27,143,136,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(27,143,136,.06) 1px,transparent 1px)",
            backgroundSize: "56px 56px",
            animation: "gridDrift 6s linear infinite",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 40%,rgba(47,196,188,.14),transparent 60%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(180deg,transparent,#f7fafc)" }} />
        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ font: "500 12.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginBottom: 18 }}>
            <Link href="/" style={{ color: "#8296a9" }}>
              Home
            </Link>{" "}
            / <span style={{ color: "#1b8f88" }}>Contact</span>
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
              marginBottom: 22,
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#2fc4bc" }} />
            Get in touch
          </div>
          <h1 style={{ font: "700 clamp(32px,3.8vw,50px)/1.12 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 18px", letterSpacing: "-.02em", maxWidth: 760 }}>
            Let&apos;s talk about the capability you want to build
          </h1>
          <p style={{ font: "400 16.5px/1.75 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", maxWidth: 660, margin: 0, textWrap: "pretty" } as CSSProperties}>
            Whether you&apos;re an individual professional exploring certification or an organization planning a training intervention — tell us the context and we&apos;ll respond with a practical
            next step.
          </p>
        </div>
      </div>

      {/* FORM + INFO */}
      <div className="site-page-sec" style={{ background: "#fff", padding: "20px 48px 88px" }}>
        <div className="site-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1.15fr .85fr", gap: 34, alignItems: "start" }}>
          {/* Form */}
          <div style={{ background: "#f7fafc", border: "1px solid #e3eaf0", borderRadius: 22, padding: "40px 42px", boxShadow: "0 2px 8px rgba(10,27,51,.05)" }}>
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
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                  if (typeof window !== "undefined") window.scrollTo({ top: 240, behavior: "smooth" });
                }}
              >
                <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 10 }}>Enquiry form</div>
                <div style={{ font: "700 26px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", marginBottom: 6 }}>Tell us what you need</div>
                <div style={{ font: "400 14px/1.7 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", marginBottom: 28 }}>Fields marked * are required. We never share your details.</div>
                <div className="site-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                  <Field label="Full name *">
                    <input required type="text" placeholder="Your name" style={inputStyle} />
                  </Field>
                  <Field label="Email *">
                    <input required type="email" placeholder="you@company.com" style={inputStyle} />
                  </Field>
                  <Field label="Phone / WhatsApp *">
                    <input required type="tel" placeholder="+91" style={inputStyle} />
                  </Field>
                  <Field label="Organization / Institution">
                    <input type="text" placeholder="Company or college name" style={inputStyle} />
                  </Field>
                </div>
                <div style={{ marginTop: 22 }}>
                  <div style={{ font: "600 12.5px 'Plus Jakarta Sans',sans-serif", color: "#3d5064", marginBottom: 10 }}>I&apos;m enquiring about *</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {INTENTS.map((label, i) => {
                      const on = i === intent;
                      return (
                        <button
                          type="button"
                          key={label}
                          onClick={() => setIntent(i)}
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
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="site-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 22 }}>
                  <Field label="Approx. participants">
                    <select style={inputStyle}>
                      <option>Just me</option>
                      <option>2 – 15</option>
                      <option>16 – 40</option>
                      <option>41 – 100</option>
                      <option>100+</option>
                    </select>
                  </Field>
                  <Field label="Preferred mode">
                    <select style={inputStyle}>
                      <option>In-person</option>
                      <option>Virtual / live online</option>
                      <option>Blended</option>
                      <option>Not sure yet</option>
                    </select>
                  </Field>
                </div>
                <label style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 22 }}>
                  <span style={{ font: "600 12.5px 'Plus Jakarta Sans',sans-serif", color: "#3d5064" }}>Your requirement</span>
                  <textarea rows={5} placeholder="Context, capability gaps, timelines, anything else we should know" style={{ ...inputStyle, resize: "vertical" }} />
                </label>
                <button
                  type="submit"
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
                    cursor: "pointer",
                    boxShadow: "0 12px 28px rgba(27,143,136,.26)",
                  }}
                >
                  Send enquiry <span>→</span>
                </button>
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

          {/* Info column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Reveal style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "28px 30px", boxShadow: "0 2px 6px rgba(10,27,51,.05)" }}>
              <div style={{ font: "700 18px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", marginBottom: 18 }}>Reach us directly</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Row href={`mailto:${contact.email}`} title="Email" sub={contact.email} kind="mail" />
                <Row href={`tel:${contact.tel}`} title="Phone" sub={contact.phone} kind="phone" />
                <Row href={contact.whatsapp} title="WhatsApp" sub="Chat with our team →" kind="wa" />
              </div>
              <div style={{ borderTop: "1px solid #e3eaf0", marginTop: 20, paddingTop: 16, font: "500 12.5px/1.6 'Plus Jakarta Sans',sans-serif", color: "#8296a9" }}>
                Response time: within one working day
                <br />
                {contact.hours}
              </div>
            </Reveal>

            <Reveal
              style={{
                background: "linear-gradient(135deg,#0c2a45,#0a1f38)",
                border: "1px solid rgba(47,196,188,.35)",
                borderRadius: 20,
                padding: "28px 30px",
                boxShadow: "0 20px 46px rgba(10,27,51,.22)",
              }}
            >
              <div style={{ font: "700 18px 'Plus Jakarta Sans',sans-serif", color: "#f2f7fb", marginBottom: 8 }}>Prefer a conversation?</div>
              <div style={{ font: "400 13.5px/1.7 'Plus Jakarta Sans',sans-serif", color: "#a9bcd0", marginBottom: 20 }}>
                Book a 30-minute discovery call to discuss your capability goals, participant profile and the right pathway.
              </div>
              <a
                href={contact.whatsapp}
                className="lp-btn-grad"
                style={{ display: "inline-flex", background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", padding: "13px 24px", borderRadius: 999 }}
              >
                Book a Discovery Call
              </a>
            </Reveal>

            <Reveal style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "26px 30px", boxShadow: "0 2px 6px rgba(10,27,51,.05)" }}>
              <div style={{ font: "700 18px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", marginBottom: 14 }}>Who we work with</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                {WHO.map((w) => (
                  <div key={w} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1b8f88" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 3 }}>
                      <path d="M5 13l4 4 10-10" />
                    </svg>
                    <div style={{ font: "500 13.5px/1.6 'Plus Jakarta Sans',sans-serif", color: "#3d5064" }}>{w}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="site-page-sec" style={{ background: "#f4f7f9", padding: "88px 48px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 }}>Before you write in</div>
            <h2 style={{ font: "700 clamp(26px,2.8vw,36px)/1.15 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: 0, letterSpacing: "-.02em" }}>Frequently asked questions</h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQS.map((f, i) => {
              const on = i === openFaq;
              return (
                <div
                  key={f.q}
                  style={{
                    background: "#fff",
                    border: `1px solid ${on ? "rgba(27,143,136,.45)" : "#e3eaf0"}`,
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: "0 2px 6px rgba(10,27,51,.05)",
                    transition: "border-color .25s ease",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(on ? -1 : i)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 18,
                      padding: "22px 26px",
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ font: "700 16px/1.4 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{f.q}</div>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        flex: "none",
                        borderRadius: "50%",
                        background: on ? "linear-gradient(135deg,#2fc4bc,#2f7fd6)" : "#eef3f7",
                        color: on ? "#fff" : "#5b6e82",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        font: "700 17px 'Plus Jakarta Sans',sans-serif",
                      }}
                    >
                      {on ? "−" : "+"}
                    </div>
                  </button>
                  {on && <div style={{ padding: "0 26px 24px", font: "400 14.5px/1.75 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", maxWidth: 700, textWrap: "pretty" } as CSSProperties}>{f.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function Row({ href, title, sub, kind }: { href: string; title: string; sub: string; kind: "mail" | "phone" | "wa" }) {
  const green = kind === "wa";
  return (
    <a href={href} style={{ display: "flex", gap: 14, alignItems: "flex-start", color: "inherit" }}>
      <div
        style={{
          width: 38,
          height: 38,
          flex: "none",
          borderRadius: 11,
          background: green ? "rgba(37,211,102,.12)" : "rgba(47,196,188,.12)",
          border: `1px solid ${green ? "rgba(37,211,102,.35)" : "rgba(27,143,136,.3)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={green ? "#1a9e4b" : "#1b8f88"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          {kind === "mail" && (
            <>
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </>
          )}
          {kind === "phone" && (
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z" />
          )}
          {kind === "wa" && <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 8.5 8.5 0 0 1-4-1L3 20l1.2-5.3a8.4 8.4 0 1 1 16.8-3.2z" />}
        </svg>
      </div>
      <div>
        <div style={{ font: "700 13.5px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{title}</div>
        <div style={{ font: "500 13px 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", marginTop: 2 }}>{sub}</div>
      </div>
    </a>
  );
}
