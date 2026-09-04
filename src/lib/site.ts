// Shared site chrome data (header/footer/contact) for the multi-page site.

export const contact = {
  email: "contactus@levitatepeoplesoft.com",
  phone: "+91-70656 45999",
  tel: "+917065645999",
  whatsapp: "https://wa.me/917065645999",
  hours: "Mon – Sat · 9:30 AM – 6:30 PM IST",
  address: "Ansal Esencia, Sector 67, Gurugram",
};

export type ServiceKey = "ttt" | "corporate" | "institutional" | "advisory";

export const services: {
  key: ServiceKey;
  num: string;
  label: string;
  short: string;
  href: string;
}[] = [
  { key: "ttt", num: "01", label: "Train-the-Trainer Certification Programs", short: "Train-the-Trainer Certifications", href: "/services/train-the-trainer" },
  { key: "corporate", num: "02", label: "Corporate Training Solutions", short: "Corporate Training Solutions", href: "/corporate-soft-skills-training-service" },
  { key: "institutional", num: "03", label: "Institutional Training", short: "Institutional Training", href: "/services/institutional" },
  { key: "advisory", num: "04", label: "HR Advisory & Workplace Culture Consulting", short: "HR Advisory & Culture Consulting", href: "/hr-consulting-services" },
];

export type NavKey = "home" | "services" | "certifications" | "about" | "parichita" | "contact" | "lms";

/** Organizations and institutions we have worked with (logos supplied by the client). */
export const trustedLogos: { name: string; src: string }[] = [
  { name: "GenXAI", src: "/assets/logos/genxai.png" },
  { name: "Vitraya", src: "/assets/logos/vitraya.png" },
  { name: "Krystelis", src: "/assets/logos/krystelis.png" },
  { name: "Netomi", src: "/assets/logos/netomi.png" },
  { name: "Bid Kinetic", src: "/assets/logos/bid-kinetic.png" },
  { name: "Works365", src: "/assets/logos/works365.png" },
  { name: "Rude Labs", src: "/assets/logos/rudelabs.png" },
  { name: "CliniWings", src: "/assets/logos/cliniwings.png" },
  { name: "Lumanity", src: "/assets/logos/lumanity.png" },
  { name: "Indium Corporation", src: "/assets/logos/indium-corporation.png" },
  { name: "CAD", src: "/assets/logos/cad.png" },
  { name: "Chitkara University", src: "/assets/logos/chitkara-university.png" },
  { name: "St. Xavier's High School", src: "/assets/logos/st-xaviers.png" },
  { name: "Hilton's School", src: "/assets/logos/hiltons-school.png" },
];

/**
 * What a visitor can put an enquiry against. The six certification programs in
 * the order they appear on /certifications, plus corporate training — kept here
 * rather than inside a form so every enquiry surface offers the same list and
 * the reply mail always names a program the team recognises.
 */
export const enquiryTopics: string[] = [
    "PoSH & Workplace Dignity Facilitator Program (PoSH TTT)",
  "POCSO & Child Safety Facilitator Program (POCSO TTT)",
  "Corporate Leadership Facilitator Program (CLF TTT)",
  "Inclusive Workplace Facilitator Program (DEI TTT)",
  "Workplace Wellbeing Facilitator Program (Mental Health & Wellbeing TTT)",
  "HR Edge certification (HR Students)",
  "Corporate Training",
];

export type Batch = {
  tag: string; title: string; status: string; open: boolean;
  /** Short name + start date, used by the homepage announcement bar. Only set while enrolling. */
  short?: string; starts?: string;
  rows: { k: string; v: string }[]; fee: string; feeNote: string; cta: string;
};

/**
 * Live certification cohorts, shared by the certifications page and the
 * homepage announcement bar so batch dates are edited in exactly one place.
 * `open` drives the card accents: teal while enrolment is on, muted grey once
 * a batch is only pencilled in.
 */
export const batches: Batch[] = [
  { tag: "PoSH Train-the-Trainer", title: "PoSH TTT Certification", status: "Enrolling", open: true, short: "PoSH TTT", starts: "26 September",
    rows: [{ k: "Batch starts", v: "26 September" }, { k: "Duration", v: "3 weeks" }, { k: "Batch type", v: "Weekend batch" }, { k: "Daily", v: "2 hours per day" }, { k: "Timing", v: "6:00 – 8:00 PM" }, { k: "Mode", v: "Live online" }],
    fee: "₹25,000", feeNote: "inclusive of taxes", cta: "Enrol for this batch" },
  { tag: "POCSO Train-the-Trainer", title: "POCSO TTT Certification", status: "Enrolling", open: true, short: "POCSO TTT", starts: "18 September",
    rows: [{ k: "Batch dates", v: "18, 19 & 20 September" }, { k: "Duration", v: "3 days" }, { k: "Daily", v: "2 hours per day" }, { k: "Timing", v: "6:00 – 8:00 PM" }, { k: "Mode", v: "Live online" }, { k: "Seats", v: "Limited cohort" }],
    fee: "₹20,000", feeNote: "inclusive of taxes", cta: "Enrol for this batch" },
  { tag: "DEI Train-the-Trainer", title: "Diversity, Equity & Inclusion Batch", status: "Enrolling", open: true, short: "DEI TTT", starts: "3 October",
    rows: [{ k: "Batch starts", v: "3 October" }, { k: "Duration", v: "20 hours" }, { k: "Curriculum", v: "13 modules" }, { k: "Timing", v: "To be confirmed" }, { k: "Mode", v: "Live online" }],
    fee: "₹40,000", feeNote: "inclusive of taxes", cta: "Enrol for this batch" },
  { tag: "Wellbeing Train-the-Trainer", title: "Mental Health & Well-being Batch", status: "Dates coming soon", open: false,
    rows: [{ k: "Batch month", v: "October 2026" }, { k: "Exact dates", v: "To be announced" }, { k: "Timing", v: "To be confirmed" }, { k: "Mode", v: "Live online" }],
    fee: "On request", feeNote: "confirmed with batch dates", cta: "Join the waitlist" },
];
