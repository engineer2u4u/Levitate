/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ENROLMENT_OPEN, courseBySlug, formatFee } from "@/lib/lms/courses";
import { PAYMENT_OFF } from "@/lib/lms/payment";
import { enrol } from "@/lib/lms/enrolments";
import { contact } from "@/lib/site";
import { outlineBySlug } from "@/lib/programOutlines";
import { contentBySlug } from "@/lib/lms/courseContent";
import { BROCHURE_ASSETS_READY, brochureBySlug } from "@/lib/lms/brochures";
import { SHRM_ACCREDITATION, certificateCards } from "@/lib/certificateArt";
import { included, programBySlug } from "@/lib/programs";
import CertificateGallery from "@/components/site/CertificateGallery";
import ConsultationBand from "@/components/site/ConsultationBand";
import BrandText from "@/components/site/BrandText";
import UpcomingBatches from "@/components/site/UpcomingBatches";
import FaqAccordion from "@/components/site/FaqAccordion";
import { faqsBySlug } from "@/lib/lms/poshFaqs";
import { founders } from "@/lib/homeData";
import { curriculumBySlug } from "@/lib/lms/poshCurriculum";
import { useSession } from "./useSession";

const Lock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a9b8c6" strokeWidth={2.4} strokeLinecap="round" style={{ flex: "none" }} aria-hidden>
    <rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

export default function CourseDetail({ slug }: { slug: string }) {
  const course = courseBySlug(slug);
  const curriculum = curriculumBySlug(slug);
  const outline = outlineBySlug(slug);
  const brochure = brochureBySlug(slug);
  const faqs = faqsBySlug(slug);
  const program = programBySlug(slug);
  // A course authored as modules and submodules can simply be started —
  // there is nothing to pay for and nothing to wait for.
  const selfPaced = contentBySlug(slug);
  // Every certification is led by the founder; her card matches the homepage.
  const facilitator = founders[0];
  const { user, enrolments, openAuth } = useSession();
  const router = useRouter();
  // Raised when somebody signs up in order to enrol. The account does not
  // exist while the modal is open, so the enrolment cannot be written there —
  // it waits here for the new user to arrive. A ref rather than state: this
  // is a one-shot intent, and nothing renders differently for it.
  const enrolOnSignIn = useRef(false);

  useEffect(() => {
    if (!enrolOnSignIn.current || !user) return;
    enrolOnSignIn.current = false;
    enrol(user.id, slug, null);
    router.push(contentBySlug(slug) ? `/lms/learn/${slug}` : `/lms/course/${slug}`);
  }, [user, slug, router]);

  if (!course) {
    return (
      <div style={{ background: "#f7fafc", padding: "80px 48px", minHeight: "50vh" }} className="site-page-sec">
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ font: "700 24px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 12px" }}>Course not found</h1>
          <Link href="/lms" style={{ font: "600 13px 'Plus Jakarta Sans',sans-serif" }}>← Back to all courses</Link>
        </div>
      </div>
    );
  }

  const enrolled = enrolments.some((e) => e.courseSlug === slug);
  const waitlist = course.status === "waitlist" || course.feePaise === null;

  const goCheckout = () => router.push(`/lms/checkout/${slug}`);

  const onEnrol = () => {
    if (enrolled) return router.push(`/lms/learn/${slug}`);
    if (!user) {
      // Signing up first, because there is nobody to enrol until then.
      return openAuth({
        mode: "signup",
        reason: PAYMENT_OFF
          ? "Create an account to enrol — there is nothing to pay."
          : "Create an account to enrol — you will land straight back on checkout.",
        onDone: PAYMENT_OFF ? () => { enrolOnSignIn.current = true; } : goCheckout,
      });
    }
    // Nothing to pay means nothing to check out: enrol and open the course.
    if (PAYMENT_OFF) {
      enrol(user.id, slug, null);
      return router.push(selfPaced ? `/lms/learn/${slug}` : `/lms/course/${slug}`);
    }
    return goCheckout();
  };

  // Anyone who already enrolled keeps their way in; everybody else is sent to
  // the enquiry desk until payment goes live.
  const canPay = ENROLMENT_OPEN && !waitlist;
  // A free course nobody can click into is just a closed course.
  const freeEntry = PAYMENT_OFF && canPay;
  // Self-paced content opens once it is paid for — or straight away when it
  // carries no fee. Otherwise the normal enrol path runs first.
  const canStart = Boolean(selfPaced) && (enrolled || !course.feePaise);
  const ctaLabel = canStart
    ? "Start course →"
    : enrolled
    ? "Go to my course →"
    : freeEntry
      ? "Enrol now →"
    : canPay
      ? "Enrol · Pay securely"
      : waitlist
        ? "Join the waitlist"
        : "Enquire about this program →";
  const onCta = canStart
    ? () => router.push(`/lms/learn/${slug}`)
    : enrolled || canPay
      ? onEnrol
      : () => router.push("/contact");

  return (
    <>
      {/* HERO */}
      <div style={{ background: "linear-gradient(120deg,#0c2a45,#0a1f38)", padding: "46px 48px" }} className="site-page-sec">
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Link href="/certifications" style={{ font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#7fe3dc", display: "inline-block", marginBottom: 18 }}>← All certifications</Link>
          <div className="lms-split" style={{ display: "grid", gridTemplateColumns: "1fr 330px", gap: 44, alignItems: "start" }}>
            <div>
              <div style={{ font: "700 11px 'Plus Jakarta Sans',sans-serif", color: "#7fe3dc", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 12 }}>
                <BrandText>{curriculum?.eyebrow ?? `${course.tag} · ${course.mode}`}</BrandText>
              </div>
              <h1 style={{ font: "700 clamp(26px,2.8vw,38px)/1.15 'Plus Jakarta Sans',sans-serif", color: "#fff", margin: "0 0 12px", letterSpacing: "-.02em" }}>{course.title}</h1>
              <p style={{ font: "400 15px/1.75 'Plus Jakarta Sans',sans-serif", color: "rgba(255,255,255,.75)", margin: "0 0 22px", maxWidth: 620 }}>
                {curriculum?.blurb ?? course.desc}
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {(curriculum?.meta ?? brochure?.meta ?? [course.modulesLabel, course.hoursLabel, course.mode]).map((m) => (
                  <div key={m} style={{ font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#e6f6f4", background: "rgba(255,255,255,.08)", border: "1px solid rgba(127,227,220,.35)", borderRadius: 999, padding: "8px 15px" }}>{m}</div>
                ))}
              </div>

              {/* Sits with the programme detail rather than in the price card —
                  a prospect reaches for the brochure while reading, before
                  they get as far as the fee. */}
              {brochure && BROCHURE_ASSETS_READY && (
                <a
                  href={brochure.brochure.href}
                  download
                  className="lms-brochure-dl"
                  style={{ display: "inline-flex", alignItems: "center", gap: 12, marginTop: 24, background: "rgba(255,255,255,.08)", border: "1px solid rgba(127,227,220,.4)", borderRadius: 14, padding: "13px 20px 13px 15px" }}
                >
                  <span aria-hidden style={{ flex: "none", width: 34, height: 34, borderRadius: 10, background: "rgba(127,227,220,.16)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#7fe3dc" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3v12" /><path d="M7 12l5 5 5-5" /><path d="M4 20h16" />
                    </svg>
                  </span>
                  <span>
                    <span style={{ display: "block", font: "700 13px 'Plus Jakarta Sans',sans-serif", color: "#fff" }}>{brochure.brochure.label}</span>
                    <span style={{ display: "block", font: "500 11px 'Plus Jakarta Sans',sans-serif", color: "rgba(255,255,255,.6)", marginTop: 2 }}>{brochure.brochure.meta}</span>
                  </span>
                </a>
              )}
            </div>

            <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 24px 50px rgba(4,16,30,.35)" }}>
              <div style={{ font: "700 27px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{formatFee(course.feePaise)}</div>
              <div style={{ font: "500 11.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginBottom: 16 }}>{course.priceNote}</div>

              {enrolled && (
                <div style={{ font: "700 11px 'Plus Jakarta Sans',sans-serif", color: "#136f6a", background: "rgba(47,196,188,.12)", border: "1px solid rgba(27,143,136,.35)", borderRadius: 999, padding: "7px 13px", textAlign: "center", marginBottom: 12 }}>
                  You are enrolled
                </div>
              )}

              <button
                type="button"
                onClick={onCta}
                className="lp-btn-grad"
                style={{ width: "100%", cursor: "pointer", border: "none", textAlign: "center", background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", padding: "14px 20px", borderRadius: 999 }}
              >
                {ctaLabel}
              </button>

              {!enrolled && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, font: "600 10.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginTop: 10, textAlign: "center" }}>
                  {canPay ? (
                    <><Lock /> Payments secured by Razorpay</>
                  ) : (
                    <span>Or call us on <a href={`tel:${contact.tel}`} style={{ fontWeight: 700 }}>{contact.phone}</a></span>
                  )}
                </div>
              )}

              <div style={{ height: 1, background: "#eef2f6", margin: "18px 0" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                {(curriculum?.included ?? ["Live online delivery", "Trainer toolkit included", "Certificate on completion"]).map((i) => (
                  <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1b8f88" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 2 }} aria-hidden><path d="M5 13l4 4 10-10" /></svg>
                    <div style={{ font: "500 12.5px/1.5 'Plus Jakarta Sans',sans-serif", color: "#3d5064" }}>{i}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div style={{ background: "#f7fafc", padding: "44px 48px 80px" }} className="site-page-sec">
        {/* No `alignItems: start` here: the sidebar column has to stretch to
            the row's height, or the sticky element inside it has no room to
            travel and simply scrolls away with the page. */}
        <div className="lms-split" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 330px", gap: 44 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            {/* The programme write-up from the certifications page — its
                framework, who it suits and what it includes. Same source, so
                the two pages cannot describe a programme differently. Leads the
                column: the framework is the thing that explains the programme,
                and it belongs above the list of what a participant leaves able
                to do. The hero already carries the title, so this does not
                repeat it. */}
            {program && (
              <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "32px 34px" }}>
                <div style={{ font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 8 }}>About this certification</div>
                <div style={{ font: "600 14px 'Plus Jakarta Sans',sans-serif", color: "#2f7fd6", marginBottom: 18 }}>{program.sub}</div>
                <p style={{ font: "400 14.5px/1.8 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: "0 0 14px" }}>{program.p1}</p>
                <p style={{ font: "400 14.5px/1.8 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: "0 0 24px" }}>{program.p2}</p>

                <div style={{ background: "#f7fafc", border: "1px solid #eef2f6", borderRadius: 16, padding: "22px 24px", marginBottom: 22 }}>
                  <div style={{ font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 16 }}><BrandText>{program.pillarTitle}</BrandText></div>
                  <div className="lms-pillars" style={{ display: "grid", gridTemplateColumns: `repeat(${program.pillars.length}, minmax(0,1fr))`, gap: 12 }}>
                    {program.pillars.map((p, i) => (
                      <div key={`${p.k}-${i}`} style={{ background: "#fff", border: "1px solid #e3eaf0", borderTop: "3px solid #2f7fd6", borderRadius: 12, padding: "14px 14px" }}>
                        <div style={{ font: "700 20px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", marginBottom: 6 }}>{p.k}</div>
                        <div style={{ font: "600 12.5px/1.45 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{p.v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="site-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                  <div style={{ background: "#f7fafc", border: "1px solid #eef2f6", borderRadius: 16, padding: "20px 22px" }}>
                    <div style={{ font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 10 }}>Ideal for</div>
                    <div style={{ font: "400 13.5px/1.7 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>{program.ideal}</div>
                  </div>
                  <div style={{ background: "#f7fafc", border: "1px solid #eef2f6", borderRadius: 16, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 11 }}>
                    <div style={{ font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".14em", textTransform: "uppercase" }}>What&apos;s included</div>
                    {included.map((inc) => (
                      <div key={inc} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1b8f88" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 2 }}><path d="M5 13l4 4 10-10" /></svg>
                        <div style={{ font: "500 13px/1.55 'Plus Jakarta Sans',sans-serif", color: "#3d5064" }}>{inc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Objectives come from the staged LMS curriculum where there is
                one. The module list is rendered by the outline block below,
                for every programme alike — the staged, lesson-by-lesson view
                belongs in the LMS, not on a public programme page. */}
            {curriculum && (
                <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "32px 34px" }}>
                  <div style={{ font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 16 }}>What you will be able to do</div>
                  <div className="site-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 26px" }}>
                    {curriculum.objectives.map((o) => (
                      <div key={o} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2fc4bc", flex: "none", marginTop: 8 }} />
                        <div style={{ font: "500 13.5px/1.65 'Plus Jakarta Sans',sans-serif", color: "#3d5064" }}>{o}</div>
                      </div>
                    ))}
                  </div>
                </div>

            )}

            {(
              <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "32px 34px" }}>
                <div style={{ font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 12 }}>About this programme</div>
                <p style={{ font: "400 14.5px/1.75 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: "0 0 18px" }}>{outline?.intro ?? course.desc}</p>

                {/* A published module list, for programs whose syllabus is
                    settled even though the staged LMS content is not built. */}
                {outline ? (
                  <>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 22 }}>
                      {outline.facts.map((f) => (
                        <div key={f.k} style={{ background: "#f7fafc", border: "1px solid #eef2f6", borderRadius: 999, padding: "8px 15px", font: "600 11.5px 'Plus Jakarta Sans',sans-serif", color: "#3d5064" }}>
                          <span style={{ color: "#8296a9" }}>{f.k}:</span> {f.v}
                        </div>
                      ))}
                    </div>
                    <div style={{ font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 14 }}>Programme modules</div>
                    <ol style={{ listStyle: "none", counterReset: "mod", margin: "0 0 22px", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                      {outline.modules.map((m, i) => (
                        <li key={m} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#f7fafc", border: "1px solid #eef2f6", borderRadius: 13, padding: "14px 16px" }}>
                          <span aria-hidden style={{ flex: "none", width: 27, height: 27, borderRadius: 9, background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 12px 'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {i + 1}
                          </span>
                          <span style={{ font: "600 13.5px/1.55 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>
                            <span style={{ color: "#8296a9", fontWeight: 700 }}>Module {i + 1} · </span>{m}
                          </span>
                        </li>
                      ))}
                    </ol>
                    <div style={{ font: "700 14px/1.6 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", marginBottom: 18 }}>{outline.closing}</div>
                  </>
                ) : null}

                <div style={{ background: "#f7fafc", border: "1px solid #eef2f6", borderRadius: 14, padding: "18px 20px", font: "500 13.5px/1.7 'Plus Jakarta Sans',sans-serif", color: "#3d5064" }}>
                  {outline ? (
                    <>Batch dates for this programme are confirmed on request.{" "}
                    <Link href="/contact" style={{ fontWeight: 700 }}>Book a consultation</Link> and we will hold you a place.</>
                  ) : (
                    <>The detailed curriculum and batch dates for this programme are being finalised.{" "}
                    <Link href="/contact" style={{ fontWeight: 700 }}>Book a consultation</Link> and we will share the outline and hold you a place.</>
                  )}
                </div>
              </div>
            )}

            {/* ---- Brochure content: the copy the client hands to prospects ---- */}
            {brochure && (
              <>
                <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "32px 34px" }}>
                  <div style={{ font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 12 }}>Programme overview</div>
                  <div style={{ font: "700 18px/1.45 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", marginBottom: 12 }}>{brochure.strapline}</div>
                  <p style={{ font: "400 14.5px/1.8 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: "0 0 26px" }}>{brochure.about}</p>
                  <div className="site-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                    {brochure.stats.map((s) => (
                      <div key={s.label} style={{ background: "linear-gradient(120deg,#0c2a45,#0a1f38)", borderRadius: 14, padding: "18px 18px" }}>
                        <div style={{ font: "700 22px 'Plus Jakarta Sans',sans-serif", color: "#7fe3dc" }}>{s.n}</div>
                        <div style={{ font: "500 11.5px/1.45 'Plus Jakarta Sans',sans-serif", color: "rgba(255,255,255,.72)", marginTop: 4 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Programmes with no staged LMS curriculum carry their
                      objectives here instead — PoSH takes its own from the
                      curriculum block above. */}
                  {brochure.objectives && (
                    <>
                      <div style={{ font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".15em", textTransform: "uppercase", margin: "28px 0 16px" }}>What you will be able to do</div>
                      <div className="site-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 26px" }}>
                        {brochure.objectives.map((o) => (
                          <div key={o} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2fc4bc", flex: "none", marginTop: 8 }} />
                            <div style={{ font: "500 13.5px/1.65 'Plus Jakarta Sans',sans-serif", color: "#3d5064" }}>{o}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {brochure.beyond && (
                    <div style={{ background: "#f7fafc", borderLeft: "3px solid #1b8f88", borderRadius: "0 13px 13px 0", padding: "20px 22px", marginTop: 26 }}>
                      <div style={{ font: "700 15px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", marginBottom: 8 }}>{brochure.beyond.title}</div>
                      <p style={{ font: "400 13.5px/1.75 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: "0 0 12px" }}>{brochure.beyond.intro}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                        {brochure.beyond.points.map((pt) => (
                          <div key={pt} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <span aria-hidden style={{ font: "700 13px 'Plus Jakarta Sans',sans-serif", color: "#2f7fd6", flex: "none" }}>→</span>
                            <div style={{ font: "600 13px/1.6 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{pt}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {brochure.practiceLed && (
                  <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "32px 34px" }}>
                    <div style={{ font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 12 }}>{brochure.practiceLed.title}</div>
                    <p style={{ font: "400 14.5px/1.8 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: "0 0 20px" }}>{brochure.practiceLed.intro}</p>
                    <div className="site-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 26px" }}>
                      {brochure.practiceLed.items.map((it) => (
                        <div key={it} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1b8f88" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 3 }}><path d="M5 13l4 4 10-10" /></svg>
                          <div style={{ font: "500 13.5px/1.6 'Plus Jakarta Sans',sans-serif", color: "#3d5064" }}>{it}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "32px 34px" }}>
                  <div style={{ font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 18 }}>Who should attend</div>
                  <div className="site-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 26px" }}>
                    {brochure.audience.map((a) => (
                      <div key={a} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                        <span aria-hidden style={{ flex: "none", width: 18, height: 18, borderRadius: "50%", background: "rgba(47,196,188,.16)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1b8f88" }} />
                        </span>
                        <div style={{ font: "600 13.5px/1.55 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{a}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "32px 34px" }}>
                  <div style={{ font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 18 }}>Training methodology</div>
                  <div style={{ display: "flex", gap: 9, flexWrap: "wrap", marginBottom: 20 }}>
                    {brochure.methodology.tags.map((t) => (
                      <span key={t} style={{ background: "#f7fafc", border: "1px solid #e3eaf0", borderRadius: 999, padding: "9px 16px", font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{t}</span>
                    ))}
                  </div>
                  <p style={{ font: "400 14.5px/1.8 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: "0 0 22px" }}>{brochure.methodology.body}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {brochure.methodology.blocks.map((bl) => (
                      <div key={bl.title} style={{ background: "#f7fafc", borderLeft: "3px solid #1b8f88", borderRadius: "0 13px 13px 0", padding: "18px 20px" }}>
                        <div style={{ font: "700 14px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", marginBottom: 7 }}>{bl.title}</div>
                        <p style={{ font: "400 13.5px/1.75 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: 0 }}>{bl.body}</p>
                        {bl.chips && (
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 13 }}>
                            {bl.chips.map((c) => (
                              <span key={c} style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 8, padding: "6px 11px", font: "700 11px 'Plus Jakarta Sans',sans-serif", color: "#136f6a" }}>{c}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </>
            )}


            {/* Every programme awards both certificates, so this sits outside
                the brochure block rather than only on the courses that have
                one. Each is drawn with this programme's own name on it. */}
            <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "32px 34px" }}>
              <div style={{ font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 18 }}>Certification &amp; recognition</div>
              <div style={{ background: "#f7fafc", borderLeft: "3px solid #1b8f88", borderRadius: "0 13px 13px 0", padding: "20px 22px", marginBottom: 18 }}>
                <div style={{ font: "700 14px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", marginBottom: 8 }}>{SHRM_ACCREDITATION.title}</div>
                <p style={{ font: "400 13.5px/1.75 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: "0 0 12px" }}>{SHRM_ACCREDITATION.body}</p>
                <p style={{ font: "400 13px/1.75 'Plus Jakarta Sans',sans-serif", color: "#8296a9", margin: 0 }}>{SHRM_ACCREDITATION.note}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                  {SHRM_ACCREDITATION.badges.map((bd) => (
                    <span key={bd} style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 999, padding: "7px 14px", font: "700 11px 'Plus Jakarta Sans',sans-serif", color: "#136f6a" }}>{bd}</span>
                  ))}
                </div>
              </div>

              <CertificateGallery cards={certificateCards(course.certificate)} />
              <p style={{ font: "500 11.5px/1.6 'Plus Jakarta Sans',sans-serif", color: "#8296a9", margin: "14px 0 0" }}>
                Specimens — select either to enlarge it.
              </p>
            </div>

            {faqs && <FaqAccordion items={faqs} />}
          </div>

          {/* Facilitator and schedule stay in view while the long left column
              scrolls past them. `top` clears the sticky site header. */}
          <div>
          <div className="lms-side-sticky" style={{ display: "flex", flexDirection: "column", gap: 18, position: "sticky", top: 96 }}>
            <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 18, overflow: "hidden" }}>
              {/* Portrait, role and bio come from the homepage founder record,
                  so the facilitator is shown the same way in both places. */}
              <img src={facilitator.img} alt={facilitator.alt} style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover", objectPosition: facilitator.imgPos, display: "block" }} />
              <div style={{ padding: "20px 22px" }}>
                <div style={{ font: "700 11px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 8 }}>Facilitator</div>
                <div style={{ font: "700 17px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{course.facilitator}</div>
                <div style={{ font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", margin: "3px 0 10px" }}>{facilitator.role}</div>
                <div style={{ font: "400 12.5px/1.65 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>
                  {facilitator.bio}
                </div>
              </div>
            </div>

          </div>
          </div>
        </div>
      </div>

      {/* A programme page is long. This is the mid-page ask; the one above the
          footer, which every page carries, is the second. */}
      <ConsultationBand subject={course.short} background="#f7fafc" />

      {/* Batch dates and fees sit on every program page, not only on the
          certifications page — this is where a visitor decides. */}
      <UpcomingBatches background="#eef4f7" />
    </>
  );
}
