/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Reveal from "./Reveal";
import Counter from "./Counter";
import TestimonialsCarousel from "./TestimonialsCarousel";
import ScrollToTop from "./ScrollToTop";
import FontToggle from "./FontToggle";
import { contact, navLinks, services, blueprintSteps, certs, whyPoints, impactStats, tickerA, tickerB, gallery, founders } from "@/lib/homeData";

/* ------------------------------------------------------------------ */
/* Small inline icons (stroke-based, matching the design)             */
/* ------------------------------------------------------------------ */
function MailIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#1b8f88" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}
function PhoneIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#1b8f88" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}
function WhatsAppIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#1b8f88" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 8.5 8.5 0 0 1-4-1L3 20l1.2-5.3a8.4 8.4 0 1 1 16.8-3.2z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Tilt handlers (perspective rotate on mouse move)                   */
/* ------------------------------------------------------------------ */
const tiltMoveDeep = (e: React.MouseEvent<HTMLDivElement>) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  el.style.transform = `perspective(1000px) rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg) translateY(-6px) scale(1.02)`;
};
const tiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  el.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
};
const tiltLeave = (e: React.MouseEvent<HTMLDivElement>) => {
  e.currentTarget.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
};

/* ================================================================== */
/*  Home page                                                         */
/* ================================================================== */
export default function HomePage() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  // Mobile blueprint accordion: independent open item (null = all collapsed)
  const [openStep, setOpenStep] = useState<number | null>(0);
  const userPicked = useRef(false);

  // Blueprint auto-advance every 4.5s while in viewport.
  useEffect(() => {
    const bpEl = document.querySelector<HTMLElement>('[data-screen-label="Blueprint"]');
    const id = setInterval(() => {
      if (userPicked.current || !bpEl) return;
      const r = bpEl.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        setStep((s) => (s + 1) % 4);
      }
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const selectStep = (i: number) => {
    userPicked.current = true;
    setStep(i);
  };

  const activeStep = blueprintSteps[step];

  // Impact counters — start on view.
  const [impactIn, setImpactIn] = useState(false);
  const impactRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = impactRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((x) => x.isIntersecting)) {
          setImpactIn(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <ScrollToTop />
      <FontToggle />

      {/* WHATSAPP FLOAT */}
      <div style={{ position: "fixed", bottom: 26, right: 26, zIndex: 90, display: "flex", alignItems: "center", gap: 10 }}>
        <div
          className="lp-wa-tip"
          style={{
            background: "#fff",
            color: "#0a1b33",
            font: "600 12px/1.3 'Manrope',sans-serif",
            padding: "8px 14px",
            borderRadius: 10,
            border: "1px solid rgba(47,196,188,.45)",
            boxShadow: "0 8px 24px rgba(10,27,51,.14)",
          }}
        >
          Chat with us on WhatsApp
        </div>
        <a
          href={contact.whatsapp}
          aria-label="Chat on WhatsApp"
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            background: "#25d366",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "pulse 2.6s infinite",
            boxShadow: "0 10px 26px rgba(10,27,51,.25)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
            <path d="M12 2a9.9 9.9 0 0 0-8.5 15.1L2 22l5.1-1.4A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.6.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.3 0-.4.1-.6l.4-.5a1.7 1.7 0 0 0 .3-.4.5.5 0 0 0 0-.5c0-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.1 5 5 0 0 0 1 2.7 11.4 11.4 0 0 0 4.4 3.9 14.5 14.5 0 0 0 1.5.5 3.5 3.5 0 0 0 1.6.1 2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .2-1.2c-.1-.1-.3-.2-.6-.3Z" />
          </svg>
        </a>
      </div>

      {/* TOP CONTACT BAR */}
      <div
        className="lp-sec"
        style={{
          background: "#fff",
          borderBottom: "1px solid #e3eaf0",
          padding: "8px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          rowGap: 6,
          columnGap: 16,
          lineHeight: 1.5,
          font: "500 12.5px/1.5 'Manrope',sans-serif",
          color: "#5b6e82",
        }}
      >
        <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
          <a href={`mailto:${contact.email}`} className="lp-footlink" style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
            <MailIcon />
            {contact.email}
          </a>
          <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="lp-footlink" style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
            <PhoneIcon />
            {contact.phone}
          </a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#3d5064" }}>
          <span style={{ color: "#f5b942", letterSpacing: "1px" }}>★★★★★</span> {contact.rating} on Google Reviews
        </div>
      </div>

      {/* STICKY HEADER */}
      <div
        className="lp-sec"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 80,
          background: "rgba(255,255,255,.85)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid #e3eaf0",
          padding: "14px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 8, padding: "6px 12px", display: "flex", alignItems: "center" }}>
          <img src="/assets/logo.png" alt="Levitate PeopleSoft" style={{ height: 34, display: "block" }} />
        </div>
        <nav className={`lp-nav${menuOpen ? " lp-nav-open" : ""}`} style={{ font: "600 14px 'Manrope',sans-serif" }}>
          {navLinks.map((l, i) => (
            <a key={l} href="#" onClick={() => setMenuOpen(false)} className={i === 0 ? undefined : "lp-navlink"} style={i === 0 ? { color: "#1b8f88" } : undefined}>
              {l}
            </a>
          ))}
          <a
            href="#"
            onClick={() => setMenuOpen(false)}
            className="lp-nav-cta lp-btn-grad"
            style={{ background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 13.5px 'Manrope',sans-serif", padding: "12px 22px", borderRadius: 999, textAlign: "center" }}
          >
            Book a Discovery Call
          </a>
        </nav>
        <a
          href="#"
          className="lp-header-cta lp-btn-grad"
          style={{ background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 13.5px 'Manrope',sans-serif", padding: "11px 22px", borderRadius: 999, whiteSpace: "nowrap" }}
        >
          Book a Discovery Call
        </a>
        <button
          type="button"
          className="lp-hamburger"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          style={{ width: 44, height: 44, borderRadius: 10, color: "rgb(47 135 211)", cursor: "pointer", alignItems: "center", justifyContent: "center" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <>
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* HERO */}
      <div
        data-screen-label="Hero"
        className="lp-sec lp-hero"
        style={{ position: "relative", overflow: "hidden", background: "#eef4f7", padding: "110px 48px", minHeight: "72vh", display: "flex", alignItems: "center" }}
      >
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <img
            src="/assets/founder-speaking.jpeg"
            alt="Founder video background"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", animation: "kenburns 24s ease-in-out infinite", willChange: "transform" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg,rgba(243,248,251,.98) 30%,rgba(243,248,251,.9) 55%,rgba(240,246,250,.68))" }} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 50%,rgba(47,196,188,.12),transparent 55%)" }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "linear-gradient(rgba(27,143,136,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(27,143,136,.06) 1px,transparent 1px)",
              backgroundSize: "56px 56px",
              animation: "gridDrift 6s linear infinite",
            }}
          />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(180deg,transparent,#f7fafc)" }} />
        </div>
        <div
          className="lp-hero-grid"
          style={{ position: "relative", maxWidth: 1240, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1.25fr .75fr", gap: 64, alignItems: "center" }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid rgba(27,143,136,.45)",
                color: "#1b8f88",
                font: "600 12px 'Manrope',sans-serif",
                letterSpacing: ".16em",
                textTransform: "uppercase",
                padding: "8px 16px",
                borderRadius: 999,
                marginBottom: 26,
                background: "rgba(255,255,255,.6)",
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#2fc4bc" }} />
              Workplace Capability · Certification · Reskilling
            </div>
            <h1 style={{ font: "700 clamp(40px,4.6vw,62px)/1.08 'Space Grotesk',sans-serif", color: "#0a1b33", margin: "0 0 24px", letterSpacing: "-.02em" }}>
              Elevating Trainers.
              <br />
              Transforming Workplaces.
              <br />
              <span style={{ background: "linear-gradient(120deg,#1b8f88,#2f7fd6)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>Leading Human Change.</span>
            </h1>
            <p style={{ font: "400 17px/1.7 'Manrope',sans-serif", color: "#5b6e82", maxWidth: 560, margin: "0 0 36px", textWrap: "pretty" } as CSSProperties}>
              Global content. Practical facilitation. Real workplace application. We design certification programs, corporate learning interventions and institutional training solutions that build
              high-trust, inclusive and human-centred workplaces.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <a
                href="#"
                className="lp-btn-grad"
                style={{
                  background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)",
                  color: "#fff",
                  font: "700 15px 'Manrope',sans-serif",
                  padding: "16px 30px",
                  borderRadius: 999,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  whiteSpace: "nowrap",
                  boxShadow: "0 12px 28px rgba(27,143,136,.28)",
                }}
              >
                Explore Certification Programs <span>→</span>
              </a>
              <a
                href="#"
                className="lp-btn-outline"
                style={{
                  border: "1.5px solid rgba(10,27,51,.28)",
                  color: "#0a1b33",
                  font: "700 15px 'Manrope',sans-serif",
                  padding: "16px 30px",
                  borderRadius: 999,
                  whiteSpace: "nowrap",
                  background: "rgba(255,255,255,.6)",
                }}
              >
                Book a Discovery Call
              </a>
            </div>
            <div className="lp-hero-stats" style={{ display: "flex", gap: 40, marginTop: 48 }}>
              <div>
                <div style={{ font: "700 30px 'Space Grotesk',sans-serif", color: "#0a1b33", fontVariantNumeric: "tabular-nums" }}>
                  <Counter to={2000} trigger="mount" />+
                </div>
                <div style={{ font: "500 12.5px 'Manrope',sans-serif", color: "#8296a9", letterSpacing: ".06em", textTransform: "uppercase" }}>Professionals trained</div>
              </div>
              <div className="lp-hero-divider" style={{ width: 1, background: "rgba(10,27,51,.14)" }} />
              <div>
                <div style={{ font: "700 30px 'Space Grotesk',sans-serif", color: "#0a1b33", fontVariantNumeric: "tabular-nums" }}>
                  <Counter to={15} trigger="mount" />+ yrs
                </div>
                <div style={{ font: "500 12.5px 'Manrope',sans-serif", color: "#8296a9", letterSpacing: ".06em", textTransform: "uppercase" }}>Global HR experience</div>
              </div>
              <div className="lp-hero-divider" style={{ width: 1, background: "rgba(10,27,51,.14)" }} />
              <div>
                <div style={{ font: "700 30px 'Space Grotesk',sans-serif", color: "#0a1b33" }}>
                  4.9<span style={{ color: "#f5b942", fontSize: 20 }}> ★</span>
                </div>
                <div style={{ font: "500 12.5px 'Manrope',sans-serif", color: "#8296a9", letterSpacing: ".06em", textTransform: "uppercase" }}>Google reviews</div>
              </div>
            </div>
          </div>
          <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22 }}>
            <div style={{ position: "relative", width: 190, height: 190, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "absolute", inset: 0, border: "1px dashed rgba(27,143,136,.5)", borderRadius: "50%", animation: "spinSlow 28s linear infinite" }} />
              <div style={{ position: "absolute", inset: 16, border: "1px solid rgba(10,27,51,.15)", borderRadius: "50%" }} />
              <div
                onClick={() => setVideoOpen(true)}
                className="lp-video-btn"
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: "pulse 2.4s infinite",
                  cursor: "pointer",
                }}
              >
                <div style={{ width: 0, height: 0, borderLeft: "30px solid #fff", borderTop: "18px solid transparent", borderBottom: "18px solid transparent", marginLeft: 8 }} />
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ font: "700 17px 'Space Grotesk',sans-serif", color: "#0a1b33" }}>A Message from Our Founder</div>
              <div style={{ font: "500 13px 'Manrope',sans-serif", color: "#5b6e82", marginTop: 5 }}>
                Why we build certified workplace facilitators
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VIDEO MODAL */}
      {videoOpen && (
        <div
          onClick={() => setVideoOpen(false)}
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
            <iframe
              src="https://www.youtube-nocookie.com/embed/wwsRPlyvxuM?autoplay=1&rel=0&modestbranding=1"
              title="A Message from Our Founder"
              allow="accelerated-download; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ width: "100%", height: "100%", border: "none", display: "block" }}
            />
            <div
              onClick={() => setVideoOpen(false)}
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
                font: "600 18px 'Manrope',sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              ✕
            </div>
          </div>
        </div>
      )}

      {/* TICKER */}
      <div
        style={{
          background: "#fff",
          borderTop: "1px solid rgba(27,143,136,.2)",
          borderBottom: "1px solid rgba(27,143,136,.2)",
          overflow: "hidden",
          padding: "18px 0",
          position: "relative",
          maskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)",
          WebkitMaskImage: "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)",
        }}
      >
        <div style={{ display: "flex", width: "max-content", animation: "marquee 32s linear infinite", gap: 14, marginBottom: 12 }}>
          {[...tickerA, ...tickerA].map((t, i) => (
            <div
              key={`a${i}`}
              className="lp-tick-a"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 20px",
                border: "1px solid rgba(27,143,136,.3)",
                borderRadius: 999,
                background: "rgba(47,196,188,.07)",
                font: "600 13.5px 'Space Grotesk',sans-serif",
                color: "#0a1b33",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)" }} />
              {t}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", width: "max-content", animation: "marqueeRev 38s linear infinite", gap: 14 }}>
          {[...tickerB, ...tickerB].map((t, i) => (
            <div
              key={`b${i}`}
              className="lp-tick-b"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 20px",
                border: "1px solid rgba(47,127,214,.3)",
                borderRadius: 999,
                background: "rgba(47,127,214,.06)",
                font: "600 13.5px 'Space Grotesk',sans-serif",
                color: "#5b6e82",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg,#5aa9f2,#2fc4bc)" }} />
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <div data-screen-label="Services" className="lp-sec" style={{ background: "#f4f7f9", padding: "96px 48px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Reveal style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 32, flexWrap: "wrap", marginBottom: 52 }}>
            <div>
              <div style={{ font: "700 12px 'Manrope',sans-serif", color: "#1b8f88", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 }}>Our Services</div>
              <h2 style={{ font: "700 clamp(30px,3.2vw,44px)/1.15 'Space Grotesk',sans-serif", color: "#0a1b33", margin: 0, letterSpacing: "-.02em", maxWidth: 640 }}>
                Learning, certification and capability-building for modern workplaces
              </h2>
            </div>
            <p style={{ font: "400 15.5px/1.7 'Manrope',sans-serif", color: "#5b6e82", maxWidth: 400, margin: 0 }}>
              We work with professionals, organizations and institutions across four core verticals.
            </p>
          </Reveal>
          <div className="lp-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 26, perspective: 1400 }}>
            {services.map((s) => (
              <Reveal
                key={s.num}
                className="lp-svc-card"
                onMouseMove={tiltMoveDeep}
                onMouseLeave={tiltLeave}
                style={{
                  position: "relative",
                  background: "linear-gradient(165deg,#ffffff,#f2f7fa)",
                  border: "1px solid #e3eaf0",
                  borderRadius: 20,
                  padding: "32px 26px 26px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  transformStyle: "preserve-3d",
                  boxShadow: "0 1px 2px rgba(10,27,51,.06),0 10px 24px rgba(10,27,51,.08),0 30px 60px -18px rgba(10,27,51,.18)",
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 22, right: 22, height: 3, borderRadius: "0 0 4px 4px", background: "linear-gradient(90deg,#2fc4bc,#2f7fd6)" }} />
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    font: "700 19px 'Space Grotesk',sans-serif",
                    color: "#fff",
                    boxShadow: "0 10px 22px rgba(27,143,136,.35)",
                    transform: "translateZ(36px)",
                  }}
                >
                  {s.num}
                </div>
                <div style={{ font: "700 18px/1.3 'Space Grotesk',sans-serif", color: "#0a1b33", transform: "translateZ(26px)" }}>{s.title}</div>
                <div style={{ font: "400 14px/1.65 'Manrope',sans-serif", color: "#5b6e82", flex: 1, textWrap: "pretty", transform: "translateZ(16px)" } as CSSProperties}>{s.desc}</div>
                <a href="#" style={{ font: "700 13.5px 'Manrope',sans-serif", color: "#1b8f88", transform: "translateZ(26px)" }}>
                  Explore →
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* BLUEPRINT */}
      <div data-screen-label="Blueprint" className="lp-sec" style={{ background: "#fff", padding: "96px 48px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ font: "700 12px 'Manrope',sans-serif", color: "#1b8f88", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 }}>The Levitate Learning Blueprint</div>
            <h2 style={{ font: "700 clamp(28px,3vw,40px)/1.15 'Space Grotesk',sans-serif", color: "#0a1b33", margin: 0, letterSpacing: "-.02em" }}>
              Learning that begins with context
              <br />
              and ends with workplace application
            </h2>
          </Reveal>
          <Reveal className="lp-blueprint-grid lp-bp-desktop" style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 28, alignItems: "stretch" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {blueprintSteps.map((b, i) => {
                const on = i === step;
                return (
                  <div
                    key={b.num}
                    onClick={() => selectStep(i)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "18px 20px",
                      borderRadius: 16,
                      cursor: "pointer",
                      background: on ? "linear-gradient(120deg,#2fc4bc,#2f7fd6)" : "#f4f7f9",
                      border: `1px solid ${on ? "rgba(27,143,136,.5)" : "#e3eaf0"}`,
                      transition: "background .3s ease,border-color .3s ease,transform .3s ease",
                      transform: on ? "translateX(8px)" : "translateX(0)",
                    }}
                  >
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        flex: "none",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        font: "700 17px 'Space Grotesk',sans-serif",
                        background: on ? "rgba(255,255,255,.22)" : "#e3ecf2",
                        color: on ? "#fff" : "#5b6e82",
                        transition: "background .3s ease",
                      }}
                    >
                      {b.num}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ font: "700 17px 'Space Grotesk',sans-serif", color: on ? "#fff" : "#0a1b33" }}>{b.title}</div>
                      <div style={{ font: "500 12px 'Manrope',sans-serif", color: on ? "rgba(255,255,255,.85)" : "#8296a9", marginTop: 2 }}>{b.short}</div>
                    </div>
                    <div style={{ font: "700 16px 'Manrope',sans-serif", color: on ? "#fff" : "#5b6e82" }}>→</div>
                  </div>
                );
              })}
              <div style={{ display: "flex", gap: 6, padding: "6px 4px 0" }}>
                {blueprintSteps.map((b, i) => (
                  <div key={b.num} style={{ flex: 1, height: 4, borderRadius: 2, background: i === step ? "linear-gradient(90deg,#2fc4bc,#2f7fd6)" : "#dde7ee", transition: "background .3s ease" }} />
                ))}
              </div>
              <div style={{ font: "500 11.5px 'Manrope',sans-serif", color: "#8296a9", padding: "2px 4px" }}>Auto-plays every few seconds — click any step to explore</div>
            </div>
            <div style={{ position: "relative", borderRadius: 22, overflow: "hidden", background: "#eef4f7", border: "1px solid #e3eaf0", minHeight: 420 }}>
              <img src={activeStep.img} alt={activeStep.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.22 }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg,rgba(244,249,251,.96) 20%,rgba(244,249,251,.62))" }} />
              <div style={{ position: "absolute", right: -20, bottom: -50, font: "700 260px 'Space Grotesk',sans-serif", color: "rgba(27,143,136,.09)", lineHeight: 1, pointerEvents: "none" }}>
                {activeStep.num}
              </div>
              <div style={{ position: "relative", padding: "52px 54px", display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box", justifyContent: "center", gap: 18 }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignSelf: "flex-start",
                    alignItems: "center",
                    gap: 10,
                    border: "1px solid rgba(27,143,136,.45)",
                    borderRadius: 999,
                    padding: "7px 16px",
                    font: "700 11.5px 'Manrope',sans-serif",
                    color: "#1b8f88",
                    letterSpacing: ".16em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  Step {activeStep.num} of 4
                </div>
                <div style={{ font: "700 40px 'Space Grotesk',sans-serif", color: "#0a1b33", letterSpacing: "-.02em" }}>{activeStep.title}</div>
                <div style={{ font: "400 16px/1.75 'Manrope',sans-serif", color: "#3d5064", maxWidth: 520, textWrap: "pretty" } as CSSProperties}>{activeStep.desc}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 6 }}>
                  {activeStep.chips.map((ch) => (
                    <div
                      key={ch}
                      style={{
                        background: "rgba(47,196,188,.12)",
                        border: "1px solid rgba(27,143,136,.35)",
                        color: "#136f6a",
                        font: "600 12.5px 'Manrope',sans-serif",
                        padding: "7px 14px",
                        borderRadius: 999,
                      }}
                    >
                      {ch}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Mobile: accordion layout */}
          <div className="lp-bp-mobile" style={{ display: "none", flexDirection: "column", gap: 12 }}>
            {blueprintSteps.map((b, i) => {
              const on = i === openStep;
              return (
                <div
                  key={b.num}
                  style={{ border: `1px solid ${on ? "rgba(27,143,136,.5)" : "#e3eaf0"}`, borderRadius: 16, overflow: "hidden", background: "#fff", transition: "border-color .3s ease" }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenStep((prev) => (prev === i ? null : i))}
                    aria-expanded={on}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "16px 18px",
                      cursor: "pointer",
                      border: "none",
                      textAlign: "left",
                      background: on ? "linear-gradient(120deg,#2fc4bc,#2f7fd6)" : "#f4f7f9",
                      transition: "background .3s ease",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        flex: "none",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        font: "700 16px 'Space Grotesk',sans-serif",
                        background: on ? "rgba(255,255,255,.22)" : "#e3ecf2",
                        color: on ? "#fff" : "#5b6e82",
                      }}
                    >
                      {b.num}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ font: "700 16px 'Space Grotesk',sans-serif", color: on ? "#fff" : "#0a1b33" }}>{b.title}</div>
                      <div style={{ font: "500 12px 'Manrope',sans-serif", color: on ? "rgba(255,255,255,.85)" : "#8296a9", marginTop: 2 }}>{b.short}</div>
                    </div>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={on ? "#fff" : "#5b6e82"}
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ flex: "none", transform: on ? "rotate(180deg)" : "rotate(0)", transition: "transform .3s ease" }}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {on && (
                    <div style={{ padding: "16px 18px 20px", animation: "fadeUp .3s ease" }}>
                      <img src={b.img} alt={b.title} style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 12, display: "block", marginBottom: 16 }} />
                      <div style={{ font: "400 14.5px/1.7 'Manrope',sans-serif", color: "#3d5064", textWrap: "pretty" } as CSSProperties}>{b.desc}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                        {b.chips.map((ch) => (
                          <div
                            key={ch}
                            style={{
                              background: "rgba(47,196,188,.12)",
                              border: "1px solid rgba(27,143,136,.35)",
                              color: "#136f6a",
                              font: "600 12px 'Manrope',sans-serif",
                              padding: "6px 12px",
                              borderRadius: 999,
                            }}
                          >
                            {ch}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div style={{ font: "500 11.5px 'Manrope',sans-serif", color: "#8296a9", padding: "2px 4px" }}>Tap any step to expand or collapse</div>
          </div>
        </div>
      </div>

      {/* CERTIFICATIONS */}
      <div data-screen-label="Certifications" className="lp-sec" style={{ position: "relative", background: "#f7fafc", padding: "96px 48px", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -120,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle,rgba(47,127,214,.1),transparent 65%)",
            filter: "blur(30px)",
          }}
        />
        <div style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
          <Reveal style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 32, flexWrap: "wrap", marginBottom: 52 }}>
            <div>
              <div style={{ font: "700 12px 'Manrope',sans-serif", color: "#1b8f88", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 }}>Certification Programs</div>
              <h2 style={{ font: "700 clamp(30px,3.2vw,44px)/1.15 'Space Grotesk',sans-serif", color: "#0a1b33", margin: 0, letterSpacing: "-.02em", maxWidth: 620 }}>
                Choose your certification pathway
              </h2>
            </div>
            <p style={{ font: "400 15.5px/1.7 'Manrope',sans-serif", color: "#5b6e82", maxWidth: 420, margin: 0 }}>
              For HR professionals, L&amp;D leaders, educators, consultants, coaches, managers and aspiring corporate trainers.
            </p>
          </Reveal>
          <div className="lp-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22 }}>
            {certs.map((c) => (
              <Reveal
                key={c.num}
                className="lp-cert-card"
                onMouseMove={tiltMove}
                onMouseLeave={tiltLeave}
                style={{
                  background: "#fff",
                  border: "1px solid #e3eaf0",
                  borderRadius: 18,
                  padding: "28px 26px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  boxShadow: "0 2px 6px rgba(10,27,51,.05)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div
                    style={{
                      font: "700 11px 'Manrope',sans-serif",
                      color: "#1b8f88",
                      letterSpacing: ".14em",
                      textTransform: "uppercase",
                      border: "1px solid rgba(27,143,136,.4)",
                      borderRadius: 999,
                      padding: "5px 12px",
                    }}
                  >
                    {c.tag}
                  </div>
                  <div style={{ font: "700 15px 'Space Grotesk',sans-serif", color: "rgba(10,27,51,.2)" }}>{c.num}</div>
                </div>
                <div style={{ font: "700 19px/1.3 'Space Grotesk',sans-serif", color: "#0a1b33" }}>{c.title}</div>
                <div style={{ font: "600 13px 'Manrope',sans-serif", color: "#2f7fd6" }}>{c.sub}</div>
                <div style={{ font: "400 13.5px/1.65 'Manrope',sans-serif", color: "#5b6e82", flex: 1, textWrap: "pretty" } as CSSProperties}>{c.desc}</div>
                <a href="#" style={{ font: "700 13.5px 'Manrope',sans-serif", color: "#1b8f88" }}>
                  Program details →
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* WHY LEVITATE + CERTIFICATE */}
      <div data-screen-label="Why Levitate" className="lp-sec" style={{ background: "#f4f7f9", padding: "96px 48px" }}>
        <div className="lp-why-grid" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <Reveal>
            <div style={{ font: "700 12px 'Manrope',sans-serif", color: "#1b8f88", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 }}>Why Get Certified With Us</div>
            <h2 style={{ font: "700 clamp(28px,3vw,40px)/1.15 'Space Grotesk',sans-serif", color: "#0a1b33", margin: "0 0 18px", letterSpacing: "-.02em" }}>
              Built for professionals who refuse to remain slide-based trainers
            </h2>
            <p style={{ font: "400 15px/1.7 'Manrope',sans-serif", color: "#5b6e82", margin: "0 0 30px" }}>
              Our programs help participants become confident, credible and responsible workplace facilitators.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {whyPoints.map((w) => (
                <div key={w.t} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "#fff", border: "1px solid #e3eaf0", borderRadius: 14, padding: "16px 20px" }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      flex: "none",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4 10-10" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ font: "700 15.5px 'Space Grotesk',sans-serif", color: "#0a1b33" }}>{w.t}</div>
                    <div style={{ font: "400 13.5px/1.6 'Manrope',sans-serif", color: "#5b6e82", marginTop: 3 }}>{w.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: -30, background: "radial-gradient(circle at 50% 40%,rgba(47,196,188,.18),transparent 70%)" }} />
            <div
              onMouseMove={tiltMove}
              onMouseLeave={tiltLeave}
              style={{
                position: "relative",
                background: "#fdfefe",
                border: "1px solid #dbe5ec",
                borderRadius: 6,
                boxShadow: "0 30px 70px rgba(10,27,51,.18)",
                padding: "38px 42px",
                transition: "transform .25s ease",
              }}
            >
              <div style={{ border: "2px solid #0a1b33", outline: "1px solid #2fc4bc", outlineOffset: 5, padding: "34px 30px", textAlign: "center" }}>
                <img src="/assets/logo.png" alt="Levitate PeopleSoft" style={{ height: 34, margin: "0 auto 18px", display: "block" }} />
                <div style={{ font: "600 10.5px 'Manrope',sans-serif", color: "#1b8f88", letterSpacing: ".3em", textTransform: "uppercase", marginBottom: 14 }}>Certificate of Completion</div>
                <div style={{ font: "400 12.5px 'Manrope',sans-serif", color: "#5b6e82" }}>This certifies that</div>
                <div style={{ font: "700 26px 'Space Grotesk',sans-serif", color: "#0a1b33", borderBottom: "1px solid #cfdbe4", padding: "8px 0", margin: "6px 24px 12px" }}>Participant Name</div>
                <div style={{ font: "400 12.5px/1.6 'Manrope',sans-serif", color: "#5b6e82", marginBottom: 18 }}>
                  has successfully completed the
                  <br />
                  <strong style={{ color: "#0a1b33" }}>Certified Corporate Leadership Facilitator Program</strong>
                  <br />
                  including participation, practice and assessment
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 26, padding: "0 8px" }}>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ font: "600 13px 'Space Grotesk',sans-serif", color: "#0a1b33", borderTop: "1px solid #cfdbe4", paddingTop: 6 }}>Parichita Kotnala</div>
                    <div style={{ font: "400 10.5px 'Manrope',sans-serif", color: "#8296a9" }}>Founder &amp; Managing Partner</div>
                  </div>
                  <div
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: "50%",
                      border: "2px solid #2fc4bc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      font: "700 9px 'Manrope',sans-serif",
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
              <div style={{ textAlign: "center", font: "600 11px 'Manrope',sans-serif", color: "#8296a9", marginTop: 14, fontFamily: "monospace" }}>
                certificate preview — issued on program completion
              </div>
            </div>
            <div className="lp-cert-features" style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginTop: 20 }}>
              <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 14, padding: "16px 14px", textAlign: "center" }}>
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1b8f88"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ display: "block", margin: "0 auto" }}
                >
                  <path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                <div style={{ font: "700 12.5px 'Space Grotesk',sans-serif", color: "#0a1b33", marginTop: 8 }}>Assessment-based</div>
                <div style={{ font: "500 11px/1.5 'Manrope',sans-serif", color: "#8296a9", marginTop: 2 }}>Practice + assessment, not attendance</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 14, padding: "16px 14px", textAlign: "center" }}>
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1b8f88"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ display: "block", margin: "0 auto" }}
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <circle cx="8.5" cy="11" r="2" />
                  <path d="M5.5 16c.6-1.4 1.7-2 3-2s2.4.6 3 2" />
                  <path d="M14 9h5M14 12h5M14 15h3" />
                </svg>
                <div style={{ font: "700 12.5px 'Space Grotesk',sans-serif", color: "#0a1b33", marginTop: 8 }}>Verifiable ID</div>
                <div style={{ font: "500 11px/1.5 'Manrope',sans-serif", color: "#8296a9", marginTop: 2 }}>Unique certificate number on issue</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 14, padding: "16px 14px", textAlign: "center" }}>
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1b8f88"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ display: "block", margin: "0 auto" }}
                >
                  <rect x="3" y="8" width="18" height="12" rx="2" />
                  <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                  <path d="M3 13h18" />
                  <path d="M11 13v2h2v-2" />
                </svg>
                <div style={{ font: "700 12.5px 'Space Grotesk',sans-serif", color: "#0a1b33", marginTop: 8 }}>Trainer toolkit</div>
                <div style={{ font: "500 11px/1.5 'Manrope',sans-serif", color: "#8296a9", marginTop: 2 }}>Ships with facilitation resources</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* IMPACT COUNTERS */}
      <div
        ref={impactRef}
        data-screen-label="Impact"
        className="lp-sec"
        style={{ background: "linear-gradient(120deg,#e7f5f3,#eaf1fa)", borderTop: "1px solid rgba(27,143,136,.2)", borderBottom: "1px solid rgba(27,143,136,.2)", padding: "64px 48px" }}
      >
        <div className="lp-impact-grid" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 32, textAlign: "center" }}>
          {impactStats.map((st, i) => (
            <div key={st.label} style={{ animation: impactIn ? "popIn .6s ease both" : undefined, animationDelay: impactIn ? `${i * 0.08}s` : undefined }}>
              <div
                style={{
                  font: "700 52px 'Space Grotesk',sans-serif",
                  background: "linear-gradient(120deg,#1b8f88,#2f7fd6)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                <Counter to={st.to} dec={st.dec} start={impactIn} />
                {st.suffix}
              </div>
              <div style={{ width: 36, height: 3, borderRadius: 2, background: "linear-gradient(90deg,#2fc4bc,#2f7fd6)", margin: "10px auto" }} />
              <div style={{ font: "600 13px 'Manrope',sans-serif", color: "#5b6e82", letterSpacing: ".08em", textTransform: "uppercase" }}>{st.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FOUNDERS */}
      <div data-screen-label="Founders" className="lp-sec" style={{ background: "#fff", padding: "96px 48px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Reveal style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ font: "700 12px 'Manrope',sans-serif", color: "#1b8f88", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 }}>Leadership</div>
            <h2 style={{ font: "700 clamp(28px,3vw,40px)/1.15 'Space Grotesk',sans-serif", color: "#0a1b33", margin: 0, letterSpacing: "-.02em" }}>
              Built on HR legacy. Strengthened by global workplace practice.
            </h2>
          </Reveal>
          <div className="lp-founders-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
            {founders.map((f) => (
              <Reveal key={f.name} style={{ background: "#f4f7f9", border: "1px solid #e3eaf0", borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <img src={f.img} alt={f.alt} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block", objectPosition: f.imgPos }} />
                <div style={{ padding: "28px 30px" }}>
                  <div style={{ font: "700 21px 'Space Grotesk',sans-serif", color: "#0a1b33" }}>{f.name}</div>
                  <div style={{ font: "600 13px 'Manrope',sans-serif", color: "#1b8f88", margin: "4px 0 14px" }}>{f.role}</div>
                  <p style={{ font: "400 14px/1.7 'Manrope',sans-serif", color: "#5b6e82", margin: 0 }}>{f.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <TestimonialsCarousel />

      {/* GALLERY MARQUEE */}
      <div data-screen-label="Gallery" style={{ background: "#fff", padding: "72px 0", overflow: "hidden" }}>
        <Reveal style={{ textAlign: "center", marginBottom: 40, padding: "0 48px" }}>
          <div style={{ font: "700 12px 'Manrope',sans-serif", color: "#1b8f88", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 12 }}>In The Room</div>
          <h2 style={{ font: "700 clamp(26px,2.8vw,36px)/1.15 'Space Grotesk',sans-serif", color: "#0a1b33", margin: 0, letterSpacing: "-.02em" }}>
            Sessions across campuses, conclaves and corporates
          </h2>
        </Reveal>
        <div style={{ display: "flex", width: "max-content", animation: "marquee 46s linear infinite", gap: 20, paddingLeft: 20 }}>
          {[...gallery, ...gallery].map((g, i) => (
            <img key={i} src={g} alt="Training session" style={{ height: 220, width: 330, objectFit: "cover", borderRadius: 14, border: "1px solid #e3eaf0" }} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div data-screen-label="CTA" className="lp-sec" style={{ position: "relative", background: "#fff", padding: "40px 48px 110px", overflow: "hidden" }}>
        <Reveal
          className="lp-cta"
          style={{
            position: "relative",
            maxWidth: 1100,
            margin: "0 auto",
            background: "linear-gradient(135deg,#0c2a45,#0a1f38)",
            border: "1px solid rgba(47,196,188,.35)",
            borderRadius: 26,
            padding: "64px 56px",
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
          <h2 style={{ position: "relative", font: "700 clamp(28px,3.2vw,42px)/1.2 'Space Grotesk',sans-serif", color: "#f2f7fb", margin: "0 0 16px", letterSpacing: "-.02em" }}>
            Ready to build workplace capability that lasts?
          </h2>
          <p style={{ position: "relative", font: "400 16px/1.7 'Manrope',sans-serif", color: "#a9bcd0", maxWidth: 620, margin: "0 auto 34px" }}>
            Partner with Levitate PeopleSoft for certification programs, customized training interventions and institutional learning solutions.
          </p>
          <div style={{ position: "relative", display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="#"
              className="lp-btn-grad"
              style={{ background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 15px 'Manrope',sans-serif", padding: "16px 30px", borderRadius: 999 }}
            >
              Request a Training Proposal
            </a>
            <a
              href="#"
              className="lp-btn-outline-light"
              style={{ border: "1.5px solid rgba(255,255,255,.25)", color: "#e8f1f8", font: "700 15px 'Manrope',sans-serif", padding: "16px 30px", borderRadius: 999 }}
            >
              Book a Discovery Call
            </a>
          </div>
        </Reveal>
      </div>

      {/* FOOTER */}
      <div className="lp-sec" style={{ background: "#eef3f7", borderTop: "1px solid #dbe5ec", padding: "64px 48px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div className="lp-footer-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr", gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ background: "#fff", border: "1px solid #dbe5ec", borderRadius: 8, padding: "6px 12px", display: "inline-flex", marginBottom: 18 }}>
                <img src="/assets/logo.png" alt="Levitate PeopleSoft" style={{ height: 30, display: "block" }} />
              </div>
              <p style={{ font: "400 13.5px/1.7 'Manrope',sans-serif", color: "#5b6e82", maxWidth: 320, margin: 0 }}>
                Elevating trainers, transforming workplaces and enabling human-centred change through practice-led certification and training.
              </p>
            </div>
            <div>
              <div style={{ font: "700 13px 'Space Grotesk',sans-serif", color: "#0a1b33", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>Services</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, font: "500 13.5px 'Manrope',sans-serif" }}>
                {["Train-the-Trainer Certifications", "Corporate Training Solutions", "Institutional Training", "HR Advisory & Culture Consulting"].map((x) => (
                  <a key={x} href="#" className="lp-footlink">
                    {x}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div style={{ font: "700 13px 'Space Grotesk',sans-serif", color: "#0a1b33", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>Company</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, font: "500 13.5px 'Manrope',sans-serif" }}>
                {["About Us", "Certification Programs", "Testimonials", "Contact"].map((x) => (
                  <a key={x} href="#" className="lp-footlink">
                    {x}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div style={{ font: "700 13px 'Space Grotesk',sans-serif", color: "#0a1b33", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 16 }}>Contact</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, font: "500 13.5px 'Manrope',sans-serif", color: "#5b6e82" }}>
                <a href={`mailto:${contact.email}`} className="lp-footlink" style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
                  <MailIcon size={14} />
                  {contact.email}
                </a>
                <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="lp-footlink" style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
                  <PhoneIcon size={14} />
                  {contact.phone}
                </a>
                <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="lp-footlink" style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
                  <WhatsAppIcon size={14} />
                  WhatsApp: {contact.phone}
                </a>
              </div>
              <div
                style={{ display: "inline-flex", alignItems: "center", gap: 12, marginTop: 18, background: "#fff", border: "1px solid rgba(27,143,136,.4)", borderRadius: 12, padding: "12px 16px" }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    flex: "none",
                    borderRadius: "50%",
                    border: "2px solid #2fc4bc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    font: "700 10px 'Space Grotesk',sans-serif",
                    color: "#1b8f88",
                    textAlign: "center",
                    lineHeight: 1.1,
                  }}
                >
                  ISO
                </div>
                <div>
                  <div style={{ font: "700 13px 'Space Grotesk',sans-serif", color: "#0a1b33" }}>ISO Certified</div>
                  <div style={{ font: "500 11.5px 'Manrope',sans-serif", color: "#5b6e82" }}>Quality-assured training organization</div>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              borderTop: "1px solid #dbe5ec",
              paddingTop: 24,
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              font: "500 12.5px 'Manrope',sans-serif",
              color: "#8296a9",
            }}
          >
            <span>© 2026 Levitate PeopleSoft. All rights reserved.</span>
            <span>Founded 2023 · Built on HR legacy, strengthened by global practice</span>
          </div>
        </div>
      </div>
    </>
  );
}
