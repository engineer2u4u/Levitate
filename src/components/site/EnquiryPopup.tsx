"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { submitEnquiry } from "@/lib/submitEnquiry";
import { enquiryTopics } from "@/lib/site";

/**
 * Landing enquiry pop-up.
 *
 * Shown once per browser session: an immediate modal on *every* page view
 * would punish returning visitors and anyone browsing several pages, so the
 * flag lives in sessionStorage — it reappears on a fresh visit, not a fresh
 * page. Delay is short but non-zero so it does not fight the first paint.
 */
const SEEN_KEY = "lvt.enquiry.seen";
const DELAY_MS = 1200;

const label: CSSProperties = {
  font: "700 10.5px 'Plus Jakarta Sans',sans-serif",
  color: "#5b6e82",
  letterSpacing: ".1em",
  textTransform: "uppercase",
  marginBottom: 6,
};
const field: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "#f7fafc",
  border: "1px solid #e3eaf0",
  borderRadius: 11,
  padding: "11px 13px",
  font: "500 13.5px 'Plus Jakarta Sans',sans-serif",
  color: "#0a1b33",
  outline: "none",
};

export default function EnquiryPopup() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    let seen = true;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // Private mode: treat as seen rather than nagging on every navigation.
    }
    if (seen) return;
    const t = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setOpen(false);
    try {
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* nothing to do — it will simply show again next navigation */
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy || !formRef.current) return;
    setBusy(true);
    setError("");
    // No `intent` override here — the dropdown's own value has to reach the
    // mail, otherwise every pop-up enquiry arrives without the program on it.
    // Provenance goes in `source` instead.
    const res = await submitEnquiry(formRef.current, { source: `Landing pop-up (${window.location.pathname})` });
    setBusy(false);
    if (res.ok) {
      setSent(true);
      try {
        window.sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* ignore */
      }
    } else {
      setError(res.error);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Enquire about Levitate PeopleSoft training"
      style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(6,18,32,.62)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
    >
      <button type="button" aria-label="Close" onClick={close} style={{ position: "absolute", inset: 0, cursor: "pointer", border: "none", background: "transparent", padding: 0 }} />

      <div style={{ position: "relative", width: "100%", maxWidth: 650, background: "#fff", borderRadius: 22, padding: "30px 30px 26px", boxShadow: "0 30px 70px rgba(4,16,30,.42)", maxHeight: "92vh", overflowY: "auto" }}>
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          style={{ position: "absolute", top: 14, right: 16, cursor: "pointer", width: 30, height: 30, borderRadius: "50%", border: "none", background: "#f4f7f9", color: "#5b6e82", font: "600 17px 'Plus Jakarta Sans',sans-serif" }}
        >
          ×
        </button>

        {sent ? (
          <div style={{ textAlign: "center", padding: "16px 4px 8px" }}>
            <div style={{ width: 58, height: 58, margin: "0 auto 18px", borderRadius: "50%", background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 13l4 4 10-10" /></svg>
            </div>
            <div style={{ font: "700 20px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", marginBottom: 8 }}>Thank you — we have your enquiry</div>
            <p style={{ font: "400 14px/1.7 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: "0 0 22px" }}>
              Someone from the Levitate team will be in touch shortly.
            </p>
            <button type="button" onClick={close} className="lp-btn-grad" style={{ cursor: "pointer", border: "none", background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 13.5px 'Plus Jakarta Sans',sans-serif", padding: "13px 26px", borderRadius: 999 }}>
              Continue to the site
            </button>
          </div>
        ) : (
          <>
            <div style={{ font: "700 10.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 9 }}>Levitate PeopleSoft</div>
            <div style={{ font: "700 21px/1.3 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", letterSpacing: "-.01em", marginBottom: 6 }}>
              Tell us what you are looking for
            </div>
            <p style={{ font: "500 12.5px/1.6 'Plus Jakarta Sans',sans-serif", color: "#8296a9", margin: "0 0 20px" }}>
              Share a few details and we will send the right programme outline, dates and pricing.
            </p>

            <form ref={formRef} onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Honeypot — a checkbox, because autofill fills hidden text inputs */}
              <label style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
                Leave this box unchecked
                <input type="checkbox" name="hp_zx" tabIndex={-1} autoComplete="off" />
              </label>

              <div className="site-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={label}>Name</div>
                  <input name="name" required autoComplete="name" placeholder="Your name" style={field} />
                </div>
                <div>
                  <div style={label}>Organisation</div>
                  <input name="organization" required autoComplete="organization" placeholder="Where you work" style={field} />
                </div>
              </div>
              <div>
                <div style={label}>Email</div>
                <input name="email" type="email" required autoComplete="email" placeholder="you@company.com" style={field} />
              </div>
              <div>
                <div style={label}>What are you interested in?</div>
                {/* Starts unselected on purpose: a pre-picked first option would
                    file every untouched form against the leadership program. */}
                <select name="intent" required defaultValue="" style={{ ...field, cursor: "pointer" }}>
                  <option value="" disabled>Choose a program</option>
                  {enquiryTopics.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <div style={label}>Drop your query</div>
                <textarea name="message" rows={3} placeholder="Tell us what you would like to know" style={{ ...field, resize: "vertical", minHeight: 84, font: "500 13.5px/1.6 'Plus Jakarta Sans',sans-serif" }} />
              </div>

              {error && (
                <div role="alert" style={{ font: "600 12px/1.5 'Plus Jakarta Sans',sans-serif", color: "#a53f28", background: "rgba(226,86,74,.08)", border: "1px solid rgba(226,86,74,.28)", borderRadius: 10, padding: "10px 12px" }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="lp-btn-grad"
                style={{ cursor: busy ? "wait" : "pointer", border: "none", marginTop: 4, background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", padding: "13px 20px", borderRadius: 999, opacity: busy ? 0.75 : 1 }}
              >
                {busy ? "Sending…" : "Submit"}
              </button>

              <button
                type="button"
                onClick={close}
                style={{ cursor: "pointer", border: "none", background: "transparent", font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", padding: "4px 0 0" }}
              >
                I&apos;ll browse first
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
