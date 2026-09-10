import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import ScrollToTop from "@/components/home/ScrollToTop";
import SalesPage from "@/components/landing/SalesPage";
import { DEI_LANDING } from "@/lib/landing";
import { faqsBySlug } from "@/lib/lms/poshFaqs";

export const metadata: Metadata = {
  title: "DEI Train-the-Trainer Certification",
  description:
    "A founder-led DEI facilitator certification with SHRM PDCs — 20 applied hours across 13 modules, anchored in the BRIDGE Inclusion Framework. Batch from 10 October. Learn to design and facilitate diversity, equity and inclusion learning.",
  keywords: [
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
  ],
  alternates: { canonical: "/dei-train-the-trainer-certification/" },
};

export default function Page() {
  return (
    <>
      <SiteHeader active="certifications" />
      <SalesPage offer={{ ...DEI_LANDING, faqs: faqsBySlug("inclusive-workplace") ?? [] }} />
      <SiteFooter />
      <WhatsAppFloat />
      <ScrollToTop />
    </>
  );
}
