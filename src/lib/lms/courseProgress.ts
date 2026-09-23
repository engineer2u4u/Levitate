import { flatItems, totalItems, type CourseContent, type FlatItem } from "./courseContent";
import { getClient, supabaseConfigured } from "./supabase";

/**
 * Per-learner progress through a self-paced course.
 *
 * Stored in Supabase so the admin can see it. Two apps cannot share
 * localStorage — they are different origins — so a browser-only store made
 * "shown in the admin panel" impossible by construction. Reads and writes go
 * through RLS with the anon key: a learner touches only their own row, an admin
 * reads every row.
 *
 * When no Supabase project is configured the same API falls back to
 * localStorage, so the flow still runs locally. Nothing written there reaches
 * the admin, and `isShared` says so rather than letting it look like it did.
 */
export type QuizAttempt = { score: number; total: number };

/**
 * Every quiz is held to the same pass mark: 70% of its questions, to the
 * nearest whole question — 2 of 3, 3 of 4, 4 of 5, 14 of 20.
 *
 * Nearest rather than rounded up, because most of these quizzes are short and
 * rounding up quietly raises the bar on exactly those: a 3-question check
 * would demand 100% and a 4-question one 75%, so "70%" would only mean 70% on
 * the 20-question final. Kept here rather than in the screen because the
 * player and anything that reports on attempts have to agree on what a pass is.
 */
export const QUIZ_PASS_RATIO = 0.7;
export const passMark = (total: number) => Math.round(total * QUIZ_PASS_RATIO);
export const quizPassed = (a: QuizAttempt | null | undefined) =>
  Boolean(a && a.total > 0 && a.score >= passMark(a.total));

export type CourseProgress = {
  courseSlug: string;
  completedItems: string[];
  quizAttempts: Record<string, QuizAttempt>;
  /** How much of each film has been watched, 0–1, keyed by item id. The
   *  furthest point reached, not the last position. */
  videoProgress: Record<string, number>;
  startedAt: string;
  completedAt: string | null;
};

/**
 * How much of a film counts as watched. Playback, not attention: a video
 * left running in another tab reaches the end like any other. It is a floor
 * under skipping, not a proof that anyone was looking.
 */
export const VIDEO_WATCHED_RATIO = 0.9;
export const videoWatched = (p: CourseProgress | null, itemId: string) =>
  (p?.videoProgress?.[itemId] ?? 0) >= VIDEO_WATCHED_RATIO;

export const isShared = supabaseConfigured;

const EMPTY = (slug: string): CourseProgress => ({
  courseSlug: slug,
  completedItems: [],
  quizAttempts: {},
  videoProgress: {},
  startedAt: new Date().toISOString(),
  completedAt: null,
});

/* ------------------------------------------------------------- unlocking */

export type ItemState = "done" | "open" | "preview" | "locked" | "scheduled";

/**
 * The modules open to the learner's batch. An admin unlocks them after each
 * live session, so a module can be further along the list than the learner
 * but still closed. Null where the course is not taught in batches, and every
 * module is open.
 */
export type ModuleGate = { open: ReadonlySet<string> } | null;

/**
 * Strictly sequential: an item opens when the one before it is done — and,
 * for a course taught in batches, only once its module has been unlocked for
 * the learner's batch. A closed module's items are "scheduled": waiting for a
 * live session, not for the learner.
 *
 * Deliberately derived rather than stored. A stored "unlocked up to N" drifts
 * the moment the syllabus changes — insert a module and every learner's cursor
 * points at the wrong item. Recomputing from what they have finished cannot.
 *
 * "preview" is the one item past the frontier. It can be opened and read, so
 * nobody has to finish an item to find out what comes after it, but it cannot
 * be completed from there — the order still has to be walked. Everything
 * beyond it stays locked, otherwise previewing the preview would step the
 * frontier forward one item at a time and the sequence would mean nothing.
 */
export function itemState(items: FlatItem[], index: number, p: CourseProgress | null, gate: ModuleGate = null): ItemState {
  const done = new Set(p?.completedItems ?? []);
  if (done.has(items[index].id)) return "done";
  // Finished work stays finished even if its module is closed again later.
  if (gate && !gate.open.has(items[index].moduleId)) return "scheduled";
  if (index === 0) return "open";
  if (done.has(items[index - 1].id)) return "open";
  return index === frontierIndex(items, p) + 1 ? "preview" : "locked";
}

/**
 * The first item not yet finished — where the learner actually stands. The
 * list on the left is freely navigable up to here, and the Next button is what
 * moves it.
 */
export function frontierIndex(items: FlatItem[], p: CourseProgress | null): number {
  const done = new Set(p?.completedItems ?? []);
  const next = items.findIndex((it) => !done.has(it.id));
  return next === -1 ? items.length : next;
}

/** The item the learner should land on: the first one not yet finished. */
export function currentIndex(items: FlatItem[], p: CourseProgress | null): number {
  const done = new Set(p?.completedItems ?? []);
  const next = items.findIndex((it) => !done.has(it.id));
  return next === -1 ? items.length - 1 : next;
}

export function courseStats(c: CourseContent, p: CourseProgress | null) {
  const total = totalItems(c);
  const done = p ? flatItems(c).filter((it) => p.completedItems.includes(it.id)).length : 0;
  return { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
}

/** The kit is the reward for finishing, so it is gated on every item. */
export const kitReleased = (c: CourseContent, p: CourseProgress | null) =>
  courseStats(c, p).done >= totalItems(c) && totalItems(c) > 0;

/* --------------------------------------------------------------- storage */

const localKey = (userId: string, slug: string) => `lvt.lms.progress.${userId}.${slug}`;

type Row = {
  course_slug: string;
  completed_items: string[];
  quiz_attempts: Record<string, QuizAttempt>;
  video_progress?: Record<string, number> | null;
  started_at: string;
  completed_at: string | null;
};

const fromRow = (r: Row): CourseProgress => ({
  courseSlug: r.course_slug,
  completedItems: r.completed_items ?? [],
  quizAttempts: r.quiz_attempts ?? {},
  videoProgress: r.video_progress ?? {},
  startedAt: r.started_at,
  completedAt: r.completed_at,
});

/**
 * Whether this database has the video_progress column yet.
 *
 * The column arrives with a migration in the admin repo, and the site may be
 * deployed before it lands. Rather than failing every write until then, the
 * first read or write that PostgREST rejects for that column turns it off and
 * everything else carries on: films are then gated for the session but the
 * watched fraction does not survive a reload.
 */
let videoColumn = true;
const missingVideoColumn = (message: string) =>
  /video_progress/.test(message) && /column|schema cache/i.test(message);

const COLUMNS = () =>
  `course_slug, completed_items, quiz_attempts, started_at, completed_at${videoColumn ? ", video_progress" : ""}`;

export async function readProgress(userId: string, slug: string): Promise<CourseProgress | null> {
  if (!userId) return null;

  if (!isShared) {
    try {
      const raw = window.localStorage.getItem(localKey(userId, slug));
      return raw ? (JSON.parse(raw) as CourseProgress) : null;
    } catch {
      return null;
    }
  }

  const supabase = await getClient();
  const { data, error } = await supabase
    .from("course_progress")
    .select(COLUMNS())
    // Row-level security already limits a learner to their own rows, but staff
    // can read everyone's — without this, a staff account opening a course would
    // get every learner's row and no single answer.
    .eq("user_id", userId)
    .eq("course_slug", slug)
    .maybeSingle();
  if (error && missingVideoColumn(error.message)) {
    videoColumn = false;
    return readProgress(userId, slug);
  }
  // A learner with no row yet is the normal first visit, not a failure.
  if (error || !data) return null;
  // The column list is built at run time — whether video_progress is in it
  // depends on the database — so the row's shape is ours to assert.
  return fromRow(data as unknown as Row);
}

async function save(userId: string, next: CourseProgress): Promise<CourseProgress> {
  if (!isShared) {
    try {
      window.localStorage.setItem(localKey(userId, next.courseSlug), JSON.stringify(next));
    } catch {
      /* quota or private mode — progress will not survive a reload */
    }
    return next;
  }

  const supabase = await getClient();
  // Upsert on (user_id, course_slug): starting a course and finishing an item
  // are the same write, so a first item never races a separate insert.
  const { error } = await supabase.from("course_progress").upsert(
    {
      user_id: userId,
      course_slug: next.courseSlug,
      completed_items: next.completedItems,
      quiz_attempts: next.quizAttempts,
      completed_at: next.completedAt,
      ...(videoColumn ? { video_progress: next.videoProgress } : {}),
    },
    { onConflict: "user_id,course_slug" },
  );
  if (error && missingVideoColumn(error.message)) {
    videoColumn = false;
    return save(userId, next);
  }
  if (error) throw new Error(error.message);
  return next;
}

/** Called when a course is opened, so "started" is recorded even at 0%. */
export async function startCourse(userId: string, c: CourseContent): Promise<CourseProgress> {
  const existing = await readProgress(userId, c.slug);
  if (existing) return existing;
  return save(userId, EMPTY(c.slug));
}

/**
 * Marks an item finished. Idempotent, and stamps `completedAt` on the write
 * that finishes the course rather than leaving the caller to notice.
 */
export async function completeItem(
  userId: string,
  c: CourseContent,
  itemId: string,
  attempt?: QuizAttempt,
): Promise<CourseProgress> {
  const current = (await readProgress(userId, c.slug)) ?? EMPTY(c.slug);
  const completedItems = current.completedItems.includes(itemId)
    ? current.completedItems
    : [...current.completedItems, itemId];
  const quizAttempts = attempt ? { ...current.quizAttempts, [itemId]: attempt } : current.quizAttempts;
  const next: CourseProgress = {
    ...current,
    completedItems,
    quizAttempts,
    completedAt:
      completedItems.length >= totalItems(c) ? current.completedAt ?? new Date().toISOString() : null,
  };
  return save(userId, next);
}

/**
 * Records a quiz attempt without completing the item — what a score under the
 * pass mark earns. The attempt still reaches the admin, because a learner who
 * keeps missing the mark is worth seeing; the course simply does not move on.
 */
export async function recordQuizAttempt(
  userId: string,
  c: CourseContent,
  itemId: string,
  attempt: QuizAttempt,
): Promise<CourseProgress> {
  const current = (await readProgress(userId, c.slug)) ?? EMPTY(c.slug);
  return save(userId, { ...current, quizAttempts: { ...current.quizAttempts, [itemId]: attempt } });
}

/**
 * Records how far into a film the learner has reached. Only ever forward:
 * rewatching the first minute must not undo an hour already watched, and the
 * gate asks how far they got, not where they are now.
 */
export async function recordVideoProgress(
  userId: string,
  c: CourseContent,
  itemId: string,
  fraction: number,
): Promise<CourseProgress> {
  const current = (await readProgress(userId, c.slug)) ?? EMPTY(c.slug);
  const seen = current.videoProgress[itemId] ?? 0;
  const next = Math.min(1, Math.max(seen, fraction));
  if (next <= seen) return current;
  return save(userId, {
    ...current,
    videoProgress: { ...current.videoProgress, [itemId]: Math.round(next * 100) / 100 },
  });
}

/** Undo, for a learner who marked something complete by mistake. */
export async function uncompleteItem(userId: string, c: CourseContent, itemId: string): Promise<CourseProgress> {
  const current = (await readProgress(userId, c.slug)) ?? EMPTY(c.slug);
  const completedItems = current.completedItems.filter((id) => id !== itemId);
  return save(userId, { ...current, completedItems, completedAt: null });
}
