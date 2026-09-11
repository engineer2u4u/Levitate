"use client";

import { useEffect, useState } from "react";
import CertificatePlate from "./CertificatePlate";
import type { CertificateCard } from "@/lib/certificateArt";

/**
 * The certificates a programme awards, enlarging on click.
 *
 * Both are drawn as SVG rather than shipped as flat images, so each programme's
 * own name is printed on them — and the enlarged view is the same drawing
 * scaled up, which stays sharp at any size instead of blurring the way a
 * bitmap would.
 */
export default function CertificateGallery({
  cards,
  columns = 2,
  equal = false,
}: {
  cards: CertificateCard[];
  columns?: 1 | 2;
  /**
   * Frame every certificate at the same size. The SHRM artwork is 3:2 and
   * the Levitate one 16:9, so at equal widths the SHRM one stood taller and
   * the pair looked mismatched. Each now sits centred in an identical 3:2
   * frame — the taller shape, so neither is cropped.
   *
   * The frame is 1.4423:1, not 3:2. Padding in % is a share of the width on
   * all four sides, so 4% padding in a 3:2 box leaves an interior shorter
   * than 3:2 and the SHRM plate would be clipped. 1 / (0.92 × 2/3 + 0.08)
   * makes the interior exactly 3:2.
   */
  equal?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const shown = open === null ? null : cards[open];

  useEffect(() => {
    if (shown === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [shown]);

  return (
    <>
      <div className={columns === 2 ? "site-grid-2" : undefined} style={{ display: "grid", gridTemplateColumns: columns === 2 ? "1fr 1fr" : "1fr", gap: 18 }}>
        {cards.map((c, i) => (
          <figure key={c.title} style={{ margin: 0 }}>
            <button
              type="button"
              className="lms-cert-zoom"
              onClick={() => setOpen(i)}
              aria-label={`Enlarge the ${c.title}`}
              style={{ display: "block", width: "100%", padding: 0, border: "1px solid #e3eaf0", borderRadius: 12, overflow: "hidden", background: "#f7fafc", lineHeight: 0 }}
            >
              {equal ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", aspectRatio: "1.4423", padding: "4%" }}>
                  <span style={{ display: "block", width: "100%", boxShadow: "0 6px 22px rgba(10,27,51,.12)" }}>
                    <CertificatePlate issue={c.issue} />
                  </span>
                </span>
              ) : (
                <CertificatePlate issue={c.issue} />
              )}
            </button>
            <figcaption style={{ marginTop: 10 }}>
              <div style={{ font: "700 13px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{c.title}</div>
              <div style={{ font: "400 12px/1.6 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginTop: 3 }}>{c.caption}</div>
            </figcaption>
          </figure>
        ))}
      </div>

      {shown && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={shown.title}
          onClick={() => setOpen(null)}
          className="lms-cert-lightbox"
          style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(6,18,32,.82)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 28 }}
        >
          <button
            type="button"
            onClick={() => setOpen(null)}
            aria-label="Close"
            style={{ position: "absolute", top: 20, right: 22, width: 40, height: 40, borderRadius: "50%", border: "none", cursor: "pointer", background: "rgba(255,255,255,.14)", color: "#fff", font: "500 22px 'Plus Jakarta Sans',sans-serif", lineHeight: 1 }}
          >
            ×
          </button>

          {/* Stops a click on the certificate itself from closing the view. */}
          <div onClick={(e) => e.stopPropagation()} style={{ width: "min(1180px, 100%)", maxHeight: "88vh", overflow: "auto", borderRadius: 14, background: "#fff", cursor: "default" }}>
            <CertificatePlate issue={shown.issue} />
          </div>

          <div style={{ position: "absolute", bottom: 18, left: 0, right: 0, textAlign: "center", font: "600 12.5px 'Plus Jakarta Sans',sans-serif", color: "rgba(255,255,255,.72)", pointerEvents: "none" }}>
            {shown.title} · specimen
          </div>
        </div>
      )}
    </>
  );
}
