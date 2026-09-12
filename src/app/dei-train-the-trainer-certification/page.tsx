import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import ScrollToTop from "@/components/home/ScrollToTop";
import SalesPage from "@/components/landing/SalesPage";
import { DEI_LANDING } from "@/lib/landing";
import { faqsBySlug } from "@/lib/lms/poshFaqs";
import { catalogCourse, fill, loadCatalog } from "@/lib/catalog";

const KEYWORDS = [
  "DEI certification",
  "DEI train the trainer",
  "DEI facilitator certification",
  "diversity equity and inclusion certification",
  "diversity and inclusion training",
  "unconscious bias training certification",
  "inclusion training certification",
  "DEI certification course",
  "HR trainer course",
  "HR certification",
  "employee resource group training",
  "psychological safety training",
];

/** The start date in the description is the catalogue's, as the build read it. */
export async function generateMetadata(): Promise<Metadata> {
  const course = catalogCourse(await loadCatalog(), DEI_LANDING.slug);
  return {
    title: "DEI Train-the-Trainer Certification",
    description: fill(
      "A founder-led DEI facilitator certification with SHRM PDCs — 20 applied hours across 13 modules, anchored in the BRIDGE Inclusion Framework. Batch from {starts}. Learn to design and facilitate diversity, equity and inclusion learning.",
      course,
    ),
    keywords: KEYWORDS,
    alternates: { canonical: "/dei-train-the-trainer-certification/" },
  };
}

export default function Page() {
  return (
    <>
      <SiteHeader active="certifications" />
      <SalesPage offer={{ ...DEI_LANDING, faqs: faqsBySlug("inclusive-workplace") ?? [] }} />
      {/* Accreditations already sit after the hero; the footer's copy would repeat them. */}
      <SiteFooter accreditations={false} bandWidth={1180} />
      <WhatsAppFloat />
      <ScrollToTop />
    </>
  );
}
