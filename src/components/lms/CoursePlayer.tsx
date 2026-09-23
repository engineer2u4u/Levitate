"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { contentBySlug, flatItems, totalMinutes, type CourseContent, type CourseItem } from "@/lib/lms/courseContent";
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
  startCourse,
  uncompleteItem,
  type CourseProgress,
} from "@/lib/lms/courseProgress";
import { useSession } from "./useSession";
import { courseBySlug } from "@/lib/lms/courses";
import { moduleGate, useCourseAccess } from "@/lib/lms/access";
import { supabaseConfigured } from "@/lib/lms/supabase";
import { submitEnquiry } from "@/lib/submitEnquiry";
import { zipFiles } from "@/lib/lms/zip";
import { fileStem } from "@/lib/lms/certificateExport";
import CourseCertificates from "./CourseCertificates";

const SANS = "'Plus Jakarta Sans',sans-serif";

/**
 * How much of a film counts as watched. Playback, not attention: a video
 * left running in another tab reaches the end like any other. It is a floor
 * under skipping for the visit, nothing that is kept or reported.
 */
const WATCHED_ENOUGH = 0.9;

/** "Sep 2026" — how a certificate dates itself. */
const monthYear = (iso: string | number) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });

// Read once when the module loads rather than during a render, which must
// stay pure. A page left open across midnight is not worth more than that.
const TODAY = monthYear(Date.now());

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
  // How far each film on this screen has played. Deliberately nowhere else:
  // watching is not progress to be kept, only a gate for the visit, so a
  // reload starts the film again.
  const [watched, setWatched] = useState<Record<string, number>>({});
  // The quiz just sat, kept only so the verdict and the footer agree. Never
  // written down: a score is not a record here, only a gate.
  const [attempt, setAttempt] = useState<{ id: string; sat: QuizAttempt } | null>(null);
  // Films that cannot play at all — a broken or blocked video must not hold
  // the learner behind a gate that can never open.
  const [unplayable, setUnplayable] = useState<string[]>([]);
  // The last page: the reading kit and the certificates, reached by finishing
  // the course or from the rail once it is unlocked.
  const [onKit, setOnKit] = useState(false);

  const items = useMemo(() => (course ? flatItems(course) : []), [course]);

  // A new item starts at its beginning. Without this the pane keeps the
  // previous item's scroll position, which both drops the learner into the
  // middle of the next reading and hands them its Proceed button unread.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 900px)").matches) {
      window.scrollTo({ top: 0 });
    }
  }, [active, onKit]);

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
    async (item: CourseItem) => {
      if (!course || !user) return;
      try {
        const next = await completeItem(user.id, course, item.id);
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
   * A quiz moves the course on at 70% or better, and nothing else is kept: a
   * pass completes the item like any other, a fail leaves it open. The score
   * itself lives here, dying with the page, so coming back is a fresh quiz
   * rather than an old mark against someone's name.
   */
  const onQuizSubmit = useCallback(
    async (item: CourseItem, sat: QuizAttempt) => {
      if (!course || !user) return;
      setAttempt({ id: item.id, sat });
      if (quizPassed(sat)) await onComplete(item);
    },
    [course, user, onComplete],
  );

  /**
   * Playback position, once a second while a film runs. The furthest point
   * reached is kept for the visit — so moving between items and back does not
   * demand a rewatch — and goes no further than this component.
   */
  const onVideoProgress = useCallback((itemId: string, fraction: number) => {
    setWatched((w) => (fraction > (w[itemId] ?? 0) ? { ...w, [itemId]: fraction } : w));
  }, []);

  const onVideoUnavailable = useCallback((itemId: string) => {
    setUnplayable((list) => (list.includes(itemId) ? list : [...list, itemId]));
  }, []);

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
  const sat = attempt && attempt.id === item.id ? attempt.sat : null;
  // What the certificates are dated: the day the course was finished, or
  // today while the last item is being finished.
  const completedOn = progress?.completedAt ? monthYear(progress.completedAt) : TODAY;
  // A reading hands over its Proceed button once its end has been on screen.
  const unread = item.kind === "reading" && !item.acknowledgement && readTo !== item.id;
  // A film hands it over once 90% of it has played.
  const played = watched[item.id] ?? 0;
  const unwatched =
    Boolean(item.videoId) &&
    !item.watchOptional &&
    !unplayable.includes(item.id) &&
    played < WATCHED_ENOUGH;

  const proceed = () => {
    if (saving) return;
    setSaving(true);
    void onComplete(item).then(() => {
      setSaving(false);
      // Nothing follows the last item but the kit, so that is where finishing
      // the course goes.
      if (isLast) setOnKit(true);
      else advance();
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
                            setOnKit(false);
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
              <button
                type="button"
                disabled={!kit}
                onClick={() => {
                  setOnKit(true);
                  setMenuOpen(false);
                }}
                className="lms-item-row"
                style={{
                  display: "block", width: "100%", textAlign: "left", border: "none",
                  borderRadius: 10, padding: 12, marginTop: 6,
                  background: onKit ? "#eef4f7" : "transparent",
                  cursor: kit ? "pointer" : "not-allowed",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ font: `${onKit ? 800 : 700} 12.5px ${SANS}`, color: kit ? "#0a1b33" : "#a9b8c6", flex: 1 }}>Reading kit</span>
                  {kit ? <Tick /> : <LockIcon />}
                </span>
                <span style={{ display: "block", font: `500 11.5px/1.5 ${SANS}`, color: "#8296a9", marginTop: 4 }}>
                  {kit ? "Released — yours to keep" : "Unlocks when the course is complete"}
                </span>
              </button>
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

          {onKit ? (
            <KitPage
              course={course}
              slug={slug}
              who={{ id: user.id, name: user.name, email: user.email, org: user.org }}
              completedOn={completedOn}
            />
          ) : (
          <ItemView
            item={item}
            state={state}
            nextSession={nextSession}
            sat={sat}
            who={{ id: user.id, name: user.name, email: user.email, org: user.org }}
            onComplete={onComplete}
            onQuizSubmit={onQuizSubmit}
            onReachEnd={setReadTo}
            onVideoProgress={onVideoProgress}
            onVideoUnavailable={onVideoUnavailable}
          />
          )}
          </div>
          </div>

          {/* The one control that moves the course forward. Everything the
              learner has already passed is reachable from the list on the
              left; going further than they have been is this button. */}
          <div className="lms-player-foot">
            {onKit ? (
              <>
                <span style={{ font: `600 12.5px ${SANS}`, color: "#8296a9", marginRight: "auto" }}>
                  Course complete. These are yours to keep.
                </span>
                <button type="button" onClick={() => setOnKit(false)} className="lp-btn-outline" style={FOOT_GHOST}>
                  Back to the course
                </button>
                <Link href="/lms/" className="lp-btn-grad" style={{ ...FOOT_PRIMARY, display: "inline-block", textDecoration: "none" }}>
                  My Learning →
                </Link>
              </>
            ) : state === "scheduled" ? (
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
            ) : item.feedback ? (
              <span style={{ font: `600 12.5px ${SANS}`, color: "#8296a9" }}>Submit your feedback above to continue.</span>
            ) : item.acknowledgement ? (
              <span style={{ font: `600 12.5px ${SANS}`, color: "#8296a9" }}>Sign the acknowledgement above to continue.</span>
            ) : item.kind === "quiz" ? (
              <span style={{ font: `600 12.5px ${SANS}`, color: "#8296a9" }}>
                {sat
                  ? `Score ${passMark(sat.total)} of ${sat.total} or better to continue — retake the quiz above.`
                  : "Submit the quiz to continue."}
              </span>
            ) : unwatched ? (
              <span style={{ font: `600 12.5px ${SANS}`, color: "#8296a9" }}>
                Watch the film to continue — {Math.round(played * 100)}% watched.
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
                {/* Nothing follows the last item, so the button names what it
                    actually does rather than pointing at a next lesson. */}
                {saving ? "Saving your progress…" : isLast ? "Finish course" : "Proceed to next lesson →"}
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
  item, state, nextSession, sat, who, onComplete, onQuizSubmit, onReachEnd, onVideoProgress, onVideoUnavailable,
}: {
  item: CourseItem;
  state: ItemState;
  who: { id: string; name: string; email: string; org: string };
  nextSession: string;
  /** The quiz just sat on this visit, if any. Nothing stored. */
  sat: QuizAttempt | null;
  onComplete: (item: CourseItem) => void;
  onQuizSubmit: (item: CourseItem, attempt: QuizAttempt) => Promise<void>;
  onReachEnd: (itemId: string) => void;
  onVideoProgress: (itemId: string, fraction: number) => void;
  onVideoUnavailable: (itemId: string) => void;
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

      {/* A film, whether the item is one or merely carries one: a reading with
          a videoId shows it above the text it belongs to. */}
      {(item.kind === "video" || item.videoId) && (
        <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: 16, overflow: "hidden", background: "#0a1b33", marginBottom: 26 }}>
          {item.videoId && state === "preview" ? (
            /* Looking ahead is for seeing what is coming, not for watching it
               early — and a film played here would count towards nothing. */
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: 24, textAlign: "center", color: "rgba(255,255,255,.72)" }}>
              <LockIcon size={26} />
              <div style={{ font: `700 13px ${SANS}`, color: "#fff" }}>
                The film opens when you complete the previous session
              </div>
            </div>
          ) : item.videoId ? (
            <FilmFrame
              key={item.id}
              itemId={item.id}
              videoId={item.videoId}
              title={item.title}
              bare={item.videoBare === true}
              onProgress={onVideoProgress}
              onUnavailable={onVideoUnavailable}
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
        <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "clamp(28px,3vw,40px) clamp(24px,3vw,44px)", marginBottom: 24 }}>
          {/* Capped for line length: the pane is as wide as the window, and
              prose set across all of it is tiring to read back across. */}
          <div style={{ maxWidth: 760 }}>
            {item.checklist
              ? <Checklist key={item.id} item={item} userId={who.id} />
              : item.body.map((para, i) => <Para key={i} text={para} />)}
          </div>
        </div>
      )}

      {item.feedback && state !== "preview" && (
        <FeedbackForm item={item} who={who} sent={state === "done"} onSent={onComplete} />
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
              The questions open once you reach this item. You need {passMark(item.questions.length)} of {item.questions.length} right to move on — 70%, to the nearest whole question — and you can retake the quiz as often as you need.
            </p>
          </div>
        ) : state === "done" && !sat ? (
          <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "32px 34px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, font: `700 13px ${SANS}`, color: "#136f6a", background: "rgba(47,196,188,.12)", border: "1px solid rgba(27,143,136,.35)", borderRadius: 999, padding: "10px 18px", marginBottom: 14 }}>
              <Tick /> Passed
            </div>
            <p style={{ font: `400 14px/1.7 ${SANS}`, color: "#5b6e82", margin: 0 }}>
              You passed this quiz, so it is complete. The score itself is not kept.
            </p>
          </div>
        ) : (
          <QuizView item={item} attempt={sat} settled={state === "done"} onSubmit={(a) => onQuizSubmit(item, a)} />
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

/* ------------------------------------------------------------------ film */

type YTPlayer = { getCurrentTime: () => number; getDuration: () => number; destroy?: () => void };
type YTNamespace = {
  Player: new (el: HTMLElement, opts: Record<string, unknown>) => YTPlayer;
  PlayerState: { ENDED: number };
};

let ytApi: Promise<YTNamespace> | null = null;

/**
 * YouTube's iframe API, loaded once for the page.
 *
 * A plain embed cannot be asked how far it has played; this one can, which is
 * what lets a film hold the Proceed button. The player itself still runs on
 * youtube-nocookie.com — only the API script has to come from youtube.com.
 */
function loadYouTubeApi(): Promise<YTNamespace> {
  ytApi ??= new Promise<YTNamespace>((resolve, reject) => {
    const w = window as unknown as { YT?: YTNamespace; onYouTubeIframeAPIReady?: () => void };
    if (w.YT?.Player) return resolve(w.YT);
    const previous = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (w.YT?.Player) resolve(w.YT);
      else reject(new Error("The video player did not load."));
    };
    const el = document.createElement("script");
    el.src = "https://www.youtube.com/iframe_api";
    el.onerror = () => reject(new Error("The video player could not be loaded."));
    document.head.appendChild(el);
  });
  return ytApi;
}

/**
 * A film that reports how much of itself has been played.
 *
 * The player is mounted into a node this component makes rather than one React
 * renders, because YouTube replaces the element it is given with its own
 * iframe — React must not be reconciling a node that is no longer there.
 *
 * If the API or the video will not load, it says so and reports the film
 * unplayable: a video that can never report progress must not be allowed to
 * trap a learner behind a gate it cannot open.
 */
function FilmFrame({
  itemId, videoId, title, bare, onProgress, onUnavailable,
}: {
  itemId: string;
  videoId: string;
  title: string;
  bare: boolean;
  onProgress: (itemId: string, fraction: number) => void;
  onUnavailable: (itemId: string) => void;
}) {
  const holder = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = holder.current;
    if (!host) return;
    let cancelled = false;
    let player: YTPlayer | null = null;
    let timer: number | undefined;
    // Which seconds of the film have actually been on. Counting seconds
    // covered rather than the furthest point reached is what lets the learner
    // seek freely without seeking past the requirement: dragging to the end
    // marks one second, not the film.
    const seen = new Set<number>();
    let last = -1;
    const mount = document.createElement("div");
    mount.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
    host.appendChild(mount);

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled) return;
        player = new YT.Player(mount, {
          videoId,
          host: "https://www.youtube-nocookie.com",
          width: "100%",
          height: "100%",
          playerVars: {
            controls: bare ? 0 : 1,
            modestbranding: 1,
            rel: 0,
            iv_load_policy: 3,
            playsinline: 1,
          },
          events: {
            onReady: () => {
              timer = window.setInterval(() => {
                if (!player) return;
                const length = player.getDuration();
                if (length <= 0) return;
                const now = Math.floor(player.getCurrentTime());
                // Everything between the last tick and this one counts, so
                // playing at double speed is not penalised; a jump bigger than
                // a tick could reasonably cover is a seek, and credits only
                // the second landed on.
                const step = now - last;
                if (last >= 0 && step > 0 && step <= 4) {
                  for (let t = last + 1; t <= now; t += 1) seen.add(t);
                } else {
                  seen.add(now);
                }
                last = now;
                onProgress(itemId, seen.size / Math.ceil(length));
              }, 1000);
            },
            onError: () => onUnavailable(itemId),
          },
        });
      })
      .catch(() => {
        if (cancelled) return;
        setFailed(true);
        onUnavailable(itemId);
      });

    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
      try {
        player?.destroy?.();
      } catch {
        /* already gone with the iframe */
      }
      host.replaceChildren();
    };
  }, [itemId, videoId, bare, onProgress, onUnavailable]);

  return (
    <div ref={holder} style={{ position: "absolute", inset: 0 }}>
      {failed && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: 24, textAlign: "center", color: "rgba(255,255,255,.72)" }}>
          <div style={{ font: `700 13px ${SANS}`, color: "#fff" }}>The film could not be loaded</div>
          <div style={{ font: `500 12px/1.6 ${SANS}`, maxWidth: 420 }}>
            Watch “{title}” on YouTube if you can — it is not holding you here.
          </div>
        </div>
      )}
    </div>
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
  item, attempt, settled, onSubmit,
}: {
  item: CourseItem;
  /** The attempt just made, from the player's own state. Never stored. */
  attempt: QuizAttempt | null;
  /** The item is already complete, so the result is final — no retake. */
  settled: boolean;
  onSubmit: (a: QuizAttempt) => Promise<void> | void;
}) {
  const questions = item.questions ?? [];
  const [picked, setPicked] = useState<Record<number, number>>({});
  // Which question is on screen: the quiz is asked one at a time.
  const [at, setAt] = useState(0);
  const [shown, setShown] = useState(false);
  const [marking, setMarking] = useState(false);

  const answered = Object.keys(picked).length;
  const score = questions.reduce((n, q, i) => n + (picked[i] === q.answer ? 1 : 0), 0);

  const verdict = attempt;
  if (verdict && !shown) {
    const passed = quizPassed(verdict);
    const need = passMark(verdict.total);
    const percent = verdict.total > 0 ? Math.round((verdict.score / verdict.total) * 100) : 0;
    const ink = passed ? "#136f6a" : "#a53f28";
    return (
      <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 24, padding: "clamp(32px,4vw,56px) clamp(28px,4vw,60px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(20px,3vw,40px)", flexWrap: "wrap" }}>
          {/* The score is the answer to the only question the learner has,
              so it is the biggest thing on the page rather than a footnote. */}
          <div style={{
            flex: "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            minWidth: 168, padding: "24px 30px", borderRadius: 20,
            background: passed ? "rgba(47,196,188,.1)" : "rgba(226,86,74,.07)",
            border: `2px solid ${passed ? "rgba(27,143,136,.32)" : "rgba(226,86,74,.26)"}`,
          }}>
            <div style={{ font: `800 clamp(38px,5vw,52px)/1 ${SANS}`, color: ink, letterSpacing: "-.02em" }}>
              {verdict.score}<span style={{ font: `700 24px ${SANS}`, color: passed ? "rgba(19,111,106,.55)" : "rgba(165,63,40,.55)" }}>/{verdict.total}</span>
            </div>
            <div style={{ font: `700 13px ${SANS}`, color: ink, marginTop: 8 }}>{percent}%</div>
          </div>

          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, font: `800 14px ${SANS}`, color: ink,
              background: passed ? "rgba(47,196,188,.12)" : "rgba(226,86,74,.08)",
              border: `1px solid ${passed ? "rgba(27,143,136,.35)" : "rgba(226,86,74,.28)"}`,
              borderRadius: 999, padding: "10px 20px", marginBottom: 14,
            }}>
              {passed ? <><Tick /> Passed</> : <>Not passed</>}
            </div>
            <h3 style={{ font: `700 clamp(20px,2.2vw,26px)/1.3 ${SANS}`, color: "#0a1b33", margin: "0 0 10px", letterSpacing: "-.01em" }}>
              {passed ? "You have the pass mark." : `You need ${need} of ${verdict.total} to pass.`}
            </h3>
            <p style={{ font: `400 15px/1.75 ${SANS}`, color: "#5b6e82", margin: "0 0 22px", maxWidth: 560 }}>
              {passed
                ? `The pass mark was ${need} of ${verdict.total}, and this item is now complete. The score is not kept — it is the pass that counts.`
                : `The pass mark is 70% of the questions, to the nearest whole question. Nothing is recorded either way. Go back over the material and retake the quiz to carry on.`}
            </p>
            {!settled && (
              <button
                type="button"
                onClick={() => { setPicked({}); setAt(0); setShown(true); }}
                className="lp-btn-outline"
                style={{ cursor: "pointer", background: "#fff", border: "1.5px solid rgba(10,27,51,.28)", color: "#0a1b33", font: `700 14px ${SANS}`, padding: "14px 26px", borderRadius: 999 }}
              >
                Retake quiz
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const q = questions[at];
  const chosenHere = picked[at];
  const lastOne = at === questions.length - 1;

  return (
    <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "clamp(28px,3vw,40px) clamp(24px,3vw,44px)" }}>
      {/* One question at a time: twenty of them on a single page is a wall to
          scroll rather than a question to think about. */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <span style={{ font: `700 11px ${SANS}`, color: "#1b8f88", letterSpacing: ".14em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
          Question {at + 1} of {questions.length}
        </span>
        <span style={{ flex: 1, height: 6, borderRadius: 999, background: "#e3eaf0", overflow: "hidden" }}>
          <span style={{ display: "block", width: `${((at + 1) / questions.length) * 100}%`, height: "100%", background: "linear-gradient(90deg,#2fc4bc,#2f7fd6)", transition: "width .25s ease" }} />
        </span>
        <span style={{ font: `600 11.5px ${SANS}`, color: "#8296a9", whiteSpace: "nowrap" }}>
          {answered} answered
        </span>
      </div>

      <div style={{ font: `700 19px/1.5 ${SANS}`, color: "#0a1b33", marginBottom: 18, maxWidth: 760 }}>
        {q.q}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 760 }}>
        {q.options.map((opt, oi) => {
          const chosen = chosenHere === oi;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => setPicked((p) => ({ ...p, [at]: oi }))}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                textAlign: "left", cursor: "pointer", borderRadius: 12, padding: "15px 17px",
                border: `2px solid ${chosen ? "#1b8f88" : "#e3eaf0"}`,
                background: chosen ? "rgba(47,196,188,.16)" : "#f7fafc",
                boxShadow: chosen ? "0 2px 12px rgba(27,143,136,.18)" : "none",
                font: `${chosen ? 700 : 500} 15px/1.6 ${SANS}`,
                color: chosen ? "#0e5d59" : READING_INK,
                transition: "background .15s ease, border-color .15s ease",
              }}
            >
              {/* The answer someone picked has to be obvious at a glance,
                  not a shade of the one they did not. */}
              <span
                aria-hidden
                style={{
                  flex: "none", width: 20, height: 20, borderRadius: "50%",
                  border: `2px solid ${chosen ? "#1b8f88" : "#c4d2de"}`,
                  background: chosen ? "#1b8f88" : "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {chosen && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
              </span>
              <span style={{ flex: 1 }}>{opt}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 26 }}>
        <button
          type="button"
          disabled={at === 0 || marking}
          onClick={() => setAt((i) => Math.max(0, i - 1))}
          className="lp-btn-outline"
          style={{
            cursor: at === 0 ? "not-allowed" : "pointer", background: "#fff",
            border: "1.5px solid rgba(10,27,51,.24)", color: "#0a1b33",
            font: `700 13.5px ${SANS}`, padding: "13px 22px", borderRadius: 999,
            opacity: at === 0 ? 0.45 : 1,
          }}
        >
          ← Back
        </button>

        {lastOne ? (
          <button
            type="button"
            disabled={answered < questions.length || marking}
            onClick={() => {
              if (marking) return;
              const sat = { score, total: questions.length };
              setMarking(true);
              // The verdict appears once the attempt is recorded, carrying the
              // score just sat — never the one before it.
              void Promise.resolve(onSubmit(sat)).finally(() => {
                setShown(false);
                setMarking(false);
              });
            }}
            className="lp-btn-grad"
            style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              cursor: answered < questions.length ? "not-allowed" : marking ? "wait" : "pointer", border: "none",
              background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff",
              font: `700 14px ${SANS}`, padding: "14px 28px", borderRadius: 999,
              opacity: answered < questions.length ? 0.5 : marking ? 0.8 : 1,
            }}
          >
            {marking && <Spinner />}
            {marking ? "Marking your answers…" : "Submit answers"}
          </button>
        ) : (
          <button
            type="button"
            disabled={chosenHere === undefined}
            onClick={() => setAt((i) => Math.min(questions.length - 1, i + 1))}
            className="lp-btn-grad"
            style={{
              cursor: chosenHere === undefined ? "not-allowed" : "pointer", border: "none",
              background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff",
              font: `700 14px ${SANS}`, padding: "14px 28px", borderRadius: 999,
              opacity: chosenHere === undefined ? 0.5 : 1,
            }}
          >
            Next question →
          </button>
        )}

        <span style={{ font: `500 12.5px ${SANS}`, color: "#8296a9" }}>
          {chosenHere === undefined
            ? "Choose an answer to carry on."
            : lastOne && answered < questions.length
              ? `${questions.length - answered} still unanswered — go back for them.`
              : `You need ${passMark(questions.length)} of ${questions.length} right to pass.`}
        </span>
      </div>
    </div>
  );
}

/**
 * The last page: the reading kit and the certificates.
 *
 * Both were previously shown alongside the course — the kit as a banner over
 * every item once it unlocked, which put a finished-course announcement at the
 * top of material the learner was still working through. They live here
 * instead, at the end, where someone who has finished comes to collect.
 */
/**
 * The whole kit as one archive.
 *
 * Built here rather than on the server because the site is a static export:
 * the files are already public, so fetching them back and zipping them in the
 * browser needs nothing the site does not already serve.
 */
function KitDownload({ course }: { course: CourseContent }) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState("");

  const files = course.readingKit.filter((f) => f.href);

  const download = async () => {
    if (busy || !files.length) return;
    setBusy(true);
    setFailed("");
    try {
      const entries = await Promise.all(
        files.map(async (file) => {
          const res = await fetch(file.href as string);
          if (!res.ok) throw new Error(`${file.title} could not be fetched.`);
          const data = new Uint8Array(await res.arrayBuffer());
          // Named for the reading, not for the path it happens to live at.
          const ext = (file.href as string).split(".").pop() ?? "pdf";
          return { name: `${fileStem(file.title)}.${ext}`, data };
        }),
      );
      const blob = zipFiles(entries);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileStem(course.title, "reading kit")}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch (e) {
      setFailed((e as Error).message || "The reading kit could not be prepared.");
    } finally {
      setBusy(false);
    }
  };

  if (!files.length) return null;

  return (
    <div>
      <button
        type="button"
        onClick={download}
        disabled={busy}
        style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          cursor: busy ? "wait" : "pointer", border: "none",
          background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff",
          font: `700 14px ${SANS}`, padding: "14px 26px", borderRadius: 999,
          opacity: busy ? 0.8 : 1,
        }}
      >
        {busy ? (
          <span aria-hidden style={{ flex: "none", width: 15, height: 15, borderRadius: "50%", border: "2px solid rgba(255,255,255,.4)", borderTopColor: "#fff", animation: "spinSlow .7s linear infinite" }} />
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 3v12" /><path d="M7 11l5 5 5-5" /><path d="M4 20h16" />
          </svg>
        )}
        {busy ? "Preparing your kit…" : `Download all ${files.length} files (ZIP)`}
      </button>
      {failed && (
        <div role="alert" style={{ font: `600 12px/1.6 ${SANS}`, color: "#ffd9d2", background: "rgba(226,86,74,.18)", border: "1px solid rgba(226,86,74,.4)", borderRadius: 10, padding: "10px 12px", marginTop: 12 }}>
          {failed}
        </div>
      )}
    </div>
  );
}

function KitPage({
  course, slug, who, completedOn,
}: {
  course: CourseContent;
  slug: string;
  who: { id: string; name: string; email: string; org: string };
  completedOn: string;
}) {
  return (
    <>
      <div style={{ background: "linear-gradient(120deg,#0c2a45,#0a1f38)", borderRadius: 20, padding: "30px 34px", marginBottom: 26 }}>
        <div style={{ font: `700 11px ${SANS}`, color: "#7fe3dc", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 8 }}>Course complete</div>
        <div style={{ font: `700 clamp(20px,2.4vw,26px) ${SANS}`, color: "#fff", marginBottom: 6 }}>Your reading kit is unlocked</div>
        <p style={{ font: `400 13.5px/1.7 ${SANS}`, color: "rgba(255,255,255,.72)", margin: "0 0 20px", maxWidth: 560 }}>
          Every item is finished. These materials are yours to keep — download them now or come back for them whenever
          you need them.
        </p>
        <KitDownload course={course} />

        {/* A contents page for the archive, not seven downloads. */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 22 }} className="site-grid-2">
          {course.readingKit.map((file, i) => (
            <div
              key={file.title}
              style={{
                display: "flex", alignItems: "center", gap: 11,
                background: "rgba(255,255,255,.06)", border: "1px solid rgba(127,227,220,.22)",
                borderRadius: 12, padding: "12px 14px",
              }}
            >
              <span aria-hidden style={{ flex: "none", width: 26, height: 26, borderRadius: 8, background: "rgba(127,227,220,.14)", display: "flex", alignItems: "center", justifyContent: "center", font: `800 10px ${SANS}`, color: "#7fe3dc" }}>
                {i + 1}
              </span>
              <span>
                <span style={{ display: "block", font: `700 12.5px ${SANS}`, color: "#fff" }}>{file.title}</span>
                <span style={{ display: "block", font: `500 11px ${SANS}`, color: "rgba(255,255,255,.6)" }}>{file.meta}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ font: `700 11px ${SANS}`, color: "#1b8f88", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 10 }}>
        Completion
      </div>
      <h2 style={{ font: `700 clamp(22px,2.4vw,30px)/1.2 ${SANS}`, color: "#0a1b33", margin: "0 0 20px", letterSpacing: "-.02em" }}>
        Your certificates
      </h2>
      <CourseCertificates
        slug={slug}
        name={who.name}
        org={who.org}
        completedOn={completedOn}
        ready
        finished
      />
    </>
  );
}

/**
 * One line of course text. Supports "## " for a heading, "- " for a bullet,
 * and **bold** inside either — enough to lay out a handout without pulling in
 * a markdown renderer for six characters of syntax.
 */
/* ---------------------------------------------------------- feedback */

const RATED = [
  "Programme content",
  "Facilitator knowledge and delivery",
  "Practical examples and activities",
  "Relevance to my professional role",
  "Overall learning experience",
] as const;

const SCALE = ["Poor", "Fair", "Good", "Very good", "Excellent"];
const CONFIDENCE = ["Very confident", "Confident", "Need more practice"];

/**
 * The delegate feedback form.
 *
 * It goes out the same way a signed acknowledgement does — an email to the
 * office, nothing stored as an enquiry, since this is a delegate on a
 * programme rather than someone asking about one. Sending it completes the
 * item, so the footer holds the course here until it is in.
 */
function FeedbackForm({
  item, who, sent, onSent,
}: {
  item: CourseItem;
  who: { id: string; name: string; email: string };
  sent: boolean;
  onSent: (item: CourseItem) => void;
}) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [useful, setUseful] = useState("");
  const [improve, setImprove] = useState("");
  const [confidence, setConfidence] = useState("");
  const [recommend, setRecommend] = useState("");
  const [comments, setComments] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState("");

  const rated = RATED.every((area) => ratings[area]);
  const ready = rated && confidence !== "" && recommend !== "";

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy || !ready) return;
    setBusy(true);
    setFailed("");
    const message = [
      "Delegate Feedback — PoSH Train-the-Trainer Certification Programme",
      "",
      ...RATED.map((area) => `${area}: ${ratings[area]}/5 (${SCALE[ratings[area] - 1]})`),
      "",
      `Most useful part: ${useful.trim() || "—"}`,
      `What could we improve: ${improve.trim() || "—"}`,
      `Confidence after the programme: ${confidence}`,
      `Would recommend: ${recommend}`,
      `Additional comments: ${comments.trim() || "—"}`,
    ].join("\n");

    const res = await submitEnquiry(
      e.currentTarget,
      {
        intent: "Delegate feedback — PoSH TTT",
        message,
        source: typeof window !== "undefined" ? window.location.pathname : "",
      },
      { store: false },
    );
    setBusy(false);
    if (res.ok) onSent(item);
    else setFailed(res.error || "Your feedback could not be sent. Please try again.");
  };

  if (sent) {
    return (
      <div style={{ background: "rgba(47,196,188,.09)", border: "1px solid rgba(27,143,136,.3)", borderRadius: 18, padding: "26px 28px", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Tick />
          <span style={{ font: `700 15px ${SANS}`, color: "#136f6a" }}>Thank you — your feedback is in</span>
        </div>
        <div style={{ font: `500 13.5px/1.7 ${SANS}`, color: "#3d5064" }}>
          It goes straight to the programme team and shapes the next cohort.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "clamp(26px,3vw,36px) clamp(24px,3vw,38px)", marginBottom: 24 }}>
      {/* The office needs to know whose feedback this is; the learner has
          already told us, so it is carried rather than asked for again. */}
      <input type="hidden" name="name" value={who.name} readOnly />
      <input type="hidden" name="email" value={who.email} readOnly />

      <h3 style={{ font: `700 19px ${SANS}`, color: "#0a1b33", margin: "0 0 4px" }}>Delegate Feedback Form</h3>
      <p style={{ font: `500 13px/1.7 ${SANS}`, color: "#8296a9", margin: "0 0 22px" }}>
        PoSH Train-the-Trainer Certification Programme · one star poor to five excellent
      </p>

      {RATED.map((area) => (
        <div key={area} style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", padding: "12px 0", borderTop: "1px solid #eef2f6" }}>
          <div style={{ flex: "1 1 240px", font: `600 14px/1.5 ${SANS}`, color: "#0a1b33" }}>{area}</div>
          <Stars
            area={area}
            value={ratings[area] ?? 0}
            onChange={(n) => setRatings((r) => ({ ...r, [area]: n }))}
          />
        </div>
      ))}

      <FeedbackText label="What was the most useful part of the programme?" value={useful} onChange={setUseful} />
      <FeedbackText label="What could we improve?" value={improve} onChange={setImprove} />

      <FeedbackChoice
        label="How confident do you feel after completing the programme?"
        options={CONFIDENCE}
        value={confidence}
        onChange={setConfidence}
      />
      <FeedbackChoice
        label="Would you recommend this programme?"
        options={["Yes", "No"]}
        value={recommend}
        onChange={setRecommend}
      />
      <FeedbackText label="Additional comments" value={comments} onChange={setComments} />

      {failed && (
        <div role="alert" style={{ font: `600 12.5px/1.6 ${SANS}`, color: "#a53f28", background: "rgba(226,86,74,.08)", border: "1px solid rgba(226,86,74,.28)", borderRadius: 12, padding: "12px 14px", margin: "18px 0 0" }}>
          {failed}
        </div>
      )}

      <button
        type="submit"
        disabled={!ready || busy}
        className="lp-btn-grad"
        style={{
          display: "inline-flex", alignItems: "center", gap: 9, marginTop: 24,
          cursor: !ready ? "not-allowed" : busy ? "wait" : "pointer", border: "none",
          background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff",
          font: `700 14px ${SANS}`, padding: "14px 28px", borderRadius: 999,
          opacity: !ready ? 0.5 : busy ? 0.8 : 1,
        }}
      >
        {busy && <Spinner />}
        {busy ? "Submitting your feedback…" : "Submit feedback"}
      </button>
      {!ready && (
        <div style={{ font: `500 12px ${SANS}`, color: "#8296a9", marginTop: 10 }}>
          Rate all five areas and answer the two choice questions to send.
        </div>
      )}
    </form>
  );
}

/**
 * Five stars, one rating.
 *
 * Still radio buttons underneath — the label says "3 of 5, Good", so this
 * reads to a screen reader as the scale it is rather than as five pictures.
 * Hovering fills the stars up to the one under the pointer, which is how
 * everyone expects a star rating to behave.
 */
function Stars({ area, value, onChange }: { area: string; value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  const lit = hover || value;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        role="radiogroup"
        aria-label={area}
        onMouseLeave={() => setHover(0)}
        style={{ display: "flex", gap: 2 }}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} of 5 — ${SCALE[n - 1]}`}
            title={SCALE[n - 1]}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(0)}
            style={{ cursor: "pointer", border: "none", background: "transparent", padding: 3, lineHeight: 0, borderRadius: 8 }}
          >
            <Star filled={n <= lit} />
          </button>
        ))}
      </div>
      {/* The word, so a rating is never only a count of shapes. */}
      <span style={{ font: `600 12.5px ${SANS}`, color: value ? "#0a1b33" : "#a9b8c6", minWidth: 74 }}>
        {value ? SCALE[value - 1] : "Not rated"}
      </span>
    </div>
  );
}

const Star = ({ filled }: { filled: boolean }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden style={{ display: "block" }}>
    <path
      d="M12 2.6l2.9 5.88 6.49.95-4.7 4.58 1.11 6.46L12 17.42l-5.8 3.05 1.11-6.46-4.7-4.58 6.49-.95L12 2.6z"
      fill={filled ? "#f0b429" : "#fff"}
      stroke={filled ? "#db9a16" : "#c4d2de"}
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
  </svg>
);

function FeedbackText({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label style={{ display: "block", marginTop: 22 }}>
      <span style={{ display: "block", font: `600 14px/1.5 ${SANS}`, color: "#0a1b33", marginBottom: 8 }}>{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        style={{ width: "100%", resize: "vertical", borderRadius: 12, border: "1.5px solid #e3eaf0", background: "#f7fafc", padding: "12px 14px", font: `400 14px/1.6 ${SANS}`, color: "#0a1b33" }}
      />
    </label>
  );
}

function FeedbackChoice({
  label, options, value, onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ font: `600 14px/1.5 ${SANS}`, color: "#0a1b33", marginBottom: 10 }}>{label}</div>
      <div role="radiogroup" aria-label={label} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {options.map((opt) => {
          const on = value === opt;
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(opt)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 9, cursor: "pointer",
                borderRadius: 999, padding: "11px 18px",
                border: `2px solid ${on ? "#1b8f88" : "#e3eaf0"}`,
                background: on ? "rgba(47,196,188,.16)" : "#f7fafc",
                boxShadow: on ? "0 2px 10px rgba(27,143,136,.18)" : "none",
                font: `${on ? 700 : 500} 13.5px ${SANS}`, color: on ? "#0e5d59" : "#0a1b33",
              }}
            >
              <span aria-hidden style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${on ? "#1b8f88" : "#c4d2de"}`, background: on ? "#1b8f88" : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {on && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Ticks are held in localStorage and read through a store rather than copied
   into state by an effect — the same shape the enrolment list uses, and the
   only way to read browser storage without a first render that disagrees with
   the prerendered HTML. */
const NO_TICKS: Record<number, boolean> = {};
const tickCache = new Map<string, Record<number, boolean>>();
const tickListeners = new Set<() => void>();

function readTicks(key: string): Record<number, boolean> {
  const hit = tickCache.get(key);
  if (hit) return hit;
  let parsed = NO_TICKS;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) parsed = JSON.parse(raw) as Record<number, boolean>;
  } catch {
    parsed = NO_TICKS;
  }
  // Cached so the snapshot is the same object between writes; a fresh one
  // every read would tell React the store had changed, forever.
  tickCache.set(key, parsed);
  return parsed;
}

function writeTicks(key: string, next: Record<number, boolean>) {
  tickCache.set(key, next);
  try {
    window.localStorage.setItem(key, JSON.stringify(next));
  } catch {
    /* quota or private mode — the ticks will not survive a reload */
  }
  tickListeners.forEach((l) => l());
}

const subscribeTicks = (cb: () => void) => {
  tickListeners.add(cb);
  return () => {
    tickListeners.delete(cb);
  };
};

/**
 * A body rendered as a checklist: every "- " line becomes something to tick.
 *
 * These items are worked through against a real committee or a real report
 * rather than read, and a facilitator halfway down a forty-line list needs to
 * see where they got to. The ticks are a working aid, not progress: they stay
 * in this browser, they are not sent anywhere, and they do not gate anything.
 */
function Checklist({ item, userId }: { item: CourseItem; userId: string }) {
  const key = `lvt.lms.checklist.${userId}.${item.id}`;
  const ticked = useSyncExternalStore(
    subscribeTicks,
    useCallback(() => readTicks(key), [key]),
    // The prerendered HTML has no ticks in it, and neither must the first
    // client render, or the two disagree.
    useCallback(() => NO_TICKS, []),
  );
  const write = (next: Record<number, boolean>) => writeTicks(key, next);

  const lines = item.body ?? [];
  const boxes = lines.filter((l) => l.startsWith("- ")).length;
  const done = Object.values(ticked).filter(Boolean).length;

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
        <span style={{ font: `700 12px ${SANS}`, color: "#1b8f88", background: "rgba(47,196,188,.1)", border: "1px solid rgba(27,143,136,.25)", borderRadius: 999, padding: "7px 14px" }}>
          {done} of {boxes} checked
        </span>
        {done > 0 && (
          <button type="button" onClick={() => write({})} style={{ cursor: "pointer", border: "none", background: "transparent", font: `600 12px ${SANS}`, color: "#8296a9", padding: 0 }}>
            Clear all
          </button>
        )}
        <span style={{ font: `500 11.5px ${SANS}`, color: "#a9b8c6" }}>Saved in this browser · not part of your progress</span>
      </div>

      {lines.map((text, i) =>
        text.startsWith("- ") ? (
          <label
            key={i}
            style={{ display: "flex", gap: 11, alignItems: "flex-start", margin: "0 0 9px", cursor: "pointer" }}
          >
            <input
              type="checkbox"
              checked={ticked[i] === true}
              onChange={(e) => write({ ...ticked, [i]: e.target.checked })}
              style={{ flex: "none", width: 16, height: 16, marginTop: 5, accentColor: "#1b8f88", cursor: "pointer" }}
            />
            <span style={{ font: `400 15.5px/1.8 ${SANS}`, color: ticked[i] ? "#a9b8c6" : READING_INK, textDecoration: ticked[i] ? "line-through" : "none" }}>
              {bold(text.slice(2))}
            </span>
          </label>
        ) : (
          <Para key={i} text={text} />
        ),
      )}
    </>
  );
}

/**
 * Course text is read, not skimmed, so it is set like something to read:
 * near-black rather than the grey used for interface copy, a size that does
 * not ask the reader to lean in, and generous leading.
 */
export const READING_INK = "#16202e";

function Para({ text }: { text: string }) {
  if (text.startsWith("## "))
    return <h3 style={{ font: `700 19.5px/1.4 ${SANS}`, color: "#0a1b33", margin: "34px 0 14px" }}>{bold(text.slice(3))}</h3>;

  if (text.startsWith("- "))
    return (
      <div style={{ display: "flex", gap: 12, margin: "0 0 12px" }}>
        <span aria-hidden style={{ flex: "none", width: 6, height: 6, borderRadius: "50%", background: "#2fc4bc", marginTop: 11 }} />
        <span style={{ font: `400 16px/1.85 ${SANS}`, color: READING_INK }}>{bold(text.slice(2))}</span>
      </div>
    );

  return <p style={{ font: `400 16px/1.9 ${SANS}`, color: READING_INK, margin: "0 0 18px" }}>{bold(text)}</p>;
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
      return <strong key={i} style={{ color: "#05080d", fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2)
      return <em key={i} style={{ color: "#16202e" }}>{part.slice(1, -1)}</em>;
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
