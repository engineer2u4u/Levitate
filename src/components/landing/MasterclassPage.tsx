/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, type CSSProperties } from "react";
import Link from "next/link";
import Accreditations from "@/components/site/Accreditations";
import FaqAccordion from "@/components/site/FaqAccordion";
import type { MasterclassOffer, ThemeIcon } from "@/lib/masterclass";
import { useCatalogCourse } from "@/components/site/CatalogProvider";
import { dateCompact, dateFull, firstSession, startsText } from "@/lib/catalog";
import { formatPaise } from "@/lib/lms/payment";
import { contact } from "@/lib/site";
import { track } from "@/lib/track";
import { H2, MAX, MEASURE, SANS, Section, T, Tick, ctaGhost, ctaPrimary } from "./SalesPage";
import RegisterCard, { useSeatClosed, type Seat } from "./RegisterCard";
import { Glyph, type GlyphName } from "./Glyph";

/**
 * The PoSH 2026 masterclass: a paid, two-hour session sold straight from an
 * ad click.
 *
 * The certification pages send people to a conversation, because ₹32,000 is
 * a decision made with a manager. ₹1,999 is not, so this page takes the money
 * on the spot: the registration form sits in the hero, and paying is
 * registering. No account — someone who clicked an ad will not make one.
 */

/** What the page says about the session that an admin can change. */
type Facts = {
  feePaise: number;
  standardPaise: number;
  startsAt: string;
  endsAt: string;
  /** "Friday" */
  day: string;
  /** "27 September 2026" */
  date: string;
  /** "Sun, 27 Sep 2026" */
  dateShort: string;
  time: string;
  duration: string;
  checkoutTitle: string;
};

/**
 * The fee, the standard fee, the date and the times as the admin last saved
 * them (course "posh-masterclass-2026" and its session), with the page's own
 * constants as the fallback. The payment server reads the same row, so what
 * this shows and what it charges agree.
 */
function useFacts(M: MasterclassOffer): Facts {
  const entry = useCatalogCourse(M.slug);
  return useMemo(() => {
    const s = entry ? firstSession(entry) : null;
    const startsOn = s?.startsOn ?? M.startsAt.slice(0, 10);
    const [day, date] = dateFull(startsOn).split(", ");
    return {
      feePaise: entry?.feePaise ?? M.feePaise,
      standardPaise: entry?.listPricePaise ?? M.standardPaise,
      startsAt: s?.startsAt ?? M.startsAt,
      endsAt: s?.endsAt ?? M.endsAt,
      day,
      date,
      dateShort: dateCompact(startsOn),
      time: s?.timeLabel || M.time,
      duration: entry?.duration || M.duration,
      checkoutTitle: `${M.checkoutPrefix} · ${date}`,
    };
  }, [entry, M]);
}

/** The offer and the catalogue's facts, as the registration card asks for them. */
const seatFor = (M: MasterclassOffer, f: Facts): Seat => ({
  slug: M.slug,
  short: M.short,
  path: M.path,
  checkoutTitle: f.checkoutTitle,
  feePaise: f.feePaise,
  standardPaise: f.standardPaise,
  feeLabel: M.feeLabel,
  day: f.day,
  date: f.date,
  startsAt: f.startsAt,
  endsAt: f.endsAt,
  closedNote: "This masterclass has started. Message us to hear about the next one.",
  formTag: "masterclass",
});

const scrollToRegister = () => {
  document.getElementById("register")?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function MasterclassPage({ offer: M }: { offer: MasterclassOffer }) {
  const facts = useFacts(M);
  const closed = useSeatClosed(facts.startsAt);
  const crossEntry = useCatalogCourse(M.crossSell.startsFrom ?? "");
  const crossStarts = crossEntry ? startsText(crossEntry) : "";
  const waHref = `${contact.whatsapp}?text=${encodeURIComponent(`Hi, I have a question about the ${M.short} on ${facts.date}.`)}`;

  // FAQ answers carry {when}, {date}, {fee} and {list_fee}.
  const faqs = M.faqs.map((f) => ({
    ...f,
    a: f.a.map((t) =>
      t
        .replace("{when}", `${facts.day}, ${facts.date}, ${facts.time}`)
        .replace("{date}", facts.date)
        .replace("{fee}", formatPaise(facts.feePaise))
        .replace("{list_fee}", formatPaise(facts.standardPaise)),
    ),
  }));
  const onWhatsApp = () => track("whatsapp_click", { course: M.slug, placement: "masterclass" });

  const onReserve = () => {
    track("reserve_seat_click", { course: M.slug });
    scrollToRegister();
  };

  return (
    <div style={{ background: "#fff" }}>
      {/* ------------------------------------------------------- ABOVE FOLD */}
      <section style={{ background: "linear-gradient(120deg,#0c2a45,#0a1f38)", padding: "54px 48px 64px" }} className="site-page-sec">
        <div style={{ maxWidth: MAX, margin: "0 auto", display: "grid", gridTemplateColumns: "1.08fr .92fr", gap: 48, alignItems: "start" }} className="lp-hero-grid">
          <div style={{ paddingTop: 10 }}>
            <div style={{ display: "inline-block", font: T.eyebrow, color: "#f3d6a4", letterSpacing: ".2em", textTransform: "uppercase", background: "rgba(212,166,52,.14)", border: "1px solid rgba(212,166,52,.4)", borderRadius: 8, padding: "8px 14px", marginBottom: 20 }}>
              {M.eyebrow}
            </div>
            <h1 style={{ font: `800 clamp(34px,4.4vw,58px)/1.06 ${SANS}`, color: "#fff", margin: "0 0 10px", letterSpacing: "-.025em" }}>
              {M.title}
            </h1>
            <div style={{ font: `700 clamp(24px,2.8vw,36px)/1.18 ${SANS}`, color: "#5fe0d6", margin: "0 0 18px", letterSpacing: "-.015em" }}>
              {M.titleRest}
            </div>
            <p style={{ font: T.lead, fontSize: 17, color: "rgba(255,255,255,.82)", margin: `0 0 ${M.intro ? 16 : 30}px`, maxWidth: 560 }}>{M.sub}</p>
            {M.intro && (
              <p style={{ font: T.body, color: "rgba(255,255,255,.72)", margin: "0 0 24px", maxWidth: 560 }}>{M.intro}</p>
            )}
            {M.scenario && (
              <div style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(95,224,214,.28)", borderLeft: "3px solid #5fe0d6", borderRadius: "0 14px 14px 0", padding: "18px 20px", margin: "0 0 26px", maxWidth: 560 }}>
                <div style={{ font: `700 16px/1.5 ${SANS}`, color: "#fff", marginBottom: 8 }}>{M.scenario.q}</div>
                <p style={{ font: T.body, color: "rgba(255,255,255,.72)", margin: 0 }}>{M.scenario.body}</p>
              </div>
            )}

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 30 }}>
              <Fact icon="calendar" k="Date" v={facts.dateShort} />
              <Fact icon="clock" k="Timings" v={facts.time} />
              <Fact icon="hourglass" k="Duration" v={facts.duration} />
            </div>

            {/* Phones stack the card below all this; one tap takes them to it. */}
            {!closed && (
              <button type="button" onClick={onReserve} className="lp-btn-grad mc-mobile-cta" style={{ ...ctaPrimary, width: "100%", marginBottom: 28, fontSize: 16 }}>
                Reserve Your Seat · {formatPaise(facts.feePaise)} →
              </button>
            )}

            {M.chips && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 26 }}>
                {M.chips.map((c) => (
                  <span key={c} style={{ font: `600 12.5px ${SANS}`, color: "#bff3ee", background: "rgba(95,224,214,.12)", border: "1px solid rgba(95,224,214,.3)", borderRadius: 999, padding: "8px 14px" }}>
                    {c}
                  </span>
                ))}
              </div>
            )}

            <div style={{ display: "inline-flex", alignItems: "center", gap: 14, background: "#fff", borderRadius: 14, padding: "10px 16px", flexWrap: "wrap" }}>
              <img src="/assets/accreditations/shrm.png" alt="SHRM Recertification Provider" height={42} style={{ height: 42, width: "auto" }} />
              <img src="/assets/accreditations/cpd-member.png" alt="CPD Member — The CPD Certification Service" height={42} style={{ height: 42, width: "auto" }} />
              <div style={{ font: `600 13px/1.45 ${SANS}`, color: "#0a1b33", maxWidth: 240 }}>
                SHRM Recertification Provider
                <span style={{ display: "block", fontWeight: 500, color: "#5b6e82" }}>and CPD Member</span>
              </div>
            </div>
          </div>

          <RegisterCard seat={seatFor(M, facts)} closed={closed} />
        </div>
      </section>

      {/* ------------------------------------------------------- THE AGENDA */}
      <Section>
        <H2 eyebrow={M.agenda.eyebrow}>{M.agenda.heading}</H2>
        <p style={{ font: T.lead, color: "#5b6e82", margin: "14px 0 34px", maxWidth: MEASURE }}>{M.agenda.intro}</p>
        <div className="site-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
          {M.themes.map((t, i) => (
            <div key={t.title} style={{ background: "#f7fafc", border: "1px solid #e3eaf0", borderRadius: 18, padding: "28px 26px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <span aria-hidden style={iconTile}>
                  <ThemeGlyph name={t.icon} />
                </span>
                <span style={{ font: `800 13px ${SANS}`, color: "#a9b8c6", letterSpacing: ".08em" }}>{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div style={{ font: T.cardTitle, fontSize: 19, color: "#0a1b33", marginBottom: 6 }}>{t.title}</div>
              <p style={{ font: T.body, color: "#5b6e82", margin: "0 0 18px" }}>{t.intro}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: "auto" }}>
                {t.points.map((p) => (
                  <div key={p} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <Tick />
                    <span style={{ font: T.body, color: "#3d5064" }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------- AUDIENCE + FACILITATOR */}
      <Section tone="soft">
        <div className="lp-hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
          <div>
            <H2 eyebrow="Who should attend">{M.audience.heading}</H2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 28 }}>
              {M.audience.items.map((a) => (
                <div key={a} style={{ display: "flex", gap: 14, alignItems: "center", background: "#fff", border: "1px solid #e3eaf0", borderRadius: 14, padding: "15px 18px" }}>
                  <span aria-hidden style={{ ...iconTile, width: 38, height: 38, borderRadius: 10 }}>
                    <Glyph name="person" size={20} />
                  </span>
                  <span style={{ font: T.item, color: "#0a1b33" }}>{a}</span>
                </div>
              ))}
              {M.audience.note && (
                <p style={{ font: T.body, color: "#5b6e82", margin: "6px 0 0" }}>{M.audience.note}</p>
              )}
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 0 }} className="mc-facilitator">
              <img
                src="/assets/parichita-kotnala.jpg"
                alt="Parichita Kotnala, Founder & Managing Partner of Levitate PeopleSoft"
                style={{ width: "100%", height: "100%", minHeight: 200, objectFit: "cover", objectPosition: "50% 15%", display: "block" }}
              />
              <div style={{ padding: "24px 24px 22px" }}>
                <div style={{ font: T.eyebrow, color: "#1b8f88", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 10 }}>Your facilitator</div>
                <div style={{ font: `700 21px ${SANS}`, color: "#0a1b33" }}>Parichita Kotnala</div>
                <div style={{ font: T.small, color: "#1b8f88", fontWeight: 600, marginTop: 2 }}>{M.facilitator.strap}</div>
              </div>
            </div>
            <div style={{ padding: "4px 26px 26px", display: "flex", flexDirection: "column", gap: 12 }}>
              {M.facilitator.paragraphs.map((p, i) => (
                <p key={p} style={{ font: T.body, color: "#5b6e82", margin: i === 0 ? "18px 0 0" : 0 }}>{p}</p>
              ))}
              <Link href="/parichita-kotnala/" style={{ font: `700 14px ${SANS}`, color: "#1b8f88", marginTop: 4 }}>
                Read her full profile →
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <Accreditations spaceBelow maxWidth={MAX} intro={M.recognition} />

      {/* ------------------------------------------------------------ FAQ */}
      <Section tone="soft">
        <FaqAccordion items={faqs} size="lg" />
      </Section>

      {/* ------------------------------------------------------ CROSS-SELL */}
      <Section tone="soft" flush>
        <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 18, padding: "28px 30px", display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ font: T.cardTitle, color: "#0a1b33", marginBottom: 6 }}>{M.crossSell.title}</div>
            <p style={{ font: T.body, color: "#5b6e82", margin: 0 }}>
              {M.crossSell.body}{crossStarts ? `, with a batch starting ${crossStarts}` : ""}.
            </p>
          </div>
          <Link href={M.crossSell.href} style={{ ...ctaGhost, color: "#0a1b33", borderColor: "rgba(10,27,51,.24)", whiteSpace: "nowrap" }}>
            {M.crossSell.cta}
          </Link>
        </div>
      </Section>

      {/* ------------------------------------------------------ FINAL CTA */}
      <section className="site-page-sec" style={{ background: "linear-gradient(120deg,#0c2a45,#0a1f38)", padding: "72px 48px" }}>
        <div style={{ maxWidth: MAX, margin: "0 auto", textAlign: "center" }}>
          <div style={{ font: T.eyebrow, color: "#5fe0d6", letterSpacing: ".18em", textTransform: "uppercase", marginBottom: 14 }}>
            {facts.day}, {facts.date} · {facts.time}
          </div>
          <h2 style={{ font: T.h2, color: "#fff", margin: "0 0 14px", letterSpacing: "-.02em" }}>
            {closed ? "Registrations for this masterclass have closed" : `Reserve your seat for ${formatPaise(facts.feePaise)}`}
          </h2>
          <p style={{ font: T.lead, color: "rgba(255,255,255,.78)", margin: "0 auto 28px", maxWidth: MEASURE }}>
            {closed
              ? "Message us to hear about the next session."
              : facts.standardPaise > facts.feePaise
                ? `${(M.feeLabel ?? "Early-bird fee").replace(/^Early Bird$/, "Early-bird fee")}, including taxes — against a standard fee of ${formatPaise(facts.standardPaise)}. ${M.closing}`
                : `Including taxes. ${M.closing}`}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {!closed && (
              <button type="button" onClick={onReserve} className="lp-btn-grad" style={ctaPrimary}>
                Reserve Your Seat →
              </button>
            )}
            <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={onWhatsApp} style={ctaGhost}>
              Ask us on WhatsApp
            </a>
          </div>
          <div style={{ font: T.small, color: "rgba(255,255,255,.55)", marginTop: 18 }}>
            {contact.phone} · {contact.email}
          </div>
        </div>
      </section>
    </div>
  );
}

function Fact({ icon, k, v }: { icon: GlyphName; k: string; v: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.16)", borderRadius: 14, padding: "11px 16px 11px 12px" }}>
      <span aria-hidden style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(95,224,214,.14)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
        <Glyph name={icon} size={19} color="#5fe0d6" />
      </span>
      <div>
        <div style={{ font: `600 11px ${SANS}`, color: "rgba(255,255,255,.55)", letterSpacing: ".12em", textTransform: "uppercase" }}>{k}</div>
        <div style={{ font: `700 15px ${SANS}`, color: "#fff", marginTop: 2 }}>{v}</div>
      </div>
    </div>
  );
}

const iconTile: CSSProperties = {
  flex: "none",
  width: 52,
  height: 52,
  borderRadius: 14,
  background: "linear-gradient(135deg,rgba(47,196,188,.16),rgba(47,127,214,.16))",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

function ThemeGlyph({ name }: { name: ThemeIcon }) {
  const p = { fill: "none", stroke: "#1b8f88", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
      {name === "gavel" && (<><path d="M14.5 3.5l6 6M11.5 6.5l6 6M13 5l-4.5 4.5 6 6L19 11" {...p} /><path d="M10.5 13.5L3.5 20.5M3 21h9" {...p} /></>)}
      {name === "building" && (<><rect x="4" y="3" width="11" height="18" rx="1.5" {...p} /><path d="M15 9h4.5a.5.5 0 0 1 .5.5V21M8 7h3M8 11h3M8 15h3M2.5 21h19" {...p} /></>)}
      {name === "spark" && (<><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" {...p} /><path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z" {...p} /></>)}
      {name === "compass" && (<><circle cx="12" cy="12" r="9" {...p} /><path d="M15.2 8.8l-2 4.4-4.4 2 2-4.4z" {...p} /></>)}
      {name === "dialogue" && (<><path d="M4 5.5h11a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H9l-4 3v-3a1 1 0 0 1-1-1v-5a2 2 0 0 1 2-2z" {...p} /><path d="M19 9.5h1a2 2 0 0 1 2 2v5l-3-2.5" {...p} /></>)}
      {name === "scales" && (<><path d="M12 4v16M7 20h10M4 8h16l-3 5a3.4 3.4 0 0 1-6 0zM4 8l3 5a3.4 3.4 0 0 0 6 0" {...p} /><circle cx="12" cy="5" r="1.4" {...p} /></>)}
    </svg>
  );
}
