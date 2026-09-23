"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { contentBySlug, flatItems, totalMinutes, type CourseItem } from "@/lib/lms/courseContent";
import {
  completeItem,
  courseStats,
  currentIndex,
  frontierIndex,
  isShared,
  itemState,
  type ItemState,
  kitReleased,
  passMark,
  type QuizAttempt,
  quizPassed,
  recordQuizAttempt,
  startCourse,
  uncompleteItem,
  type CourseProgress,
} from "@/lib/lms/courseProgress";
import { useSession } from "./useSession";
import { courseBySlug } from "@/lib/lms/courses";
import { moduleGate, useCourseAccess } from "@/lib/lms/access";
import { supabaseConfigured } from "@/lib/lms/supabase";
import { submitEnquiry } from "@/lib/submitEnquiry";

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
  // What the database says this learner may reach: their batch, whether
  // payment is confirmed, and which modules are open. Without Supabase (a
  // local build) the browser-only enrolment stands in and nothing is gated.
  const { access, loading: accessLoading } = useCourseAccess(slug, user?.id ?? null);
  const gate = useMemo(() => moduleGate(access, course?.modules.map((m) => m.id) ?? []), [access, course]);
  const paid = supabaseConfigured ? access?.enrolment.status === "paid" : enrolled;
  const nextSession = access?.next_session
    ? [access.next_session.date_label, access.next_session.time_label].filter(Boolean).join(", ")
    : "";
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  // The item whose material the learner has actually scrolled to the end of.
  // Held as an id rather than a flag, so moving to another item resets the
  // gate by itself instead of through an effect that races the render.
  const [readTo, setReadTo] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const items = useMemo(() => (course ? flatItems(course) : []), [course]);

  // A new item starts at its beginning. Without this the pane keeps the
  // previous item's scroll position, which both drops the learner into the
  // middle of the next reading and hands them its Proceed button unread.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 900px)").matches) {
      window.scrollTo({ top: 0 });
    }
  }, [active]);

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
        // Deliberately stays put. Moving between items is the Next button's
        // job and nothing else's, so a quiz can show its score before the
        // learner leaves it and nobody is carried somewhere they did not ask
        // to go.
      } catch (e) {
        setError((e as Error).message);
      }
    },
    [course, user],
  );

  /**
   * A quiz moves the course on only at 70% or better. A lower score is still
   * written down — it is the team's window on where people struggle — but the
   * item stays open, so the learner retakes it rather than carrying a fail
   * forward.
   */
  const onQuizSubmit = useCallback(
    async (item: CourseItem, attempt: QuizAttempt) => {
      if (!course || !user) return;
      if (quizPassed(attempt)) {
        await onComplete(item, attempt);
        return;
      }
      try {
        setProgress(await recordQuizAttempt(user.id, course, item.id, attempt));
      } catch (e) {
        setError((e as Error).message);
      }
    },
    [course, user, onComplete],
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

  if (supabaseConfigured && accessLoading) return <Shell><Muted>Loading your course…</Muted></Shell>;

  // Content is for people who have paid for it. The check is a courtesy, not a
  // wall: this is a static export, so the item text ships in the bundle either
  // way. Real gating needs signed URLs and content fetched per request. What
  // the database does control is progress, Zoom links and which modules open.
  if (fee > 0 && !paid) {
    const pending = access?.enrolment.status === "pending";
    return (
      <Shell>
        <h1 style={{ font: `700 24px ${SANS}`, color: "#0a1b33", margin: "0 0 10px" }}>{course.title}</h1>
        {pending ? (
          <p style={{ font: `400 14.5px/1.75 ${SANS}`, color: "#5b6e82", maxWidth: 560, margin: "0 0 22px" }}>
            You are enrolled in the {access?.batch.name} batch, and your payment is still to be confirmed. The course opens here as soon as it is.
            {access?.enrolment.payment_link ? " If you have not paid yet, you can use the link below." : ""}
          </p>
        ) : (
          <p style={{ font: `400 14.5px/1.75 ${SANS}`, color: "#5b6e82", maxWidth: 560, margin: "0 0 22px" }}>
            This course is open to enrolled learners. Enrol on the course page, or if the office has enrolled you, enter your enrolment code on My Learning.
          </p>
        )}
        {pending && access?.enrolment.payment_link && (
          <a href={access.enrolment.payment_link} target="_blank" rel="noopener noreferrer" className="lp-btn-grad" style={{ display: "inline-block", marginRight: 10, background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: `700 14px ${SANS}`, padding: "13px 26px", borderRadius: 999 }}>
            Complete payment
          </a>
        )}
        <Link href={`/lms/course/${course.slug}`} className="lp-btn-grad" style={{ display: "inline-block", background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: `700 14px ${SANS}`, padding: "13px 26px", borderRadius: 999 }}>
          Go to the course page
        </Link>
      </Shell>
    );
  }

  if (!ready) return <Shell><Muted>Loading your progress…</Muted></Shell>;

  const item = items[active];
  const state = itemState(items, active, progress, gate);
  const stats = courseStats(course, progress);
  const done = new Set(progress?.completedItems ?? []);
  const kit = kitReleased(course, progress);
  // Where the learner actually stands. The list is freely navigable up to
  // here; one item past it can be previewed; the rest is locked.
  const frontier = frontierIndex(items, progress);
  const isLast = active === items.length - 1;
  const advance = () => setActive((i) => Math.min(i + 1, items.length - 1));
  const attempt = progress?.quizAttempts[item.id] ?? null;
  // A reading hands over its Proceed button once its end has been on screen.
  const unread = item.kind === "reading" && !item.acknowledgement && readTo !== item.id;

  const proceed = () => {
    if (saving) return;
    setSaving(true);
    void onComplete(item).then(() => {
      setSaving(false);
      advance();
    });
  };

  return (
    <div className="lms-player-shell">
      <PlayerTop name={user.name} email={user.email} />
      <div className="lms-player" style={{ display: "grid", gridTemplateColumns: "360px 1fr" }}>
        {/* ---------------------------- CONTENTS ---------------------------- */}
        <aside className={`lms-player-side${menuOpen ? " is-open" : ""}`}>
          <div style={{ padding: "22px 22px 18px", borderBottom: "1px solid #e3eaf0" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <h1 style={{ font: `700 17px/1.35 ${SANS}`, color: "#0a1b33", margin: 0, flex: 1 }}>{course.title}</h1>
              <Link
                href={`/lms/course/${course.slug}`}
                aria-label="Leave the course"
                title="Leave the course"
                style={{ flex: "none", display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 8, color: "#8296a9", font: `400 17px ${SANS}` }}
              >
                ✕
              </Link>
            </div>
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
              const moduleLocked = ["locked", "scheduled"].includes(itemState(items, first, progress, gate));
              const moduleDone = m.items.every((i) => done.has(i.id));
              // Closed for the batch until an admin unlocks it after a session.
              const moduleScheduled = Boolean(gate && !gate.open.has(m.id)) && !moduleDone;
              return (
                <div key={m.id} style={{ padding: "14px 22px 4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <div style={{ font: `700 12.5px/1.4 ${SANS}`, color: moduleLocked ? "#a9b8c6" : "#0a1b33", flex: 1 }}>{m.title}</div>
                    {moduleDone && <Tick />}
                    {moduleLocked && <LockIcon />}
                  </div>
                  {m.summary && <div style={{ font: `500 11.5px/1.5 ${SANS}`, color: "#8296a9", marginBottom: 8 }}>{m.summary}</div>}
                  {moduleScheduled && (
                    <div style={{ font: `600 11px/1.5 ${SANS}`, color: "#1f5fa8", background: "rgba(47,127,214,.08)", border: "1px solid rgba(47,127,214,.22)", borderRadius: 8, padding: "6px 9px", margin: "4px 0 8px" }}>
                      Opens after the next live session{nextSession ? ` · ${nextSession}` : ""}
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {m.items.map((it) => {
                      const idx = items.findIndex((x) => x.id === it.id);
                      const st = itemState(items, idx, progress, gate);
                      const isActive = idx === active;
                      return (
                        <button
                          key={it.id}
                          type="button"
                          disabled={st === "locked" || st === "scheduled"}
                          title={
                            st === "preview" ? "Look ahead — you cannot complete it from here"
                            : st === "scheduled" ? "Opens after the next live session"
                            : undefined
                          }
                          onClick={() => {
                            setActive(idx);
                            setMenuOpen(false);
                          }}
                          className="lms-item-row"
                          style={{
                            display: "flex", alignItems: "flex-start", gap: 11, width: "100%", textAlign: "left",
                            border: "none", borderRadius: 10, padding: "10px 12px",
                            background: isActive ? "#eef4f7" : "transparent",
                            cursor: st === "locked" || st === "scheduled" ? "not-allowed" : "pointer",
                            opacity: st === "locked" || st === "scheduled" ? 0.55 : 1,
                            outline: st === "preview" && isActive ? "1.5px dashed #a9b8c6" : "none",
                            outlineOffset: -2,
                          }}
                        >
                          <span style={{ flex: "none", marginTop: 1 }}>
                            {st === "done" ? <Tick /> : st === "locked" || st === "scheduled" ? <LockIcon /> : st === "preview" ? <PeekIcon /> : <Dot />}
                          </span>
                          <span style={{ flex: 1 }}>
                            <span style={{ display: "block", font: `${isActive ? 700 : 600} 13px/1.4 ${SANS}`, color: st === "locked" || st === "scheduled" ? "#8296a9" : "#0a1b33" }}>
                              {it.title}
                            </span>
                            <span style={{ display: "block", font: `500 11px ${SANS}`, color: "#8296a9", marginTop: 3 }}>
                              {itemMeta(it)}{st === "preview" ? " · look ahead" : ""}
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
        <main style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
          <div className="lms-player-scroll" ref={scrollRef}>
          <div className="lms-player-col">
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
            nextSession={nextSession}
            attempt={attempt}
            onComplete={onComplete}
            onQuizSubmit={onQuizSubmit}
            onReachEnd={setReadTo}
          />
          </div>
          </div>

          {/* The one control that moves the course forward. Everything the
              learner has already passed is reachable from the list on the
              left; going further than they have been is this button. */}
          <div className="lms-player-foot">
            {state === "scheduled" ? (
              <span style={{ font: `600 12.5px/1.5 ${SANS}`, color: "#8296a9" }}>
                This module opens after the next live session{nextSession ? ` (${nextSession})` : ""}.
              </span>
            ) : state === "preview" ? (
              <>
                <span style={{ font: `500 12.5px/1.5 ${SANS}`, color: "#8296a9" }}>
                  You are looking ahead. Finish “{items[frontier]?.title}” to continue from here.
                </span>
                <button type="button" onClick={() => setActive(frontier)} className="lp-btn-outline" style={FOOT_GHOST}>
                  Back to where you were →
                </button>
              </>
            ) : state === "done" ? (
              <>
                <button type="button" onClick={() => onUndo(item)} style={{ cursor: "pointer", border: "none", background: "transparent", font: `600 12.5px ${SANS}`, color: "#8296a9" }}>
                  Mark as not complete
                </button>
                <button type="button" onClick={advance} disabled={isLast} className="lp-btn-grad" style={{ ...FOOT_PRIMARY, opacity: isLast ? 0.45 : 1, cursor: isLast ? "default" : "pointer" }}>
                  {isLast ? "Course complete" : "Proceed to next lesson →"}
                </button>
              </>
            ) : item.acknowledgement ? (
              <span style={{ font: `600 12.5px ${SANS}`, color: "#8296a9" }}>Sign the acknowledgement above to continue.</span>
            ) : item.kind === "quiz" ? (
              <span style={{ font: `600 12.5px ${SANS}`, color: "#8296a9" }}>
                {attempt
                  ? `Score ${passMark(attempt.total)} of ${attempt.total} or better to continue — retake the quiz above.`
                  : "Submit the quiz to continue."}
              </span>
            ) : unread ? (
              /* The button is withheld, not disabled: a reading is finished by
                 reading it, and a greyed-out control invites clicking at it. */
              <span style={{ font: `600 12.5px ${SANS}`, color: "#8296a9" }}>
                Read to the end of this page to continue.
              </span>
            ) : (
              <button
                type="button"
                onClick={proceed}
                disabled={saving}
                className="lp-btn-grad"
                style={{ ...FOOT_PRIMARY, cursor: saving ? "wait" : "pointer", opacity: saving ? 0.8 : 1, display: "inline-flex", alignItems: "center", gap: 9 }}
              >
                {saving && <Spinner />}
                {saving ? "Saving your progress…" : "Proceed to next lesson →"}
              </button>
            )}
          </div>
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

/** Content measured in pages or questions carries its own wording. */
const itemMeta = (it: CourseItem) => it.meta ?? `${KIND_LABEL[it.kind]} · ${it.minutes} min`;

function ItemView({
  item, state, nextSession, attempt, onComplete, onQuizSubmit, onReachEnd,
}: {
  item: CourseItem;
  state: ItemState;
  nextSession: string;
  attempt: QuizAttempt | null;
  onComplete: (item: CourseItem, attempt?: QuizAttempt) => void;
  onQuizSubmit: (item: CourseItem, attempt: QuizAttempt) => void;
  onReachEnd: (itemId: string) => void;
}) {
  if (state === "scheduled") {
    return (
      <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "48px 40px", textAlign: "center" }}>
        <LockIcon size={30} />
        <h2 style={{ font: `700 20px ${SANS}`, color: "#0a1b33", margin: "14px 0 8px" }}>Wait for the next live session</h2>
        <p style={{ font: `400 14px/1.7 ${SANS}`, color: "#5b6e82", margin: 0 }}>
          “{item.title}” is part of a module your facilitator opens after the live session that covers it.
          {nextSession ? ` The next session is ${nextSession}.` : ""} Your Zoom link is under Live sessions.
        </p>
      </div>
    );
  }

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
      {state === "preview" && (
        <div style={{ font: `600 12px/1.6 ${SANS}`, color: "#5b6e82", background: "#eef2f6", border: "1px dashed #c4d2de", borderRadius: 12, padding: "10px 14px", marginBottom: 18 }}>
          A look ahead at what is coming — read it now if you like. It counts once you reach it.
        </div>
      )}

      <div style={{ font: `700 11px ${SANS}`, color: "#1b8f88", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 10 }}>
        {itemMeta(item)}
      </div>
      <h2 style={{ font: `700 clamp(24px,2.6vw,32px)/1.2 ${SANS}`, color: "#0a1b33", margin: "0 0 24px", letterSpacing: "-.02em" }}>{item.title}</h2>

      {item.kind === "video" && (
        <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: 16, overflow: "hidden", background: "#0a1b33", marginBottom: 26 }}>
          {item.videoId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${item.videoId}`}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
            />
          ) : (
            /* Course footage is not hosted yet. A placeholder that says so
               beats an empty frame the learner reads as broken. */
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: "rgba(255,255,255,.72)" }}>
              <div aria-hidden style={{ width: 62, height: 62, borderRadius: "50%", background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)", display: "flex", alignItems: "center", justifyContent: "center", font: `400 22px ${SANS}`, color: "#fff", paddingLeft: 4 }}>▶</div>
              <div style={{ font: `600 12.5px ${SANS}` }}>Video is not published yet</div>
            </div>
          )}
        </div>
      )}

      {item.body && (
        <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "32px 34px", marginBottom: 24 }}>
          {item.body.map((para, i) => <Para key={i} text={para} />)}
        </div>
      )}

      {item.acknowledgement && state !== "preview" && (
        <Acknowledgement
          statement={item.acknowledgement.statement}
          item={item}
          signed={state === "done"}
          onSign={onComplete}
        />
      )}

      {/* Completing and moving on live in the footer bar, so the reading
          column ends with the material rather than with controls. */}
      {item.kind === "quiz" && item.questions && (
        state === "preview" ? (
          <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "28px 32px" }}>
            <div style={{ font: `700 15px ${SANS}`, color: "#0a1b33", marginBottom: 8 }}>
              {item.questions.length} questions
            </div>
            <p style={{ font: `400 14px/1.7 ${SANS}`, color: "#5b6e82", margin: 0 }}>
              The questions open once you reach this item. You need {passMark(item.questions.length)} of {item.questions.length} right — 70% — to move on, and you can retake the quiz as often as you need.
            </p>
          </div>
        ) : (
          <QuizView item={item} attempt={attempt} onSubmit={(a) => onQuizSubmit(item, a)} />
        )
      )}

      {state === "done" && item.kind !== "quiz" && (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, font: `700 13px ${SANS}`, color: "#136f6a", background: "rgba(47,196,188,.12)", border: "1px solid rgba(27,143,136,.35)", borderRadius: 999, padding: "10px 18px" }}>
          <Tick /> Completed
        </span>
      )}

      <EndMarker id={item.id} onSee={onReachEnd} />
    </>
  );
}

/**
 * Reports when the end of the item's material has been on screen — what the
 * Proceed button waits for on a reading.
 *
 * An observer rather than a scroll listener, because the reading column
 * scrolls inside its own pane on desktop and with the window below 900px; the
 * observer reports what the learner can see and cannot tell the difference.
 * Material short enough to need no scrolling passes immediately, which is
 * right: there was nothing left to read.
 */
function EndMarker({ id, onSee }: { id: string; onSee: (itemId: string) => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      onSee(id);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        onSee(id);
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [id, onSee]);
  return <div ref={ref} aria-hidden style={{ height: 1 }} />;
}

/** 70% carries the item. Anything less is recorded and handed back with a
 *  Retake — the score is a gate, and the learner can always try again. */
function QuizView({
  item, attempt, onSubmit,
}: {
  item: CourseItem;
  attempt: QuizAttempt | null;
  onSubmit: (a: QuizAttempt) => void;
}) {
  const questions = item.questions ?? [];
  const [picked, setPicked] = useState<Record<number, number>>({});
  const [shown, setShown] = useState(false);

  const answered = Object.keys(picked).length;
  const score = questions.reduce((n, q, i) => n + (picked[i] === q.answer ? 1 : 0), 0);

  if (attempt && !shown) {
    const passed = quizPassed(attempt);
    const need = passMark(attempt.total);
    return (
      <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "32px 34px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, font: `700 13px ${SANS}`,
          color: passed ? "#136f6a" : "#a53f28",
          background: passed ? "rgba(47,196,188,.12)" : "rgba(226,86,74,.08)",
          border: `1px solid ${passed ? "rgba(27,143,136,.35)" : "rgba(226,86,74,.28)"}`,
          borderRadius: 999, padding: "10px 18px", marginBottom: 14,
        }}>
          {passed ? <><Tick /> Passed — {attempt.score}/{attempt.total}</> : <>Not passed — {attempt.score}/{attempt.total}</>}
        </div>
        <p style={{ font: `400 14px/1.7 ${SANS}`, color: "#5b6e82", margin: "0 0 16px" }}>
          {passed
            ? `You needed ${need} of ${attempt.total} and you have it. Your score is recorded; you can retake the quiz, and the most recent attempt is what the team sees.`
            : `The pass mark is ${need} of ${attempt.total} — 70%. Your attempt is recorded either way. Go back over the material and retake the quiz to carry on.`}
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
        Submit answers
      </button>
      <div style={{ font: `500 12px ${SANS}`, color: "#8296a9", marginTop: 10 }}>
        {answered < questions.length
          ? `Answer all ${questions.length} questions to submit.`
          : `You need ${passMark(questions.length)} of ${questions.length} right — 70% — to pass.`}
      </div>
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

/**
 * One line of course text. Supports "## " for a heading, "- " for a bullet,
 * and **bold** inside either — enough to lay out a handout without pulling in
 * a markdown renderer for six characters of syntax.
 */
function Para({ text }: { text: string }) {
  if (text.startsWith("## "))
    return <h3 style={{ font: `700 17px ${SANS}`, color: "#0a1b33", margin: "26px 0 12px" }}>{bold(text.slice(3))}</h3>;

  if (text.startsWith("- "))
    return (
      <div style={{ display: "flex", gap: 11, margin: "0 0 9px" }}>
        <span aria-hidden style={{ flex: "none", width: 5, height: 5, borderRadius: "50%", background: "#2fc4bc", marginTop: 9 }} />
        <span style={{ font: `400 14.5px/1.75 ${SANS}`, color: "#5b6e82" }}>{bold(text.slice(2))}</span>
      </div>
    );

  return <p style={{ font: `400 14.5px/1.85 ${SANS}`, color: "#5b6e82", margin: "0 0 14px" }}>{bold(text)}</p>;
}

/**
 * Inline emphasis: **bold** and *italic*.
 *
 * The bold-only version printed the asterisks around *Trainer pause:* rather
 * than styling it, which is worse than having no syntax at all — the reader
 * ends up seeing the markup instead of the emphasis.
 */
function bold(text: string) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} style={{ color: "#0a1b33", fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2)
      return <em key={i} style={{ color: "#3d5064" }}>{part.slice(1, -1)}</em>;
    return part;
  });
}

/**
 * A signed acknowledgement.
 *
 * Some material has to be agreed to rather than merely read — the learning-room
 * agreement is the example. The learner types their name, ticks the box and
 * signs; the name, the moment and the item are recorded, and only then does the
 * item complete. The footer refuses to advance until it is done, so nobody can
 * click past an agreement they have not made.
 *
 * The record goes out through the same EmailJS path as every other form on the
 * site, so there is one integration to keep working rather than two. Completion
 * is not held hostage to that send: a learner who has signed has signed, and a
 * mail outage is not their problem.
 */
function Acknowledgement({
  statement,
  item,
  signed,
  onSign,
}: {
  statement: string;
  item: CourseItem;
  signed: boolean;
  onSign: (item: CourseItem) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [at, setAt] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy || !name.trim() || !agreed) return;
    setBusy(true);
    const when = new Date();
    await submitEnquiry(e.currentTarget, {
      intent: `Acknowledgement — ${item.title}`,
      source: typeof window !== "undefined" ? window.location.pathname : "",
    }, { store: false });
    setAt(when.toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" }));
    setBusy(false);
    onSign(item);
  };

  if (signed) {
    return (
      <div style={{ background: "rgba(47,196,188,.09)", border: "1px solid rgba(27,143,136,.3)", borderRadius: 18, padding: "24px 26px", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Tick />
          <span style={{ font: `700 14.5px ${SANS}`, color: "#136f6a" }}>Acknowledgement signed</span>
        </div>
        <div style={{ font: `500 13px/1.7 ${SANS}`, color: "#3d5064" }}>
          {at ? `Signed ${at}.` : "Recorded against your account."}
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      style={{ background: "#fff", border: "1.5px solid #2fc4bc", borderRadius: 18, padding: "26px 28px", marginBottom: 24 }}
    >
      <div style={{ font: `700 11px ${SANS}`, color: "#1b8f88", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 12 }}>
        Participant acknowledgement
      </div>
      <p style={{ font: `400 14px/1.8 ${SANS}`, color: "#5b6e82", margin: "0 0 20px" }}>{statement}</p>

      {/* Honeypot — a checkbox, because autofill fills hidden text inputs. */}
      <label style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
        Leave this box unchecked
        <input type="checkbox" name="hp_zx" tabIndex={-1} autoComplete="off" />
      </label>

      <label style={{ display: "block", font: `700 11.5px ${SANS}`, color: "#0a1b33", marginBottom: 7 }}>
        Full name
        <input
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          placeholder="Type your full name"
          style={{ display: "block", width: "100%", marginTop: 7, background: "#f7fafc", border: "1px solid #e3eaf0", borderRadius: 11, padding: "13px 15px", font: `500 14px ${SANS}`, color: "#0a1b33", outline: "none" }}
        />
      </label>

      <label style={{ display: "flex", gap: 11, alignItems: "flex-start", margin: "16px 0 20px", cursor: "pointer" }}>
        <input
          type="checkbox"
          name="agreed"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          style={{ marginTop: 3, width: 17, height: 17, accentColor: "#1b8f88", flex: "none", cursor: "pointer" }}
        />
        <span style={{ font: `500 13.5px/1.65 ${SANS}`, color: "#3d5064" }}>
          I have read and understood the above, and I agree to it.
        </span>
      </label>

      <button
        type="submit"
        disabled={busy || !name.trim() || !agreed}
        className="lp-btn-grad"
        style={{
          cursor: busy || !name.trim() || !agreed ? "not-allowed" : "pointer",
          border: "none",
          background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)",
          color: "#fff",
          font: `700 14px ${SANS}`,
          padding: "13px 26px",
          borderRadius: 999,
          opacity: busy || !name.trim() || !agreed ? 0.5 : 1,
        }}
      >
        {busy ? "Signing…" : "Sign and continue →"}
      </button>
      <div style={{ font: `500 11.5px ${SANS}`, color: "#8296a9", marginTop: 11 }}>
        Your name and the date and time are recorded with your acknowledgement.
      </div>
    </form>
  );
}

/* ------------------------------------------------------------- top bar */

/**
 * The player replaces the site chrome entirely, so this is the only thing on
 * screen that says whose site this is and who is signed in. Deliberately thin:
 * it carries identity and a way home, and nothing that invites the learner to
 * wander off mid-item.
 */
function PlayerTop({ name, email }: { name: string; email: string }) {
  const initials =
    name.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";
  return (
    <header className="lms-player-top">
      <Link href="/" aria-label="Levitate PeopleSoft home" style={{ display: "flex", alignItems: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo.png" alt="Levitate PeopleSoft" style={{ height: 34, display: "block" }} />
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <div className="lms-player-who" style={{ textAlign: "right" }}>
          <div style={{ font: `700 12.5px ${SANS}`, color: "#0a1b33" }}>{name}</div>
          <div style={{ font: `500 11px ${SANS}`, color: "#8296a9" }}>{email}</div>
        </div>
        <div
          aria-hidden
          title={name}
          style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)", color: "#fff", font: `700 13px ${SANS}`, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}

/* ----------------------------------------------------------------- atoms */

const FOOT_PRIMARY: React.CSSProperties = {
  cursor: "pointer",
  border: "none",
  background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)",
  color: "#fff",
  font: `700 13.5px ${SANS}`,
  padding: "13px 26px",
  borderRadius: 999,
  whiteSpace: "nowrap",
};

const FOOT_GHOST: React.CSSProperties = {
  cursor: "pointer",
  background: "#fff",
  border: "1.5px solid rgba(10,27,51,.24)",
  color: "#0a1b33",
  font: `700 13px ${SANS}`,
  padding: "12px 22px",
  borderRadius: 999,
  whiteSpace: "nowrap",
};

/** Shown while the item's completion is on its way to the database, so the
 *  wait after Proceed reads as work rather than a dead button. */
const Spinner = () => (
  <span
    aria-hidden
    style={{
      flex: "none", width: 15, height: 15, borderRadius: "50%",
      border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#fff",
      animation: "spinSlow .7s linear infinite",
    }}
  />
);

/** An item that can be read ahead of turn but not completed from there. */
const PeekIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flex: "none" }}>
    <circle cx="12" cy="12" r="10.5" fill="#fff" stroke="#a9b8c6" strokeWidth={2} strokeDasharray="3.4 3" />
  </svg>
);

// The player takes over the window, so these interstitials carry the only way
// back out — there is no site header above them.
const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="site-page-sec" style={{ background: "#f7fafc", padding: "48px 48px 72px", minHeight: "100dvh" }}>
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <Link href="/lms/" style={{ display: "inline-block", font: `600 12px ${SANS}`, color: "#1b8f88", marginBottom: 28 }}>
        ← Levitate Learning
      </Link>
      {children}
    </div>
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
