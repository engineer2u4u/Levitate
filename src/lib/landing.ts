/**
 * The two paid-ad sales pages.
 *
 * Everything a campaign changes lives here rather than in the page component,
 * because during a sprint the copy moves faster than the layout does.
 *
 * Fields that are still business decisions — the seat count, the offer close
 * date, the founder video, the lead-magnet PDF — are OPTIONAL and unset. The
 * page renders without them and the sections simply do not appear. Inventing a
 * "4 seats left" would be the easiest thing here and the worst: it is a claim
 * about the world that has to be true, and a page that lies about scarcity is
 * both a trust problem and, under the Consumer Protection Act, a legal one.
 */

import type { Faq } from "./lms/poshFaqs";

/** The glyphs the "why" cards can carry. */
export type WhyIcon = "clock" | "award" | "person" | "screen" | "shield" | "layers";

export type LandingOffer = {
  /** Course slug — the price and the Razorpay order both come from it. */
  slug: string;
  eyebrow: string;
  /** Default H1. Ad traffic can swap it via ?kw= from `headlines` below. */
  headline: string;
  /**
   * Keyword-matched headlines for Google Ads. The ad appends ?kw=<key> and the
   * page swaps its H1, so the page echoes the search that produced the click.
   *
   * An allow-list, never the raw query string: rendering arbitrary text from a
   * URL is how a page ends up hosting someone else's message.
   */
  headlines: Record<string, string>;
  sub: string;
  /** Batch facts. Shown as the page's proof that this is a real, dated cohort. */
  batch: { starts: string; rows: { k: string; v: string }[] };
  /**
   * No longer shown on the page — the fee was taken off the landing pages
   * deliberately, so the conversation about money happens with a person.
   * It stays here because the reserve_seat_click event still reports it,
   * and an ad platform optimising on that value needs it to be right.
   */
  price: { amount: string; note: string };
  /** Unset until the seat count is being tracked honestly. */
  seatsLeft?: number;
  /** Unset until the founding-cohort rate and its close date are decided. */
  offerClosesOn?: string;
  /** YouTube id. Unset until the founder video is shot. */
  founderVideoId?: string;
  /** Caption under the play control on the poster. */
  posterLabel?: string;
  /** The four reasons this programme, not a cheaper one. */
  why: { k: string; v: string; icon: WhyIcon }[];
  /** What the certification opens up afterwards. */
  career: { title: string; intro: string; points: string[] };
  /** Gated lead magnet. Unset until the PDF exists in /public. */
  kit?: { title: string; blurb: string; href: string; meta: string };
  /** A second programme worth mentioning on this page. */
  bundle?: { title: string; body: string; href: string };
  faqs: Faq[];
  /** Prefilled WhatsApp opener, so the team knows which page it came from. */
  whatsapp: string;
};

/* ------------------------------------------------------------------ PoSH */

export const POSH_LANDING: LandingOffer = {
  slug: "posh-trainer",
  eyebrow: "PoSH Train-the-Trainer Certification",
  headline: "Become a certified PoSH trainer",
  headlines: {
    // PoSH intent
    ttt: "Become a certified PoSH Train-the-Trainer",
    trainer: "Become a PoSH Certified Trainer",
    certification: "PoSH Certification for HR professionals",
    course: "PoSH Certification Course — live, and founder-led",
    training: "PoSH Training Certification",
    certificate: "PoSH Certificate Course for HR and IC members",
    online: "PoSH Certification Online — live sessions, not recordings",
    ic: "Training for Internal Committee members and external members",
    // HR intent, where PoSH is the answer rather than the search
    hr: "Add PoSH facilitation to your HR practice",
    hrtrainer: "An HR trainer course that certifies you to facilitate PoSH",
    compliance: "HR compliance training you can go on to deliver yourself",
    hrtraining: "Human resources training with a credential at the end of it",
    hrcert: "An HR certification that earns SHRM PDCs",
    hrprogram: "An HR certificate programme in PoSH facilitation",
    business: "Business trainer PoSH certification",
  },
  sub:
    "Fifteen learning hours — twelve live with the founder, three guided in the LMS — that take you past knowing the law to facilitating it: running awareness sessions, supporting an Internal Committee, and handling the questions a room actually asks.",

  batch: {
    starts: "3 October",
    rows: [
      { k: "Batch starts", v: "3 October" },
      { k: "Duration", v: "15 learning hours" },
      { k: "Live", v: "12 hours across 6 sessions" },
      { k: "Guided LMS", v: "3 hours" },
      { k: "Curriculum", v: "15 modules" },
      { k: "Schedule", v: "3 weekends" },
      { k: "Timing", v: "6:00 – 8:00 PM" },
      { k: "Mode", v: "Live online" },
    ],
  },
  price: { amount: "₹32,000", note: "inclusive of taxes" },
  founderVideoId: "wfGzTNtutXs",
  posterLabel: "Watch a PoSH session",

  why: [
    { k: "15 learning hours", icon: "clock", v: "Twelve hours live across six sessions and three weekends, plus three guided hours in the LMS — long enough to practise facilitating, not just to be told about it." },
    { k: "SHRM PDCs", icon: "award", v: "Levitate PeopleSoft is a SHRM Recertification Provider. The programme earns Professional Development Credits toward SHRM-CP® and SHRM-SCP® recertification." },
    { k: "The founder teaches it", icon: "person", v: "Every session is led by Parichita Kotnala — a certified PoSH and POCSO educator with 15+ years of global HR experience, not a rotating panel." },
    { k: "Dedicated LMS access", icon: "screen", v: "Recorded sessions, module resources, the trainer toolkit, downloadable templates and knowledge checks, in one place." },
  ],

  career: {
    title: "What the certification opens up",
    intro:
      "This is a facilitator certification, so what it changes is what you can be asked to do:",
    points: [
      "Design and deliver PoSH awareness and sensitisation sessions inside your own organisation",
      "Support Internal Committee capability building, and become eligible to serve as an external member",
      "Add a compliance and workplace-dignity line to a corporate training or L&D portfolio",
      "Build an independent practice — organisations must train their people every year, and someone has to do it",
      "Carry a verifiable certificate ID and the PDCs on your professional profile",
    ],
  },

  bundle: {
    title: "Also running: POCSO & Child Safety",
    body:
      "The POCSO Facilitator certification starts 24 October, three evenings, for professionals in child-facing organisations. Ask us about taking both.",
    href: "/pocso-train-the-trainer-certification/",
  },

  faqs: [],
  whatsapp: "Hi, I'd like to know more about the PoSH Train-the-Trainer certification starting 3 October.",
};

/* ----------------------------------------------------------------- POCSO */

export const POCSO_LANDING: LandingOffer = {
  slug: "pocso-child-safety",
  eyebrow: "POCSO Train-the-Trainer Certification",
  headline: "Become a certified POCSO facilitator",
  headlines: {
    ttt: "Become a certified POCSO Train-the-Trainer",
    training: "POCSO Training Certification for schools and institutions",
    schools: "POCSO awareness training for schools — certify your own facilitator",
    childsafety: "Child Safety Facilitator Certification",
  },
  sub:
    "A practice-led certification for people in child-facing organisations: the law, age-appropriate language, recognising signals, and how to respond responsibly when a child discloses.",

  batch: {
    starts: "24 October",
    rows: [
      { k: "Batch starts", v: "24 October" },
      { k: "Duration", v: "9 hours" },
      { k: "Format", v: "3 evenings" },
      { k: "Daily", v: "2 hours per day" },
      { k: "Timing", v: "6:00 – 8:00 PM" },
      { k: "Mode", v: "Live online" },
    ],
  },
  price: { amount: "₹20,000", note: "inclusive of taxes" },
  founderVideoId: "4pf99e4AKBU",
  posterLabel: "Watch a POCSO session",

  why: [
    { k: "Built for child-facing work", icon: "shield", v: "Schools, NGOs, hospitals, sport and hospitality — settings where a disclosure is a real possibility and the response has to be right first time." },
    { k: "SHRM PDCs", icon: "award", v: "Levitate PeopleSoft is a SHRM Recertification Provider. The programme earns Professional Development Credits toward SHRM-CP® and SHRM-SCP® recertification." },
    { k: "The founder teaches it", icon: "person", v: "Every session is led by Parichita Kotnala, a certified PoSH and POCSO educator and trainer." },
    { k: "Dedicated LMS access", icon: "screen", v: "Recorded sessions, module resources, the trainer toolkit, templates and knowledge checks, in one place." },
  ],

  career: {
    title: "What the certification opens up",
    intro: "A facilitator certification changes what your institution can ask of you:",
    points: [
      "Run child-safety and POCSO awareness sessions for staff, parents and students",
      "Speak to children about safety in language appropriate to their age",
      "Recognise behavioural, situational and digital signals, grooming patterns and vulnerability",
      "Respond to a disclosure responsibly, and know the reporting pathway before you need it",
      "Help build the preventive and institutional safeguarding systems your organisation is required to have",
    ],
  },

  bundle: {
    title: "Also running: PoSH & Workplace Dignity",
    body:
      "The PoSH Train-the-Trainer certification starts 3 October — fifteen learning hours across three weekends. Ask us about taking both.",
    href: "/posh-train-the-trainer-certification/",
  },

  faqs: [],
  whatsapp: "Hi, I'd like to know more about the POCSO Facilitator certification starting 24 October.",
};

/* ------------------------------------------------------------------- DEI */

export const DEI_LANDING: LandingOffer = {
  slug: "inclusive-workplace",
  eyebrow: "Certified DEI Train-the-Trainer",
  headline: "Become a certified DEI facilitator",
  headlines: {
    ttt: "Become a certified DEI Train-the-Trainer",
    facilitator: "DEI Facilitator Certification",
    certification: "DEI Certification for HR and people leaders",
    course: "DEI Certification Course — live, and founder-led",
    diversity: "Diversity, Equity and Inclusion Certification",
    inclusion: "Inclusion training you can go on to deliver yourself",
    bias: "Learn to facilitate unconscious bias training, credibly",
    belonging: "Build psychological safety and belonging that holds",
    hr: "Add DEI facilitation to your HR practice",
    erg: "For ERG and inclusion leads who have to run the sessions",
  },
  sub:
    "Twenty applied hours anchored in the BRIDGE Inclusion Framework — turning inclusion from a value statement into everyday workplace behaviour, and giving you the capability to design and facilitate the sessions yourself.",

  batch: {
    starts: "10 October",
    rows: [
      { k: "Batch starts", v: "10 October" },
      { k: "Duration", v: "20 hours" },
      { k: "Curriculum", v: "13 modules" },
      { k: "Framework", v: "BRIDGE Inclusion" },
      { k: "Timing", v: "To be confirmed" },
      { k: "Mode", v: "Live online" },
    ],
  },
  price: { amount: "₹40,000", note: "inclusive of taxes" },
  founderVideoId: "4pf99e4AKBU",
  posterLabel: "Watch a DEI session",

  why: [
    { k: "20 applied hours", icon: "clock", v: "Long enough to practise facilitating rather than to be told about inclusion — thirteen modules, from the global landscape through to running the room." },
    { k: "The BRIDGE Framework", icon: "layers", v: "Bias visible, respectful language, inclusive decisions, dialogue over debate, growing belonging, everyday allyship. A structure to facilitate with, not a slide to admire." },
    { k: "SHRM PDCs", icon: "award", v: "Levitate PeopleSoft is a SHRM Recertification Provider. The programme earns Professional Development Credits toward SHRM-CP® and SHRM-SCP® recertification." },
    { k: "The founder teaches it", icon: "person", v: "Every session is led by Parichita Kotnala — 15+ years of global HR across India, the UK, Europe, the US and Canada, not a rotating panel." },
  ],

  career: {
    title: "What the certification opens up",
    intro: "It is a facilitator certification, so what it changes is what you can be asked to do:",
    points: [
      "Design and deliver DEI learning that lands as behaviour rather than as a policy briefing",
      "Facilitate identity-sensitive conversations, disagreement and hot moments without losing the room",
      "Interrupt bias, stereotypes and microaggressions in everyday decisions and communication — and teach others to",
      "Apply an inclusion lens across the employee lifecycle, DEI strategy, governance and measurement",
      "Lead an ERG or inclusion council with something more durable than good intentions",
      "Carry a verifiable certificate ID and the PDCs on your professional profile",
    ],
  },

  bundle: {
    title: "Also running: PoSH & Workplace Dignity",
    body:
      "The PoSH Train-the-Trainer certification starts 3 October — fifteen learning hours across three weekends. Ask us about taking both.",
    href: "/posh-train-the-trainer-certification/",
  },

  faqs: [],
  whatsapp: "Hi, I'd like to know more about the DEI Train-the-Trainer certification starting 10 October.",
};
