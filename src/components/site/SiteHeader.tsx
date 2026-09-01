"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { contact, services, type NavKey } from "@/lib/site";
import { VISIBLE_COURSES as COURSES } from "@/lib/lms/courses";

function MailIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#1b8f88" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
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

const topActive = { color: "#1b8f88" };
const topIdle = { color: "#3d5064" };

/** Pulsing red flag on the Certifications link while cohorts are enrolling. */
function NewBadge() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#e23d3d", color: "#fff", font: "800 9.5px 'Plus Jakarta Sans',sans-serif", letterSpacing: ".1em", textTransform: "uppercase", padding: "4px 8px", borderRadius: 999, animation: "redPulse 1.8s infinite" }}>
      New
    </span>
  );
}

export default function SiteHeader({ active }: { active?: NavKey }) {
  const [svcOpen, setSvcOpen] = useState(false);
  const [certOpen, setCertOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Header starts large and compacts once the page is scrolled.
  const [shrunk, setShrunk] = useState(false);

  useEffect(() => {
    const onScroll = () => setShrunk(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* TOP CONTACT BAR */}
      <div className="site-sec site-topbar" style={{ background: "#fff", borderBottom: "1px solid #e3eaf0", padding: "8px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", rowGap: 6, columnGap: 16, font: "500 12.5px/1.5 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>
        <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
          <a href={`mailto:${contact.email}`} className="site-footlink" style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><MailIcon />{contact.email}</a>
          <a href={`tel:${contact.tel}`} className="site-footlink" style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><PhoneIcon />{contact.phone}</a>
        </div>
      </div>

      {/* STICKY HEADER */}
      <div
        className={`site-sec site-header${shrunk ? " is-shrunk" : ""}`}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 80,
          background: "rgba(255,255,255,.9)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid #e3eaf0",
          padding: shrunk ? "10px 48px" : "18px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 14,
          transition: "padding .28s ease, box-shadow .28s ease",
          boxShadow: shrunk ? "0 6px 20px rgba(10,27,51,.07)" : "none",
        }}
      >
        <Link href="/" className="site-logo" style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 10, padding: shrunk ? "5px 12px" : "8px 16px", display: "flex", alignItems: "center", transition: "padding .28s ease" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.png" alt="Levitate PeopleSoft" style={{ height: shrunk ? 36 : 52, display: "block", transition: "height .28s ease" }} />
        </Link>

        {/* Desktop nav */}
        <nav className="site-nav" style={{ alignItems: "center", gap: shrunk ? 24 : 28, font: `600 ${shrunk ? 14 : 15.5}px 'Plus Jakarta Sans',sans-serif`, transition: "gap .28s ease, font-size .28s ease" }}>
          <Link href="/" className="site-navlink" style={active === "home" ? topActive : topIdle}>Home</Link>
          <div onMouseEnter={() => setSvcOpen(true)} onMouseLeave={() => setSvcOpen(false)} style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Link href={services[0].href} className="site-navlink" style={{ ...(active === "services" ? topActive : topIdle), display: "inline-flex", alignItems: "center", gap: 6 }}>
              Services
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
            </Link>
            <div style={{ position: "absolute", top: "100%", left: -16, paddingTop: 16, minWidth: 320, display: svcOpen ? "block" : "none" }}>
              <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 14, padding: 8, boxShadow: "0 22px 48px rgba(10,27,51,.16)", display: "flex", flexDirection: "column", gap: 2 }}>
                {services.map((s) => (
                  <Link key={s.key} href={s.href} className="site-dropitem" style={{ padding: "11px 14px", borderRadius: 10, font: "600 13.5px/1.35 'Plus Jakarta Sans',sans-serif", display: "block", color: active === "services" ? "#1b8f88" : "#0a1b33" }}>{s.label}</Link>
                ))}
              </div>
            </div>
          </div>
          {/* Certifications does not navigate anywhere itself — the programs
              are the destinations, so this only opens the list. It is a button
              rather than a link so a keyboard or a tablet tap can open it too;
              hover alone would strand both. */}
          <div onMouseEnter={() => setCertOpen(true)} onMouseLeave={() => setCertOpen(false)} style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <button
              type="button"
              className="site-navlink"
              aria-expanded={certOpen}
              aria-haspopup="true"
              onClick={() => setCertOpen((o) => !o)}
              style={{ ...(active === "certifications" ? topActive : topIdle), display: "inline-flex", alignItems: "center", gap: 8, border: "none", background: "transparent", padding: 0, cursor: "pointer", font: "inherit" }}
            >
              TTT Certification<NewBadge />
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            <div style={{ position: "absolute", top: "100%", left: -16, paddingTop: 16, minWidth: 390, display: certOpen ? "block" : "none" }}>
              <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 14, padding: 8, boxShadow: "0 22px 48px rgba(10,27,51,.16)", display: "flex", flexDirection: "column", gap: 2 }}>
                {COURSES.map((c) => (
                  <Link key={c.slug} href={`/lms/course/${c.slug}`} onClick={() => setCertOpen(false)} className="site-dropitem" style={{ padding: "11px 14px", borderRadius: 10, font: "600 13.5px/1.4 'Plus Jakarta Sans',sans-serif", display: "block", color: "#0a1b33" }}>{c.title}</Link>
                ))}
              </div>
            </div>
          </div>
          {/* The LMS is not open to the public yet, so it is not advertised in
              the nav. The routes still resolve for anyone working on it. */}
          <Link href="/about-us" className="site-navlink" style={active === "about" ? topActive : topIdle}>About Us</Link>
          <Link href="/parichita-kotnala" className="site-navlink" style={{ ...(active === "parichita" ? topActive : topIdle), whiteSpace: "nowrap" }}>Parichita Kotnala</Link>
          <Link href="/contact" className="site-navlink" style={active === "contact" ? topActive : topIdle}>Contact</Link>
        </nav>

        <Link
          href="/contact"
          className="site-header-cta lp-btn-grad"
          style={{
            background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)",
            color: "#fff",
            font: `700 ${shrunk ? 13.5 : 15}px 'Plus Jakarta Sans',sans-serif`,
            padding: shrunk ? "11px 22px" : "14px 28px",
            borderRadius: 999,
            whiteSpace: "nowrap",
            transition: "padding .28s ease, font-size .28s ease",
          }}
        >
          Book a Consultation
        </Link>

        {/* Hamburger */}
        <button
          type="button"
          className="site-hamburger"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            width: shrunk ? 44 : 52,
            height: shrunk ? 44 : 52,
            borderRadius: 12,
            border: "1px solid #e3eaf0",
            background: "#fff",
            color: "#0a1b33",
            cursor: "pointer",
            alignItems: "center",
            justifyContent: "center",
            transition: "width .28s ease, height .28s ease",
          }}
        >
          <svg width={shrunk ? 22 : 26} height={shrunk ? 22 : 26} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>}
          </svg>
        </button>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="site-mobile-menu" style={{ font: "600 15px 'Plus Jakarta Sans',sans-serif" }}>
            <Link href="/" onClick={() => setMenuOpen(false)} className="site-mlink" style={{ color: active === "home" ? "#1b8f88" : "#0a1b33" }}>Home</Link>
            <div style={{ padding: "12px 6px 4px", font: "700 11px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", letterSpacing: ".14em", textTransform: "uppercase" }}>Services</div>
            {services.map((s) => (
              <Link key={s.key} href={s.href} onClick={() => setMenuOpen(false)} className="site-mlink site-msub" style={{ color: "#3d5064" }}>{s.short}</Link>
            ))}
            <div style={{ padding: "12px 6px 4px", font: "700 11px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", letterSpacing: ".14em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 }}>
              TTT Certification<NewBadge />
            </div>
            {COURSES.map((c) => (
              <Link key={c.slug} href={`/lms/course/${c.slug}`} onClick={() => setMenuOpen(false)} className="site-mlink site-msub" style={{ color: "#3d5064", lineHeight: 1.4 }}>{c.title}</Link>
            ))}
            <Link href="/about-us" onClick={() => setMenuOpen(false)} className="site-mlink" style={{ color: active === "about" ? "#1b8f88" : "#0a1b33" }}>About Us</Link>
            <Link href="/parichita-kotnala" onClick={() => setMenuOpen(false)} className="site-mlink" style={{ color: active === "parichita" ? "#1b8f88" : "#0a1b33" }}>Parichita Kotnala</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="site-mlink" style={{ color: active === "contact" ? "#1b8f88" : "#0a1b33" }}>Contact</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="lp-btn-grad" style={{ marginTop: 12, textAlign: "center", background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", padding: "13px 22px", borderRadius: 999 }}>Book a Consultation</Link>
          </div>
        )}
      </div>
    </>
  );
}
