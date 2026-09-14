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

export type CourseProgress = {
  courseSlug: string;
  completedItems: string[];
  quizAttempts: Record<string, QuizAttempt>;
  startedAt: string;
  completedAt: string | null;
};

export const isShared = supabaseConfigured;

const EMPTY = (slug: string): CourseProgress => ({
  courseSlug: slug,
  completedItems: [],
  quizAttempts: {},
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
  started_at: string;
  completed_at: string | null;
};

const fromRow = (r: Row): CourseProgress => ({
  courseSlug: r.course_slug,
  completedItems: r.completed_items ?? [],
  quizAttempts: r.quiz_attempts ?? {},
  startedAt: r.started_at,
  completedAt: r.completed_at,
});

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
    .select("course_slug, completed_items, quiz_attempts, started_at, completed_at")
    // Row-level security already limits a learner to their own rows, but staff
    // can read everyone's — without this, a staff account opening a course would
    // get every learner's row and no single answer.
    .eq("user_id", userId)
    .eq("course_slug", slug)
    .maybeSingle();
  // A learner with no row yet is the normal first visit, not a failure.
  if (error || !data) return null;
  return fromRow(data as Row);
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
    },
    { onConflict: "user_id,course_slug" },
  );
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

/** Undo, for a learner who marked something complete by mistake. */
export async function uncompleteItem(userId: string, c: CourseContent, itemId: string): Promise<CourseProgress> {
  const current = (await readProgress(userId, c.slug)) ?? EMPTY(c.slug);
  const completedItems = current.completedItems.filter((id) => id !== itemId);
  return save(userId, { ...current, completedItems, completedAt: null });
}
