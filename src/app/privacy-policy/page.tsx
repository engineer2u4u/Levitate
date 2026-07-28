import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import ScrollToTop from "@/components/home/ScrollToTop";
import LegalPage from "@/components/site/LegalPage";
import { privacyPolicy } from "@/lib/legalData";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Levitate PeopleSoft collects, uses and protects the information you share through this website. We do not share your personal information with third parties.",
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <LegalPage doc={privacyPolicy} />
      <SiteFooter />
      <WhatsAppFloat />
      <ScrollToTop />
    </>
  );
}
