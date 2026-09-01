/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState } from "react";
import { COURSES, formatFee } from "@/lib/lms/courses";
import { LMS_TESTING } from "@/lib/lms/testMode";
import { useSession } from "./useSession";

const FILTERS = ["All courses", "Train-the-Trainer", "Live cohorts", "For students"] as const;
type Filter = (typeof FILTERS)[number];

const matches = (filter: Filter, tag: string, mode: string) => {
  if (filter === "All courses") return true;
  if (filter === "For students") return tag === "For students";
  if (filter === "Live cohorts") return mode.toLowerCase().includes("live online");
  return tag.includes("TTT") || tag === "Enrolling" || tag === "Flagship";
};

export default function Catalogue() {
  const { enrolments } = useSession();
  const [filter, setFilter] = useState<Filter>("All courses");
  const enrolledSlugs = new Set(enrolments.map((e) => e.courseSlug));
  // Test fixtures are catalogued so their routes build, but they only appear
  // in the listing on a testing build.
  const shown = COURSES.filter((c) => (LMS_TESTING || !c.hidden) && matches(filter, c.tag, c.mode));

  return (
    <>
      <div style={{ background: "linear-gradient(120deg,#0c2a45,#0a1f38)", padding: "52px 48px 46px" }} className="site-page-sec">
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#7fe3dc", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 12 }}>Levitate Learning</div>
          <h1 style={{ font: "700 clamp(28px,3vw,40px)/1.15 'Plus Jakarta Sans',sans-serif", color: "#fff", margin: "0 0 12px", letterSpacing: "-.02em" }}>
            Certification courses, live cohorts and trainer toolkits
          </h1>
          <p style={{ font: "400 15px/1.7 'Plus Jakarta Sans',sans-serif", color: "rgba(255,255,255,.72)", margin: 0, maxWidth: 620 }}>
            Enrol, learn through staged modules between live sessions, and earn a verifiable certificate on completion.
          </p>
        </div>
      </div>

      <div style={{ background: "#f7fafc", padding: "34px 48px 80px" }} className="site-page-sec">
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div role="tablist" aria-label="Filter courses" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 26 }}>
            {FILTERS.map((f) => {
              const on = f === filter;
              return (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setFilter(f)}
                  style={{ cursor: "pointer", font: "700 12px 'Plus Jakarta Sans',sans-serif", color: on ? "#fff" : "#3d5064", background: on ? "linear-gradient(120deg,#2fc4bc,#2f7fd6)" : "#fff", border: `1px solid ${on ? "transparent" : "#e3eaf0"}`, borderRadius: 999, padding: "9px 16px" }}
                >
                  {f}
                </button>
              );
            })}
          </div>

          <div className="lms-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 22 }}>
            {shown.map((c) => {
              const enrolled = enrolledSlugs.has(c.slug);
              return (
                <div key={c.slug} className="site-card" style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 2px 8px rgba(10,27,51,.05)" }}>
                  <div style={{ position: "relative", height: 150, background: "#eef4f7", overflow: "hidden" }}>
                    <img src={c.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(10,27,51,.1),rgba(10,27,51,.55))" }} />
                    <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(255,255,255,.92)", color: "#136f6a", font: "800 9.5px 'Plus Jakarta Sans',sans-serif", letterSpacing: ".12em", textTransform: "uppercase", padding: "5px 10px", borderRadius: 999 }}>{c.tag}</div>
                    <div style={{ position: "absolute", bottom: 12, left: 14, right: 14, font: "600 11.5px 'Plus Jakarta Sans',sans-serif", color: "#fff" }}>{c.mode}</div>
                  </div>

                  <div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", flex: 1, gap: 12 }}>
                    <div style={{ font: "700 16.5px/1.35 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{c.title}</div>
                    <div style={{ font: "400 13px/1.6 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", flex: 1 }}>{c.desc}</div>
                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", font: "600 11.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", borderTop: "1px solid #eef2f6", paddingTop: 12 }}>
                      <span>{c.modulesLabel}</span><span>{c.hoursLabel}</span><span>{c.facilitator}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <div>
                        <div style={{ font: "700 18px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{formatFee(c.feePaise)}</div>
                        <div style={{ font: "500 10.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9" }}>{c.priceNote}</div>
                      </div>
                      <Link
                        href={`/lms/course/${c.slug}`}
                        className={enrolled ? "lp-btn-outline" : "lp-btn-grad"}
                        style={{
                          background: enrolled ? "#fff" : "linear-gradient(120deg,#2fc4bc,#2f7fd6)",
                          color: enrolled ? "#136f6a" : "#fff",
                          border: `1px solid ${enrolled ? "rgba(27,143,136,.5)" : "transparent"}`,
                          font: "700 12.5px 'Plus Jakarta Sans',sans-serif",
                          padding: "11px 18px",
                          borderRadius: 999,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {enrolled ? "Enrolled ·  Open" : c.status === "enrolling" ? "View course" : "Join waitlist"}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
