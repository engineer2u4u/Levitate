/**
 * Renders a staged `Curriculum` through the self-paced player.
 *
 * The two content shapes were authored for different products — cohort pacing
 * versus self-paced progression — but there is now one learning screen, so the
 * older shape is mapped onto the newer one rather than kept alive by a second
 * player. Lesson ids are carried across unchanged, so anything already recorded
 * against them still matches.
 *
 * What does not carry across is stage release. A `Curriculum` stage opened when
 * a facilitator marked its live session complete; here the sequence itself is
 * the gate. That is deliberate — the live schedule has been taken off the
 * programme pages, and a stage nobody releases would strand the learner.
 */

import type { Curriculum, Lesson, Quiz } from "./types";
import type { CourseContent, CourseItem, CourseModule } from "./courseContent";

const KIND: Record<Lesson["kind"], "video" | "reading"> = { VID: "video", PDF: "reading" };

/** "Video · 9 min" → 9. Page counts carry no duration, so they report none
 *  rather than an invented one; `meta` keeps the original wording either way. */
const minutesFrom = (meta: string) => {
  const m = /(\d+)\s*min/.exec(meta);
  return m ? Number(m[1]) : 0;
};

const fromLesson = (l: Lesson): CourseItem => ({
  id: l.id,
  kind: KIND[l.kind],
  title: l.title,
  minutes: minutesFrom(l.meta),
  meta: l.meta,
  body: [l.desc],
});

const fromQuiz = (q: Quiz, stageTitle: string): CourseItem => ({
  // Prefixed so it cannot collide with a lesson id.
  id: `qz-${q.stage}`,
  kind: "quiz",
  // Several stage quizzes are named after their stage, which reads as a
  // repeat of the heading directly above them in the rail.
  title: q.title === stageTitle ? "Knowledge check" : q.title,
  minutes: 0,
  meta: `Quiz · ${q.questions.length} questions`,
  questions: q.questions,
});

export function curriculumToContent(c: Curriculum, title: string): CourseContent {
  return {
    slug: c.slug,
    title,
    intro: c.blurb,
    modules: c.stages.map(
      (s): CourseModule => ({
        id: s.id,
        title: s.title,
        // The stage's own `release` line names a live session and a date, which
        // is no longer what opens it. Better to say nothing than something
        // untrue.
        summary: "",
        // A stage's quiz closes it, which is where it sat in the staged player.
        items: [
          ...s.lessons.map(fromLesson),
          ...c.quizzes.filter((q) => q.stage === s.num).map((q) => fromQuiz(q, s.title)),
        ],
      }),
    ),
    readingKit: c.finalKit,
  };
}
