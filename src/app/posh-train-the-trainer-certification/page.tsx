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
    "A 12-hour, founder-led PoSH Train-the-Trainer certification with SHRM PDCs. Six live sessions across three weekends, batch from 26 September. Learn to facilitate PoSH awareness and support an Internal Committee.",
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
