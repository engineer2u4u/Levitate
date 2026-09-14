import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * The one Supabase client the LMS uses.
 *
 * Auth, progress, enrolments and course access all go through it. Two clients
 * in one page each keep their own copy of the session and refresh it on their
 * own schedule — a sign-in seen by one is invisible to the other until reload —
 * so every module asks here rather than creating its own.
 *
 * Imported lazily, so a page that never touches the LMS never downloads the SDK.
 */
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True once a Supabase project is configured at build time. */
export const supabaseConfigured = Boolean(URL && ANON);

export const supabaseConfig = { url: URL, anonKey: ANON };

let clientPromise: Promise<SupabaseClient> | null = null;

export function getClient(): Promise<SupabaseClient> {
  clientPromise ??= import("@supabase/supabase-js").then((m) =>
    m.createClient(URL, ANON, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    }),
  );
  return clientPromise;
}

/** The signed-in learner's access token, for calls to the payment server. */
export async function accessToken(): Promise<string | null> {
  if (!supabaseConfigured) return null;
  const { data } = await (await getClient()).auth.getSession();
  return data.session?.access_token ?? null;
}
