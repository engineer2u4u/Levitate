import type { Enrolment } from "./types";

/**
 * Enrolments live in the browser, keyed by user id, until there is a database.
 *
 * Keying by user id matters even now: two accounts on the same machine must not
 * see each other's progress, and it means the shape moves to a `enrolments`
 * table later with the key becoming a foreign key rather than a rewrite.
 */
const key = (userId: string) => `lvt.lms.enrolments.${userId}`;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** Subscribe to any enrolment write. Returns an unsubscribe. */
export const onEnrolmentsChange = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb) as unknown as void;
};

export const EMPTY: Enrolment[] = [];

/**
 * Parsed lists are cached by user id and only replaced on a write, so repeated
 * reads hand back the *same* array reference. useSyncExternalStore compares
 * snapshots by identity — returning a fresh array each call would spin.
 */
const cache = new Map<string, Enrolment[]>();

export const readEnrolments = (userId: string): Enrolment[] => {
  if (typeof window === "undefined" || !userId) return EMPTY;
  const hit = cache.get(userId);
  if (hit) return hit;
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

const write = (userId: string, list: Enrolment[]) => {
  cache.set(userId, list);
  try {
    window.localStorage.setItem(key(userId), JSON.stringify(list));
  } catch {
    /* quota or private mode — progress just will not persist */
  }
  emit();
};

export const getEnrolment = (userId: string, slug: string) =>
  readEnrolments(userId).find((e) => e.courseSlug === slug) ?? null;

export const isEnrolled = (userId: string, slug: string) => getEnrolment(userId, slug) !== null;

/** Creates the enrolment if absent; enrolling twice is a no-op, not a duplicate. */
export const enrol = (userId: string, slug: string, payment: Enrolment["payment"]): Enrolment => {
  const list = readEnrolments(userId);
  const existing = list.find((e) => e.courseSlug === slug);
  if (existing) return existing;

  const created: Enrolment = {
    courseSlug: slug,
    enrolledAt: new Date().toISOString(),
    completed: [],
    // Stage 00 (orientation) is released the moment payment lands.
    stagesUnlocked: 1,
    sessionsAttended: 0,
    quizBest: {},
    certificateIssued: false,
    payment,
  };
  write(userId, [...list, created]);
  return created;
};

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
