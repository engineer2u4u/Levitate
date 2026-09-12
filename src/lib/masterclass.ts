/**
 * The PoSH 2026 masterclass — a single two-hour session sold on its own page.
 *
 * Unlike the certifications this is not an LMS course: there is nothing to
 * sign in to and nothing to unlock. A visitor pays, and the payment is the
 * registration. So it lives here rather than in the course catalogue.
 *
 * The fee, the date and the times shown here are the FALLBACK. The live values
 * come from the admin's catalogue (course "posh-masterclass-2026" and its one
 * session — see lib/catalog.ts), which is also where the payment server reads
 * the fee it charges and the moment registration closes.
 *
 * FAQ answers may use {when}, {date}, {fee} and {list_fee}; the page fills them.
 */

import type { Faq } from "@/lib/lms/poshFaqs";

export const MASTERCLASS = {
  slug: "posh-masterclass-2026",
  path: "/posh-2026-masterclass/",
  eyebrow: "Certified Masterclass",
  title: "PoSH 2026:",
  titleRest: "The New Compliance & Workplace Reality",
  sub: "Judicial Developments, Evolving Workplaces & the AI × PoSH Intersection",
  /** Shown on the Razorpay sheet and on the invoice description. */
  checkoutTitle: "PoSH 2026 Masterclass · 27 September 2026",

  date: "27 September 2026",
  dateShort: "Sun, 27 Sep 2026",
  day: "Sunday",
  time: "11:30 AM – 1:30 PM IST",
  duration: "2 Hours",
  startsAt: "2026-09-27T11:30:00+05:30",
  endsAt: "2026-09-27T13:30:00+05:30",

  /** Early bird, open until the session starts. */
  feePaise: 199900,
  /** Shown struck through. Never charged. */
  standardPaise: 299900,

  themes: [
    {
      icon: "gavel",
      title: "Judicial developments",
      intro: "What the courts now expect of employers and Internal Committees.",
      points: [
        "Recent Supreme Court and High Court rulings, and what they ask of an organisation",
        "The procedural gaps that see Internal Committee findings set aside",
        "What that means for your policy, your committee and your annual report",
      ],
    },
    {
      icon: "building",
      title: "Evolving workplaces",
      intro: "Where the workplace now begins and ends.",
      points: [
        "Hybrid and remote work, off-sites, client sites and work travel",
        "Contract, gig and third-party workers within the Act's reach",
        "Complaints that begin on chat, email and social media",
      ],
    },
    {
      icon: "spark",
      title: "The AI × PoSH intersection",
      intro: "New ways to harass, and new tools to respond.",
      points: [
        "Deepfakes, morphed images and AI-generated harassment",
        "Where AI can support an Internal Committee — and where it must not decide",
        "Keeping complaints confidential in an AI-enabled workplace",
      ],
    },
  ],

  audience: [
    "HR leaders and HR business partners",
    "Internal Committee presiding officers and members",
    "Compliance, legal and ethics teams",
    "Founders and business heads",
    "PoSH trainers and facilitators",
  ],
} as const;

export type ThemeIcon = (typeof MASTERCLASS.themes)[number]["icon"];

export const MASTERCLASS_FAQS: Faq[] = [
  {
    q: "When is the masterclass?",
    a: ["{when}."],
  },
  {
    q: "What does it cost?",
    a: ["{fee} including GST — the early-bird fee, against a standard fee of {list_fee}."],
  },
  {
    q: "How do I pay?",
    a: ["Online, through Razorpay: UPI, debit and credit cards, or net banking. Your seat is reserved the moment the payment goes through."],
  },
  {
    q: "What confirmation will I receive?",
    a: ["Razorpay emails your payment receipt straight away. We will be in touch before {date} with everything you need for the session."],
  },
  {
    q: "Can I cancel?",
    a: ["Yes. Cancel at least 7 days before the session for a full refund. After that the fee is not refundable, but you can transfer your seat to a colleague at no charge. See our Refund & Cancellation Policy for the details."],
  },
  {
    q: "Can I register several colleagues?",
    a: ["Each registration is one seat, in the attendee's own name. For a group, message us and we will arrange it with you directly."],
  },
];
