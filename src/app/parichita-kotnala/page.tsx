import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import ScrollToTop from "@/components/home/ScrollToTop";
import ParichitaPage from "@/components/site/ParichitaPage";

export const metadata: Metadata = {
  title: "Parichita Kotnala",
  description:
    "Founder & Managing Partner, Levitate PeopleSoft LLP. A global HR leader and learning facilitator with 15 years of strategic HR experience across India, the UK, Europe, the US and Canada.",
};

export default function Page() {
  return (
    <>
      <SiteHeader active="parichita" />
      <ParichitaPage />
      <SiteFooter />
      <WhatsAppFloat />
      <ScrollToTop />
    </>
  );
}
