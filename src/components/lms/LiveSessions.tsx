"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { useCourse } from "@/components/site/CatalogProvider";
import { dateTile } from "@/lib/catalog";
import { useCourseAccess, type AccessSession } from "@/lib/lms/access";
import { isPaid } from "@/lib/lms/enrolments";
import { useSession } from "./useSession";

const SANS = "'Plus Jakarta Sans',sans-serif";
const GRAD = "linear-gradient(120deg,#2fc4bc,#2f7fd6)";

/** How long before a session starts that its Zoom link becomes live. */
const JOIN_OPENS_MS = 15 * 60_000;

/**
 * The clock, ticking.
 *
 * The page reads the time once for "held" and "up next", which is right —
 * neither should change under someone while they read. The join window is
 * different: a learner sitting on this page at 5:44 waiting for a six o'clock
 * session has to watch the button appear, not discover they had to reload.
 *
 * Half a minute is close enough for a fifteen-minute door, and the snapshot is
 * a cached number rather than Date.now(), which would be a new value on every
 * render and never settle.
 */
let clock = 0;
const watchers = new Set<() => void>();
let ticker: ReturnType<typeof setInterval> | undefined;

function subscribeClock(onChange: () => void) {
  watchers.add(onChange);
  clock = Date.now();
  ticker ??= setInterval(() => {
    clock = Date.now();
    watchers.forEach((w) => w());
  }, 30_000);
  return () => {
    watchers.delete(onChange);
    if (watchers.size === 0) {
      clearInterval(ticker);
      ticker = undefined;
    }
  };
}

/**
 * What to say before the door opens.
 *
 * A time on its own only means something if it is today; "Join opens 5:45 PM"
 * against a session three weeks out tells a learner nothing they can act on,
 * so that one is told the rule instead.
 */
function joinOpensAt(at: number, now: number): string {
  const until = at - now;
  if (until > 20 * 3600_000) return "Join opens 15 minutes before";
  const clockTime = new Date(at).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });
  return `Join opens at ${clockTime}`;
}

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
  // The join window does, so it has a clock of its own. Nothing is joinable in
  // the prerendered HTML, which is the honest answer before a browser has a
  // clock to ask.
  const tick = useSyncExternalStore(subscribeClock, () => clock, () => 0);

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
  /**
   * The sitting the card is about: the next one that has not finished, or the
   * last one once they all have. One room serves the whole programme, so the
   * join link, the date tile and the fifteen-minute window are all this
   * sitting's rather than the first's.
   */
  const upcoming = access.sessions.find((sn) => endOf(sn) > now) ?? null;
  const shown = upcoming ?? access.sessions[access.sessions.length - 1] ?? null;
  const tile = shown?.starts_on ? dateTile(shown.starts_on) : { day: "—", month: "" };
  const startsAt = Date.parse(upcoming?.starts_at ?? "");
  const opensAt = Number.isFinite(startsAt) ? startsAt - JOIN_OPENS_MS : null;
  const joinable = opensAt === null || tick >= opensAt;

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

        {access.sessions.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 16, padding: "24px", font: `500 13.5px ${SANS}`, color: "#5b6e82" }}>
            The session dates for this batch have not been published yet.
          </div>
        ) : (
          /* One card for the programme, not one per sitting.
             A certification runs on a single Zoom room across all its dates,
             so a card per date repeated the same link three times and asked
             the learner to work out which one was today's. The room is the
             programme's; the dates are a list inside it. */
          <div style={{ background: "#fff", border: `1px solid ${upcoming ? "rgba(27,143,136,.45)" : "#e3eaf0"}`, borderRadius: 16, padding: "22px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
              <div style={{ textAlign: "center", background: upcoming ? "linear-gradient(135deg,#2fc4bc,#2f7fd6)" : "rgba(47,196,188,.12)", border: `1px solid ${upcoming ? "transparent" : "rgba(27,143,136,.3)"}`, borderRadius: 13, padding: "12px 14px", minWidth: 64, flex: "none" }}>
                <div style={{ font: `700 19px ${SANS}`, color: upcoming ? "#fff" : "#0a1b33" }}>{tile.day}</div>
                <div style={{ font: `700 10px ${SANS}`, color: upcoming ? "rgba(255,255,255,.85)" : "#8296a9", letterSpacing: ".1em", textTransform: "uppercase" }}>{tile.month}</div>
              </div>

              <div style={{ flex: 1, minWidth: 230 }}>
                <div style={{ font: `700 16px ${SANS}`, color: "#0a1b33" }}>{access.course.title}</div>
                <div style={{ font: `500 12.5px ${SANS}`, color: "#5b6e82", marginTop: 6 }}>
                  {upcoming
                    ? `Next: ${[upcoming.date_label, upcoming.time_label, upcoming.mode].filter(Boolean).join(" · ")}`
                    : "All sessions held"}
                </div>
                {paid && upcoming && (upcoming.meeting_id || upcoming.passcode) && (
                  <div style={{ font: `500 11.5px ${SANS}`, color: "#8296a9", marginTop: 6 }}>
                    {[upcoming.meeting_id ? `Meeting ID ${upcoming.meeting_id}` : "", upcoming.passcode ? `Passcode ${upcoming.passcode}` : ""].filter(Boolean).join(" · ")}
                  </div>
                )}
              </div>

              {/* The room, once — gated to a quarter of an hour before the next
                  sitting rather than the first. */}
              {upcoming?.join_url && joinable ? (
                <a href={upcoming.join_url} target="_blank" rel="noopener noreferrer" className="lp-btn-grad" style={{ background: GRAD, border: "1px solid transparent", color: "#fff", font: `700 12.5px ${SANS}`, padding: "11px 20px", borderRadius: 999, whiteSpace: "nowrap" }}>
                  Join on Zoom ↗
                </a>
              ) : upcoming?.join_url ? (
                <span style={{ font: `600 12px/1.4 ${SANS}`, color: "#8296a9", textAlign: "right", maxWidth: 170, whiteSpace: "normal" }}>
                  {opensAt !== null ? joinOpensAt(opensAt, tick) : "Join opens 15 minutes before"}
                </span>
              ) : null}
            </div>

            {/* Every date the programme runs, and every recording there is.
                A recording is listed against its own date and stays listed —
                it is the record of a session that happened, not something that
                replaces the next one. */}
            <div style={{ borderTop: "1px solid #eef2f6", marginTop: 18, paddingTop: 6 }}>
              {access.sessions.map((s, i) => {
                const held = endOf(s) <= now;
                const isNext = s.id === upcoming?.id;
                return (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "10px 0", borderBottom: i === access.sessions.length - 1 ? "none" : "1px solid #f4f7f9" }}>
                    <div style={{ font: `600 12.5px ${SANS}`, color: held ? "#8296a9" : "#0a1b33", minWidth: 210 }}>
                      Session {i + 1} · {[s.date_label, s.time_label].filter(Boolean).join(" · ")}
                    </div>
                    <div style={{ font: `700 9.5px ${SANS}`, letterSpacing: ".1em", textTransform: "uppercase", color: held ? "#136f6a" : isNext ? "#1f5fa8" : "#8296a9", background: held ? "rgba(47,196,188,.12)" : isNext ? "rgba(47,127,214,.1)" : "#f4f7f9", border: `1px solid ${held ? "rgba(27,143,136,.35)" : isNext ? "rgba(47,127,214,.3)" : "#dbe5ec"}`, borderRadius: 999, padding: "4px 9px" }}>
                      {held ? "Held" : isNext ? "Up next" : "Scheduled"}
                    </div>
                    {s.topic && <div style={{ font: `500 12px ${SANS}`, color: "#5b6e82" }}>{s.topic}</div>}
                    {s.recording_url && (
                      <a href={s.recording_url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "auto", font: `700 12px ${SANS}`, color: "#1b8f88", whiteSpace: "nowrap" }}>
                        Watch recording ↗
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {course && (
          <div style={{ font: `500 12px ${SANS}`, color: "#8296a9", marginTop: 18 }}>
            Facilitator: {course.facilitator}
          </div>
        )}
      </div>
    </div>
  );
}
