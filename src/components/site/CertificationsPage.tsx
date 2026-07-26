/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import Reveal from "@/components/home/Reveal";

const included = ["Facilitation practice & feedback", "Trainer toolkit: templates, guides, FAQs", "Workplace case studies & scenarios", "Assessment-linked certification"];

const why = [
  { t: "Global content with workplace relevance", d: "Global workplace content, practical HR insights and real-world application for evolving workplace realities." },
  { t: "Practice-led learning", d: "Cases, reflection, discussion, role plays and facilitation practice — not only theory." },
  { t: "Designed for sensitive conversations", d: "Leadership, DEI, wellbeing, POSH and POCSO facilitated with confidence, clarity and care." },
  { t: "Trainer toolkits included", d: "Templates, case studies, facilitation guides, sample session plans, FAQs and workplace-ready tools." },
  { t: "Assessment-based certification", d: "Linked to participation, practice, reflection and assessment — not just attendance." },
];

type Program = {
  id: string; num: string; tag: string; short: string; title: string; sub: string;
  p1: string; p2: string; ideal: string; pillarTitle: string; pillars: { k: string; v: string }[];
};

const programs: Program[] = [
  { id: "leadership", num: "01", tag: "Flagship", short: "Corporate Leadership Facilitator", title: "Certified Corporate Leadership Facilitator Program", sub: "Powered by the HUMAN Leadership Framework",
    p1: "A flagship Train-the-Trainer certification for professionals who want to facilitate leadership conversations around trust, coaching, feedback, accountability, productivity, prioritization and team growth.",
    p2: "The program equips facilitators to run leadership sessions that managers actually apply — grounded in five essential workplace leadership behaviours.",
    ideal: "HR professionals, L&D leaders, managers, coaches, consultants, trainers and aspiring leadership facilitators.",
    pillarTitle: "The HUMAN Leadership Framework", pillars: [{ k: "H", v: "High-Trust Conversations" }, { k: "U", v: "Understanding Through Coaching" }, { k: "M", v: "Meaningful Feedback" }, { k: "A", v: "Accountability & Prioritization" }, { k: "N", v: "Nurturing Team Growth" }] },
  { id: "dei", num: "02", tag: "DEI · TTT", short: "Inclusive Workplace Facilitator", title: "Certified Inclusive Workplace Facilitator Program", sub: "Diversity, Equity & Inclusion Train-the-Trainer Certification",
    p1: "A Train-the-Trainer certification for professionals who want to facilitate meaningful conversations on diversity, equity, inclusion and belonging in the workplace. Participants build understanding of core DEI concepts, unconscious bias, inclusive language, psychological safety and inclusive leadership practices.",
    p2: "It also prepares trainers to design DEI sessions, handle sensitive questions, manage resistance, use case studies and facilitate conversations that encourage reflection, awareness and behaviour change.",
    ideal: "HR professionals, DEI champions, L&D teams, managers, consultants, workplace trainers and aspiring facilitators.",
    pillarTitle: "The BRIDGE Inclusion Framework", pillars: [{ k: "B", v: "Bias Made Visible" }, { k: "R", v: "Respectful Language" }, { k: "I", v: "Inclusive Decisions" }, { k: "D", v: "Dialogue Over Debate" }, { k: "G", v: "Growing Belonging" }, { k: "E", v: "Everyday Allyship" }] },
  { id: "wellbeing", num: "03", tag: "Wellbeing", short: "Workplace Wellbeing Facilitator", title: "Certified Workplace Wellbeing Facilitator Program", sub: "Applied Mental Health & Wellbeing Train-the-Trainer Certification",
    p1: "A Train-the-Trainer certification that prepares professionals to facilitate workplace mental health and wellbeing conversations with confidence, sensitivity and ethical responsibility.",
    p2: "Participants learn to design wellbeing sessions, discuss stress and burnout with sensitivity, promote psychological safety, reduce stigma, strengthen manager awareness and facilitate supportive conversations within a responsible workplace context.",
    ideal: "HR and L&D professionals, wellness practitioners, psychologists, counsellors, coaches, managers, workplace trainers and aspiring facilitators.",
    pillarTitle: "The CARES Wellbeing Framework", pillars: [{ k: "C", v: "Check-In Conversations" }, { k: "A", v: "Awareness of Signals" }, { k: "R", v: "Reducing Stigma" }, { k: "E", v: "Ethical Boundaries" }, { k: "S", v: "Safe Escalation" }] },
  { id: "posh", num: "04", tag: "POSH", short: "POSH & Workplace Dignity", title: "Certified POSH & Workplace Dignity Facilitator Program", sub: "POSH Train-the-Trainer Certification",
    p1: "A Train-the-Trainer certification for professionals who want to facilitate POSH awareness, workplace dignity, respectful behaviour and harassment-prevention conversations with legal clarity and facilitation maturity.",
    p2: "Participants learn to explain key POSH concepts, design awareness sessions, use workplace case studies, support manager sensitisation, strengthen IC capability-building conversations and respond to difficult participant questions with sensitivity and responsibility.",
    ideal: "HR professionals, IC members, external members, legal professionals, compliance teams, consultants, workplace trainers and aspiring POSH facilitators.",
    pillarTitle: "The CLEAR POSH Framework", pillars: [{ k: "C", v: "Clarity on the Law" }, { k: "L", v: "Listening Without Judgment" }, { k: "E", v: "Explaining Boundaries" }, { k: "A", v: "Addressing Resistance" }, { k: "R", v: "Responsible Reporting" }] },
  { id: "pocso", num: "05", tag: "POCSO", short: "POCSO & Child Safety", title: "Certified POCSO & Child Safety Facilitator Program", sub: "POCSO Train-the-Trainer Certification",
    p1: "A Train-the-Trainer certification for professionals who want to facilitate child-safety and POCSO awareness sessions with sensitivity, legal clarity and responsible communication.",
    p2: "Participants learn to explain child protection concepts, create age-appropriate and institution-sensitive awareness sessions, use case-based discussions, respond to sensitive questions, build awareness around safe and unsafe behaviours and support responsible reporting conversations.",
    ideal: "Educators, school counsellors, child-safety professionals, NGOs, HR professionals, trainers, institutional leaders and professionals working in child-facing environments.",
    pillarTitle: "The GUARD Child Safety Framework", pillars: [{ k: "G", v: "Ground Rules for Safety" }, { k: "U", v: "Understanding the Law" }, { k: "A", v: "Age-Appropriate Language" }, { k: "R", v: "Recognising Signals" }, { k: "D", v: "Disclosure & Reporting" }] },
  { id: "hredge", num: "06", tag: "For Students", short: "HR Edge Certification", title: "HR Edge Certification", sub: "Integrated DEI, POSH & Workplace Wellbeing Trainer Certification for Future HR Professionals",
    p1: "A uniquely Levitate-designed certification for MBA-HR, PGDM-HR, HR postgraduate students and early-career HR professionals who want to enter the workplace with applied capability beyond their academic degree.",
    p2: "The integrated program builds practical understanding of inclusion, respectful workplaces, POSH awareness, employee wellbeing, psychological safety and responsible HR response — strengthening interview readiness and helping participants stand out as future-ready HR professionals.",
    ideal: "MBA-HR and PGDM-HR students, HR postgraduates, early-career HR professionals, campus-to-corporate learners and students preparing for HR roles.",
    pillarTitle: "The EDGE Readiness Framework", pillars: [{ k: "E", v: "Everyday Inclusion" }, { k: "D", v: "Dignity & POSH Awareness" }, { k: "G", v: "Growth & Wellbeing" }, { k: "E", v: "Employable HR Judgment" }] },
];

const eyebrow: CSSProperties = { font: "700 12px 'Manrope',sans-serif", color: "#1b8f88", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 };

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
          <div style={{ font: "500 12.5px 'Manrope',sans-serif", color: "#8296a9", marginBottom: 18 }}>
            <Link href="/" style={{ color: "#8296a9" }}>Home</Link> / <span style={{ color: "#1b8f88" }}>Certifications</span>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(27,143,136,.45)", color: "#1b8f88", font: "600 12px 'Manrope',sans-serif", letterSpacing: ".16em", textTransform: "uppercase", padding: "8px 16px", borderRadius: 999, background: "rgba(255,255,255,.6)", marginBottom: 24 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#2fc4bc" }} />Certification Programs
          </div>
          <h1 style={{ font: "700 clamp(34px,4vw,54px)/1.12 'Space Grotesk',sans-serif", color: "#0a1b33", margin: "0 0 20px", letterSpacing: "-.02em", maxWidth: 820 }}>Choose Your Certification Pathway</h1>
          <p style={{ font: "400 16.5px/1.75 'Manrope',sans-serif", color: "#5b6e82", maxWidth: 740, margin: 0, textWrap: "pretty" } as CSSProperties}>Whether you are an HR professional, L&amp;D leader, educator, consultant, coach, manager or aspiring corporate trainer, Levitate PeopleSoft helps you build facilitation capability for the workplace conversations that matter most.</p>
        </div>
      </div>

      {/* QUICK NAV */}
      <div className="site-page-sec" style={{ background: "#f4f7f9", padding: "24px 48px 60px" }}>
        <div className="site-grid-6" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12 }}>
          {programs.map((p) => (
            <a key={p.id} href={`#${p.id}`} onClick={() => setOpenId(p.id)} className="site-card" style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 14, padding: "16px 16px", display: "flex", flexDirection: "column", gap: 6, boxShadow: "0 2px 6px rgba(10,27,51,.05)" }}>
              <div style={{ font: "700 10.5px 'Manrope',sans-serif", color: "#1b8f88", letterSpacing: ".13em", textTransform: "uppercase" }}>{p.tag}</div>
              <div style={{ font: "700 13px/1.35 'Space Grotesk',sans-serif", color: "#0a1b33" }}>{p.short}</div>
            </a>
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
                      <div style={{ width: 46, height: 46, flex: "none", borderRadius: 13, background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 16px 'Space Grotesk',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 22px rgba(27,143,136,.3)" }}>{p.num}</div>
                      <div style={{ font: "700 11.5px 'Manrope',sans-serif", color: "#1b8f88", letterSpacing: ".15em", textTransform: "uppercase", border: "1px solid rgba(27,143,136,.4)", borderRadius: 999, padding: "6px 14px" }}>{p.tag}</div>
                      <span className="site-cert-chev" style={{ marginLeft: "auto", flex: "none", width: 30, height: 30, borderRadius: "50%", background: collapsed ? "#eef3f7" : "linear-gradient(135deg,#2fc4bc,#2f7fd6)", color: collapsed ? "#5b6e82" : "#fff", alignItems: "center", justifyContent: "center" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" style={{ transform: collapsed ? "rotate(0deg)" : "rotate(180deg)", transition: "transform .3s ease" }}><path d="M6 9l6 6 6-6" /></svg>
                      </span>
                    </div>
                    <h2 style={{ font: "700 clamp(24px,2.5vw,32px)/1.2 'Space Grotesk',sans-serif", color: "#0a1b33", margin: "0 0 6px", letterSpacing: "-.02em" }}>{p.title}</h2>
                    <div style={{ font: "600 14px 'Manrope',sans-serif", color: "#2f7fd6", marginBottom: collapsed ? 0 : 18 }}>{p.sub}</div>
                  </div>
                  {!collapsed && (
                  <>
                  <p style={{ font: "400 15px/1.75 'Manrope',sans-serif", color: "#5b6e82", margin: "0 0 14px", maxWidth: 640, textWrap: "pretty" } as CSSProperties}>{p.p1}</p>
                  <p style={{ font: "400 15px/1.75 'Manrope',sans-serif", color: "#5b6e82", margin: 0, maxWidth: 640, textWrap: "pretty" } as CSSProperties}>{p.p2}</p>
                  <div style={{ marginTop: 24, background: "#fff", border: "1px solid rgba(27,143,136,.35)", borderRadius: 16, padding: "24px 26px" }}>
                    <div style={{ font: "700 12px 'Manrope',sans-serif", color: "#1b8f88", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 16 }}>{p.pillarTitle}</div>
                    <div className="site-pillars" style={{ display: "grid", gridTemplateColumns: `repeat(${p.pillars.length},minmax(0,1fr))`, gap: 12 }}>
                      {p.pillars.map((h, i) => (
                        <div key={i} style={{ position: "relative", background: "linear-gradient(165deg,#f7fafc,#eef4f7)", border: "1px solid #e3eaf0", borderRadius: 12, padding: "16px 13px 14px", overflow: "hidden" }}>
                          <div style={{ position: "absolute", top: 0, left: 12, right: 12, height: 2, background: "linear-gradient(90deg,#2fc4bc,#2f7fd6)" }} />
                          <div style={{ font: "700 30px/1 'Space Grotesk',sans-serif", background: "linear-gradient(120deg,#1b8f88,#2f7fd6)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", letterSpacing: "-.02em" }}>{h.k}</div>
                          <div style={{ font: "600 12px/1.4 'Manrope',sans-serif", color: "#3d5064", marginTop: 7 }}>{h.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  </>
                  )}
                </div>
                {!collapsed && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14, height: "100%" }}>
                  <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 16, padding: "22px 22px" }}>
                    <div style={{ font: "700 11.5px 'Manrope',sans-serif", color: "#1b8f88", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 10 }}>Ideal for</div>
                    <div style={{ font: "400 13.5px/1.7 'Manrope',sans-serif", color: "#5b6e82" }}>{p.ideal}</div>
                  </div>
                  <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 16, padding: "22px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ font: "700 11.5px 'Manrope',sans-serif", color: "#1b8f88", letterSpacing: ".14em", textTransform: "uppercase" }}>What&apos;s included</div>
                    {included.map((inc) => (
                      <div key={inc} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1b8f88" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 2 }}><path d="M5 13l4 4 10-10" /></svg>
                        <div style={{ font: "500 13px/1.55 'Manrope',sans-serif", color: "#3d5064" }}>{inc}</div>
                      </div>
                    ))}
                  </div>
                  <Link href="/contact" className="lp-btn-grad" style={{ background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 14px 'Manrope',sans-serif", padding: "14px 22px", borderRadius: 999, textAlign: "center", marginTop: "auto" }}>Enquire about this program</Link>
                </div>
                )}
              </div>
            </Reveal>
            );
          })}
        </div>
      </div>

      {/* WHY CERTIFY */}
      <div className="site-page-sec" style={{ background: "#f4f7f9", padding: "88px 48px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Reveal style={{ maxWidth: 760, marginBottom: 44 }}>
            <div style={eyebrow}>Why Get Certified With Us</div>
            <h2 style={{ font: "700 clamp(28px,3vw,40px)/1.15 'Space Grotesk',sans-serif", color: "#0a1b33", margin: "0 0 16px", letterSpacing: "-.02em" }}>Built for professionals who refuse to remain slide-based trainers</h2>
            <p style={{ font: "400 15.5px/1.75 'Manrope',sans-serif", color: "#5b6e82", margin: 0 }}>Our programs help participants become confident, credible and responsible workplace facilitators.</p>
          </Reveal>
          <div className="site-grid-5" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 16 }}>
            {why.map((w) => (
              <Reveal key={w.t} style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 16, padding: "26px 22px", display: "flex", flexDirection: "column", gap: 10, boxShadow: "0 2px 6px rgba(10,27,51,.05)" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4 10-10" /></svg>
                </div>
                <div style={{ font: "700 15.5px/1.3 'Space Grotesk',sans-serif", color: "#0a1b33" }}>{w.t}</div>
                <div style={{ font: "400 13.5px/1.65 'Manrope',sans-serif", color: "#5b6e82", textWrap: "pretty" } as CSSProperties}>{w.d}</div>
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
            <h2 style={{ font: "700 clamp(26px,2.8vw,36px)/1.18 'Space Grotesk',sans-serif", color: "#0a1b33", margin: "0 0 16px", letterSpacing: "-.02em" }}>A credential that reflects practice, not just attendance</h2>
            <p style={{ font: "400 15.5px/1.75 'Manrope',sans-serif", color: "#5b6e82", margin: "0 0 26px" }}>Certificates are issued upon successful completion of program requirements, including participation, practice activities and assessment where applicable.</p>
            <div className="site-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
              <div style={{ background: "#f7fafc", border: "1px solid #e3eaf0", borderRadius: 14, padding: "16px 14px", textAlign: "center" }}>
                <CertIcon d={<><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></>} />
                <div style={{ font: "700 12.5px 'Space Grotesk',sans-serif", color: "#0a1b33", marginTop: 8 }}>Assessment-based</div>
              </div>
              <div style={{ background: "#f7fafc", border: "1px solid #e3eaf0", borderRadius: 14, padding: "16px 14px", textAlign: "center" }}>
                <CertIcon d={<><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="8.5" cy="11" r="2" /><path d="M5.5 16c.6-1.4 1.7-2 3-2s2.4.6 3 2" /><path d="M14 9h5M14 12h5M14 15h3" /></>} />
                <div style={{ font: "700 12.5px 'Space Grotesk',sans-serif", color: "#0a1b33", marginTop: 8 }}>Verifiable ID</div>
              </div>
              <div style={{ background: "#f7fafc", border: "1px solid #e3eaf0", borderRadius: 14, padding: "16px 14px", textAlign: "center" }}>
                <CertIcon d={<><rect x="3" y="8" width="18" height="12" rx="2" /><path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /><path d="M3 13h18" /><path d="M11 13v2h2v-2" /></>} />
                <div style={{ font: "700 12.5px 'Space Grotesk',sans-serif", color: "#0a1b33", marginTop: 8 }}>Trainer toolkit</div>
              </div>
            </div>
          </Reveal>
          <Reveal style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: -30, background: "radial-gradient(circle at 50% 40%,rgba(47,196,188,.18),transparent 70%)" }} />
            <div style={{ position: "relative", background: "#fdfefe", border: "1px solid #dbe5ec", borderRadius: 6, boxShadow: "0 30px 70px rgba(10,27,51,.18)", padding: "38px 42px" }}>
              <div style={{ border: "2px solid #0a1b33", outline: "1px solid #2fc4bc", outlineOffset: 5, padding: "34px 30px", textAlign: "center" }}>
                <img src="/assets/logo.png" alt="Levitate PeopleSoft" style={{ height: 34, margin: "0 auto 18px", display: "block" }} />
                <div style={{ font: "600 10.5px 'Manrope',sans-serif", color: "#1b8f88", letterSpacing: ".3em", textTransform: "uppercase", marginBottom: 14 }}>Certificate of Completion</div>
                <div style={{ font: "400 12.5px 'Manrope',sans-serif", color: "#5b6e82" }}>This certifies that</div>
                <div style={{ font: "700 26px 'Space Grotesk',sans-serif", color: "#0a1b33", borderBottom: "1px solid #cfdbe4", padding: "8px 0", margin: "6px 24px 12px" }}>Participant Name</div>
                <div style={{ font: "400 12.5px/1.6 'Manrope',sans-serif", color: "#5b6e82", marginBottom: 18 }}>has successfully completed the<br /><strong style={{ color: "#0a1b33" }}>Certified Corporate Leadership Facilitator Program</strong><br />including participation, practice and assessment</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 26, padding: "0 8px" }}>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ font: "600 13px 'Space Grotesk',sans-serif", color: "#0a1b33", borderTop: "1px solid #cfdbe4", paddingTop: 6 }}>Parichita Kotnala</div>
                    <div style={{ font: "400 10.5px 'Manrope',sans-serif", color: "#8296a9" }}>Founder &amp; Managing Partner</div>
                  </div>
                  <div style={{ width: 58, height: 58, borderRadius: "50%", border: "2px solid #2fc4bc", display: "flex", alignItems: "center", justifyContent: "center", font: "700 9px 'Manrope',sans-serif", color: "#1b8f88", textAlign: "center", letterSpacing: ".08em" }}>LPS<br />SEAL</div>
                </div>
              </div>
              <div style={{ textAlign: "center", font: "600 11px monospace", color: "#8296a9", marginTop: 14 }}>certificate preview — issued on program completion</div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* CTA */}
      <div className="site-page-sec" style={{ position: "relative", background: "#fff", padding: "20px 48px 110px", overflow: "hidden" }}>
        <Reveal style={{ position: "relative", maxWidth: 1100, margin: "0 auto", background: "linear-gradient(135deg,#0c2a45,#0a1f38)", border: "1px solid rgba(47,196,188,.35)", borderRadius: 26, padding: "60px 56px", textAlign: "center", overflow: "hidden", boxShadow: "0 30px 70px rgba(10,27,51,.25)" }}>
          <div style={{ position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)", width: 600, height: 300, background: "radial-gradient(ellipse,rgba(47,196,188,.25),transparent 70%)", filter: "blur(20px)" }} />
          <h2 style={{ position: "relative", font: "700 clamp(26px,3vw,40px)/1.2 'Space Grotesk',sans-serif", color: "#f2f7fb", margin: "0 0 16px", letterSpacing: "-.02em" }}>Not sure which pathway fits you?</h2>
          <p style={{ position: "relative", font: "400 16px/1.7 'Manrope',sans-serif", color: "#a9bcd0", maxWidth: 600, margin: "0 auto 32px" }}>Book a short discovery call and we&apos;ll map your experience and goals to the right certification.</p>
          <div style={{ position: "relative", display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" className="lp-btn-grad" style={{ background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 15px 'Manrope',sans-serif", padding: "16px 30px", borderRadius: 999 }}>Book a Discovery Call</Link>
            <Link href="/services/train-the-trainer" className="lp-btn-outline-light" style={{ border: "1.5px solid rgba(255,255,255,.25)", color: "#e8f1f8", font: "700 15px 'Manrope',sans-serif", padding: "16px 30px", borderRadius: 999 }}>Explore All Services</Link>
          </div>
        </Reveal>
      </div>
    </>
  );
}
