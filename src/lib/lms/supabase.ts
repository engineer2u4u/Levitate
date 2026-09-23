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

/**
 * Where this app keeps its session.
 *
 * Named on purpose, and different from the admin portal's key. The portal
 * lives at /admin-panel on this same domain, and same domain means one
 * localStorage: on Supabase's default key the two apps shared a single
 * session, so signing in as an admin next door appeared here as a signed-in
 * learner, and signing out of either signed you out of both. Two keys make
 * them what they should always have been — two independent logins, so an
 * admin and a learner account can be signed in side by side.
 */
const STORAGE_KEY = "lvt.lms.auth";

export function getClient(): Promise<SupabaseClient> {
  clientPromise ??= import("@supabase/supabase-js").then((m) =>
    m.createClient(URL, ANON, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: STORAGE_KEY },
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
