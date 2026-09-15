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
  /** The figures the brochure leads with. Used as the hero pills when the
   *  programme has no staged LMS curriculum to take them from. */
  meta?: string[];
  about: string;
  stats: { n: string; label: string }[];
  audience: string[];
  /** The brochure's "Professional Scope" line, under the audience list. */
  scope?: string;
  /** Written testimonials from the brochure — on the course and landing pages. */
  testimonials?: { name: string; quote: string }[];
  methodology: {
    tags: string[];
    body: string;
    blocks: { title: string; body: string; chips?: string[] }[];
  };
  /**
   * What a participant leaves able to do. Only set for programmes with no
   * staged LMS curriculum — PoSH takes its objectives from that instead.
   */
  objectives?: string[];
  /** An extra pitch the brochure makes in its own words. */
  beyond?: { title: string; intro: string; points: string[] };
  /** How the practice-led half of the programme is actually delivered. */
  practiceLed?: { title: string; intro: string; items: string[] };
  /** Downloadable PDF, served from /public. Omitted where the copy has
   *  arrived but the PDF has not — the link is simply not offered. */
  brochure?: { href: string; label: string; meta: string };
};

export const POSH_BROCHURE: ProgramBrochure = {
  eyebrow: "PoSH & Workplace Dignity Facilitator Program (PoSH TTT)",
  strapline: "Learn the law. Navigate sensitive situations. Facilitate with confidence.",
  about:
    "The PoSH & Workplace Dignity Facilitator Program (PoSH TTT) is an intensive, practice-led certification built to take participants beyond theory — equipping them with legal understanding, inquiry competence and the facilitation skill to run PoSH sessions and support Internal Committees with confidence.",

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
    "Aspiring PoSH Trainers and Workplace Facilitators",
    "New Potential Trainers (freelance and/or corporate)",
  ],

  methodology: {
    tags: ["Audio-Video", "Interactive Presentation", "Case Studies", "Roleplay", "Activity Sheets", "Reflection & Group Discussion"],
    body:
      "Every session combines legal grounding with practical HR insight and facilitator practice — using workplace cases, role plays, reflection, discussion and applied facilitation rather than theory alone. Participants leave equipped to lead PoSH conversations, not simply understand the legislation.",
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

  brochure: {
    href: "/assets/brochures/levitate-posh-ttt-brochure.pdf",
    label: "Download the programme brochure",
    meta: "PDF · 14 pages · 4 MB",
  },
};

/**
 * Whether the brochure PDF is in /public.
 *
 * The download link is hidden while this is false, so a programme whose copy
 * is written but whose PDF has not arrived does not ship a 404. Guards:
 *
 *   public/assets/brochures/levitate-posh-ttt-brochure.pdf
 */
export const BROCHURE_ASSETS_READY = true;

export const POCSO_BROCHURE: ProgramBrochure = {
  eyebrow: "POCSO & Child Safety Facilitator Program (POCSO TTT)",
  strapline: "Protect with knowledge. Respond with responsibility. Facilitate with care.",
  meta: ["9 Hours · Duration", "3 Days · Format", "3 Hrs / Day · Session", "8 Modules · Curriculum"],
  about:
    "The POCSO & Child Safety Facilitator Program (POCSO TTT) is an intensive, practice-led Train-the-Trainer certification designed to help professionals facilitate child-safety and POCSO awareness with legal clarity, age-appropriate communication and responsible reporting.",

  stats: [
    { n: "2,000+", label: "Professionals Trained" },
    { n: "15+ Yrs", label: "Global HR Leadership Experience" },
    { n: "35+ Yrs", label: "Institutional HR Legacy (ONGC)" },
    { n: "6", label: "Certification Pathways" },
  ],

  objectives: [
    "Explain the POCSO legal and child-protection ecosystem with clarity",
    "Communicate child-safety concepts using age-appropriate and audience-sensitive language",
    "Recognise behavioural, situational and digital signals, grooming patterns and vulnerability",
    "Respond responsibly to disclosures and understand reporting pathways",
    "Support preventive and institutional child-safety systems",
    "Facilitate sensitive POCSO and child-safety awareness sessions with confidence and care",
  ],

  beyond: {
    title: "Beyond awareness. Building facilitation capability.",
    intro:
      "This is not designed as a conventional POCSO awareness programme. Participants learn not only what to teach, but also:",
    points: [
      "How to explain it.",
      "How to adapt it.",
      "How to facilitate sensitive conversations.",
      "How to handle difficult questions.",
      "How to respond if a disclosure occurs.",
      "And how to create learning environments that place child safety at the centre.",
    ],
  },

  practiceLed: {
    title: "Practice-led learning",
    intro: "The certification combines legal understanding with practical facilitator capability through:",
    items: [
      "Applied case discussions",
      "Scenario-based learning",
      "Role plays and disclosure-response simulations",
      "Audience and age-adaptation exercises",
      "Child-safety and institutional safeguarding activities",
      "Facilitator practice exercises",
      "Session-design assignments",
      "Knowledge checks and assessments",
      "Certification practicum / micro-teaching",
    ],
  },

  audience: [
    "Educators, teachers, principals and school leaders",
    "School counsellors and child-safety professionals",
    "NGO and social-sector professionals",
    "HR and L&D professionals",
    "Corporate and independent trainers",
    "Institutional leaders working in child-facing environments",
    "Consultants and aspiring POCSO facilitators",
    "Psychologists and child psychologists",
    "Special educators",
  ],

  methodology: {
    tags: ["Audio-Video", "Interactive Presentation", "Case Studies", "Roleplay", "Activity Sheets", "Reflection & Group Discussion"],
    body:
      "Every session blends global content with practical HR insight — cases, role plays, reflection, discussion and applied facilitation rather than theory alone. Participants leave equipped to run sessions, not just attend them.",
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

  brochure: {
    href: "/assets/brochures/levitate-pocso-ttt-brochure.pdf",
    label: "Download the programme brochure",
    meta: "PDF · 13 pages · 10 MB",
  },
};

export const DEI_BROCHURE: ProgramBrochure = {
  eyebrow: "Certified DEIB Train-the-Trainer",
  strapline: "Understand. Reflect. Apply. Facilitate. Transform.",
  meta: ["20 + 5 Hours · Total Certification", "13 Modules · Curriculum", "BRIDGE · Inclusion Framework", "Applied TTT · Format"],
  about:
    "The Inclusive Workplace Facilitator Program (DEIB TTT) is a 20 + 5 hour applied Train-the-Trainer certification anchored in the BRIDGE Inclusion Framework, equipping participants to translate inclusion from concept into everyday workplace behaviour and facilitate DEIB learning with confidence.",

  stats: [
    { n: "2,000+", label: "Professionals Trained" },
    { n: "15+ Yrs", label: "Global HR Leadership Experience" },
    { n: "35+ Yrs", label: "Institutional HR Legacy (ONGC)" },
    { n: "6", label: "Certification Pathways" },
  ],

  objectives: [
    "Explain core DEIB concepts, identity, intersectionality, privilege, power and the global inclusion landscape",
    "Recognise and interrupt bias, stereotypes, microaggressions and exclusion in everyday workplace decisions and communication",
    "Strengthen psychological safety, belonging, allyship, inclusive leadership and culturally intelligent collaboration",
    "Apply an inclusion lens across the employee lifecycle, DEIB strategy, governance, measurement and organisational change",
    "Design and facilitate engaging, workplace-relevant DEIB learning experiences using adult-learning principles",
    "Navigate sensitive conversations, resistance, difficult questions and emotionally charged moments with confidence",
    "Use cases, structured debriefing and audience adaptation to translate DEIB learning into practical workplace application",
  ],

  audience: [
    "HR & L&D Professionals",
    "DEIB, Culture & Employee Experience Professionals",
    "People Managers & Inclusive Leaders",
    "Workplace Trainers & Facilitators",
    "HR Consultants & Independent Professionals",
    "Aspiring DEIB Facilitators",
    "New Potential Trainers (freelance and/or corporate)",
  ],
  scope:
    "A professional, workplace-focused, practice-led DEIB facilitator certification designed to build applied inclusion and facilitation capability.",

  // As printed in the FINAL brochure, which names the programme DEI in them.
  testimonials: [
    {
      name: "Aditi Malhotra",
      quote: "The programme made DEI feel practical and relevant to real workplace situations. I especially valued the structured approach to inclusive conversations and everyday decision-making.",
    },
    {
      name: "Rohan Bhatia",
      quote: "The facilitation practice was the strongest part for me. The sessions helped me build confidence to handle sensitive topics, different viewpoints and challenging questions with greater clarity.",
    },
    {
      name: "Meera Iyer",
      quote: "I appreciated how the programme connected inclusion, psychological safety and belonging with actual workplace behaviour. The case discussions gave me ideas I can immediately use in my own sessions.",
    },
    {
      name: "Siddharth Rao",
      quote: "A well-structured Train-the-Trainer programme that goes beyond DEI theory. I came away with practical tools for designing engaging sessions and facilitating meaningful conversations across differences.",
    },
  ],

  methodology: {
    tags: ["Audio-Video", "Interactive Presentation", "Case Studies", "Roleplay", "Activity Sheets", "Reflection & Group Discussion"],
    // The printed brochure reuses the PoSH wording here and ends on "lead POSH
    // conversations", which is a copy-paste left in the PDF. Saying that on the
    // DEIB page would be plainly wrong, so the sentence names DEIB instead.
    body:
      "Every session combines inclusion knowledge with practical HR insight and facilitator practice — using workplace cases, role plays, reflection, discussion and applied facilitation rather than theory alone. Participants leave equipped to lead DEIB conversations, not simply understand the concepts.",
    blocks: [
      {
        title: "Study Material",
        body: "Presentation deck, case studies, templates, facilitation guides, session plans and a complete trainer toolkit.",
      },
      {
        title: "Learning Management System (LMS)",
        body:
          "Every participant receives access to Levitate PeopleSoft's dedicated LMS — a central learning and resource hub supporting the live certification programme throughout the learning journey. It brings programme resources together in one place, including recorded session access, module-wise learning resources, trainer toolkits, case materials, templates, downloadable resources and knowledge checks. Module-wise quizzes and knowledge checks help participants reinforce key concepts, track their learning progress and prepare for the programme's assessment-based certification.",
        chips: ["Recorded Session Access", "Trainer Toolkit", "Module Resources", "Downloadable Templates", "Quizzes", "Progress Tracking"],
      },
    ],
  },

  // The FINAL brochure, at the URL the earlier one had, so any link already
  // sent out opens the current copy.
  brochure: {
    href: "/assets/brochures/levitate-dei-ttt-brochure.pdf",
    label: "Download the programme brochure",
    meta: "PDF · 14 pages · 3 MB",
  },
};

export const BROCHURES: Record<string, ProgramBrochure> = {
  "posh-trainer": POSH_BROCHURE,
  "pocso-child-safety": POCSO_BROCHURE,
  "inclusive-workplace": DEI_BROCHURE,
};

export const brochureBySlug = (slug: string): ProgramBrochure | undefined => BROCHURES[slug];
