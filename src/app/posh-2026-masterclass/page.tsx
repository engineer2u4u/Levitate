import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import ScrollToTop from "@/components/home/ScrollToTop";
import MasterclassPage from "@/components/landing/MasterclassPage";
import { MASTERCLASS } from "@/lib/masterclass";
import { formatFee } from "@/lib/lms/courses";
import { catalogCourse, dateFull, firstSession, loadCatalog } from "@/lib/catalog";

/** The date, time and fee in the description are the catalogue's, as the build read them. */
export async function generateMetadata(): Promise<Metadata> {
  const course = catalogCourse(await loadCatalog(), MASTERCLASS.slug);
  const session = course ? firstSession(course) : null;
  const when = session?.startsOn ? ` ${dateFull(session.startsOn)}, ${session.timeLabel}.` : "";
  const fee = formatFee(course ? course.feePaise : MASTERCLASS.feePaise);
  return {
    title: "PoSH 2026 Masterclass: The New Compliance & Workplace Reality",
    description: `A two-hour masterclass with Parichita Kotnala on judicial developments, evolving workplaces and the AI × PoSH intersection.${when} Early-bird fee ${fee} including taxes.`,
    keywords: [
      "PoSH masterclass",
      "PoSH 2026",
      "PoSH compliance",
      "PoSH Act update",
      "Internal Committee training",
      "PoSH and AI",
      "workplace harassment law India",
      "HR compliance training",
    ],
    alternates: { canonical: "/posh-2026-masterclass/" },
  };
}

export default function Page() {
  return (
    <>
      <SiteHeader />
      <MasterclassPage />
      {/* Accreditations already sit mid-page; the footer's copy would repeat them. */}
      <SiteFooter accreditations={false} bandWidth={1180} />
      <WhatsAppFloat />
      <ScrollToTop />
    </>
  );
}
