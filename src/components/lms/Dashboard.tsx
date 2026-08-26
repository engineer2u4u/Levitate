/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { courseBySlug } from "@/lib/lms/courses";
import { updateEnrolment } from "@/lib/lms/enrolments";
import { curriculumBySlug } from "@/lib/lms/poshCurriculum";
import { certificateCriteria, courseProgress } from "@/lib/lms/progress";
import type { Enrolment } from "@/lib/lms/types";
import { useSession } from "./useSession";

function EmptyState() {
  return (
    <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "48px 40px", textAlign: "center" }}>
      <div style={{ font: "700 19px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", marginBottom: 8 }}>You have not enrolled yet</div>
      <p style={{ font: "400 14px/1.7 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: "0 0 22px", maxWidth: 460, marginInline: "auto" }}>
        Browse the certification catalogue and enrol — your modules, live sessions and certificate all land here.
      </p>
      <Link href="/lms" className="lp-btn-grad" style={{ display: "inline-block", background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 13.5px 'Plus Jakarta Sans',sans-serif", padding: "13px 26px", borderRadius: 999 }}>
        Browse courses
      </Link>
    </div>
  );
}

function EnrolmentCard({ e }: { e: Enrolment }) {
  const course = courseBySlug(e.courseSlug);
  const curriculum = curriculumBySlug(e.courseSlug);
  if (!course) return null;

  const p = curriculum ? courseProgress(curriculum, e) : { done: 0, total: 0, percent: 0 };
  const complete = p.total > 0 && p.percent >= 100;

  return (
    <Link
      href={`/lms/learn/${e.courseSlug}`}
      className="site-card"
      style={{ display: "flex", alignItems: "center", gap: 16, background: "#fff", border: `1px solid ${complete ? "#e3eaf0" : "rgba(27,143,136,.3)"}`, borderRadius: 14, padding: "14px 16px" }}
    >
      <img src={course.img} alt="" style={{ width: 80, height: 58, borderRadius: 11, flex: "none", objectFit: "cover" }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: "700 14.5px/1.35 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{course.title}</div>
        <div style={{ font: "500 11.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginTop: 4 }}>
          {curriculum ? `${course.mode} · ${p.done} of ${p.total} lessons · ${p.percent}% complete` : course.mode}
        </div>
        {curriculum && (
          <div style={{ height: 6, borderRadius: 999, background: "#eef2f6", marginTop: 11, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${p.percent}%`, background: "linear-gradient(90deg,#2fc4bc,#2f7fd6)", borderRadius: 999 }} />
          </div>
        )}
      </div>
      <div style={{ textAlign: "right", flex: "none" }}>
        <div style={{ display: "inline-block", font: "700 10px 'Plus Jakarta Sans',sans-serif", letterSpacing: ".1em", textTransform: "uppercase", color: complete ? "#5b6e82" : "#136f6a", background: complete ? "#f4f7f9" : "rgba(47,196,188,.13)", border: `1px solid ${complete ? "#dbe5ec" : "rgba(27,143,136,.35)"}`, borderRadius: 999, padding: "4px 10px" }}>
          {complete ? "Completed" : "In progress"}
        </div>
        <div style={{ font: "600 11.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", marginTop: 9 }}>Continue →</div>
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const { user, loading, enrolments, openAuth } = useSession();

  if (loading) return <div style={{ background: "#f7fafc", minHeight: "60vh", padding: "38px 48px" }} />;

  if (!user) {
    return (
      <div style={{ background: "#f7fafc", padding: "80px 48px", minHeight: "60vh" }} className="site-page-sec">
        <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ font: "700 24px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 10px" }}>Sign in to see your learning</h1>
          <p style={{ font: "400 14px/1.7 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: "0 0 22px" }}>
            Your enrolled courses, live sessions and certificates live here.
          </p>
          <button type="button" onClick={() => openAuth({ mode: "signin" })} className="lp-btn-grad" style={{ cursor: "pointer", border: "none", background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 13.5px 'Plus Jakarta Sans',sans-serif", padding: "13px 26px", borderRadius: 999 }}>
            Sign in
          </button>
        </div>
      </div>
    );
  }

  // The primary course drives the hero panels; today only PoSH has content.
  const primary = enrolments.find((e) => curriculumBySlug(e.courseSlug)) ?? null;
  const curriculum = primary ? curriculumBySlug(primary.courseSlug) : null;
  const course = primary ? courseBySlug(primary.courseSlug) : null;
  const p = curriculum ? courseProgress(curriculum, primary) : null;
  const attended = primary?.sessionsAttended ?? 0;
  const nextSession = curriculum ? curriculum.sessions[Math.min(attended, curriculum.sessions.length - 1)] : null;

  return (
    <div style={{ background: "#f7fafc", padding: "38px 48px 90px", minHeight: "60vh" }} className="site-page-sec">
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 24 }}>
          <div>
            <h1 style={{ font: "700 28px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 6px", letterSpacing: "-.02em" }}>
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <div style={{ font: "500 13.5px 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>
              {curriculum && p
                ? `${p.done} of ${p.total} lessons complete · ${attended} of ${curriculum.sessions.length} live sessions attended`
                : `${enrolments.length} enrolment${enrolments.length === 1 ? "" : "s"}`}
            </div>
          </div>
          {primary && (
            <Link href={`/lms/learn/${primary.courseSlug}`} className="lp-btn-grad" style={{ background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 13.5px 'Plus Jakarta Sans',sans-serif", padding: "13px 24px", borderRadius: 999 }}>
              Continue learning →
            </Link>
          )}
        </div>

        {enrolments.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="lms-split" style={{ display: "grid", gridTemplateColumns: "1fr 330px", gap: 24, alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {primary && course && curriculum && p && (
                <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "28px 30px" }}>
                  <div style={{ display: "flex", gap: 22, alignItems: "center", flexWrap: "wrap" }}>
                    <img src={course.img} alt="" style={{ width: 132, height: 88, borderRadius: 14, objectFit: "cover", flex: "none" }} />
                    <div style={{ flex: 1, minWidth: 240 }}>
                      <div style={{ font: "700 10.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 7 }}>In progress · {course.mode}</div>
                      <div style={{ font: "700 19px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{course.title}</div>
                      <div style={{ font: "500 12.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginTop: 5 }}>
                        {course.hoursLabel} · {p.total} lessons · Facilitator: {course.facilitator}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ font: "700 30px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{p.percent}%</div>
                      <div style={{ font: "500 11px 'Plus Jakarta Sans',sans-serif", color: "#8296a9" }}>complete</div>
                    </div>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: "#eef2f6", marginTop: 20, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${p.percent}%`, background: "linear-gradient(90deg,#2fc4bc,#2f7fd6)", borderRadius: 999, transition: "width .5s ease" }} />
                  </div>
                  <div style={{ display: "flex", gap: 26, flexWrap: "wrap", marginTop: 18 }}>
                    {[
                      { k: "Stages unlocked", v: `${primary.stagesUnlocked} of ${curriculum.stages.length}` },
                      { k: "Lessons completed", v: `${p.done} / ${p.total}` },
                      { k: "Sessions attended", v: `${attended} / ${curriculum.sessions.length}` },
                    ].map((s) => (
                      <div key={s.k}>
                        <div style={{ font: "700 15px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{s.v}</div>
                        <div style={{ font: "500 11px 'Plus Jakarta Sans',sans-serif", color: "#8296a9" }}>{s.k}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "30px 32px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 8 }}>Enrolled courses</div>
                    <div style={{ font: "700 20px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>Everything you are signed up for</div>
                  </div>
                  {primary && curriculum && primary.stagesUnlocked < curriculum.stages.length && (
                    <button
                      type="button"
                      onClick={() =>
                        updateEnrolment(user.id, primary.courseSlug, {
                          stagesUnlocked: Math.min(curriculum.stages.length, primary.stagesUnlocked + 1),
                          sessionsAttended: Math.min(curriculum.sessions.length, primary.sessionsAttended + 2),
                        })
                      }
                      style={{ cursor: "pointer", font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#136f6a", background: "rgba(47,196,188,.12)", border: "1px solid rgba(27,143,136,.35)", borderRadius: 999, padding: "9px 15px" }}
                    >
                      Simulate: next session completed
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {enrolments.map((e) => <EnrolmentCard key={e.courseSlug} e={e} />)}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {nextSession && curriculum && (
                <div style={{ background: "linear-gradient(135deg,#0c2a45,#0a1f38)", borderRadius: 20, padding: 26, color: "#fff" }}>
                  <div style={{ font: "700 10.5px 'Plus Jakarta Sans',sans-serif", color: "#7fe3dc", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 14 }}>Next live session</div>
                  <div style={{ font: "700 17px/1.35 'Plus Jakarta Sans',sans-serif" }}>{nextSession.topic}</div>
                  <div style={{ font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "rgba(255,255,255,.8)", marginTop: 8 }}>{nextSession.date} · {nextSession.time}</div>
                  <div style={{ font: "500 11.5px 'Plus Jakarta Sans',sans-serif", color: "rgba(255,255,255,.6)", marginTop: 4 }}>
                    The Zoom link becomes active 15 minutes before the session.
                  </div>
                  <Link href="/lms/sessions" className="lp-btn-white" style={{ display: "block", textAlign: "center", marginTop: 18, background: "#fff", color: "#0a1b33", font: "700 13px 'Plus Jakarta Sans',sans-serif", padding: "12px 18px", borderRadius: 999 }}>
                    View all sessions
                  </Link>
                </div>
              )}

              {curriculum && (
                <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 18, padding: 22 }}>
                  <div style={{ font: "700 11px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 14 }}>Certificate status</div>
                  <div style={{ font: "600 13px/1.6 'Plus Jakarta Sans',sans-serif", color: "#3d5064", marginBottom: 14 }}>
                    {primary?.certificateIssued
                      ? "Your certificate has been issued."
                      : "Your certificate is generated automatically once all criteria below are met."}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 16 }}>
                    {certificateCriteria(curriculum, primary).map((c) => (
                      <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 16, height: 16, flex: "none", borderRadius: "50%", background: c.met ? "rgba(47,196,188,.18)" : "#eef2f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={c.met ? "#136f6a" : "#c9d6e0"} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 13l4 4 10-10" /></svg>
                        </div>
                        <div style={{ font: "500 12.5px 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", flex: 1 }}>{c.label}</div>
                        <div style={{ font: "700 11px 'Plus Jakarta Sans',sans-serif", color: c.met ? "#136f6a" : "#8296a9" }}>{c.value}</div>
                      </div>
                    ))}
                  </div>
                  <Link href="/lms/certificates" className="lp-btn-outline" style={{ display: "block", textAlign: "center", background: "#f7fafc", border: "1px solid #e3eaf0", color: "#0a1b33", font: "700 12.5px 'Plus Jakarta Sans',sans-serif", padding: "11px 16px", borderRadius: 999 }}>
                    View certificates
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
