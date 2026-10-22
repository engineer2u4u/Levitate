/* eslint-disable @next/next/no-img-element */
"use client";

import { contact } from "@/lib/site";

const SANS = "'Plus Jakarta Sans',sans-serif";

/**
 * The page after an enquiry.
 *
 * The landing page before it is a closed funnel; this page is where that ends.
 * Someone here has already done the thing the funnel existed for, so there is
 * nothing left to protect them from — a faster way to reach a person if they
 * are in a hurry, and the rest of the programmes for anyone curious enough to
 * look now that they have asked.
 */
export default function ThankYou() {
  return (
    <div style={{ background: "linear-gradient(120deg,#0c2a45,#0a1f38)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ maxWidth: 560, width: "100%", background: "#fff", borderRadius: 24, padding: "clamp(32px,5vw,48px)", textAlign: "center", boxShadow: "0 30px 80px rgba(0,0,0,.3)" }}>
        <img src="/assets/logo.png" alt="Levitate PeopleSoft" style={{ height: 46, display: "block", margin: "0 auto 26px" }} />

        <div style={{ width: 62, height: 62, borderRadius: "50%", background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px", boxShadow: "0 14px 30px rgba(27,143,136,.3)" }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 13l4 4 10-10" />
          </svg>
        </div>

        <h1 style={{ font: `800 clamp(26px,3.4vw,34px)/1.2 ${SANS}`, color: "#0a1b33", margin: "0 0 12px", letterSpacing: "-.02em" }}>
          Thank you — that has reached us
        </h1>
        <p style={{ font: `400 15px/1.8 ${SANS}`, color: "#5b6e82", margin: "0 0 26px" }}>
          A member of the Levitate PeopleSoft team will be in touch with the programme outline, the upcoming dates and
          the fee. We usually reply the same working day, {contact.hours}.
        </p>

        <div style={{ background: "#f7fafc", border: "1px solid #eef2f6", borderRadius: 16, padding: "20px 22px", marginBottom: 26 }}>
          <div style={{ font: `700 11px ${SANS}`, color: "#8296a9", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 10 }}>
            In a hurry?
          </div>
          <div style={{ font: `500 14px/1.9 ${SANS}`, color: "#3d5064" }}>
            {contact.email}
            <br />
            {contact.phone}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href={contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="lp-btn-grad"
            style={{ display: "inline-block", background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: `700 14.5px ${SANS}`, padding: "14px 30px", borderRadius: 999, textDecoration: "none" }}
          >
            Message us on WhatsApp
          </a>
          {/* The way back into the site, which exists only here: the page
              before this one has no link off it at all. */}
          <a
            href="/certifications/"
            className="lp-btn-outline"
            style={{ display: "inline-block", background: "#fff", border: "1.5px solid #1b8f88", color: "#1b8f88", font: `700 14.5px ${SANS}`, padding: "13px 28px", borderRadius: 999, textDecoration: "none" }}
          >
            Explore courses
          </a>
        </div>
      </div>
    </div>
  );
}
