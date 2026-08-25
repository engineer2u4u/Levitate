/**
 * Published module lists for programs that have a finalised syllabus but no
 * staged LMS curriculum yet.
 *
 * The certifications page and the program's own page both render from here, so
 * a syllabus the client sends over is edited once and cannot drift between the
 * two places a visitor might read it.
 */
export type ProgramOutline = {
  intro: string;
  facts: { k: string; v: string }[];
  modules: string[];
  closing: string;
};

export const POCSO_OUTLINE: ProgramOutline = {
  intro:
    "A practice-led certification that builds legal clarity, facilitation sensitivity and the confidence to lead child-safety conversations responsibly.",
  facts: [{ k: "Duration", v: "9 Hours" }, { k: "Format", v: "3 Days" }, { k: "Session", v: "3 Hrs / Day" }, { k: "Curriculum", v: "8 Modules" }],
  modules: [
    "Foundations of POCSO & the Levitate GUARD Child Safety Framework™",
    "Ground Rules for Safe & Sensitive Facilitation",
    "Understanding POCSO: Law, Offences & Child Protection Ecosystem",
    "Age-Appropriate Child Safety Communication",
    "Recognising Signals, Grooming & Vulnerability",
    "Disclosure, Response & Responsible Reporting",
    "Prevention & Institutional Child-Safety Systems",
    "POCSO Trainer Mastery & Certification Practicum",
  ],
  closing: "Understand the law. Speak to children safely. Facilitate with responsibility.",
};

export const POSH_OUTLINE: ProgramOutline = {
  intro:
    "An intensive, practice-led certification designed to build legal understanding, inquiry competence and effective POSH facilitation skills.",
  facts: [{ k: "Duration", v: "12 Hours" }, { k: "Format", v: "6 Days" }, { k: "Schedule", v: "3 Weeks" }, { k: "Curriculum", v: "11 Modules" }],
  modules: [
    "Purpose, Culture and the Certification Journey",
    "India's Evolving POSH Landscape",
    "Levitate CLEAR POSH Framework™",
    "Genesis and Legal Foundation",
    "Recognising Sexual Harassment",
    "Coverage, Definitions and Jurisdiction",
    "Prevention and Internal Committee Governance",
    "Complaint Intake and Fair Inquiry",
    "Compliance, Governance and Accountability",
    "Applied Case Laboratory",
    "Trainer Craft and Certification",
  ],
  closing: "Learn the law. Navigate sensitive situations. Facilitate with confidence.",
};

/** Keyed by course slug — the same slug the certifications cards link to. */
export const OUTLINES: Record<string, ProgramOutline> = {
  "posh-trainer": POSH_OUTLINE,
  "pocso-child-safety": POCSO_OUTLINE,
};

export const outlineBySlug = (slug: string): ProgramOutline | undefined => OUTLINES[slug];
