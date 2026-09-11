"use client";

import { useRef, useState } from "react";
import { submitEnquiry } from "@/lib/submitEnquiry";
import { track } from "@/lib/track";

const SANS = "'Plus Jakarta Sans',sans-serif";

/**
 * The gated lead magnet.
 *
 * The competitor review in the strategy deck marks Levitate's brochure as an
 * ungated PDF while everyone else trades theirs for contact details — this is
 * the fix. Details go through the same EmailJS path as every other form on the
 * site, so leads land in the same inbox and there is one integration to keep
 * working, not two.
 *
 * The download is not a reward withheld until an email arrives: it is released
 * as soon as the form is submitted, and it is released even if the send fails.
 * Somebody who has typed their details and been shown an error has still given
 * you what you asked for, and holding the file hostage to a transient EmailJS
 * outage buys nothing.
 */
export default function LeadGate({
  kit,
  slug,
}: {
  kit: { title: string; blurb: string; href: string; meta: string };
  slug: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [note, setNote] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setNote("");

    const res = await submitEnquiry(e.currentTarget, {
      intent: `Kit download — ${kit.title}`,
      source: typeof window !== "undefined" ? window.location.pathname : "",
    }, { form: "kit" });

    track("kit_download", { course: slug, kit: kit.title });
    setState("done");
    if (!res.ok) {
      // The file still opens; this only explains why no one may follow up.
      setNote("Your download is ready. We could not log your details just now — if you would like a reply, do message us.");
    }
    window.open(kit.href, "_blank", "noopener");
  };

  return (
    <section className="site-page-sec" style={{ padding: "72px 48px" }}>
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          background: "linear-gradient(120deg,#0c2a45,#0a1f38)",
          borderRadius: 22,
          padding: "38px 40px",
          display: "grid",
          gridTemplateColumns: "1.1fr .9fr",
          gap: 34,
          alignItems: "center",
        }}
        className="lp-hero-grid"
      >
        <div>
          <div style={{ font: `700 11px ${SANS}`, color: "#5fe0d6", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 12 }}>
            Free download
          </div>
          <h2 style={{ font: `700 clamp(21px,2.2vw,28px)/1.25 ${SANS}`, color: "#fff", margin: "0 0 12px", letterSpacing: "-.01em" }}>
            {kit.title}
          </h2>
          <p style={{ font: `400 14.5px/1.75 ${SANS}`, color: "rgba(255,255,255,.78)", margin: "0 0 10px" }}>{kit.blurb}</p>
          <div style={{ font: `500 12px ${SANS}`, color: "rgba(255,255,255,.5)" }}>{kit.meta}</div>
        </div>

        {state === "done" ? (
          <div style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.18)", borderRadius: 16, padding: "26px 24px" }}>
            <div style={{ font: `700 15px ${SANS}`, color: "#fff", marginBottom: 8 }}>Your download has opened.</div>
            <p style={{ font: `400 13.5px/1.7 ${SANS}`, color: "rgba(255,255,255,.72)", margin: "0 0 14px" }}>
              {note || "If the tab did not open, use the link below."}
            </p>
            <a
              href={kit.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ font: `700 13px ${SANS}`, color: "#5fe0d6" }}
            >
              Open the PDF again →
            </a>
          </div>
        ) : (
          <form ref={formRef} onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Honeypot — a checkbox, because autofill fills hidden text inputs. */}
            <label style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
              Leave this box unchecked
              <input type="checkbox" name="hp_zx" tabIndex={-1} autoComplete="off" />
            </label>

            <input name="name" required autoComplete="name" placeholder="Your name *" style={field} />
            <input name="email" type="email" required autoComplete="email" placeholder="Work email *" style={field} />
            <input name="phone" type="tel" required autoComplete="tel" placeholder="Phone / WhatsApp *" style={field} />
            <input name="organization" autoComplete="organization" placeholder="Where you work" style={field} />
            <button
              type="submit"
              disabled={state === "sending"}
              className="lp-btn-grad"
              style={{
                cursor: state === "sending" ? "wait" : "pointer",
                border: "none",
                background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)",
                color: "#fff",
                font: `700 14px ${SANS}`,
                padding: "14px 22px",
                borderRadius: 999,
                marginTop: 4,
              }}
            >
              {state === "sending" ? "Sending…" : "Send me the kit →"}
            </button>
            <div style={{ font: `500 11px/1.6 ${SANS}`, color: "rgba(255,255,255,.45)" }}>
              We will use these to send the kit and to follow up about this programme. Nothing else.
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

const field: React.CSSProperties = {
  background: "rgba(255,255,255,.09)",
  border: "1px solid rgba(255,255,255,.2)",
  borderRadius: 11,
  padding: "13px 15px",
  font: `500 13.5px ${SANS}`,
  color: "#fff",
  outline: "none",
};
