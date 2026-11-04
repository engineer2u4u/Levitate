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
  /** What the offer calls its reduced fee. "Early Bird" unless it says otherwise. */
  feeLabel?: string;

  agenda: { eyebrow: string; heading: string; intro: string };
  themes: readonly { icon: ThemeIcon; title: string; intro: string; points: readonly string[] }[];
  /**
   * What a participant walks away holding, where the session produces
   * something. Optional: a masterclass that teaches a way of thinking has no
   * artefacts to list, and an empty "what you take away" is worse than none.
   */
  takeaways?: { eyebrow: string; heading: string; intro: string; items: readonly string[]; note?: string };
  audience: { heading: string; items: readonly string[]; note?: string };
  facilitator: { strap: string; paragraphs: readonly string[] };
  /** Sits above the accreditation marks, where a programme claims them. */
  recognition?: string;
  crossSell: { title: string; body: string; href: string; cta: string; startsFrom?: string };
  /** The line under the closing headline. */
  closing: string;
  faqs: Faq[];

  /**
   * Keeps the page live but takes it out of the header menu — for a sitting
   * that is over and is not being repeated. The page still answers, and
   * anyone holding the link still reaches its enquiry form; the menu simply
   * stops offering it alongside the sittings that are actually running.
   */
  unlisted?: boolean;
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
  checkoutTitle: "PoSH 2026 Masterclass · 6 December 2026",
  checkoutPrefix: "PoSH 2026 Masterclass",

  // The December sitting. These are the FALLBACK, as the header of this file
  // says — the live values are the catalogue's, and the admin is where a date
  // moves. They are kept in step anyway because they render into the static
  // HTML, which is what a visitor sees before hydration and what a crawler
  // sees full stop.
  date: "6 December 2026",
  dateShort: "Sun, 6 Dec 2026",
  day: "Sunday",
  time: "11:30 AM – 6:00 PM IST",
  duration: "6.5 Hours",
  startsAt: "2026-12-06T11:30:00+05:30",
  endsAt: "2026-12-06T18:00:00+05:30",

  /** Early bird, open until the session starts. */
  feePaise: 210000,
  /** Shown struck through. Never charged. */
  standardPaise: 299900,

  agenda: {
    eyebrow: "What the day covers",
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

  closing: "A full day that brings your PoSH practice up to date.",

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
  eyebrow: "5-Hour HR EDGE Masterclass",
  title: "Talent Mapping",
  titleRest: "& Succession Planning",
  sub: "Identify talent. Assess future readiness. Build a stronger talent pipeline.",
  intro:
    "A five-hour practical masterclass for HR professionals, HR students and aspiring HR professionals who want to connect talent decisions with business growth and continuity.",
  scenario: {
    q: "Your company is expanding. A critical employee could leave. Who is ready to step up?",
    body:
      "Learn how to understand the talent available today, identify future gaps and prepare people for important roles before the need becomes urgent.",
  },
  chips: ["Practical business case", "Skills-based talent mapping", "Succession planning", "Ready-to-use templates"],
  short: "HR EDGE Masterclass",
  checkoutTitle: "HR EDGE Masterclass · 28 November 2026",
  checkoutPrefix: "HR EDGE Masterclass",

  // Two sittings. `startsAt` opens the first and `endsAt` closes the second,
  // which is what the closed-clock and the calendar link want; the pair of
  // dates a reader needs is in `date` and `time`.
  date: "28 & 29 November 2026",
  dateShort: "Sat 28 & Sun 29 Nov 2026",
  day: "Saturday & Sunday",
  time: "7:00 – 9:30 PM & 10:00 AM – 12:30 PM IST",
  duration: "5 Hours across two days",
  startsAt: "2026-11-28T19:00:00+05:30",
  endsAt: "2026-11-29T12:30:00+05:30",

  feePaise: 210000,
  /** The regular fee, shown struck through. */
  standardPaise: 300000,

  agenda: {
    eyebrow: "What the five hours cover",
    heading: "Three practical steps to building your talent pipeline",
    intro:
      "Business plans depend on having capable people available at the right time. When companies grow, roles change or key employees leave, HR needs to know which roles are critical, whether the skills for future plans exist, who could take on greater responsibility, and where to develop people rather than hire. Work through a business case to understand current talent, assess future readiness and build a basic succession plan.",
  },

  themes: [
    {
      icon: "compass",
      title: "Map talent against business needs",
      intro: "What talent do we have — and what will the business need?",
      points: [
        "Understand how to identify critical roles beyond senior leadership positions",
        "Map employee skills and experience against role requirements",
        "Identify strengths, skill gaps and development priorities",
        "Connect your talent map with business growth and continuity needs",
      ],
    },
    {
      icon: "scales",
      title: "Review talent and assess readiness",
      intro: "Who could step up, and what preparation would they need?",
      points: [
        "Distinguish current performance, future potential and role readiness",
        "Use evidence to support talent discussions and question assumptions",
        "Consider employee aspirations alongside organisational needs",
        "Segment potential leadership talent into suitable development pools",
      ],
    },
    {
      icon: "building",
      title: "Build a practical succession plan",
      intro: "How do we turn talent insights into action?",
      points: [
        "Identify potential successors and readiness timelines",
        "Define development actions, exposure and support",
        "Understand how leadership competencies guide readiness discussions",
        "Explore key metrics, including succession coverage and readiness",
        "Explain your recommendations from a business perspective",
      ],
    },
  ],

  takeaways: {
    eyebrow: "What you will take away",
    heading: "Practical outputs you can build on",
    intro: "By the end of the masterclass, you will have practised creating:",
    items: [
      "A skills-based talent map",
      "A view of potential successors and their readiness",
      "Development priorities for future role requirements",
      "A succession plan linked to business needs",
    ],
    note: "You will also receive ready-to-use templates to support further application.",
  },

  audience: {
    heading: "For those who want to make better talent decisions",
    items: [
      "HR professionals involved in talent, learning, performance or workforce planning",
      "HR generalists, HR operations and recruitment professionals expanding their responsibilities",
      "Aspiring HRBPs who want to connect people decisions with business priorities",
      "MBA-HR, PGDM-HR and HR postgraduate students",
      "Recent graduates, HR interns and professionals preparing to enter HR",
    ],
    note: "You do not need prior succession-planning experience. The concepts and case will be explained step by step.",
  },

  facilitator: {
    strap: "16 years of global HR experience · Global HR leader · XLRI alumna",
    paragraphs: [
      "Parichita brings experience working with leaders and managers on talent, performance, organisational design, employee relations and change.",
      "Her work spans multinational organisations and Indian startups, connecting business priorities with practical people decisions.",
      "In this masterclass, she will guide participants through a business case, helping them assess talent, examine readiness and explain their recommendations clearly.",
    ],
  },

  recognition:
    "Levitate PeopleSoft is an SHRM Recertification Provider and a member of The CPD Certification Service, UK. Our learning approach combines HR experience, realistic workplace situations and practical tools to help participants apply concepts with confidence.",

  crossSell: {
    title: "Build your HR business-partnering capability further",
    body:
      "HR EDGE — Strategic HR Business Partner Certification Programme. Talent mapping and succession planning are part of a wider set of capabilities needed to support business decisions. Develop your understanding across business strategy, workforce planning, performance, talent and hiring, rewards, employee relations, change and people analytics. Learn through practical cases, simulations and tools, with support for your HR career preparation. 6 weeks · 52 learning hours: 46 live + 6 LMS. Separate programme enrolment applies.",
    href: "/lms/course/hr-edge/",
    cta: "Explore HR EDGE",
  },

  closing: "Learn to identify available talent, assess future readiness and recommend practical development actions.",

  faqs: [
    {
      q: "What will I learn in this masterclass?",
      a: [
        "You will learn how to create a skills-based talent map, identify critical roles, assess potential successors, segment talent into development pools and build a basic succession plan. You will also explore succession planning principles, leadership competencies and key metrics.",
      ],
    },
    {
      q: "How does this connect with strategic HR and the HRBP role?",
      a: [
        "Strategic HR involves preparing the organisation for future business needs. Talent mapping and succession planning help HR recommend where to develop employees, build leadership capability and address talent gaps that could affect growth or continuity.",
      ],
    },
    {
      q: "Is succession planning only for senior leadership roles?",
      a: [
        "No. It can also cover specialist and other critical roles where a vacancy or loss of knowledge could significantly affect the business.",
      ],
    },
    {
      q: "Can I attend if I am a student or have no HR experience?",
      a: [
        "Yes. The masterclass is suitable for HR students and aspiring professionals. Concepts and activities will be explained through a guided business case.",
      ],
    },
    {
      q: "Will this be useful if I already work in HR?",
      a: [
        "Yes, particularly if you are beginning to contribute to talent reviews, employee development, workforce planning or succession discussions. You can use the case and templates to strengthen your approach.",
      ],
    },
    {
      q: "How will the masterclass be conducted?",
      a: [
        "It will be delivered live on Zoom across two sessions, combining concept explanations, guided discussion and practical case activities.",
      ],
    },
    {
      q: "Will I receive templates?",
      a: [
        "Yes. Ready-to-use talent mapping and succession planning templates will be shared to support your learning and further application.",
      ],
    },
    {
      q: "Will this help with HR interviews?",
      a: [
        "The case practice can help you explain how you would identify critical roles, assess talent gaps and recommend development actions in scenario-based interview questions.",
      ],
    },
    {
      q: "Is this the full HR EDGE programme?",
      a: [
        "No. This is a standalone, five-hour masterclass focused on talent mapping and succession planning. The full HR EDGE Strategic HR Business Partner Certification Programme is a separate learning journey covering broader HRBP capabilities.",
      ],
    },
    {
      // Written out rather than using {when}: that token is one day, one time,
      // and this masterclass is two sittings with different hours.
      q: "When is the masterclass?",
      a: [
        "28 November 2026, 7:00 – 9:30 PM IST, and 29 November 2026, 10:00 AM – 12:30 PM IST. Both sessions are conducted live on Zoom.",
      ],
    },
    { q: "What is the fee?", a: ["The early-bird fee is {fee}, against the regular fee of {list_fee}."] },
    {
      q: "How do I register?",
      a: [
        "Use the registration button to complete your registration and payment. Razorpay emails your receipt straight away, and we will be in touch before {date} with your joining link. For assistance, contact our team on +91 90269 95540.",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ DEIB */

export const DEIB_MASTERCLASS: MasterclassOffer = {
  slug: "deib-masterclass",
  path: "/deib-masterclass/",
  // Off the menu: the 10 October sitting is over and is not being repeated.
  // The page stays up, and so do the links to it from the DEIB programme.
  unlisted: true,
  eyebrow: "DEIB Masterclass",
  title: "Unconscious Bias at Work",
  titleRest: "How it shapes leadership, decisions & belonging",
  sub: "Explore how everyday perceptions shape workplace decisions — and learn practical ways to support diversity, equity, inclusion and belonging.",
  scenario: {
    q: "“They're a better culture fit.” “She isn't ready for leadership.” “He speaks confidently — he must know his subject.”",
    body: "What evidence sits behind these judgements?",
  },
  chips: ["Workplace examples", "Reflection", "Case discussion"],
  short: "DEIB Masterclass",
  checkoutTitle: "DEIB Masterclass · Unconscious Bias at Work · 10 October 2026",
  checkoutPrefix: "DEIB Masterclass",

  date: "10 October 2026",
  dateShort: "Sat, 10 Oct 2026",
  day: "Saturday",
  time: "11:30 AM – 1:00 PM IST",
  duration: "90 Minutes",
  startsAt: "2026-10-10T11:30:00+05:30",
  endsAt: "2026-10-10T13:00:00+05:30",

  /** Special registration fee, open until the session starts. */
  feePaise: 199900,
  /** Shown struck through. Never charged. */
  standardPaise: 349900,
  feeLabel: "Special Fee",

  agenda: {
    eyebrow: "What the 90 minutes cover",
    heading: "Understand the assumptions. Examine the decisions. Strengthen inclusion.",
    intro:
      "Through relatable workplace examples, reflection and case discussion, this masterclass helps you examine how bias can influence decisions — and what you can do differently.",
  },

  themes: [
    {
      icon: "compass",
      title: "Recognising unconscious bias",
      intro: "Understanding what may be shaping your judgement.",
      points: [
        "How assumptions and perceptions can influence thinking, decisions and interactions without our awareness",
        "How familiarity, first impressions and existing beliefs can affect how we assess others",
        "Recognising the difference between an observation, an interpretation and an assumption",
      ],
    },
    {
      icon: "scales",
      title: "Bias in leadership and workplace decisions",
      intro: "Examining who receives opportunities, recognition and a voice.",
      points: [
        "Where bias can appear in hiring, feedback, performance reviews and promotions",
        "How assumptions about confidence, communication, age or caregiving can shape assessments of capability",
        "Connecting everyday decisions with diversity, equity, inclusion and belonging",
      ],
    },
    {
      icon: "dialogue",
      title: "Moving towards more inclusive decisions",
      intro: "Turning reflection into practical action.",
      points: [
        "Asking better questions before reaching a judgement",
        "Using clearer criteria and checking the evidence behind decisions",
        "Exploring alternative perspectives through a workplace case, and identifying one change you can apply in your own work",
      ],
    },
  ],

  audience: {
    heading: "For professionals who shape people's workplace experiences",
    items: [
      "HR professionals and HR business partners",
      "L&D, culture and employee experience professionals",
      "People managers, team leaders and business heads",
      "Corporate trainers and independent consultants",
      "DEIB champions and aspiring inclusion facilitators",
    ],
    note: "No prior DEIB training is required. The session introduces concepts in accessible language and connects them with everyday workplace situations.",
  },

  facilitator: {
    strap: "Founder & Managing Partner, Levitate PeopleSoft · Global HR Leader",
    paragraphs: [
      "Parichita brings 15+ years of global HR experience, drawing on work with leaders and teams across different countries and workplace cultures.",
      "An XLRI and ISTD alumna, she connects learning with the questions professionals face in practice: how we assess people, allocate opportunities, communicate expectations and build inclusive teams.",
    ],
  },

  recognition:
    "SHRM Recertification Provider · CPD Provider Member. Levitate PeopleSoft combines global HR experience with practical workplace learning, and eligible programmes offer applicable SHRM Professional Development Credits and approved CPD learning hours.",

  crossSell: {
    title: "Want to build your capability as a DEIB facilitator?",
    body: "The Certified Diversity, Equity, Inclusion and Belonging Facilitator Program TTT. Design DEIB learning, facilitate sensitive conversations, respond to resistance and guide practical workplace application using the BRIDGE Inclusion Framework",
    href: "/dei-train-the-trainer-certification/",
    cta: "Explore the DEIB programme",
    startsFrom: "inclusive-workplace",
  },

  closing: "Recognise assumptions. Make fairer decisions. Start with the decisions you make every day.",

  faqs: [
    { q: "When is the masterclass?", a: ["{when}, live online."] },
    { q: "What is the fee?", a: ["The special registration fee is {fee}, against a standard fee of {list_fee}."] },
    {
      q: "What will I take away?",
      a: [
        "A clearer understanding of how unconscious bias can appear at work, questions to help examine your assumptions, and practical approaches to support fairer decisions.",
      ],
    },
    {
      q: "Will the session be interactive?",
      a: ["Yes. The session includes reflection, workplace examples and a case discussion to help you apply the concepts."],
    },
    {
      q: "How do I register?",
      a: [
        "Reserve your seat on this page and pay online through Razorpay — UPI, debit and credit cards, or net banking. Your seat is held the moment the payment goes through, and we will be in touch before {date} with your joining details. If you would rather we took you through it, message us on WhatsApp.",
      ],
    },
    {
      q: "Can I register colleagues or team members?",
      a: [
        "Yes. Each registration is one seat, in the attendee's own name. For a group, message us with the number of participants and we will coordinate it with you.",
      ],
    },
  ],
};

/** All three, for anything that has to know every masterclass — the catalogue. */
export const MASTERCLASSES: MasterclassOffer[] = [MASTERCLASS, DEIB_MASTERCLASS, HR_EDGE_MASTERCLASS];
