"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "./useSession";
import { LMS_TESTING } from "@/lib/lms/testMode";

const TABS = [
  { href: "/lms", label: "Courses" },
  { href: "/lms/dashboard", label: "My Learning" },
  { href: "/lms/sessions", label: "Live Sessions" },
  { href: "/lms/certificates", label: "Certificates" },
] as const;

const initialsOf = (name: string) =>
  name.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";

/**
 * The learner-facing bar under the site header: account state on the right,
 * section tabs beneath. Also owns the auth modal, since every screen that needs
 * a signed-in learner routes through here.
 */
export default function LmsChrome() {
  const { user, loading, signOut, openAuth } = useSession();
  const pathname = usePathname() ?? "/lms";
  const router = useRouter();
  const active = (href: string) =>
    href === "/lms" ? pathname === "/lms" || pathname.startsWith("/lms/course") : pathname.startsWith(href);

  /**
   * Programme pages are public marketing pages reached from the Certifications
   * menu, so they do not show the learner bar — a visitor reading about a
   * certification should not meet "My Learning" tabs and a sign-in button for
   * an LMS that is not open yet. The component still mounts, because it owns
   * the auth modal every LMS screen routes through.
   */
  // Testing builds keep the bar everywhere: signing in is how the flow starts.
  const publicPage = !LMS_TESTING && pathname.startsWith("/lms/course");

  return (
    <>
      {!publicPage && (
      <div style={{ background: "#fff", borderBottom: "1px solid #e3eaf0", padding: "12px 48px" }} className="site-page-sec">
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".18em", textTransform: "uppercase" }}>
            Levitate Learning
          </div>

          {loading ? (
            <div style={{ width: 150, height: 34, borderRadius: 999, background: "#f4f7f9" }} aria-hidden />
          ) : user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ font: "700 12.5px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{user.name}</div>
                <div style={{ font: "500 11px 'Plus Jakarta Sans',sans-serif", color: "#8296a9" }}>{user.email}</div>
              </div>
              <div aria-hidden style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 13px 'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {initialsOf(user.name)}
              </div>
              <button
                type="button"
                onClick={() => { void signOut().then(() => router.push("/lms")); }}
                style={{ cursor: "pointer", font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", background: "#fff", border: "1px solid #e3eaf0", borderRadius: 999, padding: "8px 13px" }}
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuth({ mode: "signin" })}
              className="lp-btn-grad"
              style={{ cursor: "pointer", border: "none", font: "700 12.5px 'Plus Jakarta Sans',sans-serif", color: "#fff", background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", borderRadius: 999, padding: "10px 20px" }}
            >
              Sign in / Sign up
            </button>
          )}
        </div>
      </div>
      )}

      {user && !publicPage && (
        <div style={{ background: "#fff", borderBottom: "1px solid #e3eaf0", padding: "0 48px" }} className="site-page-sec">
          <div className="lms-tabs" style={{ maxWidth: 1240, margin: "0 auto", display: "flex", gap: 4, overflowX: "auto" }}>
            {TABS.map((t) => {
              const on = active(t.href);
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  style={{ padding: "15px 18px", font: "700 13px 'Plus Jakarta Sans',sans-serif", color: on ? "#0a1b33" : "#5b6e82", borderBottom: `2px solid ${on ? "#2fc4bc" : "transparent"}`, whiteSpace: "nowrap" }}
                >
                  {t.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
