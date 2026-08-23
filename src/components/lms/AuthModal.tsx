"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { auth } from "@/lib/lms/auth";

export type AuthMode = "signin" | "signup";

const label: CSSProperties = {
  font: "700 10.5px 'Plus Jakarta Sans',sans-serif",
  color: "#5b6e82",
  letterSpacing: ".1em",
  textTransform: "uppercase",
  marginBottom: 7,
};

const input: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "#f7fafc",
  border: "1px solid #e3eaf0",
  borderRadius: 11,
  padding: "12px 14px",
  font: "500 13.5px 'Plus Jakarta Sans',sans-serif",
  color: "#0a1b33",
  outline: "none",
};

type Props = {
  /** Which adapter is live, so the UI can be honest about demo accounts. */
  authKind: "supabase" | "local";
  initialMode?: AuthMode;
  /** Copy explaining why the modal appeared, e.g. before checkout. */
  reason?: string;
  onClose: () => void;
  onDone: () => void;
};

export default function AuthModal({ authKind, initialMode = "signin", reason, onClose, onDone }: Props) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Escape closes, and the modal owns focus while it is up.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const res =
      mode === "signup"
        ? await auth.signUp({ name, email, password, org })
        : await auth.signIn(email, password);
    setBusy(false);
    if (res.ok) {
      onDone();
    } else {
      setError(res.error);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={mode === "signup" ? "Create your account" : "Sign in"}
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(6,18,32,.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 28 }}
    >
      <button type="button" aria-label="Close" onClick={onClose} style={{ position: "absolute", inset: 0, cursor: "pointer", border: "none", background: "transparent", padding: 0 }} />
      <div style={{ position: "relative", width: "100%", maxWidth: 430, background: "#fff", borderRadius: 22, padding: "30px 30px 28px", boxShadow: "0 30px 70px rgba(4,16,30,.4)", maxHeight: "90vh", overflowY: "auto" }}>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{ position: "absolute", top: 16, right: 18, cursor: "pointer", width: 28, height: 28, borderRadius: "50%", border: "none", background: "transparent", color: "#8296a9", font: "600 17px 'Plus Jakarta Sans',sans-serif" }}
        >
          ×
        </button>

        <div style={{ font: "700 10.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 9 }}>Levitate Learning</div>
        <div style={{ font: "700 21px/1.3 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", letterSpacing: "-.01em", marginBottom: 6 }}>
          {mode === "signup" ? "Create your Levitate learning account" : "Sign in to continue"}
        </div>
        <div style={{ font: "500 12.5px/1.6 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginBottom: 20 }}>
          {reason ?? (mode === "signup" ? "It takes under a minute." : "New to Levitate? Switch to Sign up.")}
        </div>

        <div style={{ display: "flex", gap: 6, background: "#f7fafc", border: "1px solid #eef2f6", borderRadius: 999, padding: 5, marginBottom: 20 }}>
          {(["signin", "signup"] as AuthMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError(""); }}
              style={{ flex: 1, textAlign: "center", cursor: "pointer", border: "none", font: "700 12.5px 'Plus Jakarta Sans',sans-serif", color: mode === m ? "#fff" : "#5b6e82", background: mode === m ? "linear-gradient(120deg,#2fc4bc,#2f7fd6)" : "transparent", borderRadius: 999, padding: "10px 12px" }}
            >
              {m === "signin" ? "Sign in" : "Sign up"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          {mode === "signup" && (
            <>
              <div>
                <div style={label}>Full name</div>
                <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Your name" style={input} />
              </div>
              <div>
                <div style={label}>Organisation</div>
                <input value={org} onChange={(e) => setOrg(e.target.value)} autoComplete="organization" placeholder="Where you work" style={input} />
              </div>
            </>
          )}
          <div>
            <div style={label}>{mode === "signup" ? "Work email" : "Email"}</div>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@company.com" style={input} />
          </div>
          <div>
            <div style={label}>{mode === "signup" ? "Create password" : "Password"}</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              placeholder={mode === "signup" ? "Minimum 8 characters" : "Your password"}
              style={input}
            />
          </div>

          {error && (
            <div role="alert" style={{ font: "600 12px/1.5 'Plus Jakarta Sans',sans-serif", color: "#a53f28", background: "rgba(226,86,74,.08)", border: "1px solid rgba(226,86,74,.28)", borderRadius: 10, padding: "10px 12px" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="lp-btn-grad"
            style={{ cursor: busy ? "wait" : "pointer", border: "none", textAlign: "center", marginTop: 7, background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", padding: "14px 20px", borderRadius: 999, opacity: busy ? 0.75 : 1 }}
          >
            {busy ? "Please wait…" : mode === "signup" ? "Create account & continue" : "Sign in & continue"}
          </button>
        </form>

        {authKind === "local" && (
          <div style={{ font: "500 10.5px/1.6 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginTop: 12, textAlign: "center", background: "#f7fafc", border: "1px solid #eef2f6", borderRadius: 10, padding: "9px 11px" }}>
            Demo mode — accounts are stored in this browser only and are not secure.
          </div>
        )}
      </div>
    </div>
  );
}
