import type { Course } from "./types";

/** Catalogue. Fees are in paise; `null` means "On request" until dates firm up. */
export const COURSES: Course[] = [
  {
    slug: "posh-trainer",
    tag: "Enrolling", mode: "Live online · Weekend batch",
    title: "Certified POSH Trainer Programme",
    short: "POSH Train-the-Trainer",
    desc: "Build legal understanding, inquiry competence and POSH facilitation skills across 11 practice-led modules.",
    img: "/assets/workshop-tables.jpeg", status: "enrolling",
    feePaise: 2500000, priceNote: "incl. taxes · from 26 Sep",
    modulesLabel: "11 modules", hoursLabel: "12 hours", facilitator: "Parichita Kotnala",
    certificate: {
      name: "Certified POSH & Workplace Dignity Facilitator Program (POSH TTT)",
      closing: "under the **Prevention of Sexual Harassment at Workplace** (POSH Act, 2013).",
      hours: "12 Hours",
    },
  },
  {
    slug: "pocso-child-safety",
    tag: "Enrolling", mode: "Live online · 3 days",
    title: "Certified POCSO & Child Safety Facilitator",
    short: "POCSO & Child Safety",
    desc: "Facilitate child-safety awareness with sensitivity, legal clarity and responsible communication.",
    img: "/assets/school-group.jpeg", status: "enrolling",
    feePaise: 2000000, priceNote: "incl. taxes · from 18 Sep",
    modulesLabel: "8 modules", hoursLabel: "8 hours", facilitator: "Parichita Kotnala",
    certificate: {
      name: "Certified POCSO & Child Safety Facilitator Program (POCSO TTT)",
      closing: "under the **Protection of Children from Sexual Offences** (POCSO Act, 2012).",
      hours: "8 Hours",
    },
  },
  {
    slug: "inclusive-workplace",
    tag: "DEI · TTT", mode: "Live online · dates announced soon",
    title: "Certified Inclusive Workplace Facilitator",
    short: "Inclusive Workplace",
    desc: "Lead conversations on inclusion, unconscious bias, belonging and psychological safety.",
    img: "/assets/workshop-handsup.jpeg", status: "waitlist",
    feePaise: null, priceNote: "confirmed with batch dates",
    modulesLabel: "Curriculum on request", hoursLabel: "To be confirmed", facilitator: "Parichita Kotnala",
    certificate: {
      name: "Certified Inclusive Workplace Facilitator Program (DEI TTT)",
      closing: "in **Diversity, Equity & Inclusion** workplace facilitation.",
      hours: "12 Hours",
    },
  },
  {
    slug: "workplace-wellbeing",
    tag: "Wellbeing", mode: "Live online · dates announced soon",
    title: "Certified Workplace Wellbeing Facilitator",
    short: "Workplace Wellbeing",
    desc: "Facilitate workplace mental-health conversations with confidence, sensitivity and ethical care.",
    img: "/assets/outdoor-group.jpeg", status: "waitlist",
    feePaise: null, priceNote: "confirmed with batch dates",
    modulesLabel: "Curriculum on request", hoursLabel: "To be confirmed", facilitator: "Parichita Kotnala",
    certificate: {
      name: "Certified Workplace Wellbeing Facilitator Program (Wellbeing TTT)",
      closing: "in **Workplace Mental Health & Wellbeing** facilitation.",
      hours: "12 Hours",
    },
  },
  {
    slug: "leadership-facilitator",
    tag: "Flagship", mode: "Live online · cohort based",
    title: "Certified Corporate Leadership Facilitator",
    short: "Leadership Facilitator",
    desc: "Facilitate leadership conversations on trust, coaching, feedback, accountability and team growth.",
    img: "/assets/audience-red-hall.jpeg", status: "waitlist",
    feePaise: null, priceNote: "HUMAN Leadership Framework",
    modulesLabel: "Curriculum on request", hoursLabel: "To be confirmed", facilitator: "Parichita Kotnala",
    certificate: {
      name: "Certified Corporate Leadership Facilitator Program",
      closing: "powered by the **HUMAN Leadership Framework**.",
      hours: "12 Hours",
    },
  },
  {
    slug: "hr-edge",
    tag: "For students", mode: "Blended · campus cohorts",
    title: "HR Edge Certification",
    short: "HR Edge",
    desc: "Integrated DEI, POSH and wellbeing certification for MBA-HR and early-career HR professionals.",
    img: "/assets/students-group.png", status: "waitlist",
    feePaise: null, priceNote: "institutional pricing available",
    modulesLabel: "Curriculum on request", hoursLabel: "To be confirmed", facilitator: "Parichita Kotnala",
    certificate: {
      name: "HR Edge Certification",
      closing: "in integrated **DEI, POSH & Workplace Wellbeing** facilitation.",
      hours: "12 Hours",
    },
  },
];

/**
 * Whether the public course pages may offer enrolment.
 *
 * These pages are linked from the site's Certifications menu, so they are the
 * first LMS surface a visitor meets — and payment is not live yet. While this
 * is false they ask for an enquiry instead of taking money. Flip it to true
 * once the gateway is wired and the button comes back on its own.
 */
export const ENROLMENT_OPEN = false;

export const courseBySlug = (slug: string) => COURSES.find((c) => c.slug === slug);

/** ₹ formatting from paise, so no float ever touches a price. */
export const formatFee = (paise: number | null) =>
  paise === null ? "On request" : "₹" + (paise / 100).toLocaleString("en-IN");

/** Fee split for the order summary — GST is inclusive in the headline price. */
export const feeBreakdown = (paise: number) => {
  const base = Math.round(paise / 1.18);
  return { basePaise: base, gstPaise: paise - base, totalPaise: paise };
};
