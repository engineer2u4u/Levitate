/** Shared LMS domain types. Courses are static content; everything the learner
 *  does (enrolments, progress, attendance) is state we persist per user. */

export type LessonKind = "VID" | "PDF" | "QZ";

export type Lesson = {
  id: string;
  kind: Exclude<LessonKind, "QZ">;
  title: string;
  meta: string;
  desc: string;
};

/** A release stage. Content unlocks only once its live session is complete. */
export type Stage = {
  id: string;
  /** "00", "01" … shown in the timeline dot. */
  num: string;
  title: string;
  release: string;
  lessons: Lesson[];
};

export type LiveSession = {
  n: number;
  day: string;
  month: string;
  date: string;
  time: string;
  topic: string;
};

export type QuizQuestion = {
  q: string;
  options: string[];
  /** Index into `options`. */
  answer: number;
  explanation: string;
};

export type Quiz = {
  /** Matches the Stage.num it belongs to. */
  stage: string;
  title: string;
  badge: string;
  glyph: string;
  questions: QuizQuestion[];
};

export type CourseStatus = "enrolling" | "waitlist";

export type Course = {
  slug: string;
  tag: string;
  mode: string;
  title: string;
  short: string;
  desc: string;
  img: string;
  status: CourseStatus;
  /** Fee in paise, so money is never held as a float. null = "On request". */
  feePaise: number | null;
  priceNote: string;
  modulesLabel: string;
  hoursLabel: string;
  facilitator: string;
  /** Kept out of the public nav, the sitemap and the certifications cards.
   *  Test fixtures live in the catalogue without being advertised. */
  hidden?: boolean;
  /** What this course's certificates say. Every programme awards both. */
  certificate: {
    /** The programme name as printed — not always the catalogue title. */
    name: string;
    /** Trailing clause on the Award certificate; `**…**` sets bold. */
    closing: string;
    /** Printed in the completion chip. */
    hours: string;
  };
};

/** The full teaching content for a course. Only published for courses whose
 *  curriculum is finalised — the rest are catalogue entries only. */
export type Curriculum = {
  slug: string;
  eyebrow: string;
  blurb: string;
  meta: string[];
  included: string[];
  objectives: string[];
  stages: Stage[];
  sessions: LiveSession[];
  quizzes: Quiz[];
  finalKit: { title: string; meta: string }[];
};

export type Enrolment = {
  courseSlug: string;
  enrolledAt: string;
  /** Lesson ids the learner has marked complete. */
  completed: string[];
  /** How many stages are released — driven by facilitator-marked sessions. */
  stagesUnlocked: number;
  sessionsAttended: number;
  /** Best attempt per quiz, keyed by stage num. */
  quizBest: Record<string, { score: number; total: number; xp: number; passed: boolean }>;
  certificateIssued: boolean;
  payment: { orderId: string; paymentId: string; amountPaise: number; at: string } | null;
};

export type LmsUser = {
  id: string;
  name: string;
  email: string;
  org: string;
};
