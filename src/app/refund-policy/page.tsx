import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import ScrollToTop from "@/components/home/ScrollToTop";
import LegalPage from "@/components/site/LegalPage";
import { refundPolicy } from "@/lib/legalData";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "When fees paid to Levitate PeopleSoft are refundable, how to cancel a masterclass or certification registration, and how refunds are paid.",
  alternates: { canonical: "/refund-policy/" },
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <LegalPage doc={refundPolicy} />
      <SiteFooter />
      <WhatsAppFloat />
      <ScrollToTop />
    </>
  );
}
