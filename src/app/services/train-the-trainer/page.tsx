import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import ScrollToTop from "@/components/home/ScrollToTop";
import ServicePage from "@/components/site/ServicePage";

export const metadata: Metadata = {
  title: "Train-the-Trainer Certification Programs",
  description:
    "Practice-led workplace facilitator certifications in Corporate Leadership Facilitation, Diversity, Equity & Inclusion, Applied Workplace Mental Health & Wellbeing, PoSH and POCSO — along with HR Edge Certification for future HR professionals., PoSH, POCSO and HR Edge — built for professionals who want to become credible workplace facilitators.",
};

export default function Page() {
  return (
    <>
      <SiteHeader active="services" />
      {/* showProcess=false: "How certification runs" removed per client edits */}
      <ServicePage pageKey="ttt" showProcess={false} />
      <SiteFooter />
      <WhatsAppFloat />
      <ScrollToTop />
    </>
  );
}
