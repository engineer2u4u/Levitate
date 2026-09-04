/**
 * Payment is a swappable module.
 *
 * Real Razorpay needs a server: an order is created server-side with the key
 * secret, and the signature that comes back must be verified server-side before
 * access is granted. Neither is possible on a static export, so the simulated
 * gateway stands in — but every screen talks to `PaymentGateway`, so wiring the
 * real one later is a new adapter plus a PHP endpoint, not a UI change.
 */

export type PaymentRequest = {
  courseSlug: string;
  courseTitle: string;
  amountPaise: number;
  customer: { name: string; email: string; contact?: string };
};

export type PaymentResult =
  | { ok: true; orderId: string; paymentId: string; amountPaise: number; at: string }
  | { ok: false; error: string; cancelled?: boolean };

export type PaymentGateway = {
  readonly kind: "simulated" | "razorpay";
  /** Resolves once the learner has paid, cancelled, or the attempt failed. */
  pay(req: PaymentRequest): Promise<PaymentResult>;
};

const ref = (prefix: string) =>
  prefix + "_" + Math.random().toString(36).slice(2, 12).toUpperCase();

/**
 * Simulated gateway. Deliberately takes a beat so the pending state is real
 * rather than a flash, and returns the same shape the live gateway will.
 */
export const simulatedGateway: PaymentGateway = {
  kind: "simulated",
  pay(req) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ok: true,
          orderId: ref("LVT"),
          paymentId: ref("pay"),
          amountPaise: req.amountPaise,
          at: new Date().toISOString(),
        });
      }, 1100);
    });
  },
};

/* ------------------------------------------------------------ razorpay */

/**
 * The key id is public — it is in the checkout URL of every Razorpay site on
 * the web. The secret is not here and must never be: this is a static export,
 * so anything the bundle holds is readable by anyone who opens it.
 */
const KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "";

/**
 * Where the PHP endpoints live. Empty means same origin, which is what the
 * deployed site uses. A development build sets it to the deployed origin,
 * because `next dev` cannot serve PHP.
 */
const RAW_API = process.env.NEXT_PUBLIC_PAYMENT_API_BASE ?? "";
const API = RAW_API.endsWith("/") ? RAW_API.slice(0, -1) : RAW_API;

const CHECKOUT_JS = "https://checkout.razorpay.com/v1/checkout.js";

type RazorpaySuccess = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayOptions = Record<string, unknown>;
type RazorpayInstance = { open: () => void; on: (event: string, cb: (e: unknown) => void) => void };
type RazorpayCtor = new (options: RazorpayOptions) => RazorpayInstance;

const loadCheckout = (): Promise<RazorpayCtor> =>
  new Promise((resolve, reject) => {
    const w = window as unknown as { Razorpay?: RazorpayCtor };
    if (w.Razorpay) return resolve(w.Razorpay);
    const el = document.createElement("script");
    el.src = CHECKOUT_JS;
    el.onload = () => (w.Razorpay ? resolve(w.Razorpay) : reject(new Error("Razorpay checkout did not load.")));
    el.onerror = () => reject(new Error("Could not load Razorpay checkout. Check your connection and try again."));
    document.head.appendChild(el);
  });

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(API + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => null)) as ({ ok?: boolean; error?: string } & T) | null;
  if (!data) throw new Error("The payment server did not answer properly.");
  if (data.ok === false) throw new Error(data.error ?? "Payment failed.");
  return data;
}

/**
 * Live Razorpay.
 *
 * Note what this adapter does NOT do: it never decides the amount, and it
 * never treats Razorpay's success callback as proof of payment. The amount
 * comes back from the order endpoint and the callback is only a set of
 * references, which the verify endpoint checks against Razorpay itself before
 * this resolves. Everything the browser says here is a claim, not a fact.
 */
export const razorpayGateway: PaymentGateway = {
  kind: "razorpay",
  async pay(req) {
    try {
      const [Razorpay, order] = await Promise.all([
        loadCheckout(),
        post<{ orderId: string; amountPaise: number; currency: string; keyId: string }>(
          "/api/razorpay-order.php",
          { courseSlug: req.courseSlug },
        ),
      ]);

      const success = await new Promise<RazorpaySuccess | null>((resolve) => {
        const rz = new Razorpay({
          key: order.keyId || KEY_ID,
          order_id: order.orderId,
          amount: order.amountPaise,
          currency: order.currency,
          name: "Levitate PeopleSoft",
          description: req.courseTitle,
          image: "/assets/logo.png",
          prefill: { name: req.customer.name, email: req.customer.email, contact: req.customer.contact ?? "" },
          notes: { course_slug: req.courseSlug },
          theme: { color: "#1b8f88" },
          handler: (r: RazorpaySuccess) => resolve(r),
          // Closing the sheet is a cancellation, not a failure — the two read
          // very differently to someone who simply changed their mind.
          modal: { ondismiss: () => resolve(null) },
        } as RazorpayOptions);
        rz.on("payment.failed", () => resolve(null));
        rz.open();
      });

      if (!success) return { ok: false, error: "Payment was cancelled.", cancelled: true };

      const verified = await post<{ amountPaise: number; at: string }>("/api/razorpay-verify.php", {
        orderId: success.razorpay_order_id,
        paymentId: success.razorpay_payment_id,
        signature: success.razorpay_signature,
        courseSlug: req.courseSlug,
      });

      return {
        ok: true,
        orderId: success.razorpay_order_id,
        paymentId: success.razorpay_payment_id,
        amountPaise: verified.amountPaise,
        at: verified.at,
      };
    } catch (e) {
      return { ok: false, error: (e as Error).message };
    }
  },
};

/** True while the configured key is a Razorpay test key. */
export const isTestKey = KEY_ID.startsWith("rzp_test_");

/**
 * Whether this build can actually take money. Enrolment opens on the back of
 * it, so a build with no key never shows a pay button it cannot honour, and
 * configuring the key is the whole of going live rather than half of it.
 */
export const PAYMENT_READY = Boolean(KEY_ID);

/* ---------------------------------------------------------- free entry */

/**
 * Enrolment without payment. Set NEXT_PUBLIC_PAYMENT_MODE=off.
 *
 * For running the courses while payment is deliberately out of the way —
 * pilots, a cohort already paid for elsewhere, or simply walking the learning
 * flow without a card. It short-circuits the gateway rather than faking a
 * payment: the receipt records nothing collected and no amount, so nothing
 * downstream can mistake it for money that arrived.
 */
export const PAYMENT_OFF = process.env.NEXT_PUBLIC_PAYMENT_MODE === "off";

const freeGateway: PaymentGateway = {
  kind: "simulated",
  async pay() {
    return { ok: true, orderId: ref("FREE"), paymentId: ref("free"), amountPaise: 0, at: new Date().toISOString() };
  },
};

/**
 * Free entry wins where it is set. Otherwise real Razorpay the moment a key id
 * is configured, and the simulation until then — a build with no key cannot
 * take money and a build with one does not pretend to.
 */
export const gateway: PaymentGateway = PAYMENT_OFF
  ? freeGateway
  : KEY_ID
    ? razorpayGateway
    : simulatedGateway;

export const formatPaise = (paise: number) => "₹" + (paise / 100).toLocaleString("en-IN");
