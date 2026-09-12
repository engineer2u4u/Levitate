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
import { courseBySlug } from "@/lib/lms/courses";
import { useCatalogCourse } from "@/components/site/CatalogProvider";
import { fill } from "@/lib/catalog";
import { outlineBySlug } from "@/lib/programOutlines";
import { contact } from "@/lib/site";
import { track } from "@/lib/track";
import type { LandingOffer, WhyIcon } from "@/lib/landing";
import LeadGate from "./LeadGate";

export const SANS = "'Plus Jakarta Sans',sans-serif";

/**
 * One content width for every section on the page.
 *
 * The sections used to run at 1180, 1080, 900, 860 and 780 — each chosen on
 * its own merits, and together a column whose edges wandered in and out as you
 * scrolled. Every section now shares one edge. Paragraphs keep a readable
 * measure inside it, so text does not run the full width; the boxes do.
 */
export const MAX = 1180;
export const MEASURE = 760;

/**
 * One type scale.
 *
 * Body copy had drifted across 13.5, 14, 14.5 and 15px and card titles across
 * 15.5 and 16. The headings are set to match the shared sections this page
 * embeds — accreditations, testimonials, client logos — so the page reads as
 * one document rather than several stitched together.
 */
export const T = {
  eyebrow: `700 12px ${SANS}`,
  h2: `700 clamp(26px,2.8vw,36px)/1.15 ${SANS}`,
  lead: `400 16px/1.75 ${SANS}`,
  cardTitle: `700 17px/1.35 ${SANS}`,
  body: `400 15px/1.75 ${SANS}`,
  item: `600 15px/1.55 ${SANS}`,
  small: `500 13px/1.6 ${SANS}`,
} as const;

/**
 * The skeleton the paid-ad sales pages share.
 *
 * Different from the programme pages on purpose. Those are for someone
 * browsing the catalogue; this is for someone who just clicked an ad for one
 * specific thing and will leave in seconds if the page does not obviously
 * answer the search. So: one programme, one date, two buttons, and every
 * section below the fold earning its place as a reason to click them.
 */
export default function SalesPage({ offer }: { offer: LandingOffer }) {
  // Only for the certificate artwork — the fee is no longer shown here.
  const course = courseBySlug(offer.slug);

  // Dates and the fee come from the admin's catalogue. The page's own copy
  // carries {starts} and {fee} placeholders (see lib/landing.ts), and the
  // "Also running" blurb is filled with the other programme's dates.
  const entry = useCatalogCourse(offer.slug);
  const bundleEntry = useCatalogCourse(offer.bundle?.slug ?? "");
  const batch = { starts: fill(offer.batch.starts, entry), rows: offer.batch.rows.map((r) => ({ k: r.k, v: fill(r.v, entry) })) };
  const faqs = offer.faqs.map((f) => ({ ...f, a: f.a.map((t) => fill(t, entry)) }));
  const price = fill(offer.price.amount, entry);
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

  const waHref = `${contact.whatsapp}?text=${encodeURIComponent(fill(offer.whatsapp, entry))}`;

  /**
   * The primary button now opens a conversation rather than a checkout. It
   * carries the programme along, so the enquiry says which page it came from
   * — otherwise every landing page's leads look alike in the admin.
   */
  const onEnquire = () => {
    track("enquire_click", { course: offer.slug, price });
    // Straight to the form, not the top of the contact page.
    router.push(`/contact/?from=${offer.slug}#enquiry-form`);
  };

  const onWhatsApp = () => track("whatsapp_click", { course: offer.slug, placement: "landing" });

  // Down the first column, then down the second — how a numbered list is read.
  const modules = outline?.modules ?? [];
  const moduleRows = Math.ceil(modules.length / 2);

  return (
    <div style={{ background: "#fff" }}>
      {/* ------------------------------------------------------- ABOVE FOLD */}
      <section style={{ background: "linear-gradient(120deg,#0c2a45,#0a1f38)", padding: "54px 48px 60px" }} className="site-page-sec">
        <div style={{ maxWidth: MAX, margin: "0 auto", display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: 44, alignItems: "center" }} className="lp-hero-grid">
          <div>
            <div style={{ font: T.eyebrow, color: "#5fe0d6", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 }}>
              <BrandText>{offer.eyebrow}</BrandText>
            </div>
            <h1 style={{ font: `800 clamp(30px,3.6vw,46px)/1.12 ${SANS}`, color: "#fff", margin: "0 0 16px", letterSpacing: "-.02em" }}>
              {headline}
            </h1>
            <p style={{ font: T.lead, color: "rgba(255,255,255,.82)", margin: "0 0 26px", maxWidth: 560 }}>
              {offer.sub}
            </p>

            {/* The facts that decide whether to keep reading. */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
              <Fact k="Batch starts" v={batch.starts} />
              {typeof offer.seatsLeft === "number" && <Fact k="Seats left" v={String(offer.seatsLeft)} accent />}
              {offer.offerClosesOn && <Fact k="Offer closes" v={offer.offerClosesOn} accent />}
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button type="button" onClick={onEnquire} className="lp-btn-grad" style={ctaPrimary}>
                Enquire Now
              </button>
              <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={onWhatsApp} style={ctaGhost}>
                Talk to the team
              </a>
            </div>
            <div style={{ font: T.small, color: "rgba(255,255,255,.5)", marginTop: 12 }}>
              Questions before you pay? Message us — we answer on WhatsApp.
            </div>
          </div>

          <div>
            {offer.founderVideoId ? (
              /* Video first, then the batch facts in a strip beneath it, so a
                 video does not take them off the fold. */
              <>
                <div style={{ position: "relative", paddingTop: "56.25%", borderRadius: 18, overflow: "hidden", border: "1px solid rgba(255,255,255,.14)", background: "#000", marginBottom: 14 }}>
                  <div style={{ position: "absolute", inset: 0 }}>
                    <YouTubeEmbed
                      id={offer.founderVideoId}
                      title={`${offer.eyebrow} — a message from Parichita Kotnala`}
                      autoplay={false}
                      controls
                      facade
                      posterLabel={offer.posterLabel}
                    />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 18px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.16)", borderRadius: 14, padding: "16px 18px" }}>
                  {batch.rows.map((r) => (
                    <div key={r.k} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <span style={{ font: T.small, color: "rgba(255,255,255,.6)" }}>{r.k}</span>
                      <span style={{ font: T.small, fontWeight: 700, color: "#fff", textAlign: "right" }}>{r.v}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* No founder video yet. The batch card is a better placeholder
                 than an empty frame: it repeats the facts that close the sale. */
              <div style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.16)", borderRadius: 18, padding: "26px 28px" }}>
                <div style={{ font: T.eyebrow, color: "#5fe0d6", letterSpacing: ".16em", textTransform: "uppercase", marginBottom: 16 }}>
                  This batch
                </div>
                {batch.rows.map((r) => (
                  <div key={r.k} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,.09)" }}>
                    <span style={{ font: T.small, color: "rgba(255,255,255,.62)" }}>{r.k}</span>
                    <span style={{ font: T.small, fontWeight: 700, color: "#fff", textAlign: "right" }}>{r.v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Accreditations spaceBelow={false} maxWidth={MAX} />

      {/* ------------------------------------------------------------- WHY */}
      <Section tone="soft">
        <H2 eyebrow="Why this certification">Four reasons it costs what it costs</H2>
        <div className="site-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 34 }}>
          {offer.why.map((w) => (
            <div key={w.k} style={{ display: "flex", gap: 18, alignItems: "flex-start", background: "#fff", border: "1px solid #e3eaf0", borderRadius: 18, padding: "26px 28px" }}>
              <span
                aria-hidden
                style={{ flex: "none", width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,rgba(47,196,188,.16),rgba(47,127,214,.16))", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Icon name={w.icon} />
              </span>
              <div>
                <div style={{ font: T.cardTitle, color: "#0a1b33", marginBottom: 8 }}>{w.k}</div>
                <p style={{ font: T.body, color: "#5b6e82", margin: 0 }}>{w.v}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* --------------------------------------------------------- CURRICULUM */}
      {outline && (
        <Section>
          <H2 eyebrow="Curriculum">{`${modules.length} modules`}</H2>
          <p style={{ font: T.lead, color: "#5b6e82", margin: "14px 0 32px", maxWidth: MEASURE }}>{outline.intro}</p>
          <div
            className="lp-modules"
            style={{ ["--rows" as string]: moduleRows } as React.CSSProperties}
          >
            {modules.map((m, i) => (
              <div key={m} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#f7fafc", border: "1px solid #e9eff4", borderRadius: 14, padding: "16px 18px" }}>
                <span style={{ flex: "none", width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)", color: "#fff", font: `800 12px ${SANS}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ font: T.item, color: "#0a1b33", paddingTop: 3 }}>{m}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ------------------------------------------------------------ KIT */}
      {offer.kit && <LeadGate kit={offer.kit} slug={offer.slug} />}

      {/* --------------------------------------------------------- CAREER */}
      <Section tone="soft">
        <H2 eyebrow="After the certification">{offer.career.title}</H2>
        <p style={{ font: T.lead, color: "#5b6e82", margin: "14px 0 28px", maxWidth: MEASURE }}>{offer.career.intro}</p>
        <div className="site-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {offer.career.points.map((p) => (
            <div key={p} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#fff", border: "1px solid #e3eaf0", borderRadius: 14, padding: "18px 20px" }}>
              <Tick />
              <span style={{ font: T.body, color: "#3d5064" }}>{p}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* --------------------------------------------------- CERTIFICATES */}
      {course && (
        <Section>
          <H2 eyebrow="What you receive">Two certificates on completion</H2>
          <div style={{ marginTop: 32 }}>
            <CertificateGallery cards={certificateCards(course.certificate)} equal />
          </div>
        </Section>
      )}

      <VideoTestimonials onPlay={setClip} maxWidth={MAX} headingFont={T.h2} />
      <TrustedBy maxWidth={MAX} />

      {/* ------------------------------------------------------------ FAQ */}
      {faqs.length > 0 && (
        <Section tone="soft">
          <FaqAccordion items={faqs} size="lg" />
        </Section>
      )}

      {/* --------------------------------------------------------- BUNDLE */}
      {offer.bundle && (
        <Section tone="soft" flush>
          <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 18, padding: "28px 30px", display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ font: T.cardTitle, color: "#0a1b33", marginBottom: 6 }}>{offer.bundle.title}</div>
              <p style={{ font: T.body, color: "#5b6e82", margin: 0 }}>{fill(offer.bundle.body, bundleEntry)}</p>
            </div>
            <Link href={offer.bundle.href} style={{ ...ctaGhost, color: "#0a1b33", borderColor: "rgba(10,27,51,.24)", whiteSpace: "nowrap" }}>
              See that programme
            </Link>
          </div>
        </Section>
      )}

      {/* ------------------------------------------------------ FINAL CTA */}
      <section className="site-page-sec" style={{ background: "linear-gradient(120deg,#0c2a45,#0a1f38)", padding: "72px 48px" }}>
        <div style={{ maxWidth: MAX, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ font: T.h2, color: "#fff", margin: "0 0 14px", letterSpacing: "-.02em" }}>
            Next batch starts {batch.starts}
          </h2>
          <p style={{ font: T.lead, color: "rgba(255,255,255,.78)", margin: "0 auto 28px", maxWidth: MEASURE }}>
            Seats are limited per batch so that everyone gets facilitation practice and feedback. Reserve yours, or message us first — either is fine.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button type="button" onClick={onEnquire} className="lp-btn-grad" style={ctaPrimary}>Enquire Now</button>
            <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={onWhatsApp} style={ctaGhost}>Talk to the team</a>
          </div>
          <div style={{ font: T.small, color: "rgba(255,255,255,.55)", marginTop: 18 }}>
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

/** A full-width band with its content held to the page's one width. */
export function Section({ children, tone, flush = false }: { children: React.ReactNode; tone?: "soft"; flush?: boolean }) {
  return (
    <section className="site-page-sec" style={{ padding: flush ? "0 48px 80px" : "80px 48px", background: tone === "soft" ? "#f7fafc" : "#fff" }}>
      <div style={{ maxWidth: MAX, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

export const ctaPrimary: React.CSSProperties = {
  cursor: "pointer",
  border: "none",
  background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)",
  color: "#fff",
  font: `700 15px ${SANS}`,
  padding: "15px 30px",
  borderRadius: 999,
};

export const ctaGhost: React.CSSProperties = {
  display: "inline-block",
  background: "transparent",
  border: "1.5px solid rgba(255,255,255,.4)",
  color: "#fff",
  font: `700 15px ${SANS}`,
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
      <div style={{ font: `600 11px ${SANS}`, color: accent ? "#ffcf94" : "rgba(255,255,255,.55)", letterSpacing: ".12em", textTransform: "uppercase" }}>{k}</div>
      <div style={{ font: `700 15px ${SANS}`, color: "#fff", marginTop: 3 }}>{v}</div>
    </div>
  );
}

export function H2({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <>
      <div style={{ font: T.eyebrow, color: "#1b8f88", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 }}>{eyebrow}</div>
      <h2 style={{ font: T.h2, color: "#0a1b33", margin: 0, letterSpacing: "-.02em" }}>{children}</h2>
    </>
  );
}

export const Tick = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flex: "none", marginTop: 2 }}>
    <circle cx="12" cy="12" r="11" fill="#1b8f88" />
    <path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Line icons for the "why" cards. Drawn here rather than pulled from a
 * library: six glyphs are not worth a dependency, and these share one stroke
 * weight and one colour so they read as a set.
 */
function Icon({ name }: { name: WhyIcon }) {
  const p = { fill: "none", stroke: "#1b8f88", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width="26" height="26" viewBox="0 0 24 24">
      {name === "clock" && (<><circle cx="12" cy="12" r="9" {...p} /><path d="M12 7v5l3 2" {...p} /></>)}
      {name === "award" && (<><circle cx="12" cy="9" r="6" {...p} /><path d="M8.5 13.8L7 22l5-3 5 3-1.5-8.2" {...p} /></>)}
      {name === "person" && (<><circle cx="12" cy="8" r="4" {...p} /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" {...p} /></>)}
      {name === "screen" && (<><rect x="3" y="4" width="18" height="12" rx="2" {...p} /><path d="M8 20h8M12 16v4" {...p} /></>)}
      {name === "shield" && (<path d="M12 3l8 3v6c0 4.5-3.3 8.3-8 9-4.7-.7-8-4.5-8-9V6z M9 12l2 2 4-4" {...p} />)}
      {name === "layers" && (<><path d="M12 3l9 5-9 5-9-5z" {...p} /><path d="M3 13l9 5 9-5" {...p} /></>)}
    </svg>
  );
}
