/**
 * The six certification programmes.
 *
 * Shared by the certifications page and each programme's own page, so the two
 * cannot describe the same programme differently — the individual page is the
 * one a visitor now lands on from the menu.
 */
import { DEI_OUTLINE, POCSO_OUTLINE, type ProgramOutline } from "@/lib/programOutlines";

/** What every programme includes, whichever one it is. */
export const included = ["Facilitation practice & feedback", "Trainer toolkit: templates, guides, FAQs", "Workplace case studies & scenarios", "Assessment-linked certification"];

export type Program = {
  id: string;
  /** Matches the course slug, so a card can open that program's own page. */
  slug: string;
  num: string; tag: string; short: string; title: string; sub: string;
  p1: string; p2: string; ideal: string; pillarTitle: string; pillars: { k: string; v: string }[];
  /** Full curriculum breakdown. Only published for programs whose syllabus is finalised. */
  curriculum?: ProgramOutline;
};

export const programs: Program[] = [
  { id: "leadership", slug: "leadership-facilitator", num: "01", tag: "Flagship", short: "Corporate Leadership Facilitator", title: "Corporate Leadership Facilitator Program (CLF TTT)", sub: "Powered by the HUMAN Leadership Framework",
    p1: "A flagship Train-the-Trainer certification for professionals who want to facilitate leadership conversations around trust, coaching, feedback, accountability, productivity, prioritization and team growth.",
    p2: "The program equips facilitators to run leadership sessions that managers actually apply — grounded in five essential workplace leadership behaviours.",
    ideal: "HR professionals, L&D leaders, managers, coaches, consultants, trainers and aspiring leadership facilitators.",
    pillarTitle: "The HUMAN Leadership Framework", pillars: [{ k: "H", v: "High-Trust Conversations" }, { k: "U", v: "Understanding Through Coaching" }, { k: "M", v: "Meaningful Feedback" }, { k: "A", v: "Accountability & Prioritization" }, { k: "N", v: "Nurturing Team Growth" }] },
  { id: "dei", slug: "inclusive-workplace", num: "02", tag: "DEI · TTT", short: "Inclusive Workplace Facilitator", title: "Inclusive Workplace Facilitator Program (DEI TTT)", sub: "Diversity, Equity & Inclusion Train-the-Trainer Certification",
    p1: "A Train-the-Trainer certification for professionals who want to facilitate meaningful conversations on diversity, equity, inclusion and belonging in the workplace. Participants build understanding of core DEI concepts, unconscious bias, inclusive language, psychological safety and inclusive leadership practices.",
    p2: "It also prepares trainers to design DEI sessions, handle sensitive questions, manage resistance, use case studies and facilitate conversations that encourage reflection, awareness and behaviour change.",
    ideal: "HR professionals, DEI champions, L&D teams, managers, consultants, workplace trainers and aspiring facilitators.",
    pillarTitle: "The BRIDGE Inclusion Framework", pillars: [{ k: "B", v: "Bias Visible" }, { k: "R", v: "Respectful Language" }, { k: "I", v: "Inclusive Decisions" }, { k: "D", v: "Dialogue Over Debate" }, { k: "G", v: "Growing Belonging" }, { k: "E", v: "Everyday Allyship" }],
    curriculum: DEI_OUTLINE },
  { id: "wellbeing", slug: "workplace-wellbeing", num: "03", tag: "Wellbeing", short: "Workplace Wellbeing Facilitator", title: "Workplace Wellbeing Facilitator Program (Mental Health & Wellbeing TTT)", sub: "Applied Mental Health & Wellbeing Train-the-Trainer Certification",
    p1: "A Train-the-Trainer certification that prepares professionals to facilitate workplace mental health and wellbeing conversations with confidence, sensitivity and ethical responsibility.",
    p2: "Participants learn to design wellbeing sessions, discuss stress and burnout with sensitivity, promote psychological safety, reduce stigma, strengthen manager awareness and facilitate supportive conversations within a responsible workplace context.",
    ideal: "HR and L&D professionals, wellness practitioners, psychologists, counsellors, coaches, managers, workplace trainers and aspiring facilitators.",
    pillarTitle: "The CARES Wellbeing Framework", pillars: [{ k: "C", v: "Check-In Conversations" }, { k: "A", v: "Awareness of Signals" }, { k: "R", v: "Reducing Stigma" }, { k: "E", v: "Ethical Boundaries" }, { k: "S", v: "Safe Escalation" }] },
  { id: "posh", slug: "posh-trainer", num: "04", tag: "PoSH", short: "PoSH & Workplace Dignity", title: "PoSH & Workplace Dignity Facilitator Program (PoSH TTT)", sub: "PoSH Train-the-Trainer Certification",
    p1: "A Train-the-Trainer certification for professionals who want to facilitate PoSH awareness, workplace dignity, respectful behaviour and harassment-prevention conversations with legal clarity and facilitation maturity.",
    p2: "Participants learn to explain key PoSH concepts, design awareness sessions, use workplace case studies, support manager sensitisation, strengthen IC capability-building conversations and respond to difficult participant questions with sensitivity and responsibility.",
    ideal: "HR professionals, IC members, external members, legal professionals, compliance teams, consultants, workplace trainers and aspiring PoSH facilitators.",
    pillarTitle: "Levitate CLEAR PoSH Framework™", pillars: [{ k: "C", v: "Clarity on the Law" }, { k: "L", v: "Listening Without Judgment" }, { k: "E", v: "Explaining Boundaries" }, { k: "A", v: "Addressing Resistance" }, { k: "R", v: "Responsible Reporting" }],
    curriculum: {
      intro: "An intensive, practice-led certification designed to build legal understanding, inquiry competence and effective PoSH facilitation skills.",
      facts: [{ k: "Duration", v: "12 Hours" }, { k: "Tenure", v: "3 Weeks (Weekend Batch)" }, { k: "Curriculum", v: "11 Modules" }],
      modules: [
        "Purpose, Culture and the Certification Journey",
        "India's Evolving PoSH Landscape",
        "Levitate CLEAR PoSH Framework™",
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
    } },
  { id: "pocso", slug: "pocso-child-safety", num: "05", tag: "POCSO", short: "POCSO & Child Safety", title: "POCSO & Child Safety Facilitator Program (POCSO TTT)", sub: "POCSO Train-the-Trainer Certification",
    p1: "A Train-the-Trainer certification for professionals who want to facilitate child-safety and POCSO awareness sessions with sensitivity, legal clarity and responsible communication.",
    p2: "Participants learn to explain child protection concepts, create age-appropriate and institution-sensitive awareness sessions, use case-based discussions, respond to sensitive questions, build awareness around safe and unsafe behaviours and support responsible reporting conversations.",
    ideal: "Educators, school counsellors, child-safety professionals, NGOs, HR professionals, trainers, institutional leaders and professionals working in child-facing environments.",
    pillarTitle: "The GUARD Child Safety Framework", pillars: [{ k: "G", v: "Ground Rules for Safety" }, { k: "U", v: "Understanding the Law" }, { k: "A", v: "Age-Appropriate Language" }, { k: "R", v: "Recognising Signals" }, { k: "D", v: "Disclosure & Reporting" }],
    curriculum: POCSO_OUTLINE },
  { id: "hredge", slug: "hr-edge", num: "06", tag: "For Students", short: "HR Edge Certification", title: "HR Edge certification (HR Students)", sub: "Integrated DEI, PoSH & Workplace Wellbeing Trainer Certification for Future HR Professionals",
    p1: "A uniquely Levitate-designed certification for MBA-HR, PGDM-HR, HR postgraduate students and early-career HR professionals who want to enter the workplace with applied capability beyond their academic degree.",
    p2: "The integrated program builds practical understanding of inclusion, respectful workplaces, PoSH awareness, employee wellbeing, psychological safety and responsible HR response — strengthening interview readiness and helping participants stand out as future-ready HR professionals.",
    ideal: "MBA-HR and PGDM-HR students, HR postgraduates, early-career HR professionals, campus-to-corporate learners and students preparing for HR roles.",
    pillarTitle: "The EDGE Readiness Framework", pillars: [{ k: "E", v: "Everyday Inclusion" }, { k: "D", v: "Dignity & PoSH Awareness" }, { k: "G", v: "Growth & Wellbeing" }, { k: "E", v: "Employable HR Judgment" }] },
];

export const programBySlug = (slug: string): Program | undefined =>
  programs.find((p) => p.slug === slug);
