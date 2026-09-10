import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import ScrollToTop from "@/components/home/ScrollToTop";
import SalesPage from "@/components/landing/SalesPage";
import { POSH_LANDING } from "@/lib/landing";
import { faqsBySlug } from "@/lib/lms/poshFaqs";

export const metadata: Metadata = {
  title: "PoSH Train-the-Trainer Certification",
  description:
    "A founder-led PoSH Train-the-Trainer certification with SHRM PDCs — 15 learning hours across 15 modules, 12 of them live over three weekends. Batch from 3 October. Learn to facilitate PoSH awareness and support an Internal Committee.",
  // The ad campaigns bid on these; the page should be recognisably about
   // them to anyone — a crawler included — who arrives from that search.
  keywords: [
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
  ],
  alternates: { canonical: "/posh-train-the-trainer-certification/" },
};

export default function Page() {
  return (
    <>
      <SiteHeader active="certifications" />
      <SalesPage offer={{ ...POSH_LANDING, faqs: faqsBySlug("posh-trainer") ?? [] }} />
      <SiteFooter />
      <WhatsAppFloat />
      <ScrollToTop />
    </>
  );
}
