import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import ScrollToTop from "@/components/home/ScrollToTop";
import MasterclassPage from "@/components/landing/MasterclassPage";
import { DEIB_MASTERCLASS as M } from "@/lib/masterclass";
import { formatFee } from "@/lib/lms/courses";
import { catalogCourse, dateFull, firstSession, loadCatalog } from "@/lib/catalog";

/** The date, time and fee in the description are the catalogue's, as the build read them. */
export async function generateMetadata(): Promise<Metadata> {
  const course = catalogCourse(await loadCatalog(), M.slug);
  const session = course ? firstSession(course) : null;
  const when = session?.startsOn ? ` ${dateFull(session.startsOn)}, ${session.timeLabel}.` : ` ${M.date}, ${M.time}.`;
  const fee = formatFee(course ? course.feePaise : M.feePaise);
  return {
    title: "Unconscious Bias at Work — A Live DEIB Masterclass",
    description: `A 90-minute masterclass with Parichita Kotnala on how unconscious bias shapes leadership, hiring, feedback and promotion decisions — and what to do differently.${when} Special fee ${fee}.`,
    keywords: [
      "unconscious bias training",
      "DEIB masterclass",
      "diversity equity inclusion belonging",
      "inclusive leadership India",
      "bias in hiring and promotion",
      "HR masterclass India",
      "workplace inclusion training",
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
