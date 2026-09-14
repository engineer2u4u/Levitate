/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCourse } from "@/components/site/CatalogProvider";
import { claimEnrolment, useCourseAccess } from "@/lib/lms/access";
import { contentBySlug } from "@/lib/lms/courseContent";
import { courseStats, readProgress } from "@/lib/lms/courseProgress";
import { isPaid } from "@/lib/lms/enrolments";
import { supabaseConfigured } from "@/lib/lms/supabase";
import type { Enrolment } from "@/lib/lms/types";
import { useSession } from "./useSession";

const SANS = "'Plus Jakarta Sans',sans-serif";
const GRAD = "linear-gradient(120deg,#2fc4bc,#2f7fd6)";

/**
 * My Learning: every course the learner is enrolled in, the box for an
 * enrolment code the office sent them, and their next live session.
 */
export default function Dashboard() {
  const { user, loading, enrolments, openAuth } = useSession();

  if (loading) return <div style={{ background: "#f7fafc", minHeight: "60vh", padding: "38px 48px" }} />;

  if (!user) {
    return (
      <div style={{ background: "#f7fafc", padding: "80px 48px", minHeight: "60vh" }} className="site-page-sec">
        <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ font: `700 24px ${SANS}`, color: "#0a1b33", margin: "0 0 10px" }}>Sign in to see your learning</h1>
          <p style={{ font: `400 14px/1.7 ${SANS}`, color: "#5b6e82", margin: "0 0 22px" }}>
            Your enrolled courses, live sessions and certificates live here. Enrolled by our team? Create an account, then enter the enrolment code from your message.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button type="button" onClick={() => openAuth({ mode: "signin" })} className="lp-btn-grad" style={{ cursor: "pointer", border: "none", background: GRAD, color: "#fff", font: `700 13.5px ${SANS}`, padding: "13px 26px", borderRadius: 999 }}>
              Sign in
            </button>
            <button type="button" onClick={() => openAuth({ mode: "signup" })} className="lp-btn-outline" style={{ cursor: "pointer", background: "#fff", border: "1px solid #e3eaf0", color: "#0a1b33", font: `700 13.5px ${SANS}`, padding: "13px 26px", borderRadius: 999 }}>
              Create an account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // The course the side panel follows: the first paid one with lessons here.
  const primary = enrolments.find((e) => isPaid(e) && contentBySlug(e.courseSlug)) ?? enrolments.find(isPaid) ?? null;

  return (
    <div style={{ background: "#f7fafc", padding: "38px 48px 90px", minHeight: "60vh" }} className="site-page-sec">
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 24 }}>
          <div>
            <h1 style={{ font: `700 28px ${SANS}`, color: "#0a1b33", margin: "0 0 6px", letterSpacing: "-.02em" }}>
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <div style={{ font: `500 13.5px ${SANS}`, color: "#5b6e82" }}>
              {enrolments.length === 0 ? "No enrolments yet" : `${enrolments.length} enrolment${enrolments.length === 1 ? "" : "s"}`}
            </div>
          </div>
          {primary && contentBySlug(primary.courseSlug) && (
            <Link href={`/lms/learn/${primary.courseSlug}`} className="lp-btn-grad" style={{ background: GRAD, color: "#fff", font: `700 13.5px ${SANS}`, padding: "13px 24px", borderRadius: 999 }}>
              Continue learning →
            </Link>
          )}
        </div>

        <div className="lms-split" style={{ display: "grid", gridTemplateColumns: "1fr 330px", gap: 24, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "30px 32px" }}>
              <div style={{ font: `700 11.5px ${SANS}`, color: "#1b8f88", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 8 }}>Your courses</div>
              <div style={{ font: `700 20px ${SANS}`, color: "#0a1b33", marginBottom: 18 }}>Everything you are enrolled in</div>
              {enrolments.length === 0 ? (
                <div style={{ font: `400 14px/1.7 ${SANS}`, color: "#5b6e82" }}>
                  Nothing here yet. <Link href="/lms" style={{ color: "#1b8f88", fontWeight: 700 }}>Browse the certifications</Link>, or enter the enrolment code our team sent you.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {enrolments.map((e) => <EnrolmentCard key={e.id ?? e.courseSlug} e={e} userId={user.id} />)}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {supabaseConfigured && <ClaimCode />}
            {primary && <NextSession slug={primary.courseSlug} userId={user.id} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function EnrolmentCard({ e, userId }: { e: Enrolment; userId: string }) {
  const course = useCourse(e.courseSlug);
  const content = contentBySlug(e.courseSlug);
  const paid = isPaid(e);
  const [percent, setPercent] = useState<number | null>(null);

  useEffect(() => {
    if (!paid || !content) return;
    let alive = true;
    void readProgress(userId, e.courseSlug).then((p) => {
      if (alive) setPercent(courseStats(content, p).percent);
    });
    return () => { alive = false; };
  }, [paid, content, userId, e.courseSlug]);

  if (!course) return null;
  const href = paid && content ? `/lms/learn/${e.courseSlug}` : `/lms/course/${e.courseSlug}`;

  return (
    <div className="site-card" style={{ display: "flex", alignItems: "center", gap: 16, background: "#fff", border: `1px solid ${paid ? "rgba(27,143,136,.3)" : "#f0dcae"}`, borderRadius: 14, padding: "14px 16px", flexWrap: "wrap" }}>
      <img src={course.img} alt="" style={{ width: 80, height: 58, borderRadius: 11, flex: "none", objectFit: "cover" }} />
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ font: `700 14.5px/1.35 ${SANS}`, color: "#0a1b33" }}>{course.title}</div>
        <div style={{ font: `500 11.5px ${SANS}`, color: "#8296a9", marginTop: 4 }}>
          {[e.batchName ? `${e.batchName} batch` : "", course.mode, percent !== null ? `${percent}% complete` : ""].filter(Boolean).join(" · ")}
        </div>
        {percent !== null && (
          <div style={{ height: 6, borderRadius: 999, background: "#eef2f6", marginTop: 11, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${percent}%`, background: GRAD, borderRadius: 999 }} />
          </div>
        )}
      </div>
      <div style={{ textAlign: "right", flex: "none" }}>
        <div style={{ display: "inline-block", font: `700 10px ${SANS}`, letterSpacing: ".1em", textTransform: "uppercase", color: paid ? "#136f6a" : "#9a6a12", background: paid ? "rgba(47,196,188,.13)" : "#fdf4e3", border: `1px solid ${paid ? "rgba(27,143,136,.35)" : "#f0dcae"}`, borderRadius: 999, padding: "4px 10px" }}>
          {paid ? (percent === 100 ? "Completed" : "Enrolled") : "Payment pending"}
        </div>
        <div style={{ marginTop: 9 }}>
          {paid ? (
            <Link href={href} style={{ font: `600 11.5px ${SANS}`, color: "#1b8f88" }}>{content ? "Continue →" : "Course page →"}</Link>
          ) : e.paymentLink ? (
            <a href={e.paymentLink} target="_blank" rel="noopener noreferrer" style={{ font: `700 11.5px ${SANS}`, color: "#1b8f88" }}>Complete payment ↗</a>
          ) : (
            <span style={{ font: `500 11px ${SANS}`, color: "#8296a9" }}>Opens once payment is confirmed</span>
          )}
        </div>
      </div>
    </div>
  );
}

/** Where someone the office enrolled attaches their enrolment to this account. */
function ClaimCode() {
  const { refreshEnrolments } = useSession();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async () => {
    if (!code.trim() || busy) return;
    setBusy(true);
    setMessage(null);
    const res = await claimEnrolment(code);
    setBusy(false);
    if (!res.ok) {
      setMessage({ ok: false, text: res.error });
      return;
    }
    setCode("");
    setMessage({ ok: true, text: "Done — your course is now in your account." });
    await refreshEnrolments();
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 18, padding: 22 }}>
      <div style={{ font: `700 11px ${SANS}`, color: "#1b8f88", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 10 }}>Have an enrolment code?</div>
      <div style={{ font: `500 12.5px/1.6 ${SANS}`, color: "#5b6e82", marginBottom: 12 }}>
        If our team enrolled you, enter the code from your WhatsApp or email to add the course here.
      </div>
      <form onSubmit={(ev) => { ev.preventDefault(); void submit(); }} style={{ display: "flex", gap: 8 }}>
        <input
          value={code}
          onChange={(ev) => setCode(ev.target.value.toUpperCase())}
          placeholder="LVT-XXXXXX"
          aria-label="Enrolment code"
          autoComplete="off"
          spellCheck={false}
          style={{ flex: 1, minWidth: 0, background: "#f7fafc", border: "1px solid #e3eaf0", borderRadius: 11, padding: "11px 12px", font: `700 13.5px ${SANS}`, letterSpacing: ".06em", color: "#0a1b33" }}
        />
        <button type="submit" disabled={busy || !code.trim()} className="lp-btn-grad" style={{ cursor: busy ? "default" : "pointer", border: "none", background: GRAD, color: "#fff", font: `700 12.5px ${SANS}`, padding: "0 16px", borderRadius: 11, opacity: busy || !code.trim() ? 0.6 : 1 }}>
          {busy ? "Checking…" : "Add"}
        </button>
      </form>
      {message && (
        <div role={message.ok ? "status" : "alert"} style={{ font: `600 12px/1.5 ${SANS}`, color: message.ok ? "#136f6a" : "#a53f28", marginTop: 10 }}>
          {message.text}
        </div>
      )}
    </div>
  );
}

function NextSession({ slug, userId }: { slug: string; userId: string }) {
  const { access } = useCourseAccess(slug, userId);
  const next = access?.next_session;
  if (!access || !next) return null;
  const session = access.sessions.find((s) => s.starts_on === next.starts_on && s.time_label === next.time_label);

  return (
    <div style={{ background: "linear-gradient(135deg,#0c2a45,#0a1f38)", borderRadius: 20, padding: 26, color: "#fff" }}>
      <div style={{ font: `700 10.5px ${SANS}`, color: "#7fe3dc", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 14 }}>Next live session</div>
      <div style={{ font: `700 17px/1.35 ${SANS}` }}>{next.topic || access.course.title}</div>
      <div style={{ font: `600 13px ${SANS}`, color: "rgba(255,255,255,.8)", marginTop: 8 }}>{[next.date_label, next.time_label].filter(Boolean).join(" · ")}</div>
      {session?.join_url ? (
        <a href={session.join_url} target="_blank" rel="noopener noreferrer" className="lp-btn-white" style={{ display: "block", textAlign: "center", marginTop: 18, background: "#fff", color: "#0a1b33", font: `700 13px ${SANS}`, padding: "12px 18px", borderRadius: 999 }}>
          Join on Zoom ↗
        </a>
      ) : (
        <div style={{ font: `500 11.5px/1.6 ${SANS}`, color: "rgba(255,255,255,.6)", marginTop: 8 }}>
          {access.enrolment.status === "paid" ? "The Zoom link appears here once it is set." : "The Zoom link appears once your payment is confirmed."}
        </div>
      )}
      <Link href="/lms/sessions" style={{ display: "block", textAlign: "center", marginTop: 12, color: "rgba(255,255,255,.8)", font: `600 12px ${SANS}` }}>
        All sessions →
      </Link>
    </div>
  );
}
