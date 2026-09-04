"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { courseBySlug, feeBreakdown } from "@/lib/lms/courses";
import { enrol } from "@/lib/lms/enrolments";
import { PAYMENT_OFF, formatPaise, gateway, isTestKey } from "@/lib/lms/payment";
import { useSession } from "./useSession";

const fieldLabel: CSSProperties = {
  font: "700 10.5px 'Plus Jakarta Sans',sans-serif",
  color: "#5b6e82",
  letterSpacing: ".1em",
  textTransform: "uppercase",
  marginBottom: 7,
};
const fieldInput: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "#f7fafc",
  border: "1px solid #e3eaf0",
  borderRadius: 11,
  padding: "12px 14px",
  font: "500 13.5px 'Plus Jakarta Sans',sans-serif",
  color: "#0a1b33",
  outline: "none",
};

const METHODS = [
  { key: "upi", label: "UPI", note: "GPay, PhonePe, Paytm and any UPI app", badge: "Instant" },
  { key: "card", label: "Credit / debit card", note: "Visa, Mastercard, RuPay, Amex", badge: "3D Secure" },
  { key: "netbanking", label: "Net banking", note: "50+ Indian banks supported", badge: "Razorpay" },
] as const;

export default function Checkout({ slug }: { slug: string }) {
  const course = courseBySlug(slug);
  const { user, loading, enrolments, openAuth } = useSession();

  const [method, setMethod] = useState<string>("upi");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<{ orderId: string; paymentId: string; amountPaise: number } | null>(null);

  const [contact, setContact] = useState("+91 ");
  const [designation, setDesignation] = useState("");
  const [gst, setGst] = useState("");
  const [address, setAddress] = useState("");

  const alreadyEnrolled = enrolments.some((e) => e.courseSlug === slug);

  // A signed-out visitor who deep-links here gets the modal, not a dead end.
  useEffect(() => {
    if (!loading && !user) {
      openAuth({
        mode: "signup",
        reason: "Sign in to complete your enrolment.",
      });
    }
  }, [loading, user, openAuth]);

  if (!course) {
    return (
      <div style={{ background: "#f7fafc", padding: "80px 48px", minHeight: "50vh", textAlign: "center" }} className="site-page-sec">
        <h1 style={{ font: "700 22px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>Course not found</h1>
        <Link href="/lms">← Back to all courses</Link>
      </div>
    );
  }

  if (course.feePaise === null) {
    return (
      <div style={{ background: "#f7fafc", padding: "70px 48px", minHeight: "50vh" }} className="site-page-sec">
        <div style={{ maxWidth: 620, margin: "0 auto", background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "34px 36px", textAlign: "center" }}>
          <h1 style={{ font: "700 21px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 10px" }}>Dates not open yet</h1>
          <p style={{ font: "400 14px/1.7 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: "0 0 20px" }}>
            {course.title} does not have an open batch to pay for yet. Join the waitlist and we will confirm dates and pricing with you first.
          </p>
          <Link href="/contact" className="lp-btn-grad" style={{ display: "inline-block", background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 13.5px 'Plus Jakarta Sans',sans-serif", padding: "13px 26px", borderRadius: 999 }}>Join the waitlist</Link>
        </div>
      </div>
    );
  }

  const fee = feeBreakdown(course.feePaise);

  /* ---------------- success ---------------- */
  if (receipt) {
    return (
      <div style={{ background: "#f7fafc", padding: "64px 48px 90px", minHeight: "70vh" }} className="site-page-sec">
        <div style={{ maxWidth: 720, margin: "0 auto", background: "#fff", border: "1px solid #e3eaf0", borderRadius: 24, padding: "46px 44px", textAlign: "center", boxShadow: "0 20px 44px rgba(10,27,51,.07)" }}>
          <div style={{ width: 66, height: 66, margin: "0 auto 22px", borderRadius: "50%", background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 30px rgba(27,143,136,.3)" }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 13l4 4 10-10" /></svg>
          </div>
          <h1 style={{ font: "700 26px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 10px", letterSpacing: "-.02em" }}>Payment successful — you&apos;re enrolled</h1>
          <p style={{ font: "400 14.5px/1.7 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: "0 0 26px" }}>
            A confirmation with your receipt and joining instructions is on its way to {user?.email}.
          </p>

          <div className="site-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, textAlign: "left", marginBottom: 26 }}>
            {[
              { k: "Order ID", v: receipt.orderId },
              { k: "Payment ID", v: receipt.paymentId },
              { k: "Amount paid", v: formatPaise(receipt.amountPaise) },
              { k: "Course", v: course.title },
            ].map((r) => (
              <div key={r.k} style={{ background: "#f7fafc", border: "1px solid #eef2f6", borderRadius: 13, padding: "14px 16px" }}>
                <div style={{ font: "700 10px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 5 }}>{r.k}</div>
                <div style={{ font: "700 13.5px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{r.v}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(47,196,188,.09)", border: "1px solid rgba(27,143,136,.3)", borderRadius: 14, padding: "18px 20px", textAlign: "left", marginBottom: 26 }}>
            <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: "#136f6a", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Released now</div>
            <div style={{ font: "500 13.5px/1.7 'Plus Jakarta Sans',sans-serif", color: "#3d5064" }}>
              Your first module is open in the course area. Each item unlocks as you finish the one before it.
            </div>
          </div>

          <Link href="/lms/dashboard" className="lp-btn-grad" style={{ display: "inline-block", background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", padding: "14px 30px", borderRadius: 999 }}>
            Go to My Learning
          </Link>
        </div>
      </div>
    );
  }

  /* ---------------- gates ---------------- */
  if (loading) {
    return <div style={{ background: "#f7fafc", padding: "80px 48px", minHeight: "50vh" }} />;
  }

  if (!user) {
    return (
      <div style={{ background: "#f7fafc", padding: "70px 48px", minHeight: "50vh" }} className="site-page-sec">
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ font: "700 21px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 10px" }}>Sign in to continue</h1>
          <p style={{ font: "400 14px/1.7 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>
            You need an account before enrolling in {course.title}.
          </p>
        </div>
      </div>
    );
  }

  if (alreadyEnrolled) {
    return (
      <div style={{ background: "#f7fafc", padding: "70px 48px", minHeight: "50vh" }} className="site-page-sec">
        <div style={{ maxWidth: 620, margin: "0 auto", background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "34px 36px", textAlign: "center" }}>
          <h1 style={{ font: "700 21px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", margin: "0 0 10px" }}>You are already enrolled</h1>
          <p style={{ font: "400 14px/1.7 'Plus Jakarta Sans',sans-serif", color: "#5b6e82", margin: "0 0 20px" }}>
            No need to pay again — {course.title} is already in your learning area.
          </p>
          <Link href={`/lms/learn/${slug}`} className="lp-btn-grad" style={{ display: "inline-block", background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 13.5px 'Plus Jakarta Sans',sans-serif", padding: "13px 26px", borderRadius: 999 }}>Open the course</Link>
        </div>
      </div>
    );
  }

  const pay = async () => {
    if (paying) return;
    setPaying(true);
    setError("");
    const res = await gateway.pay({
      courseSlug: slug,
      courseTitle: course.title,
      amountPaise: course.feePaise as number,
      customer: { name: user.name, email: user.email, contact },
    });
    setPaying(false);
    if (!res.ok) {
      setError(res.cancelled ? "Payment cancelled — you have not been charged." : res.error);
      return;
    }
    // Access follows a completed payment, never the button click.
    enrol(user.id, slug, { orderId: res.orderId, paymentId: res.paymentId, amountPaise: res.amountPaise, at: res.at });
    setReceipt({ orderId: res.orderId, paymentId: res.paymentId, amountPaise: res.amountPaise });
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ background: "#f7fafc", padding: "44px 48px 90px", minHeight: "70vh" }} className="site-page-sec">
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Link href={`/lms/course/${slug}`} style={{ font: "600 12px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", display: "inline-block", marginBottom: 18 }}>← Back to course</Link>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 26, flexWrap: "wrap" }}>
          {["Course", "Details", "Payment", "Access"].map((label, i) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: i <= 1 ? "linear-gradient(135deg,#2fc4bc,#2f7fd6)" : "#eef2f6", color: i <= 1 ? "#fff" : "#8296a9", font: "800 10.5px 'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
              <div style={{ font: "700 12px 'Plus Jakarta Sans',sans-serif", color: i <= 1 ? "#0a1b33" : "#8296a9" }}>{label}</div>
              {i < 3 && <div style={{ width: 30, height: 1, background: "#dbe5ec" }} />}
            </div>
          ))}
        </div>

        <div className="lms-split" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 26, alignItems: "start" }}>
          <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: "32px 34px" }}>
            <div style={{ font: "700 19px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", marginBottom: 4 }}>Confirm your enrolment</div>
            <div style={{ font: "500 13px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginBottom: 26 }}>Details come from your Levitate account — edit anything that needs updating.</div>

            <div className="site-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 18px" }}>
              <div><div style={fieldLabel}>Full name</div><input readOnly value={user.name} style={{ ...fieldInput, color: "#5b6e82" }} /></div>
              <div><div style={fieldLabel}>Email</div><input readOnly value={user.email} style={{ ...fieldInput, color: "#5b6e82" }} /></div>
              <div><div style={fieldLabel}>Mobile</div><input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="+91 98110 24567" style={fieldInput} /></div>
              <div><div style={fieldLabel}>Organisation</div><input readOnly value={user.org || "—"} style={{ ...fieldInput, color: "#5b6e82" }} /></div>
              <div><div style={fieldLabel}>Designation</div><input value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="HR Manager" style={fieldInput} /></div>
              <div><div style={fieldLabel}>GST number (optional)</div><input value={gst} onChange={(e) => setGst(e.target.value)} placeholder="22AAAAA0000A1Z5" style={fieldInput} /></div>
              <div style={{ gridColumn: "span 2" }}><div style={fieldLabel}>Billing address</div><input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, city, state, PIN" style={fieldInput} /></div>
            </div>

            <div style={{ height: 1, background: "#eef2f6", margin: "28px 0 24px" }} />
            <div style={{ font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 14 }}>Payment method</div>
            <div role="radiogroup" aria-label="Payment method" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {METHODS.map((m) => {
                const on = method === m.key;
                return (
                  <button
                    key={m.key}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setMethod(m.key)}
                    style={{ cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14, background: on ? "rgba(47,196,188,.07)" : "#fff", border: `1px solid ${on ? "rgba(27,143,136,.45)" : "#e3eaf0"}`, borderRadius: 13, padding: "15px 17px" }}
                  >
                    <span style={{ width: 17, height: 17, borderRadius: "50%", border: `2px solid ${on ? "#1b8f88" : "#cfdbe4"}`, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: on ? "#1b8f88" : "transparent" }} />
                    </span>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: "block", font: "700 13.5px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{m.label}</span>
                      <span style={{ display: "block", font: "500 11.5px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginTop: 2 }}>{m.note}</span>
                    </span>
                    <span style={{ font: "700 10px 'Plus Jakarta Sans',sans-serif", color: "#136f6a", background: "rgba(47,196,188,.12)", borderRadius: 999, padding: "5px 10px" }}>{m.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e3eaf0", borderRadius: 20, padding: 26 }}>
            <div style={{ font: "700 11.5px 'Plus Jakarta Sans',sans-serif", color: "#1b8f88", letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 16 }}>Order summary</div>
            <div style={{ font: "700 15.5px/1.4 'Plus Jakarta Sans',sans-serif", color: "#0a1b33", marginBottom: 4 }}>{course.title}</div>
            <div style={{ font: "500 12px 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginBottom: 18 }}>{course.mode}</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, font: "500 13px 'Plus Jakarta Sans',sans-serif", color: "#5b6e82" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Programme fee</span><span style={{ color: "#0a1b33", fontWeight: 700 }}>{formatPaise(fee.basePaise)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>GST (18%)</span><span style={{ color: "#0a1b33", fontWeight: 700 }}>{formatPaise(fee.gstPaise)}</span></div>
            </div>
            <div style={{ height: 1, background: "#eef2f6", margin: "16px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
              <span style={{ font: "700 13px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>Total payable</span>
              <span style={{ font: "700 24px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{formatPaise(fee.totalPaise)}</span>
            </div>

            {error && (
              <div role="alert" style={{ font: "600 12px/1.5 'Plus Jakarta Sans',sans-serif", color: "#a53f28", background: "rgba(226,86,74,.08)", border: "1px solid rgba(226,86,74,.28)", borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>{error}</div>
            )}

            <button
              type="button"
              onClick={pay}
              disabled={paying}
              className="lp-btn-grad"
              style={{ width: "100%", cursor: paying ? "wait" : "pointer", border: "none", textAlign: "center", background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", padding: "14px 20px", borderRadius: 999, opacity: paying ? 0.8 : 1 }}
            >
              {paying
                ? PAYMENT_OFF ? "Enrolling…" : "Processing payment…"
                : PAYMENT_OFF ? "Complete enrolment →" : `Pay ${formatPaise(fee.totalPaise)} securely`}
            </button>

            {/* Nobody should ever be unsure whether real money is moving. */}
            {(PAYMENT_OFF || gateway.kind === "simulated" || isTestKey) && (
              <div style={{ font: "600 10.5px/1.6 'Plus Jakarta Sans',sans-serif", color: "#9a7415", background: "rgba(240,160,44,.1)", border: "1px solid rgba(212,166,52,.4)", borderRadius: 10, padding: "9px 11px", marginTop: 12, textAlign: "center" }}>
                {PAYMENT_OFF
                  ? "Enrolment is open without payment — nothing is charged and no card details are collected."
                  : gateway.kind === "simulated"
                    ? "Demo checkout — no payment is taken and no card details are collected."
                    : "Razorpay test mode — no real money is taken. Use card 4111 1111 1111 1111, any future expiry and any CVV."}
              </div>
            )}
            <div style={{ font: "500 10.5px/1.6 'Plus Jakarta Sans',sans-serif", color: "#8296a9", marginTop: 10, textAlign: "center" }}>
              Enrolment is created on successful payment. Failed or cancelled payments give no course access.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
