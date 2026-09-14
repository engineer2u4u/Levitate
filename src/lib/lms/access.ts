"use client";

import { useCallback, useEffect, useState } from "react";
import { getClient, supabaseConfigured } from "./supabase";

/**
 * What the signed-in learner can reach on one course, as the database decides
 * it (the `my_course_access` function): their enrolment and batch, the batch's
 * live sessions, and which modules are open.
 *
 * Zoom details and open modules arrive only once payment is marked paid, so a
 * pending enrolment cannot reveal them by reading this in the browser.
 */
export type AccessSession = {
  id: string;
  starts_on: string | null;
  starts_at: string | null;
  ends_at: string | null;
  date_label: string;
  time_label: string;
  topic: string;
  mode: string;
  trainer: string;
  join_url: string | null;
  meeting_id: string | null;
  passcode: string | null;
  recording_url: string | null;
};

export type AccessModule = { id: string; title: string; release: "enrolment" | "manual"; item_ids: string[] };

export type CourseAccess = {
  course: { slug: string; title: string };
  enrolment: { id: string; status: "pending" | "paid"; payment_link: string; paid_at: string | null };
  batch: { id: string; name: string; status: string; starts_on: string | null; ends_on: string | null };
  sessions: AccessSession[];
  modules: AccessModule[];
  unlocked_module_ids: string[];
  next_session: { starts_on: string | null; starts_at: string | null; date_label: string; time_label: string; topic: string } | null;
};

export async function readCourseAccess(slug: string): Promise<CourseAccess | null> {
  if (!supabaseConfigured) return null;
  const { data, error } = await (await getClient()).rpc("my_course_access", { p_slug: slug });
  if (error) throw new Error(error.message);
  return (data as CourseAccess | null) ?? null;
}

/**
 * Loads access for a course once a learner is known. `userId` is a dependency
 * so signing in as someone else reloads it rather than showing their view.
 */
export function useCourseAccess(slug: string, userId: string | null) {
  const [version, setVersion] = useState(0);
  // What to load, as one value: a different learner, course or refresh is a
  // different key. An answer is kept with the key it was for, so one arriving
  // late for an earlier key is never shown as the current one.
  const key = supabaseConfigured && userId && slug ? `${userId}:${slug}:${version}` : "";
  const [result, setResult] = useState<{ key: string; access: CourseAccess | null; error: string }>({ key: "", access: null, error: "" });

  useEffect(() => {
    if (!key) return;
    let alive = true;
    readCourseAccess(slug).then(
      (access) => { if (alive) setResult({ key, access, error: "" }); },
      (e: Error) => { if (alive) setResult({ key, access: null, error: e.message }); },
    );
    return () => { alive = false; };
  }, [key, slug]);

  const current = result.key === key;
  const refresh = useCallback(() => setVersion((v) => v + 1), []);
  return {
    access: key && current ? result.access : null,
    loading: Boolean(key) && !current,
    error: current ? result.error : "",
    refresh,
  };
}

/**
 * The module gate for a course, or null when the course is not taught in
 * batches (its database module list carries no lesson ids to gate).
 *
 * Also checks the ids line up with the content in this build: a module
 * renamed in one place and not the other would otherwise stay closed forever
 * with nothing to say why.
 */
export function moduleGate(access: CourseAccess | null, contentModuleIds: string[]): { open: ReadonlySet<string> } | null {
  if (!access || !access.modules.some((m) => m.item_ids.length > 0)) return null;
  const known = new Set(access.modules.map((m) => m.id));
  const missing = contentModuleIds.filter((id) => !known.has(id));
  if (missing.length) {
    console.warn(`[LMS] Modules in the content but not in the database: ${missing.join(", ")}. They stay closed until the lists match.`);
  }
  return { open: new Set(access.unlocked_module_ids) };
}

/** Attaches the enrolment an admin's code belongs to, to the signed-in account. */
export async function claimEnrolment(code: string): Promise<{ ok: true; courseSlug: string } | { ok: false; error: string }> {
  if (!supabaseConfigured) return { ok: false, error: "Enrolment codes need the live site." };
  const { data, error } = await (await getClient()).rpc("claim_enrolment", { p_code: code });
  if (error) return { ok: false, error: "Could not check that code just now. Try again in a moment." };
  const res = data as { ok: boolean; error?: string; course_slug?: string };
  return res.ok ? { ok: true, courseSlug: res.course_slug ?? "" } : { ok: false, error: res.error ?? "That code did not work." };
}
