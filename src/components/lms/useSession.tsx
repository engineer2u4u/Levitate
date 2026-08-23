"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { auth, supabaseConfigured } from "@/lib/lms/auth";
import { EMPTY, onEnrolmentsChange, readEnrolments } from "@/lib/lms/enrolments";
import type { Enrolment, LmsUser } from "@/lib/lms/types";
import AuthModal, { type AuthMode } from "./AuthModal";

type OpenAuth = (opts?: { mode?: AuthMode; reason?: string; onDone?: () => void }) => void;

type SessionValue = {
  user: LmsUser | null;
  /** True until the first auth check resolves — screens must not flash signed-out. */
  loading: boolean;
  enrolments: Enrolment[];
  /** Which adapter is live, so the UI can be honest about demo accounts. */
  authKind: "supabase" | "local";
  signOut: () => Promise<void>;
  /** Raises the sign-in modal from anywhere, with an optional post-auth action. */
  openAuth: OpenAuth;
};

const Ctx = createContext<SessionValue | null>(null);

type Pending = { mode: AuthMode; reason?: string; onDone?: () => void } | null;

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LmsUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState<Pending>(null);

  useEffect(() => {
    let alive = true;
    void auth.getUser().then((u) => {
      if (!alive) return;
      setUser(u);
      setLoading(false);
    });
    const unsub = auth.onChange((u) => {
      if (alive) setUser(u);
    });
    return () => {
      alive = false;
      unsub();
    };
  }, []);

  // Enrolments come straight from the store rather than mirrored into state,
  // so a write anywhere re-renders every screen reading them. The store hands
  // back a stable reference between writes, which this relies on.
  const userId = user?.id ?? "";
  const enrolments = useSyncExternalStore(
    onEnrolmentsChange,
    useCallback(() => (userId ? readEnrolments(userId) : EMPTY), [userId]),
    // The server has no storage; rendering empty keeps hydration consistent.
    useCallback(() => EMPTY, []),
  );

  const signOut = useCallback(async () => {
    await auth.signOut();
    setUser(null);
  }, []);

  const openAuth = useCallback<OpenAuth>((opts) => {
    setPending({ mode: opts?.mode ?? "signin", reason: opts?.reason, onDone: opts?.onDone });
  }, []);

  const value = useMemo<SessionValue>(
    () => ({ user, loading, enrolments, authKind: supabaseConfigured ? "supabase" : "local", signOut, openAuth }),
    [user, loading, enrolments, signOut, openAuth],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      {/* Mounted only while open, so each visit starts from clean state. */}
      {pending && (
        <AuthModal
          authKind={value.authKind}
          initialMode={pending.mode}
          reason={pending.reason}
          onClose={() => setPending(null)}
          onDone={() => {
            const done = pending.onDone;
            setPending(null);
            done?.();
          }}
        />
      )}
    </Ctx.Provider>
  );
}

export function useSession() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSession must be used inside <SessionProvider>");
  return v;
}
