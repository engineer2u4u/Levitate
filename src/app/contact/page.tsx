import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import ScrollToTop from "@/components/home/ScrollToTop";
import ContactPage from "@/components/site/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Levitate PeopleSoft about certification programs, corporate training interventions, institutional programs or HR advisory. We respond within one working day.",
};

export default function Page() {
  return (
    <>
      <SiteHeader active="contact" />
      <ContactPage />
      <SiteFooter />
      <WhatsAppFloat />
      <ScrollToTop />
    </>
  );
}
