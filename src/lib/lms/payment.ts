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

/*
 * When a backend exists, the real adapter looks like this — kept as a comment
 * so the contract it must satisfy is unambiguous:
 *
 *   1. POST /api/razorpay-order.php { amountPaise, courseSlug }
 *      -> server creates the order with the key secret, returns { orderId }
 *   2. open Razorpay checkout with that orderId and the public key id
 *   3. POST /api/razorpay-verify.php { orderId, paymentId, signature }
 *      -> server recomputes the HMAC and returns { verified: true }
 *   4. only then resolve { ok: true } so access follows verified payment,
 *      never the browser's word for it
 */

export const gateway: PaymentGateway = simulatedGateway;

export const formatPaise = (paise: number) => "₹" + (paise / 100).toLocaleString("en-IN");
