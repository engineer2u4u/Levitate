import { getClient, supabaseConfigured } from "./supabase";
import type { Enrolment } from "./types";

/**
 * The signed-in learner's enrolments.
 *
 * With Supabase configured they come from the `enrolments` table, which the
 * learner can read but never write: an enrolment is created by the office, by
 * the payment server after a verified payment, or attached to the account with
 * an enrolment code. Without Supabase (a local build) the old browser-only store
 * still works, so the flow stays clickable.
 *
 * Lists are cached by user id and replaced only when they change, so repeated
 * reads hand back the same array — useSyncExternalStore compares by identity.
 */
const key = (userId: string) => `lvt.lms.enrolments.${userId}`;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** Subscribe to any enrolment change. Returns an unsubscribe. */
export const onEnrolmentsChange = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb) as unknown as void;
};

export const EMPTY: Enrolment[] = [];

const cache = new Map<string, Enrolment[]>();

/* ---------------------------------------------------------------- database */

type Row = {
  id: string;
  status: "pending" | "paid" | "cancelled";
  created_at: string;
  paid_at: string | null;
  payment_link: string;
  amount_paise: number;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  courses: { slug: string } | null;
  batches: { name: string } | null;
};

/** The database row in the shape the LMS screens were written against. The
 *  progress fields are no longer kept here — progress is per course, in
 *  `course_progress` — so they are empty rather than invented. */
const fromRow = (r: Row): Enrolment => ({
  id: r.id,
  courseSlug: r.courses?.slug ?? "",
  enrolledAt: r.created_at,
  status: r.status === "paid" ? "paid" : "pending",
  batchName: r.batches?.name ?? "",
  paymentLink: r.payment_link ?? "",
  completed: [],
  stagesUnlocked: 0,
  sessionsAttended: 0,
  quizBest: {},
  certificateIssued: false,
  payment: r.razorpay_payment_id
    ? { orderId: r.razorpay_order_id, paymentId: r.razorpay_payment_id, amountPaise: r.amount_paise, at: r.paid_at ?? r.created_at }
    : null,
});

/** Reads the learner's enrolments from the database and publishes them. */
export async function loadEnrolments(userId: string): Promise<void> {
  if (!supabaseConfigured || !userId) return;
  const { data, error } = await (await getClient())
    .from("enrolments")
    .select("id, status, created_at, paid_at, payment_link, amount_paise, razorpay_order_id, razorpay_payment_id, courses(slug), batches(name)")
    .eq("user_id", userId)
    .neq("status", "cancelled")
    .order("created_at", { ascending: false });
  if (error) return; // leave what was there; the next load will try again
  cache.set(userId, ((data ?? []) as unknown as Row[]).map(fromRow).filter((e) => e.courseSlug));
  emit();
}

export const readEnrolments = (userId: string): Enrolment[] => {
  if (typeof window === "undefined" || !userId) return EMPTY;
  const hit = cache.get(userId);
  if (hit) return hit;
  if (supabaseConfigured) {
    // Not loaded yet: answer empty now, and publish the real list when it lands.
    cache.set(userId, EMPTY);
    void loadEnrolments(userId);
    return EMPTY;
  }
  let parsed: Enrolment[] = EMPTY;
  try {
    const raw = window.localStorage.getItem(key(userId));
    if (raw) parsed = JSON.parse(raw) as Enrolment[];
  } catch {
    parsed = EMPTY;
  }
  cache.set(userId, parsed);
  return parsed;
};

/** Only paid enrolments open a course. */
export const isPaid = (e: Enrolment) => e.status !== "pending";

const write = (userId: string, list: Enrolment[]) => {
  cache.set(userId, list);
  if (!supabaseConfigured) {
    try {
      window.localStorage.setItem(key(userId), JSON.stringify(list));
    } catch {
      /* quota or private mode — progress just will not persist */
    }
  }
  emit();
};

export const getEnrolment = (userId: string, slug: string) =>
  readEnrolments(userId).find((e) => e.courseSlug === slug) ?? null;

export const isEnrolled = (userId: string, slug: string) => {
  const e = getEnrolment(userId, slug);
  return e !== null && isPaid(e);
};

/**
 * Creates an enrolment in the browser-only store. With Supabase configured it
 * does nothing but reload: the browser cannot create a database enrolment, and
 * after a real payment the server already has.
 */
export const enrol = (userId: string, slug: string, payment: Enrolment["payment"]): Enrolment | null => {
  if (supabaseConfigured) {
    void loadEnrolments(userId);
    return null;
  }
  const list = readEnrolments(userId);
  const existing = list.find((e) => e.courseSlug === slug);
  if (existing) return existing;

  const created: Enrolment = {
    courseSlug: slug,
    enrolledAt: new Date().toISOString(),
    status: "paid",
    completed: [],
    stagesUnlocked: 1,
    sessionsAttended: 0,
    quizBest: {},
    certificateIssued: false,
    payment,
  };
  write(userId, [...list, created]);
  return created;
};

/**
 * Changes an enrolment on this page only. Kept for the screens still built on
 * the older staged model (certificates), which Phase 3 replaces with the
 * database; nothing here is saved to the database.
 */
export const updateEnrolment = (userId: string, slug: string, patch: Partial<Enrolment>) => {
  const list = readEnrolments(userId);
  const next = list.map((e) => (e.courseSlug === slug ? { ...e, ...patch } : e));
  write(userId, next);
  return next.find((e) => e.courseSlug === slug) ?? null;
};

export const toggleLessonComplete = (userId: string, slug: string, lessonId: string) => {
  const e = getEnrolment(userId, slug);
  if (!e) return null;
  const done = e.completed.includes(lessonId);
  return updateEnrolment(userId, slug, {
    completed: done ? e.completed.filter((l) => l !== lessonId) : [...e.completed, lessonId],
  });
};

export const recordQuizAttempt = (
  userId: string,
  slug: string,
  stage: string,
  attempt: { score: number; total: number; xp: number; passed: boolean },
) => {
  const e = getEnrolment(userId, slug);
  if (!e) return null;
  const prev = e.quizBest[stage];
  // Only the best attempt is kept, so retaking can never cost a learner XP.
  const best = !prev || attempt.xp > prev.xp ? attempt : prev;
  return updateEnrolment(userId, slug, { quizBest: { ...e.quizBest, [stage]: best } });
};

/** Progress derived from the enrolment — never stored, so it cannot go stale. */
export const progressFor = (e: Enrolment | null, totalLessons: number) => {
  const completed = e?.completed.length ?? 0;
  return {
    completed,
    total: totalLessons,
    percent: totalLessons === 0 ? 0 : Math.round((completed / totalLessons) * 100),
  };
};
