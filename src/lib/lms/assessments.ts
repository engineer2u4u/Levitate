import { getClient, supabaseConfigured } from "./supabase";

/**
 * The final assessment's result, kept.
 *
 * Stage quizzes are not recorded and should not be: 2 out of 3 on a check
 * halfway through a module says nothing about anybody, and a mark against
 * someone's name that cannot be interpreted is worse than no mark. The final
 * assessment is different — it is the one the certificate stands on, and
 * "what did they score, and how many attempts did it take" is a question the
 * office has to be able to answer.
 *
 * Every attempt is kept rather than only the best, which is what makes the
 * second question answerable.
 *
 * What this is NOT: proof. The quiz is marked in the browser, so the number
 * recorded is what the page submitted, not what was independently earned. It
 * is a record of what happened in a learner's session, useful for a
 * conversation, not evidence to be relied on against someone.
 */
export type AssessmentResult = { ok: true } | { ok: false; reason: "no-table" | "refused"; message: string };

/** The table and its function are not installed until the migration is run. */
const missingFunction = (code?: string, message?: string) =>
  code === "PGRST202" || /could not find the function|schema cache/i.test(message ?? "");

/**
 * Records one attempt at the final assessment.
 *
 * Never throws and never blocks: a learner who has passed has passed, and a
 * database that cannot be reached is not their problem — the same rule the
 * acknowledgement's mail follows. The caller does not wait for this.
 */
export async function recordAssessment(input: {
  courseSlug: string;
  itemId: string;
  score: number;
  total: number;
  passed: boolean;
}): Promise<AssessmentResult> {
  if (!supabaseConfigured) {
    return { ok: false, reason: "no-table", message: "Assessment results are kept on the live site." };
  }
  try {
    const supabase = await getClient();
    const { error } = await supabase.rpc("record_assessment", {
      p_course_slug: input.courseSlug,
      p_item_id: input.itemId,
      p_score: input.score,
      p_total: input.total,
      p_passed: input.passed,
    });
    if (error) {
      return missingFunction(error.code, error.message)
        ? { ok: false, reason: "no-table", message: "Assessment results are not being recorded yet." }
        : { ok: false, reason: "refused", message: error.message };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: "refused", message: (e as Error).message };
  }
}
