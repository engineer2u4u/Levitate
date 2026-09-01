"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { contentBySlug, flatItems, totalMinutes, type CourseItem } from "@/lib/lms/courseContent";
import {
  completeItem,
  courseStats,
  currentIndex,
  isShared,
  itemState,
  kitReleased,
  startCourse,
  uncompleteItem,
  type CourseProgress,
} from "@/lib/lms/courseProgress";
import { useSession } from "./useSession";
import { courseBySlug } from "@/lib/lms/courses";

const SANS = "'Plus Jakarta Sans',sans-serif";

/**
 * The learning screen: contents on the left, the current item on the right.
 *
 * Progress is loaded once and then held here, with every write returning the
 * new state — so the sidebar, the unlock rule and the completion banner all
 * read from one value and cannot disagree with each other.
 */
export default function CoursePlayer({ slug }: { slug: string }) {
  const course = contentBySlug(slug);
  const { user, loading, openAuth, enrolments } = useSession();
  // The catalogue entry is what carries the price; the content module only
  // knows the syllabus. A course with no catalogue row is treated as free.
  const fee = courseBySlug(slug)?.feePaise ?? 0;
  const enrolled = enrolments.some((e) => e.courseSlug === slug);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const items = useMemo(() => (course ? flatItems(course) : []), [course]);

  // Load once the learner is known, and land them on the first unfinished item.
  useEffect(() => {
    if (!course || !user) return;
    let cancelled = false;
    startCourse(user.id, course)
      .then((p) => {
        if (cancelled) return;
        setProgress(p);
        setActive(currentIndex(flatItems(course), p));
        setReady(true);
      })
      .catch((e: Error) => {
        if (cancelled) return;
        setError(e.message);
        setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [course, user]);

  const onComplete = useCallback(
    async (item: CourseItem, attempt?: { score: number; total: number }) => {
      if (!course || !user) return;
      try {
        const next = await completeItem(user.id, course, item.id, attempt);
        setProgress(next);
        // Move on automatically — the next item is open the instant this one
        // is done, and stopping to click it again is friction with no purpose.
        const all = flatItems(course);
        const idx = all.findIndex((i) => i.id === item.id);
        if (idx >= 0 && idx + 1 < all.length) setActive(idx + 1);
      } catch (e) {
        setError((e as Error).message);
      }
    },
    [course, user],
  );

  const onUndo = useCallback(
    async (item: CourseItem) => {
      if (!course || !user) return;
      try {
        setProgress(await uncompleteItem(user.id, course, item.id));
      } catch (e) {
        setError((e as Error).message);
      }
    },
    [course, user],
  );

  if (!course) {
    return (
      <Shell>
        <h1 style={{ font: `700 22px ${SANS}`, color: "#0a1b33", margin: "0 0 10px" }}>Course not found</h1>
        <Link href="/certifications" style={{ font: `600 13px ${SANS}` }}>← All certifications</Link>
      </Shell>
    );
  }

  if (loading) return <Shell><Muted>Loading…</Muted></Shell>;

  if (!user) {
    return (
      <Shell>
        <h1 style={{ font: `700 24px ${SANS}`, color: "#0a1b33", margin: "0 0 10px" }}>{course.title}</h1>
        <p style={{ font: `400 14.5px/1.75 ${SANS}`, color: "#5b6e82", maxWidth: 560, margin: "0 0 22px" }}>
          Sign in to start the course. Your progress is saved against your account, so you can pick up where you left off.
        </p>
        <button
          type="button"
          onClick={() => openAuth({ mode: "signin", reason: "Sign in to start the course." })}
          className="lp-btn-grad"
          style={{ cursor: "pointer", border: "none", background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: `700 14px ${SANS}`, padding: "13px 26px", borderRadius: 999 }}
        >
          Sign in to start
        </button>
      </Shell>
    );
  }

  // Content is for people who have paid for it. The check is a courtesy, not a
  // wall: this is a static export, so the item text ships in the bundle either
  // way. Real gating needs signed URLs and content fetched per request.
  if (fee > 0 && !enrolled) {
    return (
      <Shell>
        <h1 style={{ font: `700 24px ${SANS}`, color: "#0a1b33", margin: "0 0 10px" }}>{course.title}</h1>
        <p style={{ font: `400 14.5px/1.75 ${SANS}`, color: "#5b6e82", maxWidth: 560, margin: "0 0 22px" }}>
          This course is open to enrolled learners. Enrol on the course page and it opens straight away.
        </p>
        <Link href={`/lms/course/${course.slug}`} className="lp-btn-grad" style={{ display: "inline-block", background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: `700 14px ${SANS}`, padding: "13px 26px", borderRadius: 999 }}>
          Go to the course page
        </Link>
      </Shell>
    );
  }

  if (!ready) return <Shell><Muted>Loading your progress…</Muted></Shell>;

  const item = items[active];
  const state = itemState(items, active, progress);
  const stats = courseStats(course, progress);
  const done = new Set(progress?.completedItems ?? []);
  const kit = kitReleased(course, progress);

  return (
    <div style={{ background: "#f7fafc", minHeight: "70vh" }}>
      <div className="lms-player" style={{ display: "grid", gridTemplateColumns: "360px 1fr", alignItems: "start" }}>
        {/* ---------------------------- CONTENTS ---------------------------- */}
        <aside className={`lms-player-side${menuOpen ? " is-open" : ""}`}>
          <div style={{ padding: "24px 22px 18px", borderBottom: "1px solid #e3eaf0" }}>
            <Link href={`/lms/course/${course.slug}`} style={{ font: `600 12px ${SANS}`, color: "#1b8f88" }}>← Course page</Link>
            <h1 style={{ font: `700 17px/1.35 ${SANS}`, color: "#0a1b33", margin: "12px 0 0" }}>{course.title}</h1>
            <div style={{ font: `500 12px ${SANS}`, color: "#8296a9", marginTop: 6 }}>
              {stats.total} items · {totalMinutes(course)} min
            </div>

            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", font: `700 11.5px ${SANS}`, color: "#0a1b33", marginBottom: 7 }}>
                <span>Your progress</span>
                <span style={{ color: "#1b8f88" }}>{stats.percent}%</span>
              </div>
              <div style={{ height: 7, borderRadius: 999, background: "#e3eaf0", overflow: "hidden" }}>
                <div style={{ width: `${stats.percent}%`, height: "100%", background: "linear-gradient(90deg,#2fc4bc,#2f7fd6)", transition: "width .35s ease" }} />
              </div>
              <div style={{ font: `500 11.5px ${SANS}`, color: "#8296a9", marginTop: 6 }}>
                {stats.done} of {stats.total} complete
              </div>
            </div>
          </div>

          <nav style={{ padding: "8px 0 24px" }}>
            {course.modules.map((m) => {
              const first = items.findIndex((i) => i.moduleId === m.id);
              const moduleLocked = itemState(items, first, progress) === "locked";
              const moduleDone = m.items.every((i) => done.has(i.id));
              return (
                <div key={m.id} style={{ padding: "14px 22px 4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <div style={{ font: `700 12.5px/1.4 ${SANS}`, color: moduleLocked ? "#a9b8c6" : "#0a1b33", flex: 1 }}>{m.title}</div>
                    {moduleDone && <Tick />}
                    {moduleLocked && <LockIcon />}
                  </div>
                  <div style={{ font: `500 11.5px/1.5 ${SANS}`, color: "#8296a9", marginBottom: 8 }}>{m.summary}</div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {m.items.map((it) => {
                      const idx = items.findIndex((x) => x.id === it.id);
                      const st = itemState(items, idx, progress);
                      const isActive = idx === active;
                      return (
                        <button
                          key={it.id}
                          type="button"
                          disabled={st === "locked"}
                          onClick={() => {
                            setActive(idx);
                            setMenuOpen(false);
                          }}
                          className="lms-item-row"
                          style={{
                            display: "flex", alignItems: "flex-start", gap: 11, width: "100%", textAlign: "left",
                            border: "none", borderRadius: 10, padding: "10px 12px",
                            background: isActive ? "#eef4f7" : "transparent",
                            cursor: st === "locked" ? "not-allowed" : "pointer",
                            opacity: st === "locked" ? 0.55 : 1,
                          }}
                        >
                          <span style={{ flex: "none", marginTop: 1 }}>
                            {st === "done" ? <Tick /> : st === "locked" ? <LockIcon /> : <Dot />}
                          </span>
                          <span style={{ flex: 1 }}>
                            <span style={{ display: "block", font: `${isActive ? 700 : 600} 13px/1.4 ${SANS}`, color: st === "locked" ? "#8296a9" : "#0a1b33" }}>
                              {it.title}
                            </span>
                            <span style={{ display: "block", font: `500 11px ${SANS}`, color: "#8296a9", marginTop: 3 }}>
                              {KIND_LABEL[it.kind]} · {it.minutes} min
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* The kit is listed from the start so the goal is visible, but it
                only opens once every item is done. */}
            <div style={{ padding: "14px 22px 4px", marginTop: 8, borderTop: "1px solid #e3eaf0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 12 }}>
                <div style={{ font: `700 12.5px ${SANS}`, color: kit ? "#0a1b33" : "#a9b8c6", flex: 1 }}>Reading kit</div>
                {kit ? <Tick /> : <LockIcon />}
              </div>
              <div style={{ font: `500 11.5px/1.5 ${SANS}`, color: "#8296a9", marginTop: 4 }}>
                {kit ? "Released — yours to keep" : "Unlocks when the course is complete"}
              </div>
            </div>
          </nav>
        </aside>

        {/* ----------------------------- CONTENT ---------------------------- */}
        <main style={{ padding: "34px 48px 72px", minWidth: 0 }}>
          <button type="button" className="lms-player-toggle" onClick={() => setMenuOpen((o) => !o)}>
            {menuOpen ? "Hide contents" : "Show contents"}
          </button>

          {error && (
            <div role="alert" style={{ font: `600 12.5px/1.6 ${SANS}`, color: "#a53f28", background: "rgba(226,86,74,.08)", border: "1px solid rgba(226,86,74,.28)", borderRadius: 12, padding: "12px 14px", marginBottom: 20 }}>
              {error}
            </div>
          )}

          {!isShared && (
            <div style={{ font: `600 11.5px/1.6 ${SANS}`, color: "#8a6d3b", background: "#fdf6e3", border: "1px solid #f0e2bd", borderRadius: 12, padding: "10px 13px", marginBottom: 20 }}>
              Supabase is not configured in this build, so progress is saved in this browser only and will not reach the admin panel.
            </div>
          )}

          {kit && <KitBanner course={course} />}

          <ItemView
            item={item}
            state={state}
            attempt={progress?.quizAttempts[item.id] ?? null}
            onComplete={onComplete}
            onUndo={onUndo}
          />
        </main>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ views */

const KIND_LABEL: Record<CourseItem["kind"], string> = {
  reading: "Reading",
  video: "Video",
  quiz: "Quiz",
};

function ItemView({
  item, state, attempt, onComplete, onUndo,
}: {
  item: CourseItem;
  state: "done" | "open" | "locked";
  attempt: { score: number; total: number } | null;
  onComplete: (item: CourseItem, attempt?: { score: number; total: number }) => void;
  onUndo: (item: CourseItem) => void;
}) {
  if (state === "locked") {
    return (
      <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "48px 40px", textAlign: "center" }}>
        <LockIcon size={30} />
        <h2 style={{ font: `700 20px ${SANS}`, color: "#0a1b33", margin: "14px 0 8px" }}>{item.title} is locked</h2>
        <p style={{ font: `400 14px/1.7 ${SANS}`, color: "#5b6e82", margin: 0 }}>
          Finish the item before it to open this one.
        </p>
      </div>
    );
  }

  return (
    <>
      <div style={{ font: `700 11px ${SANS}`, color: "#1b8f88", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 10 }}>
        {KIND_LABEL[item.kind]} · {item.minutes} min
      </div>
      <h2 style={{ font: `700 clamp(24px,2.6vw,32px)/1.2 ${SANS}`, color: "#0a1b33", margin: "0 0 24px", letterSpacing: "-.02em" }}>{item.title}</h2>

      {item.kind === "video" && item.videoId && (
        <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: 16, overflow: "hidden", background: "#0a1b33", marginBottom: 26 }}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${item.videoId}`}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          />
        </div>
      )}

      {item.body && (
        <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "32px 34px", marginBottom: 24 }}>
          {item.body.map((para) =>
            para.startsWith("## ") ? (
              <h3 key={para} style={{ font: `700 17px ${SANS}`, color: "#0a1b33", margin: "22px 0 10px" }}>{para.slice(3)}</h3>
            ) : (
              <p key={para} style={{ font: `400 14.5px/1.85 ${SANS}`, color: "#5b6e82", margin: "0 0 14px" }}>{para}</p>
            ),
          )}
        </div>
      )}

      {item.kind === "quiz" && item.questions ? (
        <QuizView item={item} attempt={attempt} onSubmit={(a) => onComplete(item, a)} />
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          {state === "done" ? (
            <>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, font: `700 13px ${SANS}`, color: "#136f6a", background: "rgba(47,196,188,.12)", border: "1px solid rgba(27,143,136,.35)", borderRadius: 999, padding: "10px 18px" }}>
                <Tick /> Completed
              </span>
              <button type="button" onClick={() => onUndo(item)} style={{ cursor: "pointer", border: "none", background: "transparent", font: `600 12.5px ${SANS}`, color: "#8296a9" }}>
                Mark as not complete
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onComplete(item)}
              className="lp-btn-grad"
              style={{ cursor: "pointer", border: "none", background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: `700 14px ${SANS}`, padding: "14px 28px", borderRadius: 999 }}
            >
              Mark complete &amp; continue →
            </button>
          )}
        </div>
      )}
    </>
  );
}

/** Submitting completes the item whatever the score — the score is recorded,
 *  not used as a gate. */
function QuizView({
  item, attempt, onSubmit,
}: {
  item: CourseItem;
  attempt: { score: number; total: number } | null;
  onSubmit: (a: { score: number; total: number }) => void;
}) {
  const questions = item.questions ?? [];
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [shown, setShown] = useState(false);

  const answered = Object.keys(picked).length;
  const score = questions.reduce((n, q, i) => n + (picked[i] === q.answer ? 1 : 0), 0);

  if (attempt && !shown) {
    return (
      <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "32px 34px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, font: `700 13px ${SANS}`, color: "#136f6a", background: "rgba(47,196,188,.12)", border: "1px solid rgba(27,143,136,.35)", borderRadius: 999, padding: "10px 18px", marginBottom: 14 }}>
          <Tick /> Submitted — {attempt.score}/{attempt.total}
        </div>
        <p style={{ font: `400 14px/1.7 ${SANS}`, color: "#5b6e82", margin: "0 0 16px" }}>
          Your score is recorded. You can retake this quiz; the most recent attempt is what the team sees.
        </p>
        <button type="button" onClick={() => { setPicked({}); setShown(true); }} className="lp-btn-outline" style={{ cursor: "pointer", background: "#fff", border: "1.5px solid rgba(10,27,51,.28)", color: "#0a1b33", font: `700 13.5px ${SANS}`, padding: "12px 22px", borderRadius: 999 }}>
          Retake quiz
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "32px 34px" }}>
      {questions.map((q, qi) => (
        <div key={q.q} style={{ marginBottom: 26 }}>
          <div style={{ font: `700 14.5px/1.55 ${SANS}`, color: "#0a1b33", marginBottom: 12 }}>
            {qi + 1}. {q.q}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {q.options.map((opt, oi) => {
              const chosen = picked[qi] === oi;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPicked((p) => ({ ...p, [qi]: oi }))}
                  style={{
                    textAlign: "left", cursor: "pointer", borderRadius: 12, padding: "12px 15px",
                    border: `1.5px solid ${chosen ? "#1b8f88" : "#e3eaf0"}`,
                    background: chosen ? "rgba(47,196,188,.08)" : "#f7fafc",
                    font: `${chosen ? 700 : 500} 13.5px/1.5 ${SANS}`, color: "#0a1b33",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <button
        type="button"
        disabled={answered < questions.length}
        onClick={() => onSubmit({ score, total: questions.length })}
        className="lp-btn-grad"
        style={{
          cursor: answered < questions.length ? "not-allowed" : "pointer", border: "none",
          background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff",
          font: `700 14px ${SANS}`, padding: "14px 28px", borderRadius: 999,
          opacity: answered < questions.length ? 0.5 : 1,
        }}
      >
        Submit &amp; continue →
      </button>
      {answered < questions.length && (
        <div style={{ font: `500 12px ${SANS}`, color: "#8296a9", marginTop: 10 }}>
          Answer all {questions.length} questions to submit.
        </div>
      )}
    </div>
  );
}

function KitBanner({ course }: { course: { readingKit: { title: string; meta: string }[] } }) {
  return (
    <div style={{ background: "linear-gradient(120deg,#0c2a45,#0a1f38)", borderRadius: 20, padding: "28px 32px", marginBottom: 26 }}>
      <div style={{ font: `700 11px ${SANS}`, color: "#7fe3dc", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 8 }}>Course complete</div>
      <div style={{ font: `700 20px ${SANS}`, color: "#fff", marginBottom: 6 }}>Your reading kit is unlocked</div>
      <p style={{ font: `400 13.5px/1.7 ${SANS}`, color: "rgba(255,255,255,.72)", margin: "0 0 18px", maxWidth: 560 }}>
        Every item is finished. These materials are yours to keep.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }} className="site-grid-2">
        {course.readingKit.map((f) => (
          <div key={f.title} style={{ display: "flex", alignItems: "center", gap: 11, background: "rgba(255,255,255,.08)", border: "1px solid rgba(127,227,220,.3)", borderRadius: 12, padding: "12px 14px" }}>
            <span aria-hidden style={{ flex: "none", width: 28, height: 28, borderRadius: 8, background: "rgba(127,227,220,.16)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7fe3dc" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12" /><path d="M7 12l5 5 5-5" /><path d="M4 20h16" /></svg>
            </span>
            <span>
              <span style={{ display: "block", font: `700 12.5px ${SANS}`, color: "#fff" }}>{f.title}</span>
              <span style={{ display: "block", font: `500 11px ${SANS}`, color: "rgba(255,255,255,.6)" }}>{f.meta}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- atoms */

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="site-page-sec" style={{ background: "#f7fafc", padding: "72px 48px", minHeight: "50vh" }}>
    <div style={{ maxWidth: 720, margin: "0 auto" }}>{children}</div>
  </div>
);

const Muted = ({ children }: { children: React.ReactNode }) => (
  <div style={{ font: `500 14px ${SANS}`, color: "#8296a9" }}>{children}</div>
);

const Tick = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flex: "none" }}>
    <circle cx="12" cy="12" r="11" fill="#1b8f88" />
    <path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Dot = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flex: "none" }}>
    <circle cx="12" cy="12" r="10.5" fill="#fff" stroke="#2f7fd6" strokeWidth={2} />
    <circle cx="12" cy="12" r="4" fill="#2f7fd6" />
  </svg>
);

const LockIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#a9b8c6" strokeWidth={2.2} strokeLinecap="round" aria-hidden style={{ flex: "none" }}>
    <rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);
