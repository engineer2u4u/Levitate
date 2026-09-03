import type { Course } from "./types";
import { LMS_TESTING } from "./testMode";
import { PAYMENT_OFF } from "./payment";

/** Catalogue. Fees are in paise; `null` means "On request" until dates firm up. */
export const COURSES: Course[] = [
  {
    slug: "posh-trainer",
    tag: "Enrolling", mode: "Live online · Weekend batch",
    title: "PoSH & Workplace Dignity Facilitator Program (PoSH TTT)",
    short: "PoSH Train-the-Trainer",
    desc: "Build legal understanding, inquiry competence and PoSH facilitation skills across 11 practice-led modules.",
    img: "/assets/workshop-tables.jpeg", status: "enrolling",
    feePaise: 2500000, priceNote: "incl. taxes · from 26 Sep",
    modulesLabel: "11 modules", hoursLabel: "12 hours", facilitator: "Parichita Kotnala",
    certificate: {
      name: "PoSH & Workplace Dignity Facilitator Program (PoSH TTT)",
      closing: "under the **Prevention of Sexual Harassment at Workplace** (PoSH Act, 2013).",
      hours: "12 Hours",
    },
  },
  {
    slug: "pocso-child-safety",
    tag: "Enrolling", mode: "Live online · 3 days",
    title: "POCSO & Child Safety Facilitator Program (POCSO TTT)",
    short: "POCSO & Child Safety",
    desc: "Facilitate child-safety awareness with sensitivity, legal clarity and responsible communication.",
    img: "/assets/school-group.jpeg", status: "enrolling",
    feePaise: 2000000, priceNote: "incl. taxes · from 18 Sep",
    modulesLabel: "8 modules", hoursLabel: "9 hours", facilitator: "Parichita Kotnala",
    certificate: {
      name: "POCSO & Child Safety Facilitator Program (POCSO TTT)",
      closing: "under the **Protection of Children from Sexual Offences** (POCSO Act, 2012).",
      hours: "9 Hours",
    },
  },
  {
    slug: "inclusive-workplace",
    tag: "DEI · TTT", mode: "Live online · dates announced soon",
    title: "Inclusive Workplace Facilitator Program (DEI TTT)",
    short: "Inclusive Workplace",
    desc: "Lead conversations on inclusion, unconscious bias, belonging and psychological safety.",
    img: "/assets/workshop-handsup.jpeg", status: "waitlist",
    feePaise: null, priceNote: "confirmed with batch dates",
    modulesLabel: "Curriculum on request", hoursLabel: "To be confirmed", facilitator: "Parichita Kotnala",
    certificate: {
      name: "Inclusive Workplace Facilitator Program (DEI TTT)",
      closing: "in **Diversity, Equity & Inclusion** workplace facilitation.",
      hours: "12 Hours",
    },
  },
  {
    slug: "workplace-wellbeing",
    tag: "Wellbeing", mode: "Live online · dates announced soon",
    title: "Workplace Wellbeing Facilitator Program (Mental Health & Wellbeing TTT)",
    short: "Workplace Wellbeing",
    desc: "Facilitate workplace mental-health conversations with confidence, sensitivity and ethical care.",
    img: "/assets/outdoor-group.jpeg", status: "waitlist",
    feePaise: null, priceNote: "confirmed with batch dates",
    modulesLabel: "Curriculum on request", hoursLabel: "To be confirmed", facilitator: "Parichita Kotnala",
    certificate: {
      name: "Workplace Wellbeing Facilitator Program (Mental Health & Wellbeing TTT)",
      closing: "in **Workplace Mental Health & Wellbeing** facilitation.",
      hours: "12 Hours",
    },
  },
  {
    slug: "leadership-facilitator",
    tag: "Flagship", mode: "Live online · cohort based",
    title: "Corporate Leadership Facilitator Program (CLF TTT)",
    short: "Leadership Facilitator",
    desc: "Facilitate leadership conversations on trust, coaching, feedback, accountability and team growth.",
    img: "/assets/audience-red-hall.jpeg", status: "waitlist",
    feePaise: null, priceNote: "HUMAN Leadership Framework",
    modulesLabel: "Curriculum on request", hoursLabel: "To be confirmed", facilitator: "Parichita Kotnala",
    certificate: {
      name: "Corporate Leadership Facilitator Program (CLF TTT)",
      closing: "powered by the **HUMAN Leadership Framework**.",
      hours: "12 Hours",
    },
  },
  {
    slug: "hr-edge",
    tag: "For students", mode: "Blended · campus cohorts",
    title: "HR Edge certification (HR Students)",
    short: "HR Edge",
    desc: "Integrated DEI, PoSH and wellbeing certification for MBA-HR and early-career HR professionals.",
    img: "/assets/students-group.png", status: "waitlist",
    feePaise: null, priceNote: "institutional pricing available",
    modulesLabel: "Curriculum on request", hoursLabel: "To be confirmed", facilitator: "Parichita Kotnala",
    certificate: {
      name: "HR Edge certification (HR Students)",
      closing: "in integrated **DEI, PoSH & Workplace Wellbeing** facilitation.",
      hours: "12 Hours",
    },
  },
  {
    slug: "demo-course",
    tag: "Demo", mode: "Self-paced · unlocks in order",
    title: "Demo · Workplace Facilitation Essentials",
    short: "Demo course",
    desc: "A sample course for exercising the learning flow: sequential unlocking, progress tracking and the reading kit released on completion.",
    img: "/assets/workshop-tables.jpeg", status: "enrolling",
    feePaise: 100000, priceNote: "simulated payment · for testing",
    modulesLabel: "3 modules", hoursLabel: "45 min", facilitator: "Parichita Kotnala",
    hidden: true,
    certificate: {
      name: "Demo · Workplace Facilitation Essentials",
      closing: "in **workplace facilitation essentials**.",
      hours: "45 Minutes",
    },
  },
];

/**
 * Whether the public course pages may offer enrolment.
 *
 * These pages are linked from the site's Certifications menu, so they are the
 * first LMS surface a visitor meets — and payment is not live yet. While this
 * is false they ask for an enquiry instead of taking money.
 *
 * Testing builds turn it on, which routes through the simulated gateway — no
 * real money moves until a server-verified Razorpay flow replaces it.
 */
export const ENROLMENT_OPEN = LMS_TESTING || PAYMENT_OFF;

/** Everything the public should see — the nav, sitemap and cards use this. */
export const VISIBLE_COURSES = COURSES.filter((c) => !c.hidden);

export const courseBySlug = (slug: string) => COURSES.find((c) => c.slug === slug);

/** ₹ formatting from paise, so no float ever touches a price. */
export const formatFee = (paise: number | null) =>
  paise === null ? "On request" : "₹" + (paise / 100).toLocaleString("en-IN");

/** Fee split for the order summary — GST is inclusive in the headline price. */
export const feeBreakdown = (paise: number) => {
  const base = Math.round(paise / 1.18);
  return { basePaise: base, gstPaise: paise - base, totalPaise: paise };
};
