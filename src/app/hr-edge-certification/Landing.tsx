/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import CourseDetail from "@/components/lms/CourseDetail";
import { SessionProvider } from "@/components/lms/useSession";
import EnquiryModal from "@/components/landing/EnquiryModal";
import Accreditations from "@/components/site/Accreditations";
import ConsultationBand from "@/components/site/ConsultationBand";
import { enquiryTopics } from "@/lib/site";

const SANS = "'Plus Jakarta Sans',sans-serif";
const SLUG = "hr-edge";
const PROGRAMME = "HR Edge certification (HR Students)";

/**
 * The HR Edge programme page as a paid-ad landing page.
 *
 * The same page as /lms/course/hr-edge, with every exit closed. A visitor
 * arrives from an ad for this programme, and a nav, a footer of links or a
 * contact page are all ways to lose them before they say who they are — so
 * the header carries the logo and one button, nothing links back to the site,
 * and both the button and the page's own calls to action open the form here.
 *
 * The page content is not copied. It is the same component in landing mode,
 * so the curriculum, the fee line and the batch note cannot drift between the
 * two pages as the programme changes.
 */
export default function Landing() {
  const [open, setOpen] = useState(false);
  // What the visitor came for, pre-selected — but the rest of the list is
  // there, because someone who clicked an ad for one thing may ask about
  // another and that is still a lead worth having.
  const topics = [PROGRAMME, ...enquiryTopics.filter((t) => t !== PROGRAMME)];

  return (
    <>
      {/* HEADER — the logo, and the one thing to do here. */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,.96)", backdropFilter: "blur(8px)", borderBottom: "1px solid #e8eef4" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          {/* Not a link: there is nowhere on this page to go but forward. */}
          <img src="/assets/logo.png" alt="Levitate PeopleSoft" style={{ height: 44, display: "block" }} />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="lp-btn-grad"
            style={{ border: "none", background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)", color: "#fff", font: `700 13.5px ${SANS}`, padding: "12px 22px", borderRadius: 999, cursor: "pointer", whiteSpace: "nowrap" }}
          >
            Book a Consultation
          </button>
        </div>
      </header>

      {/* The page is the LMS's course page, which reads the learner session —
          a context that only exists under /lms. Nothing here uses it: in
          landing mode every button opens the form rather than enrolling. It
          is provided so the component has what it asks for. */}
      <SessionProvider>
        <CourseDetail
          slug={SLUG}
          landing
          onEnquire={() => setOpen(true)}
          headline="Strategic HRBP Certification Programme"
          sub="Build the skills to move from HR operations to strategic business partnering."
          byline="By Levitate PeopleSoft | HR EDGE"
        />
      </SessionProvider>

      {/* The marks the programme sits behind. On the rest of the site these
          live in the footer; this page has no footer to speak of, and a
          visitor from an ad has no reason yet to take the organisation on
          trust. */}
      <Accreditations
        maxWidth={1240}
        intro="The programmes are delivered by an organisation recognised by the bodies below."
      />

      {/* The last word on the page, and the last chance to take it: the button
          opens the form rather than going anywhere. */}
      <ConsultationBand subject="HR EDGE" background="#f7fafc" onBook={() => setOpen(true)} />


      <EnquiryModal
        open={open}
        onClose={() => setOpen(false)}
        topics={topics}
        defaultTopic={PROGRAMME}
        programme={PROGRAMME}
      />
    </>
  );
}
