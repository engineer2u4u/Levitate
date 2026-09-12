import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import ScrollToTop from "@/components/home/ScrollToTop";
import SalesPage from "@/components/landing/SalesPage";
import { POSH_LANDING } from "@/lib/landing";
import { faqsBySlug } from "@/lib/lms/poshFaqs";
import { catalogCourse, fill, loadCatalog } from "@/lib/catalog";

// The ad campaigns bid on these; the page should be recognisably about
// them to anyone — a crawler included — who arrives from that search.
const KEYWORDS = [
  "PoSH certification",
  "PoSH certification course",
  "PoSH training certification",
  "PoSH certificate course",
  "PoSH certified trainer",
  "PoSH certification online",
  "PoSH Train-the-Trainer",
  "HR trainer course",
  "HR compliance training",
  "human resources training",
  "HR certification",
  "HR certificate programme",
  "business trainer PoSH certification",
  "Internal Committee training",
  "external IC member",
];

/** The start date in the description is the catalogue's, as the build read it. */
export async function generateMetadata(): Promise<Metadata> {
  const course = catalogCourse(await loadCatalog(), POSH_LANDING.slug);
  return {
    title: "PoSH Train-the-Trainer Certification",
    description: fill(
      "A founder-led PoSH Train-the-Trainer certification with SHRM PDCs — 15 learning hours across 15 modules, 12 of them live over three weekends. Batch from {starts}. Learn to facilitate PoSH awareness and support an Internal Committee.",
      course,
    ),
    keywords: KEYWORDS,
    alternates: { canonical: "/posh-train-the-trainer-certification/" },
  };
}

export default function Page() {
  return (
    <>
      <SiteHeader active="certifications" />
      <SalesPage offer={{ ...POSH_LANDING, faqs: faqsBySlug("posh-trainer") ?? [] }} />
      {/* Accreditations already sit after the hero; the footer's copy would repeat them. */}
      <SiteFooter accreditations={false} bandWidth={1180} />
      <WhatsAppFloat />
      <ScrollToTop />
    </>
  );
}
