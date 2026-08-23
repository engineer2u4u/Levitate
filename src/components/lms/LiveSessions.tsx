"use client";

import Link from "next/link";
import { courseBySlug } from "@/lib/lms/courses";
import { updateEnrolment } from "@/lib/lms/enrolments";
import { curriculumBySlug } from "@/lib/lms/poshCurriculum";
import { useSession } from "./useSession";

export default function LiveSessions() {
  const { user, loading, enrolments } = useSession();

  if (loading) return <div style={{ background: "#f7fafc", minHeight: "60vh" }} />;

  const enrolment = enrolments.find((e) => curriculumBySlug(e.courseSlug)) ?? null;
  const curriculum = enrolment ? curriculumBySlug(enrolment.courseSlug) : null;
  const course = enrolment ? courseBySlug(enrolment.courseSlug) : null;

  if (!user || !enrolment || !curriculum || !course) {
    return (
      <div style={{ background: "#f7fafc", padding: "70px 48px", minHeight: "60vh" }} className="site-page-sec">
        <div style={{ maxWidth: 600, margin: "0 auto", background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "34px 36px", textAlign: "center" }}>
          <h1 style={{ font: "700 21px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 10px" }}>No live sessions yet</h1>
          <p style={{ font: "400 14px/1.7 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: "0 0 20px" }}>
            Once you enrol in a live cohort, its full session schedule and Zoom links appear here.
          </p>
          <Link href="/lms" className="lp-btn-grad" style={{ display: "inline-block", background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 13.5px 'Plus Jakarta Sans',sans-serif", padding: "13px 26px", borderRadius: 999 }}>Browse courses</Link>
        </div>
      </div>
    );
  }

  const attended = enrolment.sessionsAttended;
  const nextIdx = Math.min(attended, curriculum.sessions.length - 1);

  return (
    <div style={{ background: "#f7fafc", padding: "38px 48px 90px", minHeight: "60vh" }} className="site-page-sec">
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <h1 style={{ font: "700 27px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 6px", letterSpacing: "-.02em" }}>Live sessions</h1>
        <div style={{ font: "500 13.5px 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", marginBottom: 26 }}>
          {course.title} · {course.mode} · {curriculum.sessions.length} sessions · 2 hours each
        </div>

        <div className="lms-split" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {curriculum.sessions.map((s, i) => {
              const done = i < attended;
              const next = i === nextIdx && !done;
              return (
                <div key={s.n} style={{ background: "#fff", border: `1px solid ${next ? "rgba(27,143,136,.45)" : "#e3eaf0"}`, borderRadius: 16, padding: "22px 24px", display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
                  <div style={{ textAlign: "center", background: done ? "rgba(47,196,188,.12)" : next ? "linear-gradient(135deg,#2fc4bc,#2f7fd6)" : "#f7fafc", border: `1px solid ${next ? "transparent" : done ? "rgba(27,143,136,.3)" : "#e3eaf0"}`, borderRadius: 13, padding: "12px 14px", minWidth: 64, flex: "none" }}>
                    <div style={{ font: "700 19px 'Plus Jakarta Sans',sans-serif", color: next ? "#fff" : "#0a1b33" }}>{s.day}</div>
                    <div style={{ font: "700 10px 'Plus Jakarta Sans',sans-serif", color: next ? "rgba(255,255,255,.85)" : "#8296a9", letterSpacing: ".1em", textTransform: "uppercase" }}>{s.month}</div>
                  </div>

                  <div style={{ flex: 1, minWidth: 230 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <div style={{ font: "700 16px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{s.topic}</div>
                      <div style={{ font: "700 9.5px 'Plus Jakarta Sans',sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: done ? "#136f6a" : next ? "#1f5fa8" : "#8296a9", background: done ? "rgba(47,196,188,.12)" : next ? "rgba(47,127,214,.1)" : "#f4f7f9", border: `1px solid ${done ? "rgba(27,143,136,.35)" : next ? "rgba(47,127,214,.3)" : "#dbe5ec"}`, borderRadius: 999, padding: "4px 9px" }}>
                        {done ? "Attended" : next ? "Up next" : "Scheduled"}
                      </div>
                    </div>
                    <div style={{ font: "500 12.5px 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", marginTop: 6 }}>Session {s.n} · {s.date} · {s.time} · Zoom</div>
                    <div style={{ font: "500 11.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginTop: 7 }}>
                      {done ? "Recording and notes emailed after the session" : next ? "Final reminder with the Zoom link goes out 1 hour before" : "Reminders scheduled 24 hours and 1 hour before"}
                    </div>
                  </div>

                  {(done || next) && (
                    <div
                      style={{ background: next ? "linear-gradient(120deg,#2fc4bc,#2f7fd6)" : "#fff", border: `1px solid ${next ? "transparent" : "#e3eaf0"}`, color: next ? "#fff" : "#0a1b33", font: "700 12.5px 'Plus Jakarta Sans',sans-serif", padding: "11px 20px", borderRadius: 999, whiteSpace: "nowrap" }}
                    >
                      {done ? "View recording" : "Join Zoom session"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 18, padding: 22 }}>
              <div style={{ font: "700 11px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 12 }}>Attendance</div>
              <div style={{ font: "700 26px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{attended} / {curriculum.sessions.length}</div>
              <div style={{ font: "500 12px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginBottom: 14 }}>sessions attended</div>
              <div style={{ font: "400 12.5px/1.65 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>
                Attendance is recorded from the Zoom session and counts towards your certificate criteria.
              </div>
              {attended < curriculum.sessions.length && (
                <button
                  type="button"
                  onClick={() => updateEnrolment(user.id, enrolment.courseSlug, { sessionsAttended: attended + 1 })}
                  style={{ width: "100%", marginTop: 16, cursor: "pointer", font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#136f6a", background: "rgba(47,196,188,.12)", border: "1px solid rgba(27,143,136,.35)", borderRadius: 999, padding: "10px 14px" }}
                >
                  Simulate: mark next session attended
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
