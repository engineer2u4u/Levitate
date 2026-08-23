/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState } from "react";
import { courseBySlug } from "@/lib/lms/courses";
import { toggleLessonComplete } from "@/lib/lms/enrolments";
import { curriculumBySlug } from "@/lib/lms/poshCurriculum";
import { availableLessons, courseProgress } from "@/lib/lms/progress";
import Quiz from "./Quiz";
import { useSession } from "./useSession";

export default function LessonPlayer({ slug }: { slug: string }) {
  const course = courseBySlug(slug);
  const curriculum = curriculumBySlug(slug);
  const { user, loading, enrolments } = useSession();
  const enrolment = enrolments.find((e) => e.courseSlug === slug) ?? null;

  const [lessonIdx, setLessonIdx] = useState(0);
  const [quizStage, setQuizStage] = useState<string | null>(null);

  if (loading) return <div style={{ background: "#f7fafc", minHeight: "60vh" }} />;

  if (!course || !curriculum) {
    return (
      <div style={{ background: "#f7fafc", padding: "80px 48px", minHeight: "50vh", textAlign: "center" }} className="site-page-sec">
        <h1 style={{ font: "700 21px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 10px" }}>Course content is not published yet</h1>
        <Link href="/lms">← Back to all courses</Link>
      </div>
    );
  }

  // Access follows enrolment. Never render lesson content to someone who has
  // not paid, even though this is a client-side check.
  if (!user || !enrolment) {
    return (
      <div style={{ background: "#f7fafc", padding: "70px 48px", minHeight: "50vh" }} className="site-page-sec">
        <div style={{ maxWidth: 600, margin: "0 auto", background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "34px 36px", textAlign: "center" }}>
          <h1 style={{ font: "700 21px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 10px" }}>You are not enrolled in this course</h1>
          <p style={{ font: "400 14px/1.7 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: "0 0 20px" }}>
            Enrol in {course.title} to open its modules, live sessions and certificate.
          </p>
          <Link href={`/lms/course/${slug}`} className="lp-btn-grad" style={{ display: "inline-block", background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 13.5px 'Plus Jakarta Sans',sans-serif", padding: "13px 26px", borderRadius: 999 }}>View the course</Link>
        </div>
      </div>
    );
  }

  const open = availableLessons(curriculum, enrolment);
  const p = courseProgress(curriculum, enrolment);
  const active = open[Math.min(lessonIdx, Math.max(0, open.length - 1))] ?? null;
  const activeQuiz = quizStage ? curriculum.quizzes.find((q) => q.stage === quizStage) ?? null : null;
  const isDone = (id: string) => enrolment.completed.includes(id);

  return (
    <div style={{ background: "#f7fafc", padding: "26px 48px 80px", minHeight: "60vh" }} className="site-page-sec">
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <Link href="/lms/dashboard" style={{ font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", display: "inline-block", marginBottom: 16 }}>← My Learning</Link>

        <div className="lms-split" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>
          <div>
            {activeQuiz ? (
              <Quiz quiz={activeQuiz} userId={user.id} courseSlug={slug} onClose={() => setQuizStage(null)} />
            ) : active ? (
              <>
                <div style={{ position: "relative", background: "#07182c", borderRadius: 18, overflow: "hidden", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src="/assets/audience-red-hall.jpeg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.28 }} />
                  <div style={{ position: "relative", textAlign: "center", padding: 20 }}>
                    <div style={{ width: 74, height: 74, margin: "0 auto 14px", borderRadius: "50%", background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 34px rgba(4,16,30,.5)" }}>
                      <div style={{ width: 0, height: 0, borderLeft: "20px solid #fff", borderTop: "12px solid transparent", borderBottom: "12px solid transparent", marginLeft: 6 }} />
                    </div>
                    <div style={{ font: "600 11.5px 'Plus Jakarta Sans',sans-serif", color: "rgba(255,255,255,.7)" }}>
                      {active.kind === "VID" ? "Video player — secure private streaming goes here" : "Reading material — the PDF viewer goes here"}
                    </div>
                  </div>
                </div>

                <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 18, padding: "28px 30px", marginTop: 18 }}>
                  <div style={{ font: "700 10.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 9 }}>{active.stageTitle}</div>
                  <h1 style={{ font: "700 22px/1.3 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 12px", letterSpacing: "-.01em" }}>{active.title}</h1>
                  <p style={{ font: "400 14px/1.75 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: "0 0 22px", maxWidth: 640 }}>{active.desc}</p>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => toggleLessonComplete(user.id, slug, active.id)}
                      className={isDone(active.id) ? undefined : "lp-btn-grad"}
                      style={{ cursor: "pointer", border: isDone(active.id) ? "1px solid rgba(27,143,136,.5)" : "none", background: isDone(active.id) ? "#fff" : "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: isDone(active.id) ? "#136f6a" : "#fff", font: "700 13px 'Plus Jakarta Sans',sans-serif", padding: "12px 22px", borderRadius: 999 }}
                    >
                      {isDone(active.id) ? "✓ Completed — undo" : "Mark lesson complete"}
                    </button>
                    {lessonIdx + 1 < open.length && (
                      <button type="button" onClick={() => setLessonIdx(lessonIdx + 1)} style={{ cursor: "pointer", background: "#f7fafc", border: "1px solid #e3eaf0", color: "#0a1b33", font: "700 13px 'Plus Jakarta Sans',sans-serif", padding: "12px 22px", borderRadius: 999 }}>
                        Next lesson →
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 18, padding: "40px 34px", textAlign: "center" }}>
                <div style={{ font: "700 18px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", marginBottom: 8 }}>Nothing released yet</div>
                <p style={{ font: "400 13.5px/1.7 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: 0 }}>Your first stage opens as soon as your orientation is confirmed.</p>
              </div>
            )}
          </div>

          {/* playlist */}
          <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 18, padding: "22px 20px" }}>
            <div style={{ font: "700 11px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 6 }}>Course content</div>
            <div style={{ font: "500 11.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginBottom: 16 }}>
              {p.done} of {p.total} lessons complete · {enrolment.stagesUnlocked} of {curriculum.stages.length} stages released
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, maxHeight: 620, overflowY: "auto" }}>
              {curriculum.stages.map((stage, si) => {
                const released = si < enrolment.stagesUnlocked;
                const quiz = curriculum.quizzes.find((q) => q.stage === stage.num);
                const best = enrolment.quizBest[stage.num];
                return (
                  <div key={stage.id}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ font: "700 10.5px 'Plus Jakarta Sans',sans-serif", color: released ? "#0a1b33" : "#a9b8c6", letterSpacing: ".08em", textTransform: "uppercase" }}>{stage.title}</div>
                      {!released && <span style={{ font: "700 9px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", background: "#f4f7f9", border: "1px solid #dbe5ec", borderRadius: 999, padding: "3px 8px" }}>Locked</span>}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {stage.lessons.map((l) => {
                        const idx = open.findIndex((o) => o.id === l.id);
                        const isActive = active?.id === l.id && !activeQuiz;
                        return (
                          <button
                            key={l.id}
                            type="button"
                            disabled={!released}
                            onClick={() => { setQuizStage(null); setLessonIdx(Math.max(0, idx)); }}
                            style={{ textAlign: "left", cursor: released ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 11, background: isActive ? "rgba(47,196,188,.1)" : "#f7fafc", border: `1px solid ${isActive ? "rgba(27,143,136,.45)" : "#eef2f6"}`, borderRadius: 11, padding: "10px 12px", opacity: released ? 1 : 0.55 }}
                          >
                            <span style={{ width: 22, height: 22, flex: "none", borderRadius: 7, background: l.kind === "VID" ? "rgba(47,196,188,.15)" : "rgba(47,127,214,.12)", display: "flex", alignItems: "center", justifyContent: "center", font: "800 8.5px 'Plus Jakarta Sans',sans-serif", color: l.kind === "VID" ? "#136f6a" : "#2f7fd6" }}>{l.kind}</span>
                            <span style={{ flex: 1, minWidth: 0 }}>
                              <span style={{ display: "block", font: "600 12.5px/1.35 'Plus Jakarta Sans',sans-serif", color: released ? "#0a1b33" : "#5b6e82" }}>{l.title}</span>
                              <span style={{ display: "block", font: "500 10.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginTop: 2 }}>{l.meta}</span>
                            </span>
                            {isDone(l.id) && <span style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#136f6a" }}>✓</span>}
                          </button>
                        );
                      })}

                      {quiz && (
                        <button
                          type="button"
                          disabled={!released}
                          onClick={() => setQuizStage(stage.num)}
                          style={{ textAlign: "left", cursor: released ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 11, background: released ? "linear-gradient(90deg,#fffdf5,#fff)" : "#f7fafc", border: `1px solid ${released ? "rgba(212,166,52,.45)" : "#eef2f6"}`, borderRadius: 11, padding: "10px 12px", opacity: released ? 1 : 0.55 }}
                        >
                          <span style={{ width: 22, height: 22, flex: "none", borderRadius: 7, background: "rgba(240,160,44,.16)", display: "flex", alignItems: "center", justifyContent: "center", font: "800 8.5px 'Plus Jakarta Sans',sans-serif", color: "#9a7415" }}>QZ</span>
                          <span style={{ flex: 1, minWidth: 0 }}>
                            <span style={{ display: "block", font: "600 12.5px/1.35 'Plus Jakarta Sans',sans-serif", color: released ? "#0a1b33" : "#5b6e82" }}>Quiz · {quiz.title}</span>
                            <span style={{ display: "block", font: "500 10.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginTop: 2 }}>
                              {quiz.questions.length} questions · badge: {quiz.badge}
                            </span>
                          </span>
                          <span style={{ font: "700 9.5px 'Plus Jakarta Sans',sans-serif", color: best ? "#136f6a" : released ? "#9a7415" : "#a9b8c6" }}>
                            {best ? `${best.score}/${best.total}` : released ? "Start" : "Locked"}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
