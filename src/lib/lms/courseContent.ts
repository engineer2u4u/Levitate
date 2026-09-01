/**
 * Self-paced course content: modules, each holding submodules.
 *
 * A flatter shape than the staged `Curriculum` this sits beside. That one
 * releases whole stages when a facilitator marks a live session complete; this
 * one unlocks one submodule at a time, in order, driven only by what the
 * learner has finished. The two coexist because they answer different
 * questions — cohort pacing versus self-paced progression.
 */

import { POSH_CURRICULUM } from "./poshCurriculum";
import { curriculumToContent } from "./curriculumContent";
import { courseBySlug } from "./courses";

export type ItemKind = "reading" | "video" | "quiz";

export type QuizQuestion = {
  q: string;
  options: string[];
  /** Index into `options`. */
  answer: number;
  explanation: string;
};

export type CourseItem = {
  /** Stable across edits — this is what gets stored in completed_items. */
  id: string;
  kind: ItemKind;
  title: string;
  minutes: number;
  /** Overrides the "Kind · N min" label — some content is measured in pages
   *  or questions, and inventing a duration for it would be a lie. */
  meta?: string;
  /** Reading: paragraphs. A heading is a line that starts with "## ". */
  body?: string[];
  /** Video: a YouTube id, plus the same body rendered underneath. */
  videoId?: string;
  questions?: QuizQuestion[];
};

export type CourseModule = {
  id: string;
  title: string;
  summary: string;
  items: CourseItem[];
};

/** A file in the reading kit, released once the whole course is finished. */
export type KitFile = { title: string; meta: string; href?: string };

export type CourseContent = {
  slug: string;
  title: string;
  intro: string;
  modules: CourseModule[];
  readingKit: KitFile[];
};

/* ------------------------------------------------------------------------ */
/*  Dummy course — for exercising the flow end to end                       */
/* ------------------------------------------------------------------------ */

/**
 * Deliberately small but complete: three modules, every item kind, a quiz in
 * the middle rather than only at the end, and a reading kit behind the finish
 * line. Enough to walk the whole journey in a few minutes and see every state
 * — locked, open, done, course complete — without wading through real content.
 */
export const DEMO_COURSE: CourseContent = {
  slug: "demo-course",
  title: "Demo · Workplace Facilitation Essentials",
  intro:
    "A short sample course used to exercise the learning flow: sequential unlocking, progress tracking and the reading kit released on completion.",
  modules: [
    {
      id: "m1",
      title: "Module 1 · Getting started",
      summary: "What the programme covers and how the platform works.",
      items: [
        {
          id: "m1-i1",
          kind: "reading",
          title: "Course overview",
          minutes: 5,
          body: [
            "## Welcome",
            "This is a demo course. It exists so the learning journey can be walked end to end — every item kind, the unlock rule, progress tracking and the reading kit — without depending on the real programme content.",
            "## How this works",
            "Items unlock one at a time. The next item opens only once you have finished the one before it, and that applies across modules too: the first item of Module 2 stays locked until the last item of Module 1 is done.",
            "Readings and videos are completed by marking them complete. A quiz is completed by submitting it — your score is recorded and shown to the team, but a low score will not block you from continuing.",
            "## What you get at the end",
            "Finishing every item releases the reading kit, a set of take-away materials that stays available afterwards.",
          ],
        },
        {
          id: "m1-i2",
          kind: "video",
          title: "How the platform works",
          minutes: 3,
          videoId: "AT4ugM8vFDw",
          body: [
            "A short orientation clip. Watch it, then mark the item complete to unlock what follows.",
          ],
        },
        {
          id: "m1-i3",
          kind: "quiz",
          title: "Check your understanding",
          minutes: 5,
          questions: [
            {
              q: "When does the next item unlock?",
              options: [
                "After a set number of days",
                "Once the previous item is complete",
                "Only when a facilitator releases it",
                "Immediately — everything is open from the start",
              ],
              answer: 1,
              explanation: "Progression is sequential: each item opens as soon as the one before it is finished.",
            },
            {
              q: "What completes a quiz item?",
              options: [
                "Submitting it, whatever the score",
                "Scoring full marks",
                "Opening it",
                "Nothing — quizzes are optional",
              ],
              answer: 0,
              explanation: "Submitting completes the item. The score is recorded for the team to see, not used as a gate.",
            },
            {
              q: "When is the reading kit released?",
              options: [
                "At enrolment",
                "After the first module",
                "Once every item in the course is complete",
                "On request",
              ],
              answer: 2,
              explanation: "The kit is the reward for finishing — it appears once the last item is done.",
            },
          ],
        },
      ],
    },
    {
      id: "m2",
      title: "Module 2 · Facilitation basics",
      summary: "Preparing a room, opening a session and handling questions.",
      items: [
        {
          id: "m2-i1",
          kind: "reading",
          title: "Preparing the room",
          minutes: 6,
          body: [
            "## Before anyone arrives",
            "Preparation is most of facilitation. Know who is in the room, why they were sent, and what they are afraid the session will be. The first two minutes either confirm or overturn that expectation.",
            "## Ground rules",
            "Set them before you need them. What is said in the room, what is not discussed in the open, and how someone signals they would rather not answer. Rules introduced after a difficult moment read as a reaction to it.",
            "## Materials",
            "Have one fewer slide than you think you need and one more case than you think you will use. Discussion expands to fill the time; slides do not.",
          ],
        },
        {
          id: "m2-i2",
          kind: "reading",
          title: "Opening a session",
          minutes: 4,
          body: [
            "## The first five minutes",
            "Say what the session is, what it is not, and how long it will take. Then ask something that everyone in the room can answer, so the first voice is not yours.",
            "## Naming the discomfort",
            "In sessions on sensitive subjects, someone present has usually lived some part of it. Acknowledging that plainly, once, does more for the room than any amount of careful phrasing later.",
          ],
        },
        {
          id: "m2-i3",
          kind: "video",
          title: "Handling difficult questions",
          minutes: 4,
          videoId: "cHIlftznV4k",
          body: [
            "A worked example of taking a hostile question without either conceding the point or shutting the person down.",
          ],
        },
        {
          id: "m2-i4",
          kind: "quiz",
          title: "Module 2 knowledge check",
          minutes: 5,
          questions: [
            {
              q: "When should ground rules be introduced?",
              options: [
                "Before they are needed, at the start",
                "The first time someone breaks one",
                "At the end, as a summary",
                "Only if the group asks for them",
              ],
              answer: 0,
              explanation: "Rules introduced after a difficult moment read as a reaction to that moment.",
            },
            {
              q: "What should the first question of a session do?",
              options: [
                "Test prior knowledge",
                "Be answerable by everyone present",
                "Identify the most experienced person",
                "Cover the hardest material first",
              ],
              answer: 1,
              explanation: "The aim is that the first voice in the room is not the facilitator's.",
            },
          ],
        },
      ],
    },
    {
      id: "m3",
      title: "Module 3 · Assessment and close",
      summary: "Closing a session well, and what happens after it.",
      items: [
        {
          id: "m3-i1",
          kind: "reading",
          title: "Closing a session",
          minutes: 5,
          body: [
            "## Land the plane",
            "A session that runs out of time has no ending; one that finishes early has one. Reserve the last ten minutes and protect them.",
            "## What people take away",
            "Ask each person for one thing they will do differently. Said aloud, it commits; written down, it survives the walk back to their desk.",
            "## Afterwards",
            "Send the materials the same day, while the session is still the most recent thing they associate with the subject.",
          ],
        },
        {
          id: "m3-i2",
          kind: "quiz",
          title: "Final assessment",
          minutes: 8,
          questions: [
            {
              q: "How much time should be reserved for closing?",
              options: ["Whatever is left", "The last ten minutes, protected", "Two minutes", "None — end on the last slide"],
              answer: 1,
              explanation: "A session that runs out of time has no ending; reserving the close gives it one.",
            },
            {
              q: "Why ask each participant to name one thing they will do differently?",
              options: [
                "To fill remaining time",
                "To assess who was paying attention",
                "Because saying it aloud commits, and writing it down makes it survive",
                "For the attendance record",
              ],
              answer: 2,
              explanation: "The point is commitment and recall, not assessment.",
            },
            {
              q: "When should session materials be sent?",
              options: ["The same day", "Within a month", "Only on request", "Before the session"],
              answer: 0,
              explanation: "While the session is still the most recent thing they associate with the subject.",
            },
          ],
        },
      ],
    },
  ],

  readingKit: [
    { title: "Facilitator session plan template", meta: "PDF · 4 pages" },
    { title: "Ground rules one-pager", meta: "PDF · 1 page" },
    { title: "Difficult questions — worked responses", meta: "PDF · 6 pages" },
    { title: "Post-session follow-up checklist", meta: "PDF · 2 pages" },
  ],
};

/* The staged curricula, mapped onto this shape so every course opens in the
   same player. See curriculumContent.ts for what the mapping drops. */
const FROM_CURRICULA = [POSH_CURRICULUM].reduce<Record<string, CourseContent>>((acc, c) => {
  acc[c.slug] = curriculumToContent(c, courseBySlug(c.slug)?.title ?? c.slug);
  return acc;
}, {});

export const COURSE_CONTENT: Record<string, CourseContent> = {
  ...FROM_CURRICULA,
  [DEMO_COURSE.slug]: DEMO_COURSE,
};

export const contentBySlug = (slug: string): CourseContent | undefined => COURSE_CONTENT[slug];

/* ----------------------------- derived helpers ---------------------------- */

/** Every item in course order, with its module — the sequence unlocking uses. */
export type FlatItem = CourseItem & { moduleId: string; moduleTitle: string; index: number };

export const flatItems = (c: CourseContent): FlatItem[] =>
  c.modules.flatMap((m) =>
    m.items.map((it) => ({ ...it, moduleId: m.id, moduleTitle: m.title })),
  ).map((it, index) => ({ ...it, index }));

export const totalItems = (c: CourseContent) => c.modules.reduce((n, m) => n + m.items.length, 0);

export const totalMinutes = (c: CourseContent) =>
  c.modules.reduce((n, m) => n + m.items.reduce((k, it) => k + it.minutes, 0), 0);
