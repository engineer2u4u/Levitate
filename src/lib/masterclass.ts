/**
 * The masterclasses — single two-hour sessions, each sold on its own page.
 *
 * Unlike the certifications these are not LMS courses: there is nothing to
 * sign in to and nothing to unlock. A visitor pays, and the payment is the
 * registration. So they live here rather than in the course catalogue.
 *
 * The fee, the date and the times written here are the FALLBACK. The live
 * values come from the admin's catalogue (the course of the same slug and its
 * one session — see lib/catalog.ts), which is also where the payment server
 * reads the fee it charges and the moment registration closes.
 *
 * One shape, two offers: the page is the same page, and everything that
 * differs between them is here rather than in the component, so a third
 * masterclass is a new object and a new route.
 *
 * FAQ answers may use {when}, {date}, {fee} and {list_fee}; the page fills them.
 */

import type { Faq } from "@/lib/lms/poshFaqs";

/** The three agenda cards each carry a mark of their own. */
export type ThemeIcon = "gavel" | "building" | "spark" | "compass" | "dialogue" | "scales";

export type MasterclassOffer = {
  slug: string;
  path: string;
  eyebrow: string;
  /** Set in white; `titleRest` follows it in teal. */
  title: string;
  titleRest: string;
  /** Under the title. */
  sub: string;
  /** A paragraph under the strapline, where there is more to say. */
  intro?: string;
  /** The case the session opens with, quoted in the hero. */
  scenario?: { q: string; body: string };
  /** What the two hours are made of, as a short run of words. */
  chips?: readonly string[];
  /** Short name — the header link and the catalogue fallback. */
  short: string;
  /** Shown on the Razorpay sheet and on the invoice description. */
  checkoutTitle: string;
  /** Prefix for the checkout line; the page appends the session date. */
  checkoutPrefix: string;

  date: string;
  dateShort: string;
  day: string;
  time: string;
  duration: string;
  startsAt: string;
  endsAt: string;

  feePaise: number;
  /** Shown struck through where it is higher than the fee. Never charged. */
  standardPaise: number;

  agenda: { eyebrow: string; heading: string; intro: string };
  themes: readonly { icon: ThemeIcon; title: string; intro: string; points: readonly string[] }[];
  audience: { heading: string; items: readonly string[]; note?: string };
  facilitator: { strap: string; paragraphs: readonly string[] };
  /** Sits above the accreditation marks, where a programme claims them. */
  recognition?: string;
  crossSell: { title: string; body: string; href: string; cta: string; startsFrom?: string };
  /** The line under the closing headline. */
  closing: string;
  faqs: Faq[];
};

/* ------------------------------------------------------------- PoSH 2026 */

export const MASTERCLASS: MasterclassOffer = {
  slug: "posh-masterclass-2026",
  path: "/posh-2026-masterclass/",
  eyebrow: "Certified Masterclass",
  title: "PoSH 2026:",
  titleRest: "The New Compliance & Workplace Reality",
  sub: "Judicial Developments, Evolving Workplaces & the AI × PoSH Intersection",
  short: "PoSH 2026 Masterclass",
  checkoutTitle: "PoSH 2026 Masterclass · 27 September 2026",
  checkoutPrefix: "PoSH 2026 Masterclass",

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

  agenda: {
    eyebrow: "What the two hours cover",
    heading: "Three shifts every PoSH programme now has to answer to",
    intro:
      "The law has not stood still since 2013, and neither has the workplace. This masterclass brings your understanding up to date on where PoSH compliance stands in 2026 — and what that asks of you.",
  },

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

  audience: {
    heading: "Built for the people who own PoSH in an organisation",
    items: [
      "HR leaders and HR business partners",
      "Internal Committee presiding officers and members",
      "Compliance, legal and ethics teams",
      "Founders and business heads",
      "PoSH trainers and facilitators",
    ],
  },

  facilitator: {
    strap: "Founder & Managing Partner, Levitate PeopleSoft",
    paragraphs: [
      "A global HR leader and learning facilitator with 15 years of strategic HR experience, partnering with leaders and teams across India, the United Kingdom, Europe, the United States and Canada.",
      "She is an internationally certified PoSH and POCSO Educator and Trainer, and an alumna of XLRI – Xavier School of Management and the Indian Society for Training & Development.",
    ],
  },

  crossSell: {
    title: "Ready to deliver PoSH training yourself?",
    body: "The PoSH Train-the-Trainer Certification — 15 learning hours across 15 modules",
    href: "/posh-train-the-trainer-certification/",
    cta: "See the certification",
    startsFrom: "posh-trainer",
  },

  closing: "Two hours that bring your PoSH practice up to date.",

  faqs: [
    { q: "When is the masterclass?", a: ["{when}."] },
    { q: "What does it cost?", a: ["{fee} including GST — the early-bird fee, against a standard fee of {list_fee}."] },
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
      a: [
        "Yes. Cancel at least 7 days before the session for a full refund. After that the fee is not refundable, but you can transfer your seat to a colleague at no charge. See our Refund & Cancellation Policy for the details.",
      ],
    },
    {
      q: "Can I register several colleagues?",
      a: ["Each registration is one seat, in the attendee's own name. For a group, message us and we will arrange it with you directly."],
    },
  ],
};

/* --------------------------------------------------------------- HR EDGE */

export const HR_EDGE_MASTERCLASS: MasterclassOffer = {
  slug: "hr-edge-masterclass",
  path: "/hr-edge-masterclass/",
  eyebrow: "HR EDGE Masterclass",
  title: "Think Like an",
  titleRest: "HR Business Partner",
  sub: "Understand the business. Ask better questions. Make informed people recommendations.",
  intro:
    "A two-hour practical masterclass for MBA-HR students, HR postgraduates and early-career HR professionals who want to build business understanding, workplace judgement and confidence in manager conversations.",
  scenario: {
    q: "A manager wants to put an employee on a PIP. What should an HR Business Partner ask first?",
    body:
      "Step into a realistic workplace situation and practise how HR connects business expectations, employee perspectives and manager accountability before recommending action.",
  },
  chips: ["Realistic HR cases", "Manager conversations", "HR Decision Lab", "Practical tools"],
  short: "HR EDGE Masterclass",
  checkoutTitle: "HR EDGE Masterclass · 16 October 2026",
  checkoutPrefix: "HR EDGE Masterclass",

  date: "16 October 2026",
  dateShort: "Fri, 16 Oct 2026",
  day: "Friday",
  time: "6:00 – 8:00 PM IST",
  duration: "2 Hours",
  startsAt: "2026-10-16T18:00:00+05:30",
  endsAt: "2026-10-16T20:00:00+05:30",

  feePaise: 49900,
  // One fee, so nothing is shown struck through.
  standardPaise: 49900,

  agenda: {
    eyebrow: "What the two hours cover",
    heading: "Experience three essentials of HR business partnering",
    intro:
      "Effective HR business partnering starts with understanding what the business is trying to achieve — and how people decisions affect that outcome. Built on HR EDGE's practical learning approach, this masterclass takes you through a workplace case to practise understanding the problem, advising the manager and recommending a way forward.",
  },

  themes: [
    {
      icon: "compass",
      title: "Understand the business behind the request",
      intro: "What problem are we actually trying to solve? A manager's request is your starting point.",
      points: [
        "Connect a people concern to delivery, quality, workload or team performance",
        "Explore whether expectations, capability, resources or management practices need attention",
        "Identify the evidence you need before forming a recommendation",
      ],
    },
    {
      icon: "dialogue",
      title: "Partner with the manager",
      intro: "How do you question constructively and build credibility?",
      points: [
        "Ask focused questions without making the conversation confrontational",
        "Acknowledge business pressures while examining assumptions",
        "Clarify what the manager owns and where HR can advise and support",
      ],
    },
    {
      icon: "scales",
      title: "Make and explain your recommendation",
      intro: "What should happen next — and why? Use an HR Decision Lab to compare the options.",
      points: [
        "Weigh business impact, fair treatment and people risks",
        "Recommend a proportionate next step based on the available information",
        "Explain who should act, what support is needed and how progress could be reviewed",
      ],
    },
  ],

  audience: {
    heading: "For those preparing to contribute as an HR Business Partner",
    items: [
      "MBA-HR, PGDM-HR and HR postgraduate students",
      "Recent graduates preparing for their first HR role",
      "HR interns, management trainees and early-career generalists",
      "HR operations and recruitment professionals exploring business-partnering responsibilities",
      "Aspiring HRBPs who want to strengthen practical judgement and stakeholder conversations",
    ],
    note: "You do not need an HRBP title to begin developing a business-partnering mindset.",
  },

  facilitator: {
    strap: "15+ years of global HR leadership experience · XLRI alumna",
    paragraphs: [
      "Parichita brings experience partnering with leaders and managers on performance, talent, employee concerns and organisational change.",
      "Her facilitation connects business priorities with the everyday realities of managing people — helping participants examine context, ask purposeful questions and explain their recommendations.",
      "This masterclass draws on that experience to make HR business partnering practical and accessible for students and early-career professionals.",
    ],
  },

  recognition:
    "Learn with Levitate PeopleSoft — an SHRM Recertification Provider and a member of The CPD Certification Service, UK. Our HR EDGE learning approach combines global HR experience, realistic workplace scenarios and practical application.",

  crossSell: {
    title: "Ready to build your HR business-partnering capability further?",
    body:
      "HR EDGE — the Certified MNC-Ready HR Practitioner Programme. Connected MNC workplace cases, business simulations, manager conversations and HR Decision Labs, with an assessed practitioner portfolio alongside résumé, LinkedIn and interview preparation. 6 weeks · 42 learning hours · live online. Separate programme enrolment applies.",
    href: "/lms/course/hr-edge/",
    cta: "Explore HR EDGE",
  },

  closing: "Two hours of practical learning that connect business understanding with people judgement.",

  faqs: [
    {
      q: "What will I learn in this masterclass?",
      a: [
        "You will practise three foundations of HR business partnering: understanding the business context behind a people issue, advising a manager through purposeful questions, and explaining a reasoned recommendation.",
      ],
    },
    {
      q: "Is this a session on PIPs?",
      a: [
        "The PIP scenario is the starting case. We use it to explore wider business-partnering skills: diagnosing a concern, examining evidence, managing stakeholder expectations and deciding what should happen next.",
      ],
    },
    {
      q: "Can I attend if I am a student or have no HR experience?",
      a: [
        "Yes. The masterclass is designed for HR students, recent graduates and early-career professionals. The case and activities are explained step by step.",
      ],
    },
    {
      q: "How will the session be conducted?",
      a: ["The live online session combines a realistic workplace case, guided discussion, manager-conversation practice and an HR Decision Lab."],
    },
    {
      q: "Will this help me prepare for HR interviews?",
      a: [
        "The practice can help you structure answers to scenario-based questions by explaining what you would investigate, whom you would involve and how you would reach a recommendation.",
      ],
    },
    {
      q: "Is this the full HR EDGE programme?",
      a: [
        "No. This is a standalone two-hour introduction to HR EDGE's practical learning approach. The full Certified MNC-Ready HR Practitioner Programme is a separate six-week, 42-hour learning journey.",
      ],
    },
    { q: "When is the masterclass?", a: ["{when}, live online."] },
    { q: "What is the fee?", a: ["{fee}, including taxes."] },
    {
      q: "How do I register?",
      a: [
        "Complete the registration form and payment to reserve your seat. Razorpay emails your payment receipt straight away, and we will be in touch before {date} with your joining link and everything else you need.",
      ],
    },
  ],
};

/** Both, for anything that has to know every masterclass — the catalogue. */
export const MASTERCLASSES: MasterclassOffer[] = [MASTERCLASS, HR_EDGE_MASTERCLASS];
