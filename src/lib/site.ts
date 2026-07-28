// Shared site chrome data (header/footer/contact) for the multi-page site.

export const contact = {
  email: "contactus@levitatepeoplesoft.com",
  phone: "+91-70656 45999",
  tel: "+917065645999",
  whatsapp: "https://wa.me/917065645999",
  rating: "4.9",
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
  { key: "corporate", num: "02", label: "Corporate Training Solutions", short: "Corporate Training Solutions", href: "/services/corporate" },
  { key: "institutional", num: "03", label: "Institutional Training", short: "Institutional Training", href: "/services/institutional" },
  { key: "advisory", num: "04", label: "HR Advisory & Workplace Culture Consulting", short: "HR Advisory & Culture Consulting", href: "/services/advisory" },
];

export type NavKey = "home" | "services" | "certifications" | "about" | "parichita" | "contact";

/** Accreditations / recognitions (logos supplied by the client). */
export const accreditationLogos: { name: string; src: string; note: string }[] = [
  { name: "GCG", src: "/assets/accreditations/gcg.png", note: "Global Career Guidance" },
  { name: "SHRM Recertification Provider", src: "/assets/accreditations/shrm.png", note: "SHRM-CP | SHRM-SCP" },
  { name: "peopleHum Top 200 Global Thought Leader", src: "/assets/accreditations/peoplehum.png", note: "Top 200 Global Thought Leader, 2021" },
];

/** Organizations and institutions we have worked with (logos supplied by the client). */
export const trustedLogos: { name: string; src: string }[] = [
  { name: "GenXAI", src: "/assets/logos/genxai.png" },
  { name: "Vitraya", src: "/assets/logos/vitraya.png" },
  { name: "Krystelis", src: "/assets/logos/krystelis.png" },
  { name: "Netomi", src: "/assets/logos/netomi.png" },
  { name: "Bid Kinetic", src: "/assets/logos/bid-kinetic.png" },
  { name: "Works365", src: "/assets/logos/works365.png" },
  { name: "Rude Labs", src: "/assets/logos/rudelabs.png" },
  { name: "CAD", src: "/assets/logos/cad.png" },
  { name: "Chitkara University", src: "/assets/logos/chitkara-university.png" },
  { name: "St. Xavier's High School", src: "/assets/logos/st-xaviers.png" },
  { name: "Hilton's School", src: "/assets/logos/hiltons-school.png" },
];
