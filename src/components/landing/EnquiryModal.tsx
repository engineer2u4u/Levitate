"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { submitEnquiry } from "@/lib/submitEnquiry";
import { contact } from "@/lib/site";

const SANS = "'Plus Jakarta Sans',sans-serif";

/**
 * The enquiry form a landing page opens over itself.
 *
 * Everything else on the site sends a visitor to /contact to ask a question.
 * A paid-ad landing page cannot afford that: the page is one programme and one
 * action, and a navigation away from it is a visitor who may not come back. So
 * the form opens here, over the page they are reading, and the only navigation
 * is the one that follows a completed answer.
 *
 * Four fields and no more. Each one is something the office needs in order to
 * reply; anything else is a question that can be asked in that reply instead
 * of standing between someone and asking.
 */
export default function EnquiryModal({
  open,
  onClose,
  topics,
  defaultTopic,
  programme,
}: {
  open: boolean;
  onClose: () => void;
  /** What the dropdown offers. */
  topics: readonly string[];
  /** Pre-selected, because the page already says what they came for. */
  defaultTopic: string;
  /** Named on the enquiry, so the office knows which page it came from. */
  programme: string;
}) {
  const router = useRouter();
  const panel = useRef<HTMLDivElement>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Escape closes it, as it does on every other overlay here.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // The page behind must not scroll under the form.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError("");

    const res = await submitEnquiry(
      e.currentTarget,
      { source: typeof window !== "undefined" ? window.location.pathname : "" },
      { form: "popup" },
    );

    if (!res.ok) {
      // Both the mail and the row failed, so nobody has their details. Saying
      // "thank you" here would be telling someone they will be contacted when
      // there is nothing to contact them from.
      setSending(false);
      setError("We could not send that just now. Please try again, or message us on WhatsApp and we will pick it up there.");
      return;
    }

    router.push("/thank-you/");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Enquire about ${programme}`}
      onMouseDown={(e) => {
        if (!panel.current?.contains(e.target as Node)) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(8,20,35,.62)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        zIndex: 1000,
        overflowY: "auto",
      }}
    >
      <div ref={panel} style={{ background: "#fff", borderRadius: 20, padding: "30px 32px 26px", width: "100%", maxWidth: 480, boxShadow: "0 30px 80px rgba(0,0,0,.35)", position: "relative" }}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{ position: "absolute", top: 14, right: 14, width: 30, height: 30, borderRadius: "50%", border: "1px solid #e3eaf0", background: "#f7fafc", color: "#5b6e82", font: `700 15px ${SANS}`, cursor: "pointer", lineHeight: 1 }}
        >
          ×
        </button>

        <div style={{ font: `700 11px ${SANS}`, color: "#1b8f88", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 8 }}>
          Levitate PeopleSoft
        </div>
        <h2 style={{ font: `800 23px/1.25 ${SANS}`, color: "#0a1b33", margin: "0 0 7px", letterSpacing: "-.02em" }}>
          Tell us where to reach you
        </h2>
        <p style={{ font: `400 13.5px/1.7 ${SANS}`, color: "#5b6e82", margin: "0 0 20px" }}>
          Share a few details and we will come back with the outline, the dates and the fee.
        </p>

        <form onSubmit={onSubmit}>
          {/* Honeypot — a checkbox, because autofill fills hidden text inputs. */}
          <label style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
            Leave this box unchecked
            <input type="checkbox" name="hp_zx" tabIndex={-1} autoComplete="off" />
          </label>

          <Field label="Full name" required>
            <input name="name" required autoComplete="name" maxLength={200} placeholder="Your full name" style={input} />
          </Field>
          <Field label="Email" required>
            <input name="email" type="email" required autoComplete="email" maxLength={320} placeholder="you@company.com" style={input} />
          </Field>
          <Field label="Phone / WhatsApp" required>
            <input name="phone" type="tel" required autoComplete="tel" maxLength={40} placeholder="+91 98110 24567" style={input} />
          </Field>
          <Field label="I&rsquo;m enquiring about" required>
            <select name="intent" required defaultValue={defaultTopic} style={{ ...input, cursor: "pointer" }}>
              {topics.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>

          {error && (
            <div role="alert" style={{ font: `600 12.5px/1.6 ${SANS}`, color: "#a53f28", background: "rgba(226,86,74,.08)", border: "1px solid rgba(226,86,74,.28)", borderRadius: 10, padding: "10px 12px", marginTop: 14 }}>
              {error}{" "}
              <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" style={{ color: "#a53f28", fontWeight: 800 }}>
                Message us →
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={sending}
            className="lp-btn-grad"
            style={{
              width: "100%",
              marginTop: 18,
              cursor: sending ? "wait" : "pointer",
              border: "none",
              background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)",
              color: "#fff",
              font: `700 15px ${SANS}`,
              padding: "14px 20px",
              borderRadius: 999,
              opacity: sending ? 0.75 : 1,
            }}
          >
            {sending ? "Sending…" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

const input: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "#f7fafc",
  border: "1px solid #e3eaf0",
  borderRadius: 11,
  padding: "12px 14px",
  font: `500 14px ${SANS}`,
  color: "#0a1b33",
  outline: "none",
};

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <span style={{ display: "block", font: `700 10.5px ${SANS}`, color: "#5b6e82", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>
        {label} {required && <span style={{ color: "#e2564a" }}>*</span>}
      </span>
      {children}
    </label>
  );
}
