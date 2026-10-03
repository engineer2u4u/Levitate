"use client";

import { useState, useSyncExternalStore, type CSSProperties, type FormEvent } from "react";
import Link from "next/link";
import { formatPaise, razorpayGateway } from "@/lib/lms/payment";
import { LMS_TESTING } from "@/lib/lms/testMode";
import { contact } from "@/lib/site";
import { submitEnquiry, type EnquiryForm } from "@/lib/submitEnquiry";
import { track } from "@/lib/track";
import { Glyph } from "./Glyph";
import { SANS, T, ctaGhost, ctaPrimary } from "./theme";

/**
 * Paying is registering — no account, and no sign-in before a card is
 * reached.
 *
 * Written for the masterclasses, where someone arriving from an ad will not
 * make an account to spend two thousand rupees. A certification cohort now
 * sells the same way, so what the card needs is stated here as a seat rather
 * than read off a masterclass: the slug the server prices, the fee, when it
 * runs, and what to call the sale on an invoice and in the admin.
 *
 * The amount is still the server's to decide. What is passed here is only
 * what the page is showing, so the two can be checked against each other.
 */
export type Seat = {
  /** What the order endpoint prices: the catalogue slug. */
  slug: string;
  /** The programme in a sentence — "your seat for the HR EDGE Masterclass". */
  short: string;
  /** The page the sale came from, recorded with the enquiry. */
  path: string;
  /** What Razorpay's sheet and the office's copy call this purchase. */
  checkoutTitle: string;
  feePaise: number;
  /** The fee shown struck through. Equal to feePaise where there is only one. */
  standardPaise: number;
  /** What to call a fee below the standard one. "Early Bird" unless told. */
  feeLabel?: string;
  day: string;
  date: string;
  startsAt: string;
  endsAt: string;
  /** Said when registration has closed, because what has closed differs. */
  closedNote: string;
  /** How the admin's enquiry list files this sale. */
  formTag: EnquiryForm;
};

const item = (s: Seat) => ({ item_id: s.slug, item_name: s.checkoutTitle, price: s.feePaise / 100, quantity: 1 });

type Done = { name: string; email: string; paymentId: string; amountPaise: number; invoiceNo: string | null; live: boolean };

/** Google Calendar wants UTC in its compact form: 20260925T123000Z. */
const calStamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const calendarUrl = (s: Seat) =>
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  `&text=${encodeURIComponent(`${s.short} — Levitate PeopleSoft`)}` +
  `&dates=${calStamp(s.startsAt)}/${calStamp(s.endsAt)}` +
  `&details=${encodeURIComponent("Your seat is reserved. Levitate PeopleSoft will email everything you need for the session beforehand.")}`;

export default function RegisterCard({ seat, closed }: { seat: Seat; closed: boolean }) {
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
    track("begin_checkout", { currency: "INR", value: seat.feePaise / 100, items: [item(seat)] });

    const res = await razorpayGateway.pay({
      courseSlug: seat.slug,
      courseTitle: seat.checkoutTitle,
      amountPaise: seat.feePaise,
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
    // meta_event_id pairs this with the server's own report of the sale.
    track("purchase", { transaction_id: res.paymentId, value: res.amountPaise / 100, currency: "INR", items: [item(seat)], meta_event_id: res.metaEventId });

    // Into the admin's enquiry list and the office inbox. Not awaited: the
    // payment is verified and the seat is theirs whether or not this lands,
    // and Razorpay holds the definitive record either way. The form is still
    // mounted here, which is what submitEnquiry reads from.
    void submitEnquiry(
      form,
      {
        intent: seat.checkoutTitle,
        source: seat.path,
        message: [
          live ? "" : "TEST PAYMENT — Razorpay test mode, no money taken.",
          `Paid ${formatPaise(res.amountPaise)} · Payment ${res.paymentId} · Order ${res.orderId}`,
          res.invoiceNo ? `Invoice ${res.invoiceNo}` : "",
          designation ? `Designation: ${designation}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      },
      { form: seat.formTag },
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
          Thank you, {done.name.split(" ")[0]}. Your seat for {seat.short} on {seat.day}, {seat.date} is reserved.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, background: "#f7fafc", border: "1px solid #eef2f6", borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
          <Row k="Amount paid" v={formatPaise(done.amountPaise)} />
          <Row k="Payment ID" v={done.paymentId} />
          {done.invoiceNo && <Row k="Invoice no." v={done.invoiceNo} />}
        </div>

        <p style={{ font: T.body, color: "#3d5064", margin: "0 0 20px" }}>
          Razorpay has emailed your payment receipt to <strong>{done.email}</strong>. We will be in touch before {seat.date} with everything you need for the session.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href={calendarUrl(seat)} target="_blank" rel="noopener noreferrer" className="lp-btn-grad" style={{ ...ctaPrimary, display: "inline-block", fontSize: 14, padding: "13px 22px" }}>
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

  const earlyBird = seat.standardPaise > seat.feePaise;

  return (
    <div id="register" style={card}>
      {/* An early bird is only an early bird against a higher standard fee.
          Where there is one fee, saying "Early Bird" over a price struck
          through at the same number invents a discount nobody is getting. */}
      <div style={{ display: "flex", alignItems: "stretch", gap: 18, paddingBottom: 20, marginBottom: 20, borderBottom: "1px solid #eef2f6", flexWrap: "wrap" }}>
        <div>
          <div style={{ font: `700 13px ${SANS}`, color: earlyBird ? "#b07d1e" : "#1b8f88", letterSpacing: ".04em" }}>
            {earlyBird ? seat.feeLabel ?? "Early Bird" : "Your seat"}
          </div>
          <div style={{ font: `800 40px/1.05 ${SANS}`, color: "#0a1b33", letterSpacing: "-.02em", margin: "4px 0 6px" }}>{formatPaise(seat.feePaise)}</div>
          <div style={{ font: `700 10.5px ${SANS}`, color: "#5b6e82", letterSpacing: ".16em", textTransform: "uppercase" }}>
            {earlyBird ? "Limited period offer" : "Incl. of taxes"}
          </div>
        </div>
        {earlyBird && (
          <>
            <div style={{ width: 1, background: "#eef2f6" }} />
            <div style={{ paddingTop: 2 }}>
              <div style={{ font: `600 13px ${SANS}`, color: "#8296a9" }}>Standard Fee</div>
              <div style={{ font: `700 22px ${SANS}`, color: "#a9b8c6", textDecoration: "line-through", textDecorationColor: "#d9534f", margin: "6px 0 6px" }}>
                {formatPaise(seat.standardPaise)}
              </div>
              <div style={{ font: `600 10.5px ${SANS}`, color: "#8296a9", letterSpacing: ".1em", textTransform: "uppercase" }}>Incl. of taxes</div>
            </div>
          </>
        )}
      </div>

      {closed ? (
        <div>
          <div style={{ font: T.cardTitle, color: "#0a1b33", marginBottom: 6 }}>Registrations have closed</div>
          <p style={{ font: T.body, color: "#5b6e82", margin: "0 0 16px" }}>{seat.closedNote}</p>
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
            {paying ? "Opening secure payment…" : `Pay ${formatPaise(seat.feePaise)} & reserve your seat →`}
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

/**
 * Registration closes when the sitting starts.
 *
 * The server refuses an order after that regardless; this only stops a page
 * offering a form that cannot work. Read as an external value so the static
 * HTML — built long before the session — and a visit after it do not disagree
 * during hydration.
 */
const subscribeNever = () => () => {};

export function useSeatClosed(startsAt: string) {
  const closesAt = Date.parse(startsAt);
  return useSyncExternalStore(subscribeNever, () => Date.now() >= closesAt, () => false);
}
