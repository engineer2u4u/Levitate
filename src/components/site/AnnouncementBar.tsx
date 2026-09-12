"use client";

import Link from "next/link";
import { useCatalog } from "@/components/site/CatalogProvider";
import { batchCards, startsText } from "@/lib/catalog";

/**
 * Full-width enrolment strip that sits directly under the homepage nav.
 * Reads the enrolling, dated batches from the catalogue (the admin's Courses
 * and Sessions screens), so it disappears on its own once no batch is
 * enrolling rather than advertising stale dates.
 */
export default function AnnouncementBar() {
  const open = batchCards(useCatalog()).filter((c) => c.status === "enrolling" && c.batch?.short && startsText(c));
  if (open.length === 0) return null;

  return (
    // Same ground as the SHRM ticker above the header, so the two bands read
    // as one piece of site chrome rather than two competing stripes.
    <div style={{ background: "linear-gradient(120deg,#0c2a45,#0a1f38)", borderBottom: "1px solid rgba(127,227,220,.25)" }}>
      <div
        className="site-annc"
        style={{ maxWidth: 1240, margin: "0 auto", padding: "12px 48px", display: "flex", alignItems: "center", justifyContent: "center", gap: 18, flexWrap: "wrap" }}
      >
        <span style={{ width: 30, height: 30, flex: "none", borderRadius: 9, background: "rgba(255,255,255,.18)", border: "1px solid rgba(255,255,255,.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M8 3v4M16 3v4M3 11h18" />
            <path d="M9 16l2 2 4-4" />
          </svg>
        </span>
        <div style={{ font: "700 15px/1.45 'Plus Jakarta Sans',sans-serif", color: "#fff" }}>
          Enrolment open: {open.map((c) => `${c.batch?.short} from ${startsText(c)}`).join(" · ")}
        </div>
        <Link
          href="/certifications#upcoming"
          className="lp-btn-white"
          style={{ background: "#fff", color: "#136f6a", font: "700 13.5px 'Plus Jakarta Sans',sans-serif", padding: "9px 20px", borderRadius: 999, whiteSpace: "nowrap" }}
        >
          Check out our upcoming certification programs →
        </Link>
      </div>
    </div>
  );
}
