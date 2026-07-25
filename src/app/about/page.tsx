import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import ScrollToTop from "@/components/home/ScrollToTop";
import AboutPage from "@/components/site/AboutPage";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Built on HR legacy, strengthened by global workplace practice. Levitate PeopleSoft — founded 2023 by Mr. Ravindra Prem Nath and led by Parichita Kotnala — builds future-ready people capability.",
};

export default function Page() {
  return (
    <>
      <SiteHeader active="about" />
      <AboutPage />
      <SiteFooter />
      <WhatsAppFloat />
      <ScrollToTop />
    </>
  );
}
