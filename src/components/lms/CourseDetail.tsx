/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ENROLMENT_OPEN, courseBySlug, formatFee } from "@/lib/lms/courses";
import { contact } from "@/lib/site";
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
  const { user, enrolments, openAuth } = useSession();
  const router = useRouter();

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
      return openAuth({
        mode: "signup",
        reason: "Create an account to enrol — you will land straight back on checkout.",
        onDone: goCheckout,
      });
    }
    goCheckout();
  };

  // Anyone who already enrolled keeps their way in; everybody else is sent to
  // the enquiry desk until payment goes live.
  const canPay = ENROLMENT_OPEN && !waitlist;
  const ctaLabel = enrolled
    ? "Go to my course →"
    : canPay
      ? "Enrol · Pay securely"
      : waitlist
        ? "Join the waitlist"
        : "Enquire about this program →";
  const onCta = enrolled || canPay ? onEnrol : () => router.push("/contact");

  return (
    <>
      {/* HERO */}
      <div style={{ background: "linear-gradient(120deg,#0c2a45,#0a1f38)", padding: "46px 48px" }} className="site-page-sec">
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <Link href="/lms" style={{ font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#7fe3dc", display: "inline-block", marginBottom: 18 }}>← All courses</Link>
          <div className="lms-split" style={{ display: "grid", gridTemplateColumns: "1fr 330px", gap: 44, alignItems: "start" }}>
            <div>
              <div style={{ font: "700 11px 'Plus Jakarta Sans',sans-serif", color: "#7fe3dc", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 12 }}>
                {curriculum?.eyebrow ?? `${course.tag} · ${course.mode}`}
              </div>
              <h1 style={{ font: "700 clamp(26px,2.8vw,38px)/1.15 'Plus Jakarta Sans',sans-serif", color: "#fff", margin: "0 0 12px", letterSpacing: "-.02em" }}>{course.title}</h1>
              <p style={{ font: "400 15px/1.75 'Plus Jakarta Sans',sans-serif", color: "rgba(255,255,255,.75)", margin: "0 0 22px", maxWidth: 620 }}>
                {curriculum?.blurb ?? course.desc}
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {(curriculum?.meta ?? [course.modulesLabel, course.hoursLabel, course.mode]).map((m) => (
                  <div key={m} style={{ font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#e6f6f4", background: "rgba(255,255,255,.08)", border: "1px solid rgba(127,227,220,.35)", borderRadius: 999, padding: "8px 15px" }}>{m}</div>
                ))}
              </div>
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
        <div className="lms-split" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 330px", gap: 44, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            {curriculum ? (
              <>
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

                <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "32px 34px" }}>
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, marginBottom: 6, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 8 }}>Curriculum · staged release</div>
                      <div style={{ font: "700 21px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>
                        {curriculum.stages.reduce((a, s) => a + s.lessons.length, 0)} lessons across {curriculum.stages.length} stages
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, font: "600 11.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9" }}>
                      <Lock /> Content unlocks after each live session
                    </div>
                  </div>

                  <div style={{ marginTop: 24, display: "flex", flexDirection: "column" }}>
                    {curriculum.stages.map((s, si) => (
                      <div key={s.id} style={{ display: "grid", gridTemplateColumns: "34px 1fr", gap: 18 }}>
                        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <div style={{ width: 30, height: 30, flex: "none", borderRadius: "50%", background: "#f4f7f9", border: "2px solid #dbe5ec", display: "flex", alignItems: "center", justifyContent: "center", font: "700 11px 'Plus Jakarta Sans',sans-serif", color: "#a9b8c6", zIndex: 2 }}>{s.num}</div>
                          {si < curriculum.stages.length - 1 && <div style={{ flex: 1, width: 2, background: "#e3eaf0", margin: "2px 0" }} />}
                        </div>
                        <div style={{ paddingBottom: 22 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                            <div style={{ font: "700 15.5px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{s.title}</div>
                          </div>
                          <div style={{ font: "500 12.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginTop: 6 }}>{s.release}</div>
                          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                            {s.lessons.map((it) => (
                              <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "#f7fafc", border: "1px solid #eef2f6", borderRadius: 11, padding: "11px 14px" }}>
                                <div style={{ width: 22, height: 22, flex: "none", borderRadius: 7, background: it.kind === "VID" ? "rgba(47,196,188,.15)" : "rgba(47,127,214,.12)", display: "flex", alignItems: "center", justifyContent: "center", font: "800 9px 'Plus Jakarta Sans',sans-serif", color: it.kind === "VID" ? "#136f6a" : "#2f7fd6" }}>{it.kind}</div>
                                <div style={{ font: "600 13px 'Plus Jakarta Sans',sans-serif", color: "#3d5064", flex: 1 }}>{it.title}</div>
                                <div style={{ font: "500 11.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9" }}>{it.meta}</div>
                                <Lock />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ font: "600 13.5px 'Plus Jakarta Sans',sans-serif", color: "#136f6a", marginTop: 4 }}>Learn the law. Navigate sensitive situations. Facilitate with confidence.</div>
                </div>
              </>
            ) : (
              <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "32px 34px" }}>
                <div style={{ font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 12 }}>About this programme</div>
                <p style={{ font: "400 14.5px/1.75 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: "0 0 18px" }}>{course.desc}</p>
                <div style={{ background: "#f7fafc", border: "1px solid #eef2f6", borderRadius: 14, padding: "18px 20px", font: "500 13.5px/1.7 'Plus Jakarta Sans',sans-serif", color: "#3d5064" }}>
                  The detailed curriculum and batch dates for this programme are being finalised.{" "}
                  <Link href="/contact" style={{ fontWeight: 700 }}>Talk to us</Link> and we will share the outline and hold you a place.
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 18, overflow: "hidden" }}>
              <img src="/assets/parichita-speaking.png" alt="" style={{ width: "100%", aspectRatio: "16/10", objectFit: "cover", objectPosition: "35% 30%", display: "block" }} />
              <div style={{ padding: "20px 22px" }}>
                <div style={{ font: "700 11px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 8 }}>Facilitator</div>
                <div style={{ font: "700 17px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{course.facilitator}</div>
                <div style={{ font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", margin: "3px 0 10px" }}>Founder &amp; Managing Partner</div>
                <div style={{ font: "400 12.5px/1.65 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>
                  15+ years of global HR leadership across India, the UK, Europe and North America — POSH, DEI, wellbeing and leadership facilitation.
                </div>
              </div>
            </div>

            {curriculum && (
              <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 18, padding: 22 }}>
                <div style={{ font: "700 11px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 14 }}>Live session schedule</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {curriculum.sessions.map((s) => (
                    <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #eef2f6", paddingBottom: 9 }}>
                      <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#2f7fd6", minWidth: 16 }}>{s.n}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ font: "600 12.5px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{s.date}</div>
                        <div style={{ font: "500 11px 'Plus Jakarta Sans',sans-serif", color: "#8296a9" }}>{s.time} · {s.topic}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
