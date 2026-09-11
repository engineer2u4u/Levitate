import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import ScrollToTop from "@/components/home/ScrollToTop";
import MasterclassPage from "@/components/landing/MasterclassPage";

export const metadata: Metadata = {
  title: "PoSH 2026 Masterclass: The New Compliance & Workplace Reality",
  description:
    "A two-hour masterclass with Parichita Kotnala on judicial developments, evolving workplaces and the AI × PoSH intersection. Friday 25 September 2026, 6–8 PM IST. Early-bird fee ₹1,999 including taxes.",
  keywords: [
    "PoSH masterclass",
    "PoSH 2026",
    "PoSH compliance",
    "PoSH Act update",
    "Internal Committee training",
    "PoSH and AI",
    "workplace harassment law India",
    "HR compliance training",
  ],
  alternates: { canonical: "/posh-2026-masterclass/" },
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <MasterclassPage />
      {/* Accreditations already sit mid-page; the footer's copy would repeat them. */}
      <SiteFooter accreditations={false} bandWidth={1180} />
      <WhatsAppFloat />
      <ScrollToTop />
    </>
  );
}
