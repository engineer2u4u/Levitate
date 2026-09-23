"use client";

import { useEffect, useRef, useState } from "react";
import CertificatePlate from "@/components/site/CertificatePlate";
import { certificateCards, type CertificateIssue } from "@/lib/certificateArt";
import { downloadCertificatePdf, downloadCertificatePng, fileStem } from "@/lib/lms/certificateExport";
import { issueCertificate, isRevoked, type Certificate } from "@/lib/lms/certificates";
import { courseBySlug } from "@/lib/lms/courses";

const SANS = "'Plus Jakarta Sans',sans-serif";

/**
 * The learner's own certificates, at the end of the course.
 *
 * The same artwork the programme pages show as specimens, with this learner's
 * details written into it — so what they take away is what they were shown
 * they would get, rather than a second design that drifted from it.
 *
 * Everything printed comes from the register once a certificate is issued:
 * the number, the name, the course title, the hours and the date are all
 * snapshots taken at issue. Before then the plates are shown as a preview,
 * with the number blank, because a number invented in the browser would be
 * verifiable by nobody.
 */
export default function CourseCertificates({
  slug, name, org, completedOn, ready, finished,
}: {
  slug: string;
  name: string;
  org: string;
  /** "Sep 2026" — when the course was finished, for the preview. */
  completedOn: string;
  /** False while the learner is only looking ahead at this item. */
  ready: boolean;
  /** Every item done, so the register will accept an issue. */
  finished: boolean;
}) {
  const course = courseBySlug(slug);
  const [issued, setIssued] = useState<Certificate | null>(null);
  const [note, setNote] = useState("");
  // Starts true where a request is about to go out, so the card says it is
  // checking from the first render rather than flickering through "preview".
  const [asking, setAsking] = useState(finished && Boolean(course?.certificate));

  // Asked for as soon as the course is finished: the register decides whether
  // there is one, and hands back the same row every time it is asked.
  useEffect(() => {
    if (!finished || !course?.certificate) return;
    let live = true;
    void issueCertificate(slug, name)
      .then((res) => {
        if (!live) return;
        if (res.ok) setIssued(res.certificate);
        else setNote(res.message);
      })
      .finally(() => {
        if (live) setAsking(false);
      });
    return () => {
      live = false;
    };
  }, [finished, slug, name, course?.certificate]);

  if (!course?.certificate) return null;

  const revoked = issued ? isRevoked(issued) : false;
  // The register's snapshot wins over the account and the catalogue.
  const printedName = issued?.recipient_name || name;
  const printedCourse = issued?.course_title || course.certificate.name;
  const printedDate = issued?.completed_on
    ? new Date(issued.completed_on).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : completedOn;

  const cards = certificateCards({ ...course.certificate, name: printedCourse }).map((card) => ({
    ...card,
    issue: {
      ...card.issue,
      recipientName: printedName,
      completedOn: printedDate,
      hours: issued?.hours || card.issue.hours,
      certificateId: issued?.cert_no ?? "",
    } satisfies CertificateIssue,
  }));

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <span style={{ font: `700 11px ${SANS}`, color: "#1b8f88", letterSpacing: ".16em", textTransform: "uppercase" }}>
          {cards.length} certificate{cards.length === 1 ? "" : "s"}
        </span>
        <span style={{ font: `500 12.5px ${SANS}`, color: "#8296a9" }}>
          Made out to {printedName}{org ? ` · ${org}` : ""}
        </span>
        {issued && !revoked && (
          <span style={{ font: `700 11.5px ${SANS}`, color: "#136f6a", background: "rgba(47,196,188,.12)", border: "1px solid rgba(27,143,136,.3)", borderRadius: 999, padding: "6px 13px" }}>
            No. {issued.cert_no}
          </span>
        )}
      </div>

      {revoked && (
        <div role="alert" style={{ font: `600 12.5px/1.7 ${SANS}`, color: "#a53f28", background: "rgba(226,86,74,.08)", border: "1px solid rgba(226,86,74,.28)", borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
          Certificate {issued?.cert_no} has been withdrawn{issued?.revoked_reason ? `: ${issued.revoked_reason}.` : "."} Please speak to the
          programme team before using it.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {cards.map((card) => (
          <CertificateCard
            key={card.title}
            title={card.title}
            caption={card.caption}
            issue={card.issue}
            name={printedName}
            downloadable={Boolean(issued) && !revoked}
            waiting={asking}
            ready={ready}
          />
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "#f7fafc", border: "1px solid #eef2f6", borderRadius: 12, padding: "12px 14px", marginTop: 18 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1b8f88" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 2 }} aria-hidden>
          <circle cx="12" cy="8" r="3.4" /><path d="M5 20c0-3.6 3.1-5.6 7-5.6s7 2 7 5.6" />
        </svg>
        <div style={{ font: `500 12px/1.65 ${SANS}`, color: "#5b6e82" }}>
          {issued ? (
            <>
              Issued as <strong style={{ color: "#0a1b33" }}>No. {issued.cert_no}</strong> to{" "}
              <strong style={{ color: "#0a1b33" }}>{printedName}</strong>. The name is the one held when your
              certificate was issued — speak to the programme team if it needs correcting, so the register and your
              copy stay in step. The PDC and CPD hours are filled in by the office.
            </>
          ) : (
            <>
              {note || "Your certificate number is issued once the whole course is complete."} The name printed will be
              the one on your account — <strong style={{ color: "#0a1b33" }}>{name}</strong>
              {org ? `, ${org}` : ""} — so correct it in your profile first if it needs changing.
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CertificateCard({
  title, caption, issue, name, downloadable, waiting, ready,
}: {
  title: string;
  caption: string;
  issue: CertificateIssue;
  name: string;
  downloadable: boolean;
  waiting: boolean;
  ready: boolean;
}) {
  const holder = useRef<HTMLDivElement | null>(null);
  const [busy, setBusy] = useState<"png" | "pdf" | null>(null);
  const [failed, setFailed] = useState("");

  const download = async (format: "png" | "pdf") => {
    const svg = holder.current?.querySelector("svg");
    if (!svg || busy) return;
    setBusy(format);
    setFailed("");
    try {
      const stem = fileStem(name, issue.courseName, title);
      if (format === "png") await downloadCertificatePng(svg, stem);
      else await downloadCertificatePdf(svg, stem);
    } catch (e) {
      setFailed((e as Error).message || "The download could not be prepared.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "22px 24px" }}>
      <div style={{ font: `700 15px/1.4 ${SANS}`, color: "#0a1b33", marginBottom: 4 }}>{title}</div>
      <div style={{ font: `400 13px/1.65 ${SANS}`, color: "#5b6e82", marginBottom: 16 }}>{caption}</div>

      <div ref={holder} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #eef2f6", boxShadow: "0 10px 28px rgba(10,27,51,.10)" }}>
        <CertificatePlate issue={issue} />
      </div>

      {!ready ? (
        <div style={{ font: `600 12.5px ${SANS}`, color: "#8296a9", marginTop: 16 }}>
          Your certificates open when you reach this item.
        </div>
      ) : downloadable ? (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginTop: 16 }}>
          <DownloadButton label="Download PDF" busy={busy === "pdf"} disabled={busy !== null} onClick={() => download("pdf")} primary />
          <DownloadButton label="Download PNG" busy={busy === "png"} disabled={busy !== null} onClick={() => download("png")} />
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 9, font: `600 12.5px ${SANS}`, color: "#8296a9", marginTop: 16 }}>
          {waiting && <Spin />}
          {waiting ? "Checking the certificate register…" : "A preview. Downloads open once your certificate is issued."}
        </div>
      )}

      {failed && (
        <div role="alert" style={{ font: `600 12px/1.6 ${SANS}`, color: "#a53f28", background: "rgba(226,86,74,.08)", border: "1px solid rgba(226,86,74,.28)", borderRadius: 10, padding: "10px 12px", marginTop: 12 }}>
          {failed}
        </div>
      )}
    </div>
  );
}

const Spin = ({ light }: { light?: boolean }) => (
  <span
    aria-hidden
    style={{
      flex: "none", width: 14, height: 14, borderRadius: "50%",
      border: `2px solid ${light ? "rgba(255,255,255,.4)" : "rgba(10,27,51,.18)"}`,
      borderTopColor: light ? "#fff" : "#0a1b33",
      animation: "spinSlow .7s linear infinite",
    }}
  />
);

function DownloadButton({
  label, busy, disabled, onClick, primary,
}: {
  label: string;
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={primary ? "lp-btn-grad" : "lp-btn-outline"}
      style={{
        display: "inline-flex", alignItems: "center", gap: 9,
        cursor: disabled ? "wait" : "pointer",
        border: primary ? "none" : "1.5px solid rgba(10,27,51,.24)",
        background: primary ? "linear-gradient(120deg,#2fc4bc,#2f7fd6)" : "#fff",
        color: primary ? "#fff" : "#0a1b33",
        font: `700 13px ${SANS}`, padding: "12px 22px", borderRadius: 999,
        opacity: disabled && !busy ? 0.55 : 1,
      }}
    >
      {busy ? (
        <Spin light={primary} />
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={primary ? "#fff" : "#0a1b33"} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 3v12" /><path d="M7 11l5 5 5-5" /><path d="M4 20h16" />
        </svg>
      )}
      {busy ? "Preparing…" : label}
    </button>
  );
}
