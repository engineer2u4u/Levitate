"use client";

import Link from "next/link";
import { useState } from "react";
import { useCourse } from "@/components/site/CatalogProvider";
import { dateTile } from "@/lib/catalog";
import { useCourseAccess, type AccessSession } from "@/lib/lms/access";
import { isPaid } from "@/lib/lms/enrolments";
import { useSession } from "./useSession";

const SANS = "'Plus Jakarta Sans',sans-serif";
const GRAD = "linear-gradient(120deg,#2fc4bc,#2f7fd6)";

/** When a session is over: its end, else its start plus a day. */
const endOf = (s: AccessSession) =>
  Date.parse(s.ends_at ?? "") || Date.parse(s.starts_at ?? "") + 3 * 3600_000 || (s.starts_on ? Date.parse(`${s.starts_on}T23:59:59+05:30`) : Infinity);

/**
 * The learner's live sessions for their batch, with the Zoom link for each —
 * shown only once payment is confirmed, which the database enforces: a pending
 * enrolment is never sent the links at all.
 */
export default function LiveSessions() {
  const { user, loading, enrolments } = useSession();
  // Paid enrolments first; a pending one still shows its dates.
  const choices = [...enrolments].sort((a, b) => Number(isPaid(b)) - Number(isPaid(a)));
  const [picked, setPicked] = useState("");
  const slug = picked || choices[0]?.courseSlug || "";
  const course = useCourse(slug);
  const { access, loading: accessLoading } = useCourseAccess(slug, user?.id ?? null);
  // Read once when the page opens: what is "held" and "next" does not need to
  // change under someone while they read it.
  const [now] = useState(Date.now);

  if (loading || (slug && accessLoading)) return <div style={{ background: "#f7fafc", minHeight: "60vh" }} />;

  if (!user || !access) {
    return (
      <div style={{ background: "#f7fafc", padding: "70px 48px", minHeight: "60vh" }} className="site-page-sec">
        <div style={{ maxWidth: 600, margin: "0 auto", background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "34px 36px", textAlign: "center" }}>
          <h1 style={{ font: `700 21px ${SANS}`, color: "#0a1b33", margin: "0 0 10px" }}>No live sessions yet</h1>
          <p style={{ font: `400 14px/1.7 ${SANS}`, color: "#5b6e82", margin: "0 0 20px" }}>
            Once you are enrolled in a batch, its session dates and Zoom links appear here.
          </p>
          <Link href="/lms/dashboard" className="lp-btn-grad" style={{ display: "inline-block", background: GRAD, color: "#fff", font: `700 13.5px ${SANS}`, padding: "13px 26px", borderRadius: 999 }}>Go to My Learning</Link>
        </div>
      </div>
    );
  }

  const paid = access.enrolment.status === "paid";
  const nextId = access.sessions.find((s) => endOf(s) > now)?.id;

  return (
    <div style={{ background: "#f7fafc", padding: "38px 48px 90px", minHeight: "60vh" }} className="site-page-sec">
      <div style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 26 }}>
          <div>
            <h1 style={{ font: `700 27px ${SANS}`, color: "#0a1b33", margin: "0 0 6px", letterSpacing: "-.02em" }}>Live sessions</h1>
            <div style={{ font: `500 13.5px ${SANS}`, color: "#5b6e82" }}>
              {access.course.title} · {access.batch.name} batch · {access.sessions.length} session{access.sessions.length === 1 ? "" : "s"}
            </div>
          </div>
          {choices.length > 1 && (
            <select value={slug} onChange={(e) => setPicked(e.target.value)} aria-label="Course" style={{ border: "1px solid #e3eaf0", borderRadius: 11, padding: "10px 12px", font: `600 13px ${SANS}`, background: "#fff" }}>
              {choices.map((e) => <option key={e.id ?? e.courseSlug} value={e.courseSlug}>{e.courseSlug}{e.batchName ? ` · ${e.batchName}` : ""}</option>)}
            </select>
          )}
        </div>

        {!paid && (
          <div style={{ font: `600 13px/1.6 ${SANS}`, color: "#9a6a12", background: "#fdf4e3", border: "1px solid #f0dcae", borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
            Your payment is still to be confirmed. The dates are below; the Zoom links appear here as soon as it is.
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {access.sessions.length === 0 && (
            <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 16, padding: "24px", font: `500 13.5px ${SANS}`, color: "#5b6e82" }}>
              The session dates for this batch have not been published yet.
            </div>
          )}
          {access.sessions.map((s, i) => {
            const held = endOf(s) <= now;
            const next = s.id === nextId;
            const tile = s.starts_on ? dateTile(s.starts_on) : { day: "—", month: "" };
            return (
              <div key={s.id} style={{ background: "#fff", border: `1px solid ${next ? "rgba(27,143,136,.45)" : "#e3eaf0"}`, borderRadius: 16, padding: "22px 24px", display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
                <div style={{ textAlign: "center", background: held ? "rgba(47,196,188,.12)" : next ? "linear-gradient(135deg,#2fc4bc,#2f7fd6)" : "#f7fafc", border: `1px solid ${next ? "transparent" : held ? "rgba(27,143,136,.3)" : "#e3eaf0"}`, borderRadius: 13, padding: "12px 14px", minWidth: 64, flex: "none" }}>
                  <div style={{ font: `700 19px ${SANS}`, color: next ? "#fff" : "#0a1b33" }}>{tile.day}</div>
                  <div style={{ font: `700 10px ${SANS}`, color: next ? "rgba(255,255,255,.85)" : "#8296a9", letterSpacing: ".1em", textTransform: "uppercase" }}>{tile.month}</div>
                </div>

                <div style={{ flex: 1, minWidth: 230 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ font: `700 16px ${SANS}`, color: "#0a1b33" }}>{s.topic || `Session ${i + 1}`}</div>
                    <div style={{ font: `700 9.5px ${SANS}`, letterSpacing: ".1em", textTransform: "uppercase", color: held ? "#136f6a" : next ? "#1f5fa8" : "#8296a9", background: held ? "rgba(47,196,188,.12)" : next ? "rgba(47,127,214,.1)" : "#f4f7f9", border: `1px solid ${held ? "rgba(27,143,136,.35)" : next ? "rgba(47,127,214,.3)" : "#dbe5ec"}`, borderRadius: 999, padding: "4px 9px" }}>
                      {held ? "Held" : next ? "Up next" : "Scheduled"}
                    </div>
                  </div>
                  <div style={{ font: `500 12.5px ${SANS}`, color: "#5b6e82", marginTop: 6 }}>
                    Session {i + 1} · {[s.date_label, s.time_label, s.mode].filter(Boolean).join(" · ")}
                  </div>
                  {paid && !held && (s.meeting_id || s.passcode) && (
                    <div style={{ font: `500 11.5px ${SANS}`, color: "#8296a9", marginTop: 6 }}>
                      {[s.meeting_id ? `Meeting ID ${s.meeting_id}` : "", s.passcode ? `Passcode ${s.passcode}` : ""].filter(Boolean).join(" · ")}
                    </div>
                  )}
                </div>

                {held && s.recording_url ? (
                  <a href={s.recording_url} target="_blank" rel="noopener noreferrer" className="lp-btn-outline" style={{ background: "#fff", border: "1px solid #e3eaf0", color: "#0a1b33", font: `700 12.5px ${SANS}`, padding: "11px 20px", borderRadius: 999, whiteSpace: "nowrap" }}>
                    Watch recording ↗
                  </a>
                ) : !held && s.join_url ? (
                  <a href={s.join_url} target="_blank" rel="noopener noreferrer" className="lp-btn-grad" style={{ background: next ? GRAD : "#fff", border: `1px solid ${next ? "transparent" : "#e3eaf0"}`, color: next ? "#fff" : "#0a1b33", font: `700 12.5px ${SANS}`, padding: "11px 20px", borderRadius: 999, whiteSpace: "nowrap" }}>
                    Join on Zoom ↗
                  </a>
                ) : null}
              </div>
            );
          })}
        </div>

        {course && (
          <div style={{ font: `500 12px ${SANS}`, color: "#8296a9", marginTop: 18 }}>
            Facilitator: {course.facilitator}
          </div>
        )}
      </div>
    </div>
  );
}
