/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState, useSyncExternalStore, type CSSProperties, type FormEvent } from "react";
import Link from "next/link";
import Accreditations from "@/components/site/Accreditations";
import FaqAccordion from "@/components/site/FaqAccordion";
import { MASTERCLASS as M, MASTERCLASS_FAQS, type ThemeIcon } from "@/lib/masterclass";
import { useCatalogCourse } from "@/components/site/CatalogProvider";
import { dateCompact, dateFull, firstSession, startsText } from "@/lib/catalog";
import { formatPaise, razorpayGateway } from "@/lib/lms/payment";
import { LMS_TESTING } from "@/lib/lms/testMode";
import { contact } from "@/lib/site";
import { submitEnquiry } from "@/lib/submitEnquiry";
import { track } from "@/lib/track";
import { H2, MAX, MEASURE, SANS, Section, T, Tick, ctaGhost, ctaPrimary } from "./SalesPage";

/**
 * The PoSH 2026 masterclass: a paid, two-hour session sold straight from an
 * ad click.
 *
 * The certification pages send people to a conversation, because ₹32,000 is
 * a decision made with a manager. ₹1,999 is not, so this page takes the money
 * on the spot: the registration form sits in the hero, and paying is
 * registering. No account — someone who clicked an ad will not make one.
 */

const subscribeNever = () => () => {};

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
function useFacts(): Facts {
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
      checkoutTitle: `PoSH 2026 Masterclass · ${date}`,
    };
  }, [entry]);
}

/**
 * Registration closes when the session starts. The server refuses orders
 * after that regardless; this only stops the page offering a form that
 * cannot work. Read as an external value so the static HTML (built before the
 * session) and a visit after it do not disagree during hydration.
 */
function useClosed(startsAt: string) {
  const closesAt = Date.parse(startsAt);
  return useSyncExternalStore(subscribeNever, () => Date.now() >= closesAt, () => false);
}

const item = (f: Facts) => ({ item_id: M.slug, item_name: f.checkoutTitle, price: f.feePaise / 100, quantity: 1 });

const scrollToRegister = () => {
  document.getElementById("register")?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function MasterclassPage() {
  const facts = useFacts();
  const closed = useClosed(facts.startsAt);
  const poshEntry = useCatalogCourse("posh-trainer");
  const poshStarts = poshEntry ? startsText(poshEntry) : "";
  const waHref = `${contact.whatsapp}?text=${encodeURIComponent(`Hi, I have a question about the PoSH 2026 masterclass on ${facts.date}.`)}`;

  // FAQ answers carry {when}, {date}, {fee} and {list_fee}.
  const faqs = MASTERCLASS_FAQS.map((f) => ({
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
            <p style={{ font: T.lead, fontSize: 17, color: "rgba(255,255,255,.82)", margin: "0 0 30px", maxWidth: 560 }}>{M.sub}</p>

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

            <div style={{ display: "inline-flex", alignItems: "center", gap: 14, background: "#fff", borderRadius: 14, padding: "10px 16px", flexWrap: "wrap" }}>
              <img src="/assets/accreditations/shrm.png" alt="SHRM Recertification Provider" height={42} style={{ height: 42, width: "auto" }} />
              <img src="/assets/accreditations/cpd-member.png" alt="CPD Member — The CPD Certification Service" height={42} style={{ height: 42, width: "auto" }} />
              <div style={{ font: `600 13px/1.45 ${SANS}`, color: "#0a1b33", maxWidth: 240 }}>
                SHRM Recertification Provider
                <span style={{ display: "block", fontWeight: 500, color: "#5b6e82" }}>and CPD Member</span>
              </div>
            </div>
          </div>

          <RegisterCard closed={closed} facts={facts} />
        </div>
      </section>

      {/* ------------------------------------------------------- THE AGENDA */}
      <Section>
        <H2 eyebrow="What the two hours cover">Three shifts every PoSH programme now has to answer to</H2>
        <p style={{ font: T.lead, color: "#5b6e82", margin: "14px 0 34px", maxWidth: MEASURE }}>
          The law has not stood still since 2013, and neither has the workplace. This masterclass brings your understanding up to date on where PoSH compliance
          stands in 2026 — and what that asks of you.
        </p>
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
            <H2 eyebrow="Who should attend">Built for the people who own PoSH in an organisation</H2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 28 }}>
              {M.audience.map((a) => (
                <div key={a} style={{ display: "flex", gap: 14, alignItems: "center", background: "#fff", border: "1px solid #e3eaf0", borderRadius: 14, padding: "15px 18px" }}>
                  <span aria-hidden style={{ ...iconTile, width: 38, height: 38, borderRadius: 10 }}>
                    <Glyph name="person" size={20} />
                  </span>
                  <span style={{ font: T.item, color: "#0a1b33" }}>{a}</span>
                </div>
              ))}
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
                <div style={{ font: T.small, color: "#1b8f88", fontWeight: 600, marginTop: 2 }}>Founder &amp; Managing Partner, Levitate PeopleSoft</div>
              </div>
            </div>
            <div style={{ padding: "4px 26px 26px", display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ font: T.body, color: "#5b6e82", margin: "18px 0 0" }}>
                A global HR leader and learning facilitator with 15 years of strategic HR experience, partnering with leaders and teams across India, the United
                Kingdom, Europe, the United States and Canada.
              </p>
              <p style={{ font: T.body, color: "#5b6e82", margin: 0 }}>
                She is an internationally certified PoSH and POCSO Educator and Trainer, and an alumna of XLRI – Xavier School of Management and the Indian Society
                for Training &amp; Development.
              </p>
              <Link href="/parichita-kotnala/" style={{ font: `700 14px ${SANS}`, color: "#1b8f88", marginTop: 4 }}>
                Read her full profile →
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <Accreditations spaceBelow maxWidth={MAX} />

      {/* ------------------------------------------------------------ FAQ */}
      <Section tone="soft">
        <FaqAccordion items={faqs} size="lg" />
      </Section>

      {/* ------------------------------------------------------ CROSS-SELL */}
      <Section tone="soft" flush>
        <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 18, padding: "28px 30px", display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ font: T.cardTitle, color: "#0a1b33", marginBottom: 6 }}>Ready to deliver PoSH training yourself?</div>
            <p style={{ font: T.body, color: "#5b6e82", margin: 0 }}>
              The PoSH Train-the-Trainer Certification — 15 learning hours across 15 modules{poshStarts ? `, with a batch starting ${poshStarts}` : ""}.
            </p>
          </div>
          <Link href="/posh-train-the-trainer-certification/" style={{ ...ctaGhost, color: "#0a1b33", borderColor: "rgba(10,27,51,.24)", whiteSpace: "nowrap" }}>
            See the certification
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
              : `Early-bird fee, including taxes — against a standard fee of ${formatPaise(facts.standardPaise)}. Two hours that bring your PoSH practice up to date.`}
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

/* ------------------------------------------------------------ register */

type Done = { name: string; email: string; paymentId: string; amountPaise: number; invoiceNo: string | null; live: boolean };

/** Google Calendar wants UTC in its compact form: 20260925T123000Z. */
const calStamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const calendarUrl = (f: Facts) =>
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  `&text=${encodeURIComponent(`${M.title} ${M.titleRest} — Levitate PeopleSoft masterclass`)}` +
  `&dates=${calStamp(f.startsAt)}/${calStamp(f.endsAt)}` +
  `&details=${encodeURIComponent("Your seat is reserved. Levitate PeopleSoft will email everything you need for the session beforehand.")}`;

function RegisterCard({ closed, facts }: { closed: boolean; facts: Facts }) {
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<Done | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (paying) return;
    const form = e.currentTarget;
    const d = new FormData(form);
    const v = (k: string) => String(d.get(k) ?? "").trim();

    const name = v("name");
    const email = v("email");
    const phone = v("phone");
    const organisation = v("organization");
    const designation = v("designation");

    if (phone.replace(/[^0-9]/g, "").length < 10) {
      setError("Please enter a phone number with at least 10 digits.");
      return;
    }

    setError("");
    setPaying(true);
    track("begin_checkout", { currency: "INR", value: facts.feePaise / 100, items: [item(facts)] });

    const res = await razorpayGateway.pay({
      courseSlug: M.slug,
      courseTitle: facts.checkoutTitle,
      amountPaise: facts.feePaise,
      customer: { name, email, contact: phone },
      billing: { organisation, designation },
      // A development build may use the server's test keys; the public page
      // may not, or a test card would buy a seat.
      requireLive: !LMS_TESTING,
    });
    setPaying(false);

    if (!res.ok) {
      setError(res.cancelled ? "Payment cancelled — you have not been charged." : res.error);
      return;
    }

    const live = res.live === true;
    track("purchase", { transaction_id: res.paymentId, value: res.amountPaise / 100, currency: "INR", items: [item(facts)] });

    // Into the admin's enquiry list and the office inbox. Not awaited: the
    // payment is verified and the seat is theirs whether or not this lands,
    // and Razorpay holds the definitive record either way. The form is still
    // mounted here, which is what submitEnquiry reads from.
    void submitEnquiry(
      form,
      {
        intent: facts.checkoutTitle,
        source: M.path,
        message: [
          live ? "" : "TEST PAYMENT — Razorpay test mode, no money taken.",
          `Paid ${formatPaise(res.amountPaise)} · Payment ${res.paymentId} · Order ${res.orderId}`,
          res.invoiceNo ? `Invoice ${res.invoiceNo}` : "",
          designation ? `Designation: ${designation}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      },
      { form: "masterclass" },
    );

    setDone({ name, email, paymentId: res.paymentId, amountPaise: res.amountPaise, invoiceNo: res.invoiceNo ?? null, live });
  };

  const card: CSSProperties = {
    background: "#fff",
    borderRadius: 22,
    padding: "28px 28px 24px",
    boxShadow: "0 30px 70px rgba(0,0,0,.28)",
    scrollMarginTop: 96,
  };

  if (done) {
    return (
      <div id="register" style={card} role="status">
        <div style={{ width: 58, height: 58, borderRadius: "50%", background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 13l4 4 10-10" /></svg>
        </div>
        <h2 style={{ font: `800 26px/1.2 ${SANS}`, color: "#0a1b33", margin: "0 0 8px", letterSpacing: "-.02em" }}>You&apos;re registered</h2>
        <p style={{ font: T.body, color: "#5b6e82", margin: "0 0 20px" }}>
          Thank you, {done.name.split(" ")[0]}. Your seat for {M.title} {M.titleRest} on {facts.day}, {facts.date} is reserved.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, background: "#f7fafc", border: "1px solid #eef2f6", borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
          <Row k="Amount paid" v={formatPaise(done.amountPaise)} />
          <Row k="Payment ID" v={done.paymentId} />
          {done.invoiceNo && <Row k="Invoice no." v={done.invoiceNo} />}
        </div>

        <p style={{ font: T.body, color: "#3d5064", margin: "0 0 20px" }}>
          Razorpay has emailed your payment receipt to <strong>{done.email}</strong>. We will be in touch before {facts.date} with everything you need for the session.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href={calendarUrl(facts)} target="_blank" rel="noopener noreferrer" className="lp-btn-grad" style={{ ...ctaPrimary, display: "inline-block", fontSize: 14, padding: "13px 22px" }}>
            Add to Google Calendar
          </a>
          <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" style={{ ...ctaGhost, color: "#0a1b33", borderColor: "rgba(10,27,51,.24)", fontSize: 14, padding: "12px 20px" }}>
            WhatsApp us
          </a>
        </div>

        {!done.live && <TestNote>This was a Razorpay test-mode payment — no money was taken.</TestNote>}
      </div>
    );
  }

  return (
    <div id="register" style={card}>
      <div style={{ display: "flex", alignItems: "stretch", gap: 18, paddingBottom: 20, marginBottom: 20, borderBottom: "1px solid #eef2f6", flexWrap: "wrap" }}>
        <div>
          <div style={{ font: `700 13px ${SANS}`, color: "#b07d1e", letterSpacing: ".04em" }}>Early Bird</div>
          <div style={{ font: `800 40px/1.05 ${SANS}`, color: "#0a1b33", letterSpacing: "-.02em", margin: "4px 0 6px" }}>{formatPaise(facts.feePaise)}</div>
          <div style={{ font: `700 10.5px ${SANS}`, color: "#5b6e82", letterSpacing: ".16em", textTransform: "uppercase" }}>Limited period offer</div>
        </div>
        <div style={{ width: 1, background: "#eef2f6" }} />
        <div style={{ paddingTop: 2 }}>
          <div style={{ font: `600 13px ${SANS}`, color: "#8296a9" }}>Standard Fee</div>
          <div style={{ font: `700 22px ${SANS}`, color: "#a9b8c6", textDecoration: "line-through", textDecorationColor: "#d9534f", margin: "6px 0 6px" }}>
            {formatPaise(facts.standardPaise)}
          </div>
          <div style={{ font: `600 10.5px ${SANS}`, color: "#8296a9", letterSpacing: ".1em", textTransform: "uppercase" }}>Incl. of taxes</div>
        </div>
      </div>

      {closed ? (
        <div>
          <div style={{ font: T.cardTitle, color: "#0a1b33", marginBottom: 6 }}>Registrations have closed</div>
          <p style={{ font: T.body, color: "#5b6e82", margin: "0 0 16px" }}>This masterclass has started. Message us to hear about the next one.</p>
          <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="lp-btn-grad" style={{ ...ctaPrimary, display: "inline-block" }}>
            WhatsApp us
          </a>
        </div>
      ) : (
        <form onSubmit={onSubmit}>
          <div style={{ font: T.cardTitle, color: "#0a1b33", marginBottom: 14 }}>Reserve your seat</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="Full name" required>
              <input name="name" required autoComplete="name" maxLength={200} style={input} />
            </Field>
            <div className="site-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Email" required>
                <input name="email" type="email" required autoComplete="email" maxLength={320} style={input} />
              </Field>
              <Field label="Phone / WhatsApp" required>
                <input name="phone" type="tel" required autoComplete="tel" maxLength={40} placeholder="+91 98110 24567" style={input} />
              </Field>
            </div>
            <div className="site-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Organisation">
                <input name="organization" autoComplete="organization" maxLength={200} style={input} />
              </Field>
              <Field label="Designation">
                <input name="designation" autoComplete="organization-title" maxLength={120} style={input} />
              </Field>
            </div>

          </div>

          {error && (
            <div role="alert" style={{ font: `600 13px/1.5 ${SANS}`, color: "#a53f28", background: "rgba(226,86,74,.08)", border: "1px solid rgba(226,86,74,.28)", borderRadius: 10, padding: "10px 12px", marginTop: 14 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={paying}
            className="lp-btn-grad"
            style={{ ...ctaPrimary, width: "100%", marginTop: 16, fontSize: 16, padding: "16px 20px", cursor: paying ? "wait" : "pointer", opacity: paying ? 0.8 : 1 }}
          >
            {paying ? "Opening secure payment…" : `Pay ${formatPaise(facts.feePaise)} & reserve your seat →`}
          </button>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, font: `500 12.5px ${SANS}`, color: "#8296a9", marginTop: 12, textAlign: "center" }}>
            <Glyph name="lock" size={14} color="#8296a9" />
            Secure payment by Razorpay · UPI, cards and net banking
          </div>
          <div style={{ font: `500 12px/1.6 ${SANS}`, color: "#8296a9", marginTop: 6, textAlign: "center" }}>
            By paying you agree to our{" "}
            <Link href="/refund-policy/" target="_blank" style={{ color: "#1b8f88", fontWeight: 600 }}>
              Refund &amp; Cancellation Policy
            </Link>
            .
          </div>

          {LMS_TESTING && <TestNote>Test build — payments go to Razorpay test mode. Use card 4100 2800 0000 1007, any future expiry and any CVV.</TestNote>}
        </form>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ bits */

const input: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "#f7fafc",
  border: "1px solid #dfe7ee",
  borderRadius: 11,
  padding: "11px 13px",
  // 16px keeps iOS from zooming the page when a field takes focus.
  font: `500 16px ${SANS}`,
  color: "#0a1b33",
  outline: "none",
};

function Field({ label, required = false, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", font: `700 12.5px ${SANS}`, color: "#3d5064", marginBottom: 6 }}>
        {label}
        {required && <span style={{ color: "#d9534f" }}> *</span>}
      </span>
      {children}
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 14 }}>
      <span style={{ font: T.small, color: "#8296a9" }}>{k}</span>
      <span style={{ font: T.small, fontWeight: 700, color: "#0a1b33", textAlign: "right", wordBreak: "break-all" }}>{v}</span>
    </div>
  );
}

function TestNote({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ font: `600 12px/1.6 ${SANS}`, color: "#9a7415", background: "rgba(240,160,44,.1)", border: "1px solid rgba(212,166,52,.4)", borderRadius: 10, padding: "9px 11px", marginTop: 14, textAlign: "center" }}>
      {children}
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

type GlyphName = "calendar" | "clock" | "hourglass" | "person" | "lock";

/** Line icons in the landing pages' one stroke weight. */
function Glyph({ name, size = 24, color = "#1b8f88" }: { name: GlyphName; size?: number; color?: string }) {
  const p = { fill: "none", stroke: color, strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      {name === "calendar" && (<><rect x="3.5" y="5" width="17" height="15" rx="2.5" {...p} /><path d="M3.5 10h17M8 3v4M16 3v4" {...p} /></>)}
      {name === "clock" && (<><circle cx="12" cy="12" r="8.5" {...p} /><path d="M12 7.5V12l3 2" {...p} /></>)}
      {name === "hourglass" && (<path d="M6.5 3h11M6.5 21h11M7.5 3c0 5 9 5 9 9s-9 4-9 9M16.5 3c0 5-9 5-9 9s9 4 9 9" {...p} />)}
      {name === "person" && (<><circle cx="12" cy="8" r="4" {...p} /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" {...p} /></>)}
      {name === "lock" && (<><rect x="5" y="11" width="14" height="10" rx="2" {...p} /><path d="M8 11V8a4 4 0 0 1 8 0v3" {...p} /></>)}
    </svg>
  );
}

function ThemeGlyph({ name }: { name: ThemeIcon }) {
  const p = { fill: "none", stroke: "#1b8f88", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
      {name === "gavel" && (<><path d="M14.5 3.5l6 6M11.5 6.5l6 6M13 5l-4.5 4.5 6 6L19 11" {...p} /><path d="M10.5 13.5L3.5 20.5M3 21h9" {...p} /></>)}
      {name === "building" && (<><rect x="4" y="3" width="11" height="18" rx="1.5" {...p} /><path d="M15 9h4.5a.5.5 0 0 1 .5.5V21M8 7h3M8 11h3M8 15h3M2.5 21h19" {...p} /></>)}
      {name === "spark" && (<><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" {...p} /><path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z" {...p} /></>)}
    </svg>
  );
}
