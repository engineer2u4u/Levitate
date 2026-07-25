// Shared site chrome data (header/footer/contact) for the multi-page site.

export const contact = {
  email: "contactus@levitatepeoplesoft.com",
  phone: "+91-70656 45999",
  tel: "+917065645999",
  whatsapp: "https://wa.me/917065645999",
  rating: "4.9",
  hours: "Mon – Sat · 9:30 AM – 6:30 PM IST",
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

export type NavKey = "home" | "services" | "certifications" | "about" | "contact";
