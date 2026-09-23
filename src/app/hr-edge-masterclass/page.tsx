import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import ScrollToTop from "@/components/home/ScrollToTop";
import MasterclassPage from "@/components/landing/MasterclassPage";
import { HR_EDGE_MASTERCLASS as M } from "@/lib/masterclass";
import { formatFee } from "@/lib/lms/courses";
import { catalogCourse, dateFull, firstSession, loadCatalog } from "@/lib/catalog";

/** The date, time and fee in the description are the catalogue's, as the build read them. */
export async function generateMetadata(): Promise<Metadata> {
  const course = catalogCourse(await loadCatalog(), M.slug);
  const session = course ? firstSession(course) : null;
  const when = session?.startsOn ? ` ${dateFull(session.startsOn)}, ${session.timeLabel}.` : ` ${M.date}, ${M.time}.`;
  const fee = formatFee(course ? course.feePaise : M.feePaise);
  return {
    title: "HR EDGE Masterclass: Think Like an HR Business Partner",
    description: `A two-hour practical masterclass with Parichita Kotnala for HR students and early-career HR professionals — business understanding, manager conversations and an HR Decision Lab.${when} Fee ${fee} including taxes.`,
    keywords: [
      "HR business partner training",
      "HRBP masterclass",
      "HR masterclass India",
      "MBA HR students",
      "HR EDGE",
      "performance improvement plan HR",
      "HR interview preparation",
      "early career HR",
    ],
    alternates: { canonical: M.path },
  };
}

export default function Page() {
  return (
    <>
      <SiteHeader active="masterclass" />
      <MasterclassPage offer={M} />
      {/* Accreditations already sit mid-page; the footer's copy would repeat them. */}
      <SiteFooter accreditations={false} bandWidth={1180} />
      <WhatsAppFloat />
      <ScrollToTop />
    </>
  );
}
