/**
 * Programme content taken from the printed brochure.
 *
 * The brochure is the copy the client actually hands to prospects, so the page
 * and the PDF say the same thing. Keyed by course slug — POCSO gets an entry
 * here once its brochure is signed off.
 */
export type ProgramBrochure = {
  /** Sits above the title in the hero. */
  eyebrow: string;
  /** Headline promise, printed above the programme description. */
  strapline: string;
  about: string;
  stats: { n: string; label: string }[];
  audience: string[];
  methodology: {
    tags: string[];
    body: string;
    blocks: { title: string; body: string; chips?: string[] }[];
  };
  accreditation: { title: string; body: string; note: string; badges: string[] };
  /** Sample certificates a participant earns. Images live in /public. */
  certificates: { title: string; caption: string; src: string }[];
  /** Downloadable PDF, served from /public. */
  brochure: { href: string; label: string; meta: string };
};

export const POSH_BROCHURE: ProgramBrochure = {
  eyebrow: "Certified POSH & Workplace Dignity Facilitator Programme",
  strapline: "Learn the law. Navigate sensitive situations. Facilitate with confidence.",
  about:
    "The Certified POSH Trainer Programme is an intensive, practice-led certification built to take participants beyond theory — equipping them with legal understanding, inquiry competence and the facilitation skill to run POSH sessions and support Internal Committees with confidence.",

  stats: [
    { n: "2,000+", label: "Professionals Trained" },
    { n: "15+ Yrs", label: "Global HR Leadership Experience" },
    { n: "35+ Yrs", label: "Institutional HR Legacy (ONGC)" },
    { n: "6", label: "Certification Pathways" },
  ],

  audience: [
    "HR & L&D Professionals",
    "Internal Committee Members & Presiding Officers",
    "External IC Members",
    "Legal & Compliance Professionals",
    "Workplace Trainers & Facilitators",
    "HR Consultants & Independent Professionals",
    "Aspiring POSH Trainers and Workplace Facilitators",
    "New Potential Trainers (freelance and/or corporate)",
  ],

  methodology: {
    tags: ["Audio-Video", "Interactive Presentation", "Case Studies", "Roleplay", "Activity Sheets", "Reflection & Group Discussion"],
    body:
      "Every session combines legal grounding with practical HR insight and facilitator practice — using workplace cases, role plays, reflection, discussion and applied facilitation rather than theory alone. Participants leave equipped to lead POSH conversations, not simply understand the legislation.",
    blocks: [
      {
        title: "Study Material",
        body: "Presentation deck, case studies, templates, facilitation guides, session plans and a complete trainer toolkit.",
      },
      {
        title: "Learning Management System (LMS)",
        body:
          "Every participant receives access to Levitate PeopleSoft's dedicated LMS — a central learning and resource hub supporting the live certification programme throughout the learning journey. Module-wise quizzes and knowledge checks help participants reinforce key concepts, track progress and prepare for the programme's assessment-based certification.",
        chips: ["Recorded Session Access", "Trainer Toolkit", "Module Resources", "Downloadable Templates", "Quizzes", "Progress Tracking"],
      },
    ],
  },

  accreditation: {
    title: "SHRM Professional Development Credits",
    body:
      "Levitate PeopleSoft is recognised by SHRM to offer Professional Development Credits (PDCs), applicable toward SHRM-CP® and SHRM-SCP® recertification, for participants who successfully complete our certification programmes.",
    note:
      "This accreditation reflects Levitate PeopleSoft's commitment to delivering globally benchmarked, practice-led learning that stands up to professional and institutional scrutiny — giving participants a credential that is recognised well beyond the classroom.",
    badges: ["ISO 9001:2015 Certified", "DPIIT Recognised", "Udyam Registration"],
  },

  certificates: [
    {
      title: "SHRM Certificate of Completion",
      caption: "Issued with the PDCs earned toward SHRM-CP® and SHRM-SCP® recertification.",
      src: "/assets/certificates/posh-ttt-shrm-certificate.jpg",
    },
    {
      title: "Levitate PeopleSoft Certificate of Training Completion",
      caption: "Carries a verifiable certificate ID, the completion date and the programme hours.",
      src: "/assets/certificates/posh-ttt-levitate-certificate.png",
    },
  ],

  brochure: {
    href: "/assets/brochures/levitate-posh-ttt-brochure.pdf",
    label: "Download the programme brochure",
    meta: "PDF · 13 pages · 5 MB",
  },
};

/**
 * Whether the brochure PDF and the two certificate images are in /public.
 *
 * The download link and the certificate images are hidden while this is false,
 * so a programme whose copy is written but whose files have not arrived does
 * not ship a 404 and two broken images. The files this guards:
 *
 *   public/assets/brochures/levitate-posh-ttt-brochure.pdf
 *   public/assets/certificates/posh-ttt-shrm-certificate.jpg
 *   public/assets/certificates/posh-ttt-levitate-certificate.png
 */
export const BROCHURE_ASSETS_READY = true;

export const BROCHURES: Record<string, ProgramBrochure> = {
  "posh-trainer": POSH_BROCHURE,
};

export const brochureBySlug = (slug: string): ProgramBrochure | undefined => BROCHURES[slug];
