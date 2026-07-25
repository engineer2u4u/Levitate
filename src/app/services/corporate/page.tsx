import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import ScrollToTop from "@/components/home/ScrollToTop";
import ServicePage from "@/components/site/ServicePage";

export const metadata: Metadata = {
  title: "Corporate Training Solutions",
  description:
    "Customized, outcome-focused corporate training interventions that strengthen leadership, communication, collaboration, culture and people capability — scoped to your business context.",
};

export default function Page() {
  return (
    <>
      <SiteHeader active="services" />
      <ServicePage pageKey="corporate" />
      <SiteFooter />
      <WhatsAppFloat />
      <ScrollToTop />
    </>
  );
}
