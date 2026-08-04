/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { type CSSProperties } from "react";
import Reveal from "@/components/home/Reveal";

const eyebrow: CSSProperties = { font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 };

const expertise = ["Leadership development", "Talent & performance management", "Employee engagement", "Organisational culture", "Change management", "Inclusion", "Workplace capability building"];

const regions = ["India", "United Kingdom", "Europe", "United States", "Canada"];

const education = [
  { t: "University of Delhi", d: "Graduate" },
  { t: "XLRI – Xavier School of Management", d: "Alumna" },
  {
    t: "Indian Society for Training & Development (ISTD)",
    d: "Diploma in Training and Development, recognised by the Department of Personnel and Training (DoPT), Government of India",
  },
];

const certifications = [
  {
    t: "POSH & POCSO Educator and Trainer",
    d: "Internationally certified",
  },
  {
    t: "Certified Soft-Skills Trainer",
    d: "LifeLabs Learning, USA",
  },
  {
    t: "Certified Workplace Mental Health and Wellbeing Trainer",
    d: "Including specialised training in Adult Mental Health First Aid from MHFA England",
  },
];

export default function ParichitaPage() {
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
            / <span style={{ color: "#1b8f88" }}>Parichita Kotnala</span>
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
            Leadership
          </div>
          <h1 style={{ font: "700 clamp(34px,4vw,54px)/1.12 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 14px", letterSpacing: "-.02em" }}>Parichita Kotnala</h1>
          <p style={{ font: "600 17px/1.6 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", margin: 0 }}>Founder &amp; Managing Partner, Levitate PeopleSoft</p>
        </div>
      </div>

      {/* PORTRAIT + BIO */}
      <div className="site-page-sec" style={{ background: "#fff", padding: "80px 48px" }}>
        <div className="site-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: ".8fr 1.2fr", gap: 60, alignItems: "start" }}>
          <Reveal style={{ position: "relative" }}>
            <img
              src="/assets/parichita-kotnala.jpg"
              alt="Parichita Kotnala, Founder & Managing Partner of Levitate PeopleSoft"
              style={{ width: "100%", display: "block", borderRadius: 20, border: "1px solid #e3eaf0", background: "#f4f7f9", boxShadow: "0 24px 60px rgba(10,27,51,.14)" }}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 18 }}>
              <div style={{ background: "#f4f7f9", border: "1px solid #e3eaf0", borderRadius: 16, padding: "20px 18px" }}>
                <div
                  style={{
                    font: "700 30px 'Plus Jakarta Sans',sans-serif",
                    background: "linear-gradient(120deg,#1b8f88,#2f7fd6)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  15
                </div>
                <div style={{ font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", letterSpacing: ".07em", textTransform: "uppercase", marginTop: 6 }}>Years in strategic HR</div>
              </div>
              <div style={{ background: "#f4f7f9", border: "1px solid #e3eaf0", borderRadius: 16, padding: "20px 18px" }}>
                <div
                  style={{
                    font: "700 30px 'Plus Jakarta Sans',sans-serif",
                    background: "linear-gradient(120deg,#1b8f88,#2f7fd6)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  5
                </div>
                <div style={{ font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", letterSpacing: ".07em", textTransform: "uppercase", marginTop: 6 }}>Regions worked across</div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div style={eyebrow}>Profile</div>
            <h2 style={{ font: "700 clamp(24px,2.6vw,34px)/1.2 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 22px", letterSpacing: "-.02em" }}>
              Global HR leadership, brought into the training room
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, font: "400 15.5px/1.8 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>
              <p style={{ margin: 0, textWrap: "pretty" } as CSSProperties}>
                Parichita Kotnala is a global HR leader and learning facilitator with 15 years of strategic human resources experience across multinational organisations. Throughout her corporate
                career, she has partnered with leaders and teams across India, the United Kingdom, Europe, the United States and Canada. Her expertise spans leadership development, talent and
                performance management, employee engagement, organisational culture, change management, inclusion and workplace capability building.
              </p>
              <p style={{ margin: 0, textWrap: "pretty" } as CSSProperties}>
                A graduate of the University of Delhi, Parichita is also an alumna of XLRI – Xavier School of Management and the Indian Society for Training &amp; Development (ISTD), with a Diploma in
                Training and Development recognised by the Department of Personnel and Training (DoPT), Government of India.
              </p>
              <p style={{ margin: 0, textWrap: "pretty" } as CSSProperties}>
                She is an internationally certified POSH and POCSO Educator and Trainer. She is also a certified soft-skills trainer through LifeLabs Learning, USA, and a certified Workplace Mental
                Health and Wellbeing Trainer, with specialised training in Adult Mental Health First Aid from MHFA England.
              </p>
              <p style={{ margin: 0, textWrap: "pretty" } as CSSProperties}>
                Through Levitate PeopleSoft, Parichita brings together global corporate experience, strong subject expertise and practical facilitation to develop credible trainers, capable leaders
                and safer, more inclusive and human-centred workplaces.
              </p>
            </div>

            <div style={{ marginTop: 30 }}>
              <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 14 }}>Areas of expertise</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
                {expertise.map((e) => (
                  <div
                    key={e}
                    style={{
                      background: "rgba(47,196,188,.1)",
                      border: "1px solid rgba(27,143,136,.32)",
                      color: "#136f6a",
                      font: "600 12.5px 'Plus Jakarta Sans',sans-serif",
                      padding: "8px 15px",
                      borderRadius: 999,
                    }}
                  >
                    {e}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 26 }}>
              <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 14 }}>Worked across</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
                {regions.map((r) => (
                  <div
                    key={r}
                    style={{
                      background: "rgba(47,127,214,.09)",
                      border: "1px solid rgba(47,127,214,.3)",
                      color: "#215f9e",
                      font: "600 12.5px 'Plus Jakarta Sans',sans-serif",
                      padding: "8px 15px",
                      borderRadius: 999,
                    }}
                  >
                    {r}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* EDUCATION + CERTIFICATIONS */}
      <div className="site-page-sec" style={{ background: "#f4f7f9", padding: "80px 48px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Reveal style={{ maxWidth: 720, marginBottom: 44 }}>
            <div style={eyebrow}>Education &amp; Credentials</div>
            <h2 style={{ font: "700 clamp(26px,2.8vw,36px)/1.15 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: 0, letterSpacing: "-.02em" }}>
              Qualified to teach the conversations that matter
            </h2>
          </Reveal>

          <div className="site-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1.25fr", gap: 34, alignItems: "start" }}>
            {/* Education */}
            <Reveal>
              <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 16 }}>Education</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {education.map((e) => (
                  <div key={e.t} style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 16, padding: "22px 24px", boxShadow: "0 2px 6px rgba(10,27,51,.05)" }}>
                    <div style={{ font: "700 15.5px/1.35 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{e.t}</div>
                    <div style={{ font: "400 13.5px/1.65 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", marginTop: 5 }}>{e.d}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Certifications */}
            <Reveal>
              <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 16 }}>
                Certifications &amp; empanelment
              </div>
              <div className="site-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {certifications.map((c) => (
                  <div
                    key={c.t}
                    style={{
                      background: "#fff",
                      border: "1px solid #e3eaf0",
                      borderRadius: 16,
                      padding: "22px 24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      boxShadow: "0 2px 6px rgba(10,27,51,.05)",
                    }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3z" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                    </div>
                    <div style={{ font: "700 15px/1.35 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{c.t}</div>
                    <div style={{ font: "400 13px/1.65 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>{c.d}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="site-page-sec" style={{ position: "relative", background: "#fff", padding: "70px 48px 110px", overflow: "hidden" }}>
        <Reveal
          className="lp-cta"
          style={{
            position: "relative",
            maxWidth: 1100,
            margin: "0 auto",
            background: "linear-gradient(135deg,#0c2a45,#0a1f38)",
            border: "1px solid rgba(47,196,188,.35)",
            borderRadius: 26,
            padding: "60px 56px",
            textAlign: "center",
            overflow: "hidden",
            boxShadow: "0 30px 70px rgba(10,27,51,.25)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -120,
              left: "50%",
              transform: "translateX(-50%)",
              width: 600,
              height: 300,
              background: "radial-gradient(ellipse,rgba(47,196,188,.25),transparent 70%)",
              filter: "blur(20px)",
            }}
          />
          <h2 style={{ position: "relative", font: "700 clamp(26px,3vw,40px)/1.2 'Plus Jakarta Sans',sans-serif", color: "#f2f7fb", margin: "0 0 16px", letterSpacing: "-.02em" }}>
            Work with Parichita
          </h2>
          <p style={{ position: "relative", font: "400 16px/1.7 'Plus Jakarta Sans',sans-serif", color: "#a9bcd0", maxWidth: 620, margin: "0 auto 32px" }}>
            Explore certification programs, customized training interventions and HR advisory led by Levitate PeopleSoft.
          </p>
          <div style={{ position: "relative", display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/contact"
              className="lp-btn-grad"
              style={{ background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 15px 'Plus Jakarta Sans',sans-serif", padding: "16px 30px", borderRadius: 999 }}
            >
              Book a Discovery Call
            </Link>
            <Link
              href="/certifications"
              className="lp-btn-outline-light"
              style={{ border: "1.5px solid rgba(255,255,255,.25)", color: "#e8f1f8", font: "700 15px 'Plus Jakarta Sans',sans-serif", padding: "16px 30px", borderRadius: 999 }}
            >
              Explore Certifications
            </Link>
          </div>
        </Reveal>
      </div>
    </>
  );
}
