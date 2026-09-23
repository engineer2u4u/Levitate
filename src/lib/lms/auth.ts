import { getClient, supabaseConfig, supabaseConfigured } from "./supabase";
import type { LmsUser } from "./types";

// Re-exported: screens have always imported these from here.
export { supabaseConfig, supabaseConfigured };

/**
 * Auth is deliberately behind a narrow interface.
 *
 * The site is a static export on Apache with no server, so there is nothing to
 * hold a session server-side. Supabase works in that setting because the whole
 * exchange is browser-to-Supabase over the anon key — but until a project is
 * configured we fall back to a local adapter so the flow is still clickable.
 *
 * Swapping adapters must never require touching a screen: everything above
 * this file talks only to `AuthAdapter`.
 */
export type AuthResult = { ok: true; user: LmsUser } | { ok: false; error: string };

export type AuthAdapter = {
  /** Human-readable, shown in the UI so nobody mistakes local for real auth. */
  readonly kind: "supabase" | "local";
  getUser(): Promise<LmsUser | null>;
  signIn(email: string, password: string): Promise<AuthResult>;
  signUp(input: { name: string; email: string; password: string; org: string }): Promise<AuthResult>;
  signOut(): Promise<void>;
  /** Fires whenever the session changes. Returns an unsubscribe. */
  onChange(cb: (user: LmsUser | null) => void): () => void;
};

/* ------------------------------------------------------------------ */
/* Local adapter — browser only, no security, for demoing the flow     */
/* ------------------------------------------------------------------ */

const USERS_KEY = "lvt.lms.users";
const SESSION_KEY = "lvt.lms.session";

type StoredUser = LmsUser & { password: string };

const readJson = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode / quota — the session simply will not persist */
  }
};

const listeners = new Set<(u: LmsUser | null) => void>();
const emit = (u: LmsUser | null) => listeners.forEach((l) => l(u));

const strip = (u: StoredUser): LmsUser => ({ id: u.id, name: u.name, email: u.email, org: u.org });

export const localAuth: AuthAdapter = {
  kind: "local",

  async getUser() {
    const id = readJson<string | null>(SESSION_KEY, null);
    if (!id) return null;
    const found = readJson<StoredUser[]>(USERS_KEY, []).find((u) => u.id === id);
    return found ? strip(found) : null;
  },

  async signIn(email, password) {
    const users = readJson<StoredUser[]>(USERS_KEY, []);
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) return { ok: false, error: "No account found for that email." };
    if (found.password !== password) return { ok: false, error: "That password does not match." };
    writeJson(SESSION_KEY, found.id);
    const user = strip(found);
    emit(user);
    return { ok: true, user };
  },

  async signUp({ name, email, password, org }) {
    const clean = email.trim().toLowerCase();
    if (!name.trim()) return { ok: false, error: "Please enter your name." };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return { ok: false, error: "Please enter a valid email address." };
    if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };

    const users = readJson<StoredUser[]>(USERS_KEY, []);
    if (users.some((u) => u.email.toLowerCase() === clean)) {
      return { ok: false, error: "An account already exists for that email." };
    }
    const stored: StoredUser = {
      id: "u_" + Math.random().toString(36).slice(2, 11),
      name: name.trim(),
      email: clean,
      org: org.trim(),
      password,
    };
    writeJson(USERS_KEY, [...users, stored]);
    writeJson(SESSION_KEY, stored.id);
    const user = strip(stored);
    emit(user);
    return { ok: true, user };
  },

  async signOut() {
    writeJson(SESSION_KEY, null);
    emit(null);
  },

  onChange(cb) {
    listeners.add(cb);
    return () => listeners.delete(cb) as unknown as void;
  },
};

/* ------------------------------------------------------------------ */
/* Supabase adapter — loaded only when a project is configured         */
/* ------------------------------------------------------------------ */

/** Name and organisation ride in user_metadata; Supabase owns identity. */
type SupaMeta = { name?: string; org?: string };

const toUser = (u: { id: string; email?: string; user_metadata?: SupaMeta } | null): LmsUser | null =>
  u
    ? {
        id: u.id,
        email: u.email ?? "",
        name: u.user_metadata?.name?.trim() || (u.email ?? "").split("@")[0],
        org: u.user_metadata?.org ?? "",
      }
    : null;

/**
 * Whether this account belongs to the admin portal rather than the LMS.
 *
 * The portal lives at /admin-panel on this same domain, so it shares this
 * origin — and therefore the one Supabase session in localStorage. Signing in
 * there would otherwise appear here as a signed-in learner, which is wrong
 * twice over: staff hold no enrolment, and a learner screen is not where an
 * admin's own progress or certificates should be invented.
 *
 * Read from the caller's own profile row, which is all RLS lets them see. A
 * failed read is treated as "not staff": the honest default for a learner
 * whose profile has not been written yet, and nothing is granted by it — every
 * course still needs a paid enrolment, which staff do not have.
 */
async function isStaffAccount(userId: string): Promise<boolean> {
  try {
    const { data } = await (await getClient())
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();
    const role = (data as { role?: string } | null)?.role ?? "learner";
    return role === "admin" || role === "viewer";
  } catch {
    return false;
  }
}

export const supabaseAuth: AuthAdapter = {
  kind: "supabase",

  async getUser() {
    const { data } = await (await getClient()).auth.getUser();
    const user = toUser(data.user);
    // Staff are simply not signed in as far as the LMS is concerned. Their
    // session is left alone rather than ended, because ending it would sign
    // them out of the admin portal in the other tab.
    if (user && (await isStaffAccount(user.id))) return null;
    return user;
  },

  async signIn(email, password) {
    const { data, error } = await (await getClient()).auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) return { ok: false, error: error.message };
    const user = toUser(data.user);
    if (!user) return { ok: false, error: "Sign-in failed." };
    if (await isStaffAccount(user.id)) {
      // Deliberately the same words Supabase gives for a wrong password, so
      // the refusal says nothing about the account behind it. Naming it as
      // staff would tell anyone who tried an address that it belongs to
      // someone who can open the admin portal — a hint worth having if you
      // are guessing at passwords, and of no use to a real learner.
      return { ok: false, error: "Invalid login credentials" };
    }
    return { ok: true, user };
  },

  async signUp({ name, email, password, org }) {
    const { data, error } = await (await getClient()).auth.signUp({
      email: email.trim(),
      password,
      options: { data: { name: name.trim(), org: org.trim() } },
    });
    if (error) return { ok: false, error: error.message };
    const user = toUser(data.user);
    // Email confirmation is off for this project, so a session comes back at
    // once. If it is ever switched on, say so rather than dropping the learner
    // on a screen that looks signed out.
    if (!data.session) {
      return { ok: false, error: "Check your inbox to confirm your email, then sign in." };
    }
    return user ? { ok: true, user } : { ok: false, error: "Sign-up failed." };
  },

  async signOut() {
    await (await getClient()).auth.signOut();
  },

  onChange(cb) {
    let unsub = () => {};
    let live = true;
    void getClient().then((c) => {
      const { data } = c.auth.onAuthStateChange((_e, session) => {
        const user = toUser(session?.user ?? null);
        if (!user) return cb(null);
        // Same rule as getUser: an admin signing in next door does not become
        // a learner here. Checked per change, since the session is shared.
        void isStaffAccount(user.id).then((staff) => {
          if (live) cb(staff ? null : user);
        });
      });
      unsub = () => data.subscription.unsubscribe();
    });
    return () => {
      live = false;
      unsub();
    };
  },
};

export const auth: AuthAdapter = supabaseConfigured ? supabaseAuth : localAuth;
