/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { type CSSProperties } from "react";
import Reveal from "@/components/home/Reveal";

const facts = [
  { v: "2023", l: "Founded" },
  { v: "2,000+", l: "Participants trained" },
  { v: "15+", l: "Yrs global HR practice" },
  { v: "35+", l: "Yrs institutional HR legacy" },
];
const highlights = [
  { v: "4.9★", l: "Google Reviews rating" },
  { v: "2,000+", l: "Participants trained so far" },
  { v: "6", l: "Certification pathways" },
];
const hpills = ["Flexible Training Modes", "Delivered By Industry Experts", "Hands-On Learning", "Assessment-Based Certification"];
const pkTags = ["Leadership enablement", "Workplace culture", "DEI", "POSH & POCSO", "Wellbeing", "People advisory"];
const rpnTags = ["ONGC · Chief Manager HR", "Employee relations", "HR governance", "Workforce capability", "Organizational learning"];
const accred = [
  { badge: "ISO", t: "ISO Certified", d: "Quality-assured training organization." },
  { badge: "TTT", t: "Train-the-Trainer Framework", d: "Practice-led facilitator development with assessment-linked certification." },
  { badge: "POSH", t: "POSH & IC Advisory", d: "Programs designed with legal clarity and facilitation sensitivity." },
  { badge: "HR EDGE", t: "HR Edge Curriculum", d: "Integrated DEI, POSH and wellbeing certification for future HR professionals." },
];
const gallery = [
  "/assets/founder-speaking.jpeg",
  "/assets/group-chitkara.jpeg",
  "/assets/workshop-tables.jpeg",
  "/assets/audience-red-hall.jpeg",
  "/assets/workshop-handsup.jpeg",
  "/assets/outdoor-group.jpeg",
  "/assets/school-group.jpeg",
  "/assets/students-group.png",
  "/assets/award-speaker.jpeg",
];

const eyebrow: CSSProperties = { font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 };

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <div className="site-page-sec" style={{ position: "relative", overflow: "hidden", background: "#eef4f7", padding: "82px 48px 74px" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          <img src="/assets/hr-conclave-stage.jpeg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg,rgba(243,248,251,.98) 34%,rgba(240,246,250,.72))" }} />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(27,143,136,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(27,143,136,.06) 1px,transparent 1px)",
            backgroundSize: "56px 56px",
            animation: "gridDrift 6s linear infinite",
          }}
        />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 90, background: "linear-gradient(180deg,transparent,#f7fafc)" }} />
        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ font: "500 12.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginBottom: 18 }}>
            <Link href="/" style={{ color: "#8296a9" }}>
              Home
            </Link>{" "}
            / <span style={{ color: "#1b8f88" }}>About Us</span>
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
              marginBottom: 24,
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#2fc4bc" }} />
            About Levitate PeopleSoft
          </div>
          <h1 style={{ font: "700 clamp(34px,4vw,54px)/1.12 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 20px", letterSpacing: "-.02em", maxWidth: 820 }}>
            Built on HR Legacy.
            <br />
            Strengthened by Global Workplace Practice.
          </h1>
          <p style={{ font: "400 16.5px/1.75 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", maxWidth: 700, margin: 0, textWrap: "pretty" } as CSSProperties}>
            Levitate PeopleSoft is a workplace capability, facilitator certification and reskilling organization focused on helping professionals and organizations build future-ready people
            capability.
          </p>
        </div>
      </div>

      {/* STORY */}
      <div className="site-page-sec" style={{ background: "#fff", padding: "88px 48px" }}>
        <div className="site-stack" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1.15fr .85fr", gap: 64, alignItems: "start" }}>
          <Reveal>
            <div style={eyebrow}>Our Story</div>
            <h2 style={{ font: "700 clamp(26px,2.8vw,36px)/1.18 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 22px", letterSpacing: "-.02em" }}>
              A blend of Indian institutional HR depth and contemporary global practice
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, font: "400 15.5px/1.8 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>
              <p style={{ margin: 0, textWrap: "pretty" } as CSSProperties}>
                Our journey began in 2023, founded by <strong style={{ color: "#0a1b33" }}>Mr. Ravindra Prem Nath</strong>, former Chief Manager – HR at ONGC. With over 35 years of experience in
                people management, employee relations, HR governance, workforce capability building and organizational learning, he brings deep institutional HR wisdom and people-centred workplace
                experience to Levitate PeopleSoft.
              </p>
              <p style={{ margin: 0, textWrap: "pretty" } as CSSProperties}>
                This foundation of disciplined HR practice, employee sensitivity and organizational learning has shaped Levitate&apos;s commitment to practical, responsible and human-centred learning.
              </p>
              <p style={{ margin: 0, textWrap: "pretty" } as CSSProperties}>
                Today, Levitate PeopleSoft is led forward by <strong style={{ color: "#0a1b33" }}>Parichita Kotnala</strong>, Founder &amp; Managing Partner, who brings over 15 years of global HR
                leadership, leadership development and workplace culture experience across diverse teams, geographies and business environments — spanning India, the UK, Europe, USA and Canada.
              </p>
              <p style={{ margin: 0, textWrap: "pretty" } as CSSProperties}>
                We specialize in Train-the-Trainer certification programs, workplace facilitator development, corporate training and HR capability-building solutions across leadership, DEI, workplace
                mental health and wellbeing, POSH, POCSO, people culture and professional readiness.
              </p>
            </div>
            <div style={{ marginTop: 28, background: "#f4f7f9", border: "1px solid rgba(27,143,136,.35)", borderRadius: 16, padding: "28px 30px" }}>
              <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 10 }}>Our Purpose</div>
              <div style={{ font: "600 21px/1.5 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", textWrap: "pretty" } as CSSProperties}>
                To elevate trainers, transform workplaces and enable human-centred change — helping professionals become confident facilitators who lead conversations that shape high-trust, inclusive
                and future-ready workplaces.
              </div>
            </div>
          </Reveal>
          <Reveal style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <img
              src="/assets/audience-red-hall.jpeg"
              alt="Levitate session"
              style={{ width: "100%", borderRadius: 18, border: "1px solid #e3eaf0", display: "block", aspectRatio: "4/3", objectFit: "cover" }}
            />
            <div className="site-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {facts.map((f) => (
                <div key={f.l} style={{ background: "#f4f7f9", border: "1px solid #e3eaf0", borderRadius: 16, padding: "22px 20px" }}>
                  <div
                    style={{
                      font: "700 30px 'Plus Jakarta Sans',sans-serif",
                      background: "linear-gradient(120deg,#1b8f88,#2f7fd6)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {f.v}
                  </div>
                  <div style={{ font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", letterSpacing: ".07em", textTransform: "uppercase", marginTop: 6 }}>{f.l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* LEADERSHIP */}
      <div className="site-page-sec" style={{ background: "#f4f7f9", padding: "88px 48px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={eyebrow}>Leadership</div>
            <h2 style={{ font: "700 clamp(28px,3vw,40px)/1.15 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: 0, letterSpacing: "-.02em" }}>The people behind Levitate PeopleSoft</h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            <Reveal
              className="site-stack"
              style={{
                background: "#fff",
                border: "1px solid #e3eaf0",
                borderRadius: 22,
                overflow: "hidden",
                display: "grid",
                gridTemplateColumns: "420px 1fr",
                boxShadow: "0 2px 8px rgba(10,27,51,.05)",
              }}
            >
              <div style={{ position: "relative", minHeight: 340 }}>
                <img
                  src="/assets/parichita-full.jpg"
                  alt="Parichita Kotnala"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%", display: "block" }}
                />
              </div>
              <div style={{ padding: "40px 44px" }}>
                <div style={{ font: "700 26px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>Parichita Kotnala</div>
                <div style={{ font: "600 13.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", margin: "6px 0 4px" }}>Founder &amp; Managing Partner</div>
                <div style={{ font: "500 12.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginBottom: 18 }}>
                  Global HR Leader · Workplace Culture Facilitator · Certification Program Designer
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, font: "400 14.5px/1.75 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>
                  <p style={{ margin: 0, textWrap: "pretty" } as CSSProperties}>
                    Parichita brings over 15 years of global HR, leadership development and workplace culture experience across diverse teams and business environments. Her work spans HR business
                    partnering, leadership enablement, performance, employee relations, workplace compliance, POSH, POCSO, wellbeing, DEI and people advisory.
                  </p>
                  <p style={{ margin: 0, textWrap: "pretty" } as CSSProperties}>
                    Having worked across global workplace contexts, she brings practical insight into how organizations build leadership capability, psychological safety, inclusive cultures, safe
                    workplace practices and meaningful employee experiences. At Levitate PeopleSoft she leads the organization&apos;s next phase of growth through globally designed, practice-led
                    certification programs.
                  </p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 20 }}>
                  {pkTags.map((t) => (
                    <div
                      key={t}
                      style={{
                        background: "rgba(47,196,188,.1)",
                        border: "1px solid rgba(27,143,136,.32)",
                        color: "#136f6a",
                        font: "600 12px 'Plus Jakarta Sans',sans-serif",
                        padding: "7px 14px",
                        borderRadius: 999,
                      }}
                    >
                      {t}
                    </div>
                  ))}
                </div>
                <Link
                  href="/parichita-kotnala"
                  className="lp-btn-grad"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 9,
                    marginTop: 24,
                    background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)",
                    color: "#fff",
                    font: "700 14px 'Plus Jakarta Sans',sans-serif",
                    padding: "13px 26px",
                    borderRadius: 999,
                    boxShadow: "0 10px 24px rgba(27,143,136,.26)",
                  }}
                >
                  Know more about Parichita <span aria-hidden="true">→</span>
                </Link>
              </div>
            </Reveal>
            <Reveal
              className="site-stack"
              style={{
                background: "#fff",
                border: "1px solid #e3eaf0",
                borderRadius: 22,
                overflow: "hidden",
                display: "grid",
                gridTemplateColumns: "1fr 420px",
                boxShadow: "0 2px 8px rgba(10,27,51,.05)",
              }}
            >
              <div style={{ padding: "40px 44px" }}>
                <div style={{ font: "700 26px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>Mr. Ravindra Prem Nath</div>
                <div style={{ font: "600 13.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", margin: "6px 0 4px" }}>Director &amp; Principal Advisor</div>
                {/* <div style={{ font: "500 12.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginBottom: 18 }}>Director</div> */}
                <br />
                <div style={{ display: "flex", flexDirection: "column", gap: 12, font: "400 14.5px/1.75 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>
                  <p style={{ margin: 0, textWrap: "pretty" } as CSSProperties}>
                    Mr. Nath brings over three decades of rich HR leadership experience from ONGC, one of India&apos;s leading public sector enterprises. As Chief Manager – HR he worked across people
                    management, employee relations, workforce administration, HR governance, learning initiatives and organizational capability building in a large-scale institutional environment.
                  </p>
                  <p style={{ margin: 0, textWrap: "pretty" } as CSSProperties}>
                    A blend of Indian institutional HR depth and contemporary global practice Our journey began in 2023, founded by Mr. Ravindra Prem Nath, former Chief Manager – HR at ONGC. With over
                    35 years of experience in people management, employee relations, HR governance, workforce capability building and organizational learning, he brings deep institutional HR wisdom
                    and people-centred workplace experience to Levitate PeopleSoft.
                  </p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 20 }}>
                  {rpnTags.map((t) => (
                    <div
                      key={t}
                      style={{
                        background: "rgba(47,127,214,.09)",
                        border: "1px solid rgba(47,127,214,.3)",
                        color: "#215f9e",
                        font: "600 12px 'Plus Jakarta Sans',sans-serif",
                        padding: "7px 14px",
                        borderRadius: 999,
                      }}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </div>
              <div className="site-order-first" style={{ position: "relative", minHeight: 340 }}>
                <img
                  src="/assets/ravindra-full.jpg"
                  alt="Mr. Ravindra Prem Nath"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 20%", display: "block" }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* HIGHLIGHTS */}
      <div
        className="site-page-sec"
        style={{ background: "linear-gradient(120deg,#e7f5f3,#eaf1fa)", borderTop: "1px solid rgba(27,143,136,.2)", borderBottom: "1px solid rgba(27,143,136,.2)", padding: "64px 48px" }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div className="site-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22, marginBottom: 26 }}>
            {highlights.map((h) => (
              <div key={h.l} style={{ background: "rgba(255,255,255,.7)", border: "1px solid rgba(27,143,136,.28)", borderRadius: 18, padding: "26px 28px", textAlign: "center" }}>
                <div
                  style={{
                    font: "700 40px 'Plus Jakarta Sans',sans-serif",
                    background: "linear-gradient(120deg,#1b8f88,#2f7fd6)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {h.v}
                </div>
                <div style={{ font: "600 12.5px 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", letterSpacing: ".08em", textTransform: "uppercase", marginTop: 8 }}>{h.l}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12 }}>
            {hpills.map((pill) => (
              <div
                key={pill}
                style={{
                  background: "#fff",
                  border: "1px solid rgba(27,143,136,.32)",
                  color: "#0a1b33",
                  font: "600 13px 'Plus Jakarta Sans',sans-serif",
                  padding: "10px 20px",
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)" }} />
                {pill}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACCREDITATIONS */}
      <div className="site-page-sec" style={{ background: "#fff", padding: "88px 48px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={eyebrow}>Accreditations &amp; Standards</div>
            <h2 style={{ font: "700 clamp(26px,2.8vw,36px)/1.15 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: 0, letterSpacing: "-.02em" }}>
              Practice governed by standards, not slideware
            </h2>
          </Reveal>
          <div className="site-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
            {accred.map((a) => (
              <Reveal key={a.t} style={{ background: "#f7fafc", border: "1px solid #e3eaf0", borderRadius: 18, padding: "28px 24px", textAlign: "center", boxShadow: "0 2px 6px rgba(10,27,51,.05)" }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    margin: "0 auto 14px",
                    borderRadius: "50%",
                    border: "2px solid #2fc4bc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    font: "700 12px 'Plus Jakarta Sans',sans-serif",
                    color: "#1b8f88",
                    textAlign: "center",
                    lineHeight: 1.15,
                  }}
                >
                  {a.badge}
                </div>
                <div style={{ font: "700 15.5px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{a.t}</div>
                <div style={{ font: "400 13px/1.6 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", marginTop: 6 }}>{a.d}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* GALLERY */}
      <div style={{ background: "#f4f7f9", padding: "72px 0", overflow: "hidden" }}>
        <Reveal style={{ textAlign: "center", marginBottom: 36, padding: "0 48px" }}>
          <div style={{ ...eyebrow, marginBottom: 12 }}>In The Room</div>
          <h2 style={{ font: "700 clamp(24px,2.6vw,34px)/1.15 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: 0, letterSpacing: "-.02em" }}>
            Sessions across campuses, conclaves and corporates
          </h2>
        </Reveal>
        <div className="lp-marquee-pause" style={{ display: "flex", width: "max-content", animation: "marquee 46s linear infinite" }}>
          {[...gallery, ...gallery].map((g, i) => (
            <img key={i} src={g} alt="Training session" style={{ height: 210, width: 315, marginRight: 20, objectFit: "cover", borderRadius: 14, border: "1px solid #e3eaf0", flex: "none" }} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="site-page-sec" style={{ position: "relative", background: "#fff", padding: "70px 48px 110px", overflow: "hidden" }}>
        <Reveal
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
            Let&apos;s build capability that lasts
          </h2>
          <p style={{ position: "relative", font: "400 16px/1.7 'Plus Jakarta Sans',sans-serif", color: "#a9bcd0", maxWidth: 600, margin: "0 auto 32px" }}>
            Partner with us for certification programs, customized training interventions and institutional learning solutions.
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
