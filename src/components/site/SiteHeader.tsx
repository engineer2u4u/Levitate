"use client";

import Link from "next/link";
import { useState } from "react";
import { contact, services, type NavKey } from "@/lib/site";

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

export default function SiteHeader({ active }: { active?: NavKey }) {
  const [svcOpen, setSvcOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* TOP CONTACT BAR */}
      <div className="site-sec site-topbar" style={{ background: "#fff", borderBottom: "1px solid #e3eaf0", padding: "8px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", rowGap: 6, columnGap: 16, font: "500 12.5px/1.5 'Manrope',sans-serif", color: "#5b6e82" }}>
        <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
          <a href={`mailto:${contact.email}`} className="site-footlink" style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><MailIcon />{contact.email}</a>
          <a href={`tel:${contact.tel}`} className="site-footlink" style={{ display: "inline-flex", alignItems: "center", gap: 7 }}><PhoneIcon />{contact.phone}</a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#3d5064" }}>
          <span style={{ color: "#f5b942", letterSpacing: "1px" }}>★★★★★</span> {contact.rating} on Google Reviews
        </div>
      </div>

      {/* STICKY HEADER */}
      <div className="site-sec" style={{ position: "sticky", top: 0, zIndex: 80, background: "rgba(255,255,255,.9)", backdropFilter: "blur(14px)", borderBottom: "1px solid #e3eaf0", padding: "14px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
        <Link href="/" style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 8, padding: "6px 12px", display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.png" alt="Levitate PeopleSoft" style={{ height: 34, display: "block" }} />
        </Link>

        {/* Desktop nav */}
        <nav className="site-nav" style={{ alignItems: "center", gap: 32, font: "600 14px 'Manrope',sans-serif" }}>
          <Link href="/" className="site-navlink" style={active === "home" ? topActive : topIdle}>Home</Link>
          <div onMouseEnter={() => setSvcOpen(true)} onMouseLeave={() => setSvcOpen(false)} style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <Link href={services[0].href} className="site-navlink" style={{ ...(active === "services" ? topActive : topIdle), display: "inline-flex", alignItems: "center", gap: 6 }}>
              Services
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
            </Link>
            <div style={{ position: "absolute", top: "100%", left: -16, paddingTop: 16, minWidth: 320, display: svcOpen ? "block" : "none" }}>
              <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 14, padding: 8, boxShadow: "0 22px 48px rgba(10,27,51,.16)", display: "flex", flexDirection: "column", gap: 2 }}>
                {services.map((s) => (
                  <Link key={s.key} href={s.href} className="site-dropitem" style={{ padding: "11px 14px", borderRadius: 10, font: "600 13.5px/1.35 'Manrope',sans-serif", display: "block", color: active === "services" ? "#1b8f88" : "#0a1b33" }}>{s.label}</Link>
                ))}
              </div>
            </div>
          </div>
          <Link href="/certifications" className="site-navlink" style={active === "certifications" ? topActive : topIdle}>Certifications</Link>
          <Link href="/about" className="site-navlink" style={active === "about" ? topActive : topIdle}>About Us</Link>
          <Link href="/contact" className="site-navlink" style={active === "contact" ? topActive : topIdle}>Contact</Link>
        </nav>

        <Link href="/contact" className="site-header-cta lp-btn-grad" style={{ background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 13.5px 'Manrope',sans-serif", padding: "11px 22px", borderRadius: 999, whiteSpace: "nowrap" }}>
          Book a Discovery Call
        </Link>

        {/* Hamburger */}
        <button type="button" className="site-hamburger" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)} style={{ width: 44, height: 44, borderRadius: 10, border: "1px solid #e3eaf0", background: "#fff", color: "#0a1b33", cursor: "pointer", alignItems: "center", justifyContent: "center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>}
          </svg>
        </button>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="site-mobile-menu" style={{ font: "600 15px 'Manrope',sans-serif" }}>
            <Link href="/" onClick={() => setMenuOpen(false)} className="site-mlink" style={{ color: active === "home" ? "#1b8f88" : "#0a1b33" }}>Home</Link>
            <div style={{ padding: "12px 6px 4px", font: "700 11px 'Manrope',sans-serif", color: "#8296a9", letterSpacing: ".14em", textTransform: "uppercase" }}>Services</div>
            {services.map((s) => (
              <Link key={s.key} href={s.href} onClick={() => setMenuOpen(false)} className="site-mlink site-msub" style={{ color: "#3d5064" }}>{s.short}</Link>
            ))}
            <Link href="/certifications" onClick={() => setMenuOpen(false)} className="site-mlink" style={{ color: active === "certifications" ? "#1b8f88" : "#0a1b33" }}>Certifications</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)} className="site-mlink" style={{ color: active === "about" ? "#1b8f88" : "#0a1b33" }}>About Us</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="site-mlink" style={{ color: active === "contact" ? "#1b8f88" : "#0a1b33" }}>Contact</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="lp-btn-grad" style={{ marginTop: 12, textAlign: "center", background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 14px 'Manrope',sans-serif", padding: "13px 22px", borderRadius: 999 }}>Book a Discovery Call</Link>
          </div>
        )}
      </div>
    </>
  );
}
