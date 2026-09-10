import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import ScrollToTop from "@/components/home/ScrollToTop";
import SalesPage from "@/components/landing/SalesPage";
import { POCSO_LANDING } from "@/lib/landing";
import { faqsBySlug } from "@/lib/lms/poshFaqs";

export const metadata: Metadata = {
  title: "POCSO Train-the-Trainer Certification",
  description:
    "A founder-led POCSO and Child Safety Facilitator certification for schools, NGOs and child-facing organisations. Three evenings from 24 October, with SHRM PDCs and a trainer toolkit.",
  alternates: { canonical: "/pocso-train-the-trainer-certification/" },
};

export default function Page() {
  return (
    <>
      <SiteHeader active="certifications" />
      <SalesPage offer={{ ...POCSO_LANDING, faqs: faqsBySlug("pocso-child-safety") ?? [] }} />
      <SiteFooter />
      <WhatsAppFloat />
      <ScrollToTop />
    </>
  );
}
