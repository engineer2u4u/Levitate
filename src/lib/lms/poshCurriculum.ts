import type { Curriculum } from "./types";

/** Teaching content for the POSH programme — the one course with a finalised
 *  syllabus. Stages release in order as their live sessions are completed. */
export const POSH_CURRICULUM: Curriculum = {
  slug: "posh-trainer",
  eyebrow: "POSH Train-the-Trainer · Live cohort",
  blurb:
    "An intensive, practice-led certification designed to build legal understanding, inquiry competence and effective POSH facilitation skills.",
  // The four figures the brochure leads with, in the brochure's order.
  meta: ["12 Hours · Learning Duration", "6 Live Sessions · Format", "3 Weeks · Weekend Schedule", "11 Modules · Curriculum"],
  included: [
    "Assessment-Based Certification",
    "Trainer Toolkit Included",
    "SHRM PDC Eligible",
    "Practice-Led Learning",
    "Verifiable Certificate ID",
    "Dedicated LMS Access",
    "Workplace Case Laboratories",
  ],
  // "On successful completion of the programme, participants will be able to:"
  objectives: [
    "Confidently design and deliver POSH awareness and sensitisation sessions",
    "Apply the Levitate CLEAR POSH Framework™ to practical workplace situations",
    "Explain complaint intake, inquiry principles and the role of the Internal Committee with clarity",
    "Navigate key legal definitions, coverage, jurisdiction and compliance requirements",
    "Facilitate sensitive POSH conversations with confidence, care and legal grounding",
    "Handle participant questions, resistance and difficult conversations responsibly",
    "Use case studies, facilitation tools and structured session plans to deliver workplace-ready POSH learning and build a credible career path as a certified workplace facilitator",
  ],
  stages: [
    {
      id: "s0", num: "00", title: "Orientation & Pre-Work", release: "Released immediately after payment",
      lessons: [
        { id: "l0-1", kind: "VID", title: "Welcome & how this certification works", meta: "Video · 9 min", desc: "How the cohort runs, what is expected of you between sessions, and how assessment and certification work." },
        { id: "l0-2", kind: "PDF", title: "Programme handbook & assessment criteria", meta: "PDF · 14 pages", desc: "Your handbook covering the schedule, assessment criteria, facilitation practice expectations and certification rules." },
        { id: "l0-3", kind: "PDF", title: "Pre-reading: the POSH Act 2013 at a glance", meta: "PDF · 8 pages", desc: "A short primer on the Act so the first live session can move straight to application." },
      ],
    },
    {
      id: "s1", num: "01", title: "Week 1 · Legal Foundations", release: "Unlocks after Live Session 1 · 26 September",
      lessons: [
        { id: "l1-1", kind: "VID", title: "M1 · Purpose, Culture and the Certification Journey", meta: "Video · 22 min", desc: "Why POSH facilitation is a culture role before it is a compliance role, and what the certification journey asks of you." },
        { id: "l1-2", kind: "VID", title: "M2 · India's Evolving POSH Landscape", meta: "Video · 26 min", desc: "How expectations, judgments and workplace practice have shifted since 2013 — and what that means for trainers." },
        { id: "l1-3", kind: "VID", title: "M3 · Levitate CLEAR POSH Framework™", meta: "Video · 24 min", desc: "Clarity on the law, listening without judgment, evidence-based inquiry, action with fairness and a respectful workplace culture." },
        { id: "l1-4", kind: "PDF", title: "M4 · Genesis and Legal Foundation", meta: "Reading · 18 pages", desc: "Vishaka to the 2013 Act — the legal lineage every POSH facilitator should be able to explain from memory." },
      ],
    },
    {
      id: "s2", num: "02", title: "Week 2 · Recognition & Inquiry", release: "Unlocks after Live Session 3 · 3 October",
      lessons: [
        { id: "l2-1", kind: "VID", title: "M5 · Recognising Sexual Harassment", meta: "Video · 28 min", desc: "Behaviour patterns, grey areas and the language to use when describing them in a training room." },
        { id: "l2-2", kind: "VID", title: "M6 · Coverage, Definitions and Jurisdiction", meta: "Video · 21 min", desc: "Who is covered, what counts as a workplace today, and where jurisdiction begins and ends." },
        { id: "l2-3", kind: "VID", title: "M7 · Prevention and Internal Committee Governance", meta: "Video · 25 min", desc: "Constituting a credible IC, governance hygiene and the prevention work that reduces complaints." },
        { id: "l2-4", kind: "PDF", title: "M8 · Complaint Intake and Fair Inquiry", meta: "Reading · 22 pages", desc: "Intake, natural justice, evidence handling, witness conduct and writing a defensible inquiry report." },
      ],
    },
    {
      id: "s3", num: "03", title: "Week 3 · Practice & Certification", release: "Unlocks after Live Session 5 · 10 October",
      lessons: [
        { id: "l3-1", kind: "VID", title: "M9 · Compliance, Governance and Accountability", meta: "Video · 20 min", desc: "Annual reporting, policy hygiene, leadership accountability and the audit trail an organisation must keep." },
        { id: "l3-2", kind: "VID", title: "M10 · Applied Case Laboratory", meta: "Video · 32 min", desc: "Six real-shape cases worked end to end — the practice that separates a certified trainer from an informed one." },
        { id: "l3-3", kind: "VID", title: "M11 · Trainer Craft and Certification", meta: "Video · 27 min", desc: "Room management, handling resistance and hostile questions, and your final facilitation assessment brief." },
      ],
    },
  ],
  sessions: [
    { n: 1, day: "26", month: "Sep", date: "Sat 26 September", time: "6:00 – 8:00 PM", topic: "Foundations & the CLEAR framework" },
    { n: 2, day: "27", month: "Sep", date: "Sun 27 September", time: "6:00 – 8:00 PM", topic: "Legal genesis & applied definitions" },
    { n: 3, day: "03", month: "Oct", date: "Sat 3 October", time: "6:00 – 8:00 PM", topic: "Recognition, coverage & jurisdiction" },
    { n: 4, day: "04", month: "Oct", date: "Sun 4 October", time: "6:00 – 8:00 PM", topic: "IC governance & fair inquiry practice" },
    { n: 5, day: "10", month: "Oct", date: "Sat 10 October", time: "6:00 – 8:00 PM", topic: "Case laboratory · live inquiry simulation" },
    { n: 6, day: "11", month: "Oct", date: "Sun 11 October", time: "6:00 – 8:00 PM", topic: "Trainer craft & facilitation assessment" },
  ],
  quizzes: [
    {
      stage: "00", title: "Orientation check", badge: "Orientation Ready", glyph: "✦",
      questions: [
        {
          q: "What does the CLEAR POSH framework mainly give a trainer?",
          options: ["A structured way to move from the letter of the law to lived workplace practice", "A checklist for filing the annual return", "A template for writing IC minutes", "A legal defence strategy for the employer"],
          answer: 0,
          explanation: "CLEAR is a facilitation framework — Clarity on the law, Listening without judgment, Evidence-based inquiry, Action with fairness, and a Respectful culture.",
        },
        {
          q: "When does Week 1 content unlock in this programme?",
          options: ["Immediately after payment", "After Live Session 1 is marked complete", "After the final assessment", "Seven days after enrolment"],
          answer: 1,
          explanation: "Content is released in stages. Each stage unlocks only when its attached live session has been marked complete by the facilitator.",
        },
        {
          q: "Your certificate is issued when…",
          options: ["You have paid the fee in full", "You have watched any three modules", "All course content is complete and the required live sessions are attended", "You request it by email"],
          answer: 2,
          explanation: "Eligibility is recalculated from content progress and marked attendance. Both criteria must be met before issuance.",
        },
      ],
    },
    {
      stage: "01", title: "Week 1 · Legal Foundations", badge: "Legal Eagle", glyph: "§",
      questions: [
        {
          q: "Which Supreme Court judgment produced the Vishaka Guidelines?",
          options: ["Rupan Deol Bajaj v. K.P.S. Gill", "Vishaka v. State of Rajasthan (1997)", "Medha Kotwal Lele v. Union of India", "Apparel Export Promotion Council v. Chopra"],
          answer: 1,
          explanation: "Vishaka (1997) laid down binding guidelines in the absence of legislation — the direct legal ancestor of the 2013 Act.",
        },
        {
          q: "The POSH Act 2013 draws its constitutional basis primarily from…",
          options: ["Articles 14, 15, 19(1)(g) and 21", "Articles 32 and 226", "Articles 246 and 254", "Article 370"],
          answer: 0,
          explanation: "Equality, non-discrimination, the right to practise any profession and the right to life with dignity together form the constitutional foundation.",
        },
        {
          q: "Who qualifies as an “aggrieved woman” under the Act?",
          options: ["Only permanent employees", "Only women on the payroll of that employer", "Any woman, whether employed there or not, in relation to that workplace", "Only women who have completed probation"],
          answer: 2,
          explanation: "The definition is deliberately wide — visitors, clients, interns, contract and domestic workers are all covered in relation to that workplace.",
        },
        {
          q: "An Internal Committee must be constituted at every workplace with…",
          options: ["10 or more workers", "20 or more workers", "50 or more workers", "100 or more workers"],
          answer: 0,
          explanation: "Ten or more workers triggers the obligation. Below that threshold complaints go to the Local Committee.",
        },
      ],
    },
    {
      stage: "02", title: "Week 2 · Recognition & Inquiry", badge: "Inquiry Pro", glyph: "◈",
      questions: [
        {
          q: "What is the time limit for filing a complaint?",
          options: ["30 days from the incident", "3 months, extendable by a further 3 months", "1 year, no extension", "No limit at all"],
          answer: 1,
          explanation: "Three months from the incident (or the last in a series), which the IC may extend by three more months for recorded reasons.",
        },
        {
          q: "The inquiry must ordinarily be completed within…",
          options: ["30 days", "60 days", "90 days", "180 days"],
          answer: 2,
          explanation: "Ninety days for the inquiry; the report goes to the employer within ten days of completion.",
        },
        {
          q: "Which of these is NOT acceptable inquiry practice?",
          options: ["Giving both parties a fair opportunity to be heard", "Circulating the complainant’s statement on a team email group", "Documenting evidence and witness statements", "Allowing a support person during proceedings"],
          answer: 1,
          explanation: "Confidentiality is a statutory duty. Disclosure of the complaint, identities or proceedings attracts penalty under Section 16.",
        },
        {
          q: "Conciliation under Section 10 may be attempted…",
          options: ["Whenever the employer prefers it", "Only if the aggrieved woman requests it, and never as a monetary settlement", "Always, before any inquiry", "Only after the inquiry concludes"],
          answer: 1,
          explanation: "It is her choice alone, and no monetary settlement may form the basis of conciliation.",
        },
      ],
    },
    {
      stage: "03", title: "Week 3 · Practice & Certification", badge: "Trainer Craft", glyph: "✪",
      questions: [
        {
          q: "The annual report of the IC is submitted to…",
          options: ["The District Officer", "The Labour Commissioner only", "The Ministry of Corporate Affairs", "The National Commission for Women"],
          answer: 0,
          explanation: "The IC reports annually to the employer and the District Officer; listed companies also disclose in the Board report.",
        },
        {
          q: "A participant says “this law is misused”. The strongest facilitator response is to…",
          options: ["Shut the question down as inappropriate", "Agree, to keep the room comfortable", "Acknowledge the concern, then bring the room back to data, process and safeguards", "Ask the participant to leave the session"],
          answer: 2,
          explanation: "Naming the concern keeps credibility; redirecting to evidence and the safeguards in the Act keeps the room accurate.",
        },
        {
          q: "Employer obligations under the Act include…",
          options: ["Only constituting an IC", "Displaying penal consequences, organising awareness and assisting the IC", "Investigating complaints personally", "Reporting every complaint to the police"],
          answer: 1,
          explanation: "Section 19 lists a safe environment, display of consequences, awareness programmes, IC facilitation and assistance in securing evidence.",
        },
        {
          q: "A complaint against an employer, or where no IC exists, goes to…",
          options: ["The Internal Committee of a sister company", "The Local Committee", "The State Women’s Commission", "The company’s legal team"],
          answer: 1,
          explanation: "The Local Committee constituted by the District Officer has jurisdiction in both situations.",
        },
        {
          q: "In a training room, confidentiality means…",
          options: ["Never mentioning any case at all", "Sharing case details to make the session vivid", "Using only anonymised facts, and never identities or inquiry contents", "Sharing outcomes with managers afterwards"],
          answer: 2,
          explanation: "Anonymised, de-identified case shapes teach well and stay lawful. Only justice-served information may be published, without identities.",
        },
      ],
    },
  ],
  finalKit: [
    { title: "POSH trainer session plans (employee, manager, IC)", meta: "PDF · 34 pages" },
    { title: "Case study pack with facilitator notes", meta: "PDF · 26 pages" },
    { title: "IC inquiry templates and report formats", meta: "PDF · 18 pages" },
    { title: "Handling difficult questions — trainer FAQ", meta: "PDF · 12 pages" },
  ],
};

export const curriculumBySlug = (slug: string) =>
  slug === POSH_CURRICULUM.slug ? POSH_CURRICULUM : null;
