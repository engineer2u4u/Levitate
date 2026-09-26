/**
 * Published module lists for programs that have a finalised syllabus but no
 * staged LMS curriculum yet.
 *
 * The certifications page and the program's own page both render from here, so
 * a syllabus the client sends over is edited once and cannot drift between the
 * two places a visitor might read it.
 */
/** A title, or a title with the line that says what the module is for. */
export type ProgramModule = string | { title: string; detail: string };

export const moduleTitle = (m: ProgramModule) => (typeof m === "string" ? m : m.title);
export const moduleDetail = (m: ProgramModule) => (typeof m === "string" ? "" : m.detail);

export type ProgramOutline = {
  intro: string;
  facts: { k: string; v: string }[];
  modules: ProgramModule[];
  closing: string;
};

export const POCSO_OUTLINE: ProgramOutline = {
  intro:
    "A practice-led certification that builds legal clarity, facilitation sensitivity and the confidence to lead child-safety conversations responsibly.",
  facts: [{ k: "Duration", v: "9 Hours" }, { k: "Format", v: "3 Days" }, { k: "Session", v: "3 Hrs / Day" }, { k: "Curriculum", v: "10 Modules" }],
  modules: [
    "Purpose, Child Safety and the Certification Journey",
    "The Levitate GUARD Child Safety Framework™",
    "Understanding the POCSO Legal & Child-Protection Ecosystem",
    "POCSO Offences, Reporting and Child-Friendly Justice",
    "Age-Appropriate Child Safety Communication",
    "Recognising Signals, Grooming and Vulnerability",
    "Disclosure, Response and Responsible Reporting",
    "Prevention and Institutional Child-Safety Systems",
    "Applied Child-Safety Case Laboratory",
    "Trainer Craft, Facilitation and Certification Practicum",
  ],
  closing: "Understand the law. Speak to children safely. Facilitate with responsibility.",
};

export const POSH_OUTLINE: ProgramOutline = {
  intro:
    "An intensive, practice-led certification designed to build legal understanding, inquiry competence and effective PoSH facilitation skills.",
  facts: [
    { k: "Duration", v: "15 Learning Hours" },
    { k: "Live", v: "12 Hours Facilitated" },
    { k: "Guided LMS", v: "3 Hours" },
    { k: "Curriculum", v: "15 Modules" },
  ],
  modules: [
    "Purpose, Culture and the Certification Journey",
    "India's Evolving PoSH Landscape",
    "The CLEAR PoSH Framework",
    "Genesis and Legal Foundation",
    "Recognising Sexual Harassment",
    "Coverage, Definitions and Jurisdiction",
    "Prevention and Internal Committee Governance",
    "Complaint Intake and Fair Inquiry",
    "Compliance, Governance and Accountability",
    "Digital, Virtual and Evolving Workplace Scenarios",
    "Power Dynamics, Retaliation and Complex Situations",
    "AI × PoSH: Assist, Never Adjudicate",
    "Recent Judicial, Regulatory and Compliance Developments",
    "Applied Case Laboratory",
    "Trainer Craft, Assessment and Certification",
  ],
  closing: "Learn the law. Navigate sensitive situations. Facilitate with confidence.",
};

export const DEI_OUTLINE: ProgramOutline = {
  intro:
    "A 20 + 5 hour applied Train-the-Trainer certification anchored in the BRIDGE Inclusion Framework, equipping participants to translate inclusion from concept into everyday workplace behaviour and facilitate DEIB learning with confidence.",
  facts: [
    { k: "Duration", v: "20 + 5 Hours" },
    { k: "Guided LMS", v: "5 Hours" },
    { k: "Format", v: "Applied TTT" },
    { k: "Framework", v: "BRIDGE Inclusion" },
    { k: "Curriculum", v: "13 Modules" },
  ],
  modules: [
    "DEIB Foundations & the Global Inclusion Landscape",
    "Identity, Intersectionality, Privilege & Power",
    "Bias, Stereotypes & Inclusive Decision-Making",
    "Inclusive Communication, Microaggressions & Constructive Dialogue",
    "Dimensions of Diversity & Intersectional Inclusion",
    "Cultural Intelligence & Working Across Difference",
    "Psychological Safety, Belonging & Inclusive Teams",
    "Allyship, Bystander Intervention & Inclusive Leadership",
    "Inclusive Employee Lifecycle & Organisational DEIB",
    "Designing Powerful DEIB Learning Experiences",
    "Facilitating Sensitive & Difficult DEIB Conversations",
    "Managing Resistance, Hot Moments & Challenging Questions",
    "Case Facilitation, Debriefing & Audience Adaptation",
  ],
  closing:
    "Build the inclusion knowledge, practical judgement and facilitation capability to lead meaningful workplace conversations across difference.",
};

export const HR_EDGE_OUTLINE: ProgramOutline = {
  intro:
    "An applied certification that builds the practical judgement to connect business priorities with people decisions, partner with managers and explain your recommendations with confidence. The programme builds from core concepts into practical application; previous MNC experience is not required.",
  facts: [
    { k: "Duration", v: "6 Weeks" },
    { k: "Learning", v: "42 Hours" },
    { k: "Live", v: "18 Sessions" },
    { k: "Curriculum", v: "8 Modules" },
  ],
  modules: [
    {
      title: "Understanding Business and the MNC HR Environment",
      detail: "How HR operates within multinational organisations, and how business priorities shape people decisions.",
    },
    {
      title: "Strategic Workforce Planning and Organisation Design",
      detail: "Translate business demand into workforce and skills requirements, weighing cost, capacity and organisational effectiveness.",
    },
    {
      title: "Performance, Coaching and Manager Capability",
      detail: "Support meaningful goals, effective feedback and fair performance decisions while strengthening manager capability.",
    },
    {
      title: "Talent, Reward and Employee Experience",
      detail: "Connect talent and reward decisions with capability, fairness, retention and employee experience.",
    },
    {
      title: "Employee Relations, Workplace Dignity and Wellbeing",
      detail: "A structured approach to sensitive employee situations, with professional boundaries and specialist responsibilities recognised.",
    },
    {
      title: "Restructuring and Organisational Change",
      detail: "The business rationale and the people impact of change, and how to support its implementation with clarity and care.",
    },
    {
      title: "People Analytics, AI and Future Workforce Decisions",
      detail: "Use people data and technology thoughtfully to improve the quality of HR recommendations.",
    },
    {
      title: "MNC Career Conversion Lab",
      detail: "Turn the learning into evidence: résumé positioning, LinkedIn, programme projects as proof of capability, behavioural and situational interviews, HRBP case interviews and assessment centres.",
    },
  ],
  closing: "Explore. Diagnose. Guide. Enable.",
};

/** Keyed by course slug — the same slug the certifications cards link to. */
export const OUTLINES: Record<string, ProgramOutline> = {
  "posh-trainer": POSH_OUTLINE,
  "pocso-child-safety": POCSO_OUTLINE,
  "inclusive-workplace": DEI_OUTLINE,
  "hr-edge": HR_EDGE_OUTLINE,
};

export const outlineBySlug = (slug: string): ProgramOutline | undefined => OUTLINES[slug];
