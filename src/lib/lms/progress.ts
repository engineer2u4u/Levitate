import type { Curriculum, Enrolment, Lesson } from "./types";

/** A lesson plus where it sits, so screens can flatten without losing context. */
export type FlatLesson = Lesson & { stageIndex: number; stageTitle: string; stageNum: string };

export const flattenLessons = (c: Curriculum): FlatLesson[] =>
  c.stages.flatMap((s, stageIndex) =>
    s.lessons.map((l) => ({ ...l, stageIndex, stageTitle: s.title, stageNum: s.num })),
  );

/** Lessons the learner can actually open — released stages only. */
export const availableLessons = (c: Curriculum, e: Enrolment | null) =>
  flattenLessons(c).filter((l) => l.stageIndex < (e?.stagesUnlocked ?? 0));

export type StageState = "done" | "open" | "locked";

export const stageState = (stageIndex: number, e: Enrolment | null): StageState => {
  const unlocked = e?.stagesUnlocked ?? 0;
  if (stageIndex < unlocked - 1) return "done";
  if (stageIndex === unlocked - 1) return "open";
  return "locked";
};

/**
 * Course progress. Measured against *all* lessons, not just released ones, so
 * the number reflects distance to certification rather than distance through
 * whatever happens to be unlocked today.
 */
export const courseProgress = (c: Curriculum, e: Enrolment | null) => {
  const all = flattenLessons(c);
  const done = e ? all.filter((l) => e.completed.includes(l.id)).length : 0;
  return {
    done,
    total: all.length,
    percent: all.length === 0 ? 0 : Math.round((done / all.length) * 100),
  };
};

/** The three gates on certification, each independently checkable. */
export const certificateCriteria = (c: Curriculum, e: Enrolment | null) => {
  const p = courseProgress(c, e);
  const attended = e?.sessionsAttended ?? 0;
  const required = c.sessions.length;
  return [
    { label: "All course content completed", value: `${p.percent}%`, met: p.percent >= 100 },
    { label: "Live sessions attended", value: `${attended}/${required}`, met: attended >= required },
    { label: "Facilitation assessment cleared", value: e?.certificateIssued ? "Passed" : "Pending", met: Boolean(e?.certificateIssued) },
  ];
};

export const isCertificateEligible = (c: Curriculum, e: Enrolment | null) =>
  certificateCriteria(c, e).slice(0, 2).every((x) => x.met);

/** XP is only ever the best attempt per quiz, summed. */
export const totalXp = (e: Enrolment | null) =>
  e ? Object.values(e.quizBest).reduce((a, b) => a + b.xp, 0) : 0;

export const LEVELS = ["Rookie", "Apprentice", "Practitioner", "Facilitator", "Master Trainer"] as const;
const XP_PER_LEVEL = 120;

export const levelFor = (xp: number) => {
  const level = Math.min(LEVELS.length, Math.floor(xp / XP_PER_LEVEL) + 1);
  const atTop = level >= LEVELS.length;
  return {
    level,
    name: LEVELS[level - 1],
    percent: atTop ? 100 : Math.round(((xp - (level - 1) * XP_PER_LEVEL) / XP_PER_LEVEL) * 100),
    toNext: atTop ? 0 : level * XP_PER_LEVEL - xp,
    nextName: atTop ? null : LEVELS[level],
  };
};

/** Pass mark is 70% of the quiz, never fewer than 2 correct. */
export const passMarkFor = (questionCount: number) => Math.max(2, Math.round(questionCount * 0.7));
