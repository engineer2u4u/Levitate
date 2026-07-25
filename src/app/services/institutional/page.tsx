import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import ScrollToTop from "@/components/home/ScrollToTop";
import ServicePage from "@/components/site/ServicePage";

export const metadata: Metadata = {
  title: "Institutional Training",
  description:
    "Campus-to-corporate readiness, communication, interview preparation and the HR Edge Certification — HR-led programs that turn academic learning into corporate readiness.",
};

export default function Page() {
  return (
    <>
      <SiteHeader active="services" />
      <ServicePage pageKey="institutional" />
      <SiteFooter />
      <WhatsAppFloat />
      <ScrollToTop />
    </>
  );
}
