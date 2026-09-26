/**
 * The six certification programmes.
 *
 * Shared by the certifications page and each programme's own page, so the two
 * cannot describe the same programme differently — the individual page is the
 * one a visitor now lands on from the menu.
 */
import { DEI_OUTLINE, HR_EDGE_OUTLINE, POCSO_OUTLINE, POSH_OUTLINE, type ProgramOutline } from "@/lib/programOutlines";

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
  { id: "dei", slug: "inclusive-workplace", num: "02", tag: "DEIB · TTT", short: "Inclusive Workplace Facilitator", title: "Inclusive Workplace Facilitator Program (DEIB TTT)", sub: "Diversity, Equity, Inclusion & Belonging Train-the-Trainer Certification",
    p1: "A Train-the-Trainer certification for professionals who want to facilitate meaningful conversations on diversity, equity, inclusion and belonging in the workplace. Participants build understanding of core DEIB concepts, unconscious bias, inclusive language, psychological safety and inclusive leadership practices.",
    p2: "It also prepares trainers to design DEIB sessions, handle sensitive questions, manage resistance, use case studies and facilitate conversations that encourage reflection, awareness and behaviour change.",
    ideal: "HR professionals, DEIB champions, L&D teams, managers, consultants, workplace trainers and aspiring facilitators.",
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
    curriculum: POSH_OUTLINE },
  { id: "pocso", slug: "pocso-child-safety", num: "05", tag: "POCSO", short: "POCSO & Child Safety", title: "POCSO & Child Safety Facilitator Program (POCSO TTT)", sub: "POCSO Train-the-Trainer Certification",
    p1: "A Train-the-Trainer certification for professionals who want to facilitate child-safety and POCSO awareness sessions with sensitivity, legal clarity and responsible communication.",
    p2: "Participants learn to explain child protection concepts, create age-appropriate and institution-sensitive awareness sessions, use case-based discussions, respond to sensitive questions, build awareness around safe and unsafe behaviours and support responsible reporting conversations.",
    ideal: "Educators, school counsellors, child-safety professionals, NGOs, HR professionals, trainers, institutional leaders and professionals working in child-facing environments.",
    pillarTitle: "The GUARD Child Safety Framework", pillars: [{ k: "G", v: "Ground Rules for Safety" }, { k: "U", v: "Understanding the Law" }, { k: "A", v: "Age-Appropriate Language" }, { k: "R", v: "Recognising Signals" }, { k: "D", v: "Disclosure & Reporting" }],
    curriculum: POCSO_OUTLINE },
  { id: "hredge", slug: "hr-edge", num: "06", tag: "For Students", short: "HR EDGE", title: "HR EDGE — Certified MNC-Ready HR Practitioner Programme", sub: "Think like an HR Business Partner",
    p1: "An applied certification programme for people preparing to contribute as an HR Business Partner: understand the business, ask better questions and make stronger people decisions. It builds the practical judgement to connect business priorities with people decisions, partner with managers, and explain a recommendation with confidence.",
    p2: "Learning happens through the work HR actually does. Participants work a simulated MNC environment of connected situations involving business leaders, managers, employees and specialist HR teams — interpreting manager emails, organisation charts, workforce figures and case records, practising role-plays, stakeholder discussions and decision labs, and applying each concept between sessions through guided LMS work and reusable tools.",
    ideal: "MBA-HR and PGDM-HR students and recent graduates entering corporate HR, early-career HR professionals building confidence in workplace decisions and manager conversations, HR operations and talent acquisition professionals broadening into business partnering, and aspiring HR Business Partners and People Partners. Previous MNC experience is not required.",
    pillarTitle: "The EDGE Framework", pillars: [{ k: "E", v: "Explore — understand the situation before recommending a solution" }, { k: "D", v: "Diagnose — use evidence to understand what needs attention" }, { k: "G", v: "Guide — help managers make informed people decisions" }, { k: "E", v: "Enable — turn recommendations into responsible action" }],
    curriculum: HR_EDGE_OUTLINE },
];

export const programBySlug = (slug: string): Program | undefined =>
  programs.find((p) => p.slug === slug);
