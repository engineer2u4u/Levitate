import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import ScrollToTop from "@/components/home/ScrollToTop";
import CertificationsPage from "@/components/site/CertificationsPage";

export const metadata: Metadata = {
  title: "Certification Programs",
  description:
    "Six Train-the-Trainer certification pathways — Leadership, DEI, Wellbeing, POSH, POCSO and HR Edge — with practice-led learning and assessment-based, verifiable credentials.",
};

export default function Page() {
  return (
    <>
      <SiteHeader active="certifications" />
      <CertificationsPage />
      <SiteFooter />
      <WhatsAppFloat />
      <ScrollToTop />
    </>
  );
}
