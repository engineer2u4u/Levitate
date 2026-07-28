import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import ScrollToTop from "@/components/home/ScrollToTop";
import LegalPage from "@/components/site/LegalPage";
import { disclaimer } from "@/lib/legalData";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Terms covering the use of the Levitate PeopleSoft website, including the scope of our training, certification and HR advisory content.",
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <LegalPage doc={disclaimer} />
      <SiteFooter />
      <WhatsAppFloat />
      <ScrollToTop />
    </>
  );
}
