import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import ScrollToTop from "@/components/home/ScrollToTop";
import ServicePage from "@/components/site/ServicePage";

export const metadata: Metadata = {
  title: "Train-the-Trainer Certification Programs",
  description:
    "Practice-led facilitator certifications across leadership, DEI, wellbeing, POSH, POCSO and HR Edge — built for professionals who want to become credible workplace facilitators.",
};

export default function Page() {
  return (
    <>
      <SiteHeader active="services" />
      <ServicePage pageKey="ttt" />
      <SiteFooter />
      <WhatsAppFloat />
      <ScrollToTop />
    </>
  );
}
