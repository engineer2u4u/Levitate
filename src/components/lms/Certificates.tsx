"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import CourseCertificates from "./CourseCertificates";
import { contentBySlug } from "@/lib/lms/courseContent";
import { kitReleased, readProgress } from "@/lib/lms/courseProgress";
import { courseBySlug } from "@/lib/lms/courses";
import { useSession } from "./useSession";

const SANS = "'Plus Jakarta Sans',sans-serif";

/**
 * Where a learner comes back for their certificates.
 *
 * The course player hands them over at the end of the course, but that is a
 * moment, and a certificate is wanted again months later — for an appraisal,
 * an audit, a job application — long after anyone would think to reopen a
 * finished course. So the same certificates live here, under My Learning.
 *
 * Only finished programmes appear. The screen used to list every enrolment
 * and leave the register to refuse the ones that had not been earned — which
 * meant a learner on their first module was shown certificate plates with
 * their own name on them, and told why they could not have them. That reads
 * as a certificate being withheld rather than one not yet earned, and it is
 * the wrong thing to show someone either way.
 *
 * What is on it still comes from the register: the number, the name it was
 * made out to, and the date.
 */
export default function Certificates() {
  const { user, loading, enrolments } = useSession();
  // Which of this learner's courses are actually finished. Null while it is
  // still being read, so the page waits rather than flashing "no certificates"
  // at someone who has earned several.
  const [finished, setFinished] = useState<Set<string> | null>(null);
  // Programmes the register has since said are not finished. Only reachable
  // for a course with no lesson list here, which cannot be judged in advance.
  const [notEarned, setNotEarned] = useState<string[]>([]);
  const dropSection = useCallback((slug: string) => {
    setNotEarned((list) => (list.includes(slug) ? list : [...list, slug]));
  }, []);

  const slugs = enrolments.map((e) => e.courseSlug).join(",");
  useEffect(() => {
    if (!user) return;
    let alive = true;
    const courses = slugs ? slugs.split(",") : [];
    // The same rule the course page and the player use — every item done —
    // so a programme is finished in one place or in none of them.
    void Promise.all(
      courses.map(async (slug) => {
        const content = contentBySlug(slug);
        // A programme with no lesson list here — a live cohort marked off by
        // the office — cannot be judged from this browser. It is passed
        // through to the register, which knows, and the section removes
        // itself if the answer is that it is not finished.
        if (!content) return slug;
        return kitReleased(content, await readProgress(user.id, slug)) ? slug : null;
      }),
    ).then((done) => {
      if (alive) setFinished(new Set(done.filter((x): x is string => x !== null)));
    });
    return () => {
      alive = false;
    };
  }, [user, slugs]);

  if (loading || (user && finished === null)) return <div style={{ background: "#f7fafc", minHeight: "60vh" }} />;

  const mine = enrolments
    .map((e) => ({ enrolment: e, course: courseBySlug(e.courseSlug) }))
    .filter((row) => row.course?.certificate && finished?.has(row.enrolment.courseSlug) && !notEarned.includes(row.enrolment.courseSlug));

  if (!user || !mine.length) {
    return (
      <div style={{ background: "#f7fafc", padding: "70px 48px", minHeight: "60vh" }} className="site-page-sec">
        <div style={{ maxWidth: 600, margin: "0 auto", background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "34px 36px", textAlign: "center" }}>
          <h1 style={{ font: `700 21px ${SANS}`, color: "#0a1b33", margin: "0 0 10px" }}>No certificates yet</h1>
          <p style={{ font: `400 14px/1.7 ${SANS}`, color: "#5b6e82", margin: "0 0 20px" }}>
            Finish a certification programme and your certificates are issued here, made out in your name.
          </p>
          <Link href="/lms" className="lp-btn-grad" style={{ display: "inline-block", background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: `700 13.5px ${SANS}`, padding: "13px 26px", borderRadius: 999 }}>
            Browse courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f7fafc", padding: "38px 48px 90px", minHeight: "60vh" }} className="site-page-sec">
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h1 style={{ font: `700 27px ${SANS}`, color: "#0a1b33", margin: "0 0 6px", letterSpacing: "-.02em" }}>My certificates</h1>
        <p style={{ font: `500 13.5px/1.7 ${SANS}`, color: "#5b6e82", margin: "0 0 30px", maxWidth: 620 }}>
          Issued once a programme is complete, numbered in the certificate register, and yours to download whenever you
          need them.
        </p>

        {mine.map(({ enrolment, course }) => (
          <section key={enrolment.courseSlug} style={{ marginBottom: 40 }}>
            <div style={{ font: `700 11px ${SANS}`, color: "#1b8f88", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 8 }}>
              {course?.short ?? "Programme"}
            </div>
            <h2 style={{ font: `700 clamp(19px,2.2vw,24px)/1.3 ${SANS}`, color: "#0a1b33", margin: "0 0 18px", letterSpacing: "-.01em" }}>
              {course?.title}
            </h2>
            {/* `finished` asks the register rather than asserting anything:
                it issues for a learner who has finished and says why not for
                one who has not. */}
            <CourseCertificates
              slug={enrolment.courseSlug}
              variant="gallery"
              name={user.name}
              org={user.org}
              completedOn=""
              finished
              onNotEarned={dropSection}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
