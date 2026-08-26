/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { courseBySlug } from "@/lib/lms/courses";
import { updateEnrolment } from "@/lib/lms/enrolments";
import { curriculumBySlug } from "@/lib/lms/poshCurriculum";
import { certificateCriteria, isCertificateEligible } from "@/lib/lms/progress";
import { useSession } from "./useSession";

export default function Certificates() {
  const { user, loading, enrolments } = useSession();

  if (loading) return <div style={{ background: "#f7fafc", minHeight: "60vh" }} />;

  const enrolment = enrolments.find((e) => curriculumBySlug(e.courseSlug)) ?? null;
  const curriculum = enrolment ? curriculumBySlug(enrolment.courseSlug) : null;
  const course = enrolment ? courseBySlug(enrolment.courseSlug) : null;

  if (!user || !enrolment || !curriculum || !course) {
    return (
      <div style={{ background: "#f7fafc", padding: "70px 48px", minHeight: "60vh" }} className="site-page-sec">
        <div style={{ maxWidth: 600, margin: "0 auto", background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "34px 36px", textAlign: "center" }}>
          <h1 style={{ font: "700 21px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 10px" }}>No certificates yet</h1>
          <p style={{ font: "400 14px/1.7 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: "0 0 20px" }}>
            Complete a certification programme and your certificate is issued automatically here.
          </p>
          <Link href="/lms" className="lp-btn-grad" style={{ display: "inline-block", background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 13.5px 'Plus Jakarta Sans',sans-serif", padding: "13px 26px", borderRadius: 999 }}>Browse courses</Link>
        </div>
      </div>
    );
  }

  const issued = enrolment.certificateIssued;
  const eligible = isCertificateEligible(curriculum, enrolment);
  const criteria = certificateCriteria(curriculum, enrolment);

  return (
    <div style={{ background: "#f7fafc", padding: "38px 48px 90px", minHeight: "60vh" }} className="site-page-sec">
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap", marginBottom: 26 }}>
          <div>
            <h1 style={{ font: "700 27px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 6px", letterSpacing: "-.02em" }}>Certificates</h1>
            <div style={{ font: "500 13.5px 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>
              Issued automatically once completion criteria are met, emailed to you and available here.
            </div>
          </div>
          {eligible && !issued && (
            <button
              type="button"
              onClick={() => updateEnrolment(user.id, enrolment.courseSlug, { certificateIssued: true })}
              className="lp-btn-grad"
              style={{ cursor: "pointer", border: "none", background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 12.5px 'Plus Jakarta Sans',sans-serif", padding: "12px 20px", borderRadius: 999 }}
            >
              Issue my certificate
            </button>
          )}
        </div>

        <div className="lms-split" style={{ display: "grid", gridTemplateColumns: "1fr 330px", gap: 26, alignItems: "start" }}>
          <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "30px 32px" }}>
            {/* Certificate preview. Sized by container query so it scales with the
                column rather than the viewport. */}
            <div
              style={{
                containerType: "inline-size",
                position: "relative",
                width: "100%",
                aspectRatio: "1600/900",
                borderRadius: 10,
                overflow: "hidden",
                background: "linear-gradient(135deg,#1D4D7E,#122C4A 58%,#0D2138)",
                opacity: issued ? 1 : 0.55,
                boxShadow: "0 12px 32px rgba(10,27,51,.16)",
              }}
            >
              <div style={{ position: "absolute", left: "11.98%", top: "2.12%", width: "76.04%", height: "95.56%", background: "#fff", borderRadius: 8 }} />

              <div style={{ position: "absolute", left: "11.98%", top: "2.12%", width: "22.4%", height: "95.56%", overflow: "hidden", background: "linear-gradient(168deg,#1F5FA8,#2A7CC0 46%,#17A2A0)", borderRadius: "8px 0 0 8px" }}>
                <div style={{ position: "absolute", left: "21%", top: "4.4%", width: "57.9%", height: "9.7%", background: "#fff", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.4%", boxSizing: "border-box" }}>
                  <img src="/assets/logo.png" alt="Levitate PeopleSoft" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                </div>
                <div style={{ position: "absolute", left: "20%", top: "48.9%", width: "60%", height: "2.7%", borderRadius: 999, background: "linear-gradient(100deg,#F6D982,#D4A634)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ font: "600 0.61cqw 'Plus Jakarta Sans',sans-serif", color: "#4D3A05", letterSpacing: ".23em", whiteSpace: "nowrap" }}>AWARD OF EXCELLENCE</span>
                </div>
              </div>

              <div style={{ position: "absolute", left: "40.52%", top: "8.45%", font: "600 0.99cqw 'Plus Jakarta Sans',sans-serif", color: "#17A2A0", letterSpacing: ".315em", lineHeight: 1, whiteSpace: "nowrap" }}>LEVITATE PEOPLESOFT</div>

              <div style={{ position: "absolute", left: "70.35%", top: "7.87%", width: "13.71%", height: "6.26%", background: "#F4F8FC", border: "1px solid #DDE6EE", borderRadius: 6 }} />
              <div style={{ position: "absolute", left: "71.44%", top: "9.25%", font: "500 0.78cqw 'Plus Jakarta Sans',sans-serif", color: "#16324F", lineHeight: 1, whiteSpace: "nowrap" }}>
                {issued ? "ID — LVT-PoSH-2026-0148" : "ID — pending"}
              </div>
              <div style={{ position: "absolute", left: "71.44%", top: "11.36%", font: "500 0.78cqw 'Plus Jakarta Sans',sans-serif", color: "#16324F", lineHeight: 1, whiteSpace: "nowrap" }}>
                {issued ? "Issued — Oct 2026" : "Issued — on completion"}
              </div>

              <div style={{ position: "absolute", left: "38.34%", top: "17%", font: "700 2.6cqw 'Plus Jakarta Sans',sans-serif", color: "#16324F", lineHeight: 1, letterSpacing: "-.01em" }}>CERTIFICATE</div>
              <div style={{ position: "absolute", left: "38.34%", top: "25.1%", font: "500 1.25cqw 'Plus Jakarta Sans',sans-serif", color: "#5A7590", letterSpacing: ".333em", lineHeight: 1, whiteSpace: "nowrap" }}>OF TRAINING COMPLETION</div>

              <div style={{ position: "absolute", left: "38.34%", top: "32.3%", font: "400 1.09cqw 'Plus Jakarta Sans',sans-serif", color: "#5A7590", lineHeight: 1, whiteSpace: "nowrap" }}>This certificate is proudly presented to</div>
              <div style={{ position: "absolute", left: "38.34%", top: "35.6%", width: "50.3%", font: "600 3.2cqw/1.35 'Plus Jakarta Sans',sans-serif", color: "#1F5FA8" }}>{user.name}</div>
              <div style={{ position: "absolute", left: "38.34%", top: "46%", width: "27.08%", height: "0.19%", background: "#D4A634" }} />
              <div style={{ position: "absolute", left: "38.34%", top: "49%", width: "42.92%", font: "400 1.15cqw/1.6 'Plus Jakarta Sans',sans-serif", color: "#3D566E" }}>
                {user.org ? `of ${user.org} ` : ""}has successfully completed the {course.hoursLabel.toLowerCase()} {course.title} conducted by Levitate PeopleSoft.
              </div>

              <div style={{ position: "absolute", left: "38.34%", top: "83.63%", width: "15%", height: 1, background: "#C6D4E2" }} />
              <div style={{ position: "absolute", left: "38.34%", top: "84.5%", font: "600 0.99cqw 'Plus Jakarta Sans',sans-serif", color: "#16324F", lineHeight: 1, whiteSpace: "nowrap" }}>Parichita Kotnala</div>
              <div style={{ position: "absolute", left: "38.34%", top: "86.9%", font: "400 0.83cqw 'Plus Jakarta Sans',sans-serif", color: "#5A7590", lineHeight: 1, whiteSpace: "nowrap" }}>Trainer</div>

              <div style={{ position: "absolute", left: "73.14%", top: "82.72%", width: "10.83%", height: 1, background: "#C6D4E2" }} />
              <div style={{ position: "absolute", right: "16.39%", top: "84.05%", font: "600 0.99cqw 'Plus Jakarta Sans',sans-serif", color: "#16324F", lineHeight: 1, textAlign: "right" }}>RP Nath</div>
              <div style={{ position: "absolute", right: "16.39%", top: "87.15%", font: "400 0.83cqw 'Plus Jakarta Sans',sans-serif", color: "#5A7590", lineHeight: 1, textAlign: "right" }}>Principal Advisor</div>

              <div style={{ position: "absolute", left: "55.94%", top: "93.3%", font: "500 0.89cqw 'Plus Jakarta Sans',sans-serif", color: "#1F5FA8", letterSpacing: ".118em", lineHeight: 1 }}>www.levitatepeoplesoft.com</div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 14, background: "#f7fafc", border: "1px solid #eef2f6", borderRadius: 11, padding: "11px 14px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1b8f88" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }} aria-hidden>
                <circle cx="12" cy="8" r="3.4" /><path d="M5 20c0-3.6 3.1-5.6 7-5.6s7 2 7 5.6" />
              </svg>
              <div style={{ font: "500 12px/1.6 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>
                The name and organisation printed come from your account — <strong style={{ color: "#0a1b33" }}>{user.name}</strong>
                {user.org ? `, ${user.org}` : ""}. Update your profile before issuance if this needs correcting.
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 22, alignItems: "center" }}>
              <div style={{ background: issued ? "linear-gradient(120deg,#2fc4bc,#2f7fd6)" : "#f4f7f9", border: `1px solid ${issued ? "transparent" : "#e3eaf0"}`, color: issued ? "#fff" : "#8296a9", font: "700 13px 'Plus Jakarta Sans',sans-serif", padding: "12px 22px", borderRadius: 999, cursor: issued ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 9 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={issued ? "#fff" : "#8296a9"} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 3v12" /><path d="M7 11l5 5 5-5" /><path d="M4 20h16" />
                </svg>
                {issued ? "Download certificate (PDF)" : "Locked until completion"}
              </div>
              <div style={{ font: "500 12px 'Plus Jakarta Sans',sans-serif", color: "#8296a9" }}>
                {issued ? "Verifiable by certificate ID" : "Generated as soon as criteria are met"}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 18, padding: 22 }}>
              <div style={{ font: "700 11px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 14 }}>Completion criteria</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {criteria.map((c) => (
                  <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 16, height: 16, flex: "none", borderRadius: "50%", background: c.met ? "rgba(47,196,188,.18)" : "#eef2f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={c.met ? "#136f6a" : "#c9d6e0"} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 13l4 4 10-10" /></svg>
                    </div>
                    <div style={{ font: "500 12.5px 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", flex: 1 }}>{c.label}</div>
                    <div style={{ font: "700 11px 'Plus Jakarta Sans',sans-serif", color: c.met ? "#136f6a" : "#8296a9" }}>{c.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 18, padding: 22 }}>
              <div style={{ font: "700 11px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 14 }}>Final reading kit</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {curriculum.finalKit.map((k) => (
                  <div key={k.title} style={{ display: "flex", alignItems: "center", gap: 11, background: "#f7fafc", border: "1px solid #eef2f6", borderRadius: 11, padding: "11px 13px", opacity: issued ? 1 : 0.6 }}>
                    <div style={{ width: 22, height: 22, flex: "none", borderRadius: 7, background: "rgba(47,127,214,.12)", display: "flex", alignItems: "center", justifyContent: "center", font: "800 8.5px 'Plus Jakarta Sans',sans-serif", color: "#2f7fd6" }}>PDF</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ font: "600 12.5px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{k.title}</div>
                      <div style={{ font: "500 10.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginTop: 2 }}>{k.meta}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ font: "400 11.5px/1.6 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginTop: 12 }}>
                {issued ? "Emailed with your certificate and available here permanently." : "Released with your certificate once the course is complete."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
