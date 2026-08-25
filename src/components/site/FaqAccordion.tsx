"use client";

import { useState } from "react";
import type { Faq } from "@/lib/lms/poshFaqs";

/**
 * Programme FAQs.
 *
 * Native <details>/<summary> rather than state-driven divs: it opens without
 * JavaScript, the browser gives keyboard and screen-reader behaviour for free,
 * and in-page find still reaches text inside a closed answer. The open index is
 * tracked only to rotate the chevron.
 */
export default function FaqAccordion({ items, heading = "Frequently asked questions" }: { items: Faq[]; heading?: string }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "32px 34px" }}>
      <div style={{ font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 18 }}>{heading}</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((f, i) => (
          <details
            key={f.q}
            onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open ? i : (p) => (p === i ? null : p))}
            style={{ borderBottom: i < items.length - 1 ? "1px solid #eef3f7" : "none" }}
          >
            <summary
              style={{ cursor: "pointer", listStyle: "none", display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 0", font: "700 14.5px/1.55 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}
            >
              <span aria-hidden style={{ flex: "none", font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#2f7fd6", fontVariantNumeric: "tabular-nums", marginTop: 3, minWidth: 20 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ flex: 1 }}>{f.q}</span>
              <span aria-hidden style={{ flex: "none", width: 26, height: 26, borderRadius: "50%", background: open === i ? "linear-gradient(135deg,#2fc4bc,#2f7fd6)" : "#f4f7f9", color: open === i ? "#fff" : "#5b6e82", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" style={{ transform: open === i ? "rotate(180deg)" : "none", transition: "transform .25s ease" }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </summary>
            <div style={{ padding: "0 40px 18px 34px", display: "flex", flexDirection: "column", gap: 10 }}>
              {f.a.map((para) => (
                <p key={para} style={{ font: "400 13.5px/1.8 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: 0 }}>{para}</p>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
