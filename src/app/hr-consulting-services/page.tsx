import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import ScrollToTop from "@/components/home/ScrollToTop";
import ServicePage from "@/components/site/ServicePage";

export const metadata: Metadata = {
  title: "HR Advisory & Workplace Culture Consulting",
  description:
    "Practical HR advisory and workplace culture support — POSH & IC readiness, policy review, manager capability and employee experience — from decades of institutional and global HR practice.",
};

export default function Page() {
  return (
    <>
      <SiteHeader active="services" />
      {/* showCredential=false: no certificate section on HR Advisory per client edits */}
      <ServicePage pageKey="advisory" showCredential={false} />
      <SiteFooter />
      <WhatsAppFloat />
      <ScrollToTop />
    </>
  );
}
