"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Accreditations from "@/components/site/Accreditations";
import BrandText from "@/components/site/BrandText";
import CertificateGallery from "@/components/site/CertificateGallery";
import FaqAccordion from "@/components/site/FaqAccordion";
import TrustedBy from "@/components/site/TrustedBy";
import YouTubeEmbed from "@/components/site/YouTubeEmbed";
import VideoTestimonials, { type PlayableClip } from "@/components/home/VideoTestimonials";
import { certificateCards } from "@/lib/certificateArt";
import { ENROLMENT_OPEN, courseBySlug } from "@/lib/lms/courses";
import { outlineBySlug } from "@/lib/programOutlines";
import { contact } from "@/lib/site";
import { track } from "@/lib/track";
import type { LandingOffer } from "@/lib/landing";
import LeadGate from "./LeadGate";

const SANS = "'Plus Jakarta Sans',sans-serif";

/**
 * The skeleton both paid-ad sales pages share.
 *
 * Different from the programme pages on purpose. Those are for someone
 * browsing the catalogue; this is for someone who just clicked an ad for one
 * specific thing and will leave in seconds if the page does not obviously
 * answer the search. So: one programme, one date, two buttons, and
 * every section below the fold earning its place as a reason to click them.
 */
export default function SalesPage({ offer }: { offer: LandingOffer }) {
  // Only for the certificate artwork now — the fee is no longer shown here.
  const course = courseBySlug(offer.slug);
  const outline = outlineBySlug(offer.slug);
  const router = useRouter();

  const [clip, setClip] = useState<PlayableClip | null>(null);

  /**
   * Ad traffic arrives with ?kw=<key> and the H1 echoes the search that
   * produced the click.
   *
   * The query string is not React state and a static export cannot see it at
   * build time, so it is read as an external source with the default as the
   * server snapshot — rather than set into state from an effect, which would
   * render twice on every visit to say the same thing.
   *
   * Only ever from the allow-list: rendering arbitrary text out of a URL is
   * how a page ends up hosting somebody else's message.
   */
  const headline = useSyncExternalStore(
    useCallback(() => () => {}, []),
    useCallback(() => {
      const kw = new URLSearchParams(window.location.search).get("kw");
      return (kw && offer.headlines[kw]) || offer.headline;
    }, [offer]),
    useCallback(() => offer.headline, [offer]),
  );

  const waHref = `${contact.whatsapp}?text=${encodeURIComponent(offer.whatsapp)}`;

  const onReserve = () => {
    track("reserve_seat_click", { course: offer.slug, price: offer.price.amount });
    router.push(ENROLMENT_OPEN ? `/lms/checkout/${offer.slug}/` : `/lms/course/${offer.slug}/`);
  };

  const onWhatsApp = () => track("whatsapp_click", { course: offer.slug, placement: "landing" });

  return (
    <div style={{ background: "#fff" }}>
      {/* ------------------------------------------------------- ABOVE FOLD */}
      <section style={{ background: "linear-gradient(120deg,#0c2a45,#0a1f38)", padding: "54px 48px 60px" }} className="site-page-sec">
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: 44, alignItems: "center" }} className="lp-hero-grid">
          <div>
            <div style={{ font: `700 11.5px ${SANS}`, color: "#5fe0d6", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 }}>
              <BrandText>{offer.eyebrow}</BrandText>
            </div>
            <h1 style={{ font: `800 clamp(30px,3.6vw,46px)/1.12 ${SANS}`, color: "#fff", margin: "0 0 16px", letterSpacing: "-.02em" }}>
              {headline}
            </h1>
            <p style={{ font: `400 clamp(15px,1.3vw,17px)/1.7 ${SANS}`, color: "rgba(255,255,255,.82)", margin: "0 0 26px", maxWidth: 560 }}>
              {offer.sub}
            </p>

            {/* The three facts that decide whether to keep reading. */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
              <Fact k="Batch starts" v={offer.batch.starts} />
              {typeof offer.seatsLeft === "number" && <Fact k="Seats left" v={String(offer.seatsLeft)} accent />}
              {offer.offerClosesOn && <Fact k="Offer closes" v={offer.offerClosesOn} accent />}
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button type="button" onClick={onReserve} className="lp-btn-grad" style={ctaPrimary}>
                Reserve a seat →
              </button>
              <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={onWhatsApp} style={ctaGhost}>
                Talk to the team
              </a>
            </div>
            <div style={{ font: `500 11.5px ${SANS}`, color: "rgba(255,255,255,.5)", marginTop: 12 }}>
              Questions before you pay? Message us — we answer on WhatsApp.
            </div>
          </div>

          <div>
            {offer.founderVideoId ? (
              /* Video first, then the same facts in a strip beneath it. The
                 batch card was carrying the dates and the fee, and a video
                 that simply replaced it would take them off the fold. */
              <>
                <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: 18, overflow: "hidden", border: "1px solid rgba(255,255,255,.14)", background: "#000", marginBottom: 14 }}>
                  <div style={{ position: "absolute", inset: 0 }}>
                  <YouTubeEmbed
                    id={offer.founderVideoId}
                    title={`${offer.eyebrow} — a message from Parichita Kotnala`}
                    autoplay={false}
                    controls
                  />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 18px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.16)", borderRadius: 14, padding: "16px 18px" }}>
                  {offer.batch.rows.map((r) => (
                    <div key={r.k} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <span style={{ font: `500 12px ${SANS}`, color: "rgba(255,255,255,.6)" }}>{r.k}</span>
                      <span style={{ font: `700 12px ${SANS}`, color: "#fff", textAlign: "right" }}>{r.v}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* No founder video yet. The batch card is a better placeholder
                 than an empty frame: it repeats the facts that close the sale. */
              <div style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.16)", borderRadius: 18, padding: "26px 28px" }}>
                <div style={{ font: `700 11px ${SANS}`, color: "#5fe0d6", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 16 }}>
                  This batch
                </div>
                {offer.batch.rows.map((r) => (
                  <div key={r.k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,.09)" }}>
                    <span style={{ font: `500 13px ${SANS}`, color: "rgba(255,255,255,.62)" }}>{r.k}</span>
                    <span style={{ font: `700 13px ${SANS}`, color: "#fff", textAlign: "right" }}>{r.v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Accreditations spaceBelow={false} />

      {/* ------------------------------------------------------------- WHY */}
      <section className="site-page-sec" style={{ padding: "72px 48px", background: "#f7fafc" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <H2 eyebrow="Why this certification">Four reasons it costs what it costs</H2>
          <div className="site-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 34 }}>
            {offer.why.map((w) => (
              <div key={w.k} style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 18, padding: "24px 26px" }}>
                <div style={{ font: `700 16px ${SANS}`, color: "#0a1b33", marginBottom: 8 }}>{w.k}</div>
                <p style={{ font: `400 14px/1.75 ${SANS}`, color: "#5b6e82", margin: 0 }}>{w.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- CURRICULUM */}
      {outline && (
        <section className="site-page-sec" style={{ padding: "72px 48px" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <H2 eyebrow="Curriculum">{`${outline.modules.length} modules`}</H2>
            <p style={{ font: `400 15px/1.75 ${SANS}`, color: "#5b6e82", margin: "12px 0 30px", maxWidth: 720 }}>{outline.intro}</p>
            <div className="site-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {outline.modules.map((m, i) => (
                <div key={m} style={{ display: "flex", gap: 13, alignItems: "flex-start", background: "#f7fafc", border: "1px solid #e9eff4", borderRadius: 13, padding: "15px 17px" }}>
                  <span style={{ flex: "none", width: 25, height: 25, borderRadius: 8, background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)", color: "#fff", font: `800 11px ${SANS}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ font: `600 13.5px/1.55 ${SANS}`, color: "#0a1b33" }}>{m}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------ KIT */}
      {offer.kit && <LeadGate kit={offer.kit} slug={offer.slug} />}

      {/* --------------------------------------------------------- CAREER */}
      <section className="site-page-sec" style={{ padding: "72px 48px", background: "#f7fafc" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <H2 eyebrow="After the certification">{offer.career.title}</H2>
          <p style={{ font: `400 15px/1.75 ${SANS}`, color: "#5b6e82", margin: "12px 0 24px" }}>{offer.career.intro}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {offer.career.points.map((p) => (
              <div key={p} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#fff", border: "1px solid #e3eaf0", borderRadius: 13, padding: "15px 18px" }}>
                <Tick />
                <span style={{ font: `500 14px/1.65 ${SANS}`, color: "#3d5064" }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- CERTIFICATES */}
      {course && (
        <section className="site-page-sec" style={{ padding: "72px 48px" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <H2 eyebrow="What you receive">Two certificates on completion</H2>
            <div style={{ marginTop: 30 }}>
              <CertificateGallery cards={certificateCards(course.certificate)} />
            </div>
          </div>
        </section>
      )}

      <VideoTestimonials onPlay={setClip} />
      <TrustedBy />

      {/* ------------------------------------------------------------ FAQ */}
      {offer.faqs.length > 0 && (
        <section className="site-page-sec" style={{ padding: "72px 48px", background: "#f7fafc" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <FaqAccordion items={offer.faqs} />
          </div>
        </section>
      )}

      {/* --------------------------------------------------------- BUNDLE */}
      {offer.bundle && (
        <section className="site-page-sec" style={{ padding: "0 48px 72px", background: "#f7fafc" }}>
          <div style={{ maxWidth: 860, margin: "0 auto", background: "#fff", border: "1px solid #e3eaf0", borderRadius: 18, padding: "26px 28px", display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ font: `700 15.5px ${SANS}`, color: "#0a1b33", marginBottom: 6 }}>{offer.bundle.title}</div>
              <p style={{ font: `400 13.5px/1.7 ${SANS}`, color: "#5b6e82", margin: 0 }}>{offer.bundle.body}</p>
            </div>
            <Link href={offer.bundle.href} style={{ ...ctaGhost, color: "#0a1b33", borderColor: "rgba(10,27,51,.24)", whiteSpace: "nowrap" }}>
              See that programme
            </Link>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------ FINAL CTA */}
      <section className="site-page-sec" style={{ background: "linear-gradient(120deg,#0c2a45,#0a1f38)", padding: "64px 48px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ font: `800 clamp(24px,2.6vw,34px)/1.2 ${SANS}`, color: "#fff", margin: "0 0 12px", letterSpacing: "-.02em" }}>
            Next batch starts {offer.batch.starts}
          </h2>
          <p style={{ font: `400 15px/1.7 ${SANS}`, color: "rgba(255,255,255,.78)", margin: "0 0 26px" }}>
            Seats are limited per batch so that everyone gets facilitation practice and feedback. Reserve yours, or message us first — either is fine.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button type="button" onClick={onReserve} className="lp-btn-grad" style={ctaPrimary}>Reserve a seat →</button>
            <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={onWhatsApp} style={ctaGhost}>Talk to the team</a>
          </div>
          <div style={{ font: `500 12px ${SANS}`, color: "rgba(255,255,255,.55)", marginTop: 18 }}>
            {contact.phone} · {contact.email}
          </div>
        </div>
      </section>
      {clip && (
        <div
          role="dialog"
          aria-modal
          aria-label={clip.title}
          onClick={() => setClip(null)}
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(10,27,51,.55)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: clip.portrait ? 420 : 900, aspectRatio: clip.portrait ? "9 / 16" : "16 / 9", borderRadius: 18, overflow: "hidden", background: "#000" }}
          >
            <YouTubeEmbed key={clip.id} id={clip.id} title={clip.title} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ bits */

const ctaPrimary: React.CSSProperties = {
  cursor: "pointer",
  border: "none",
  background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)",
  color: "#fff",
  font: `700 15px ${SANS}`,
  padding: "15px 30px",
  borderRadius: 999,
};

const ctaGhost: React.CSSProperties = {
  display: "inline-block",
  background: "transparent",
  border: "1.5px solid rgba(255,255,255,.4)",
  color: "#fff",
  font: `700 14.5px ${SANS}`,
  padding: "14px 26px",
  borderRadius: 999,
};

function Fact({ k, v, accent = false }: { k: string; v: string; accent?: boolean }) {
  return (
    <div
      style={{
        background: accent ? "rgba(255,176,86,.15)" : "rgba(255,255,255,.08)",
        border: `1px solid ${accent ? "rgba(255,176,86,.45)" : "rgba(255,255,255,.18)"}`,
        borderRadius: 12,
        padding: "9px 15px",
      }}
    >
      <div style={{ font: `600 10px ${SANS}`, color: accent ? "#ffcf94" : "rgba(255,255,255,.55)", letterSpacing: ".12em", textTransform: "uppercase" }}>{k}</div>
      <div style={{ font: `700 13.5px ${SANS}`, color: "#fff", marginTop: 3 }}>{v}</div>
    </div>
  );
}

function H2({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <>
      <div style={{ font: `700 11.5px ${SANS}`, color: "#1b8f88", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 12 }}>{eyebrow}</div>
      <h2 style={{ font: `700 clamp(24px,2.6vw,34px)/1.18 ${SANS}`, color: "#0a1b33", margin: 0, letterSpacing: "-.02em" }}>{children}</h2>
    </>
  );
}

const Tick = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flex: "none", marginTop: 1 }}>
    <circle cx="12" cy="12" r="11" fill="#1b8f88" />
    <path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
