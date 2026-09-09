/**
 * The PoSH TTT course as it is taught in the LMS.
 *
 * Authored from "LMS PoSH Content.docx" and the handouts supplied beside it.
 * This takes precedence over the curriculum-derived content, because the
 * curriculum describes the syllabus while this is the material a learner
 * actually works through.
 *
 * Two rules from the brief shape the structure:
 *
 *  - Sections are named for the session, not "Module 1, Module 2". A learner
 *    scanning the rail should see what they are about to study.
 *  - Modules with "no specific documents" against them — 1, 2 and 9 — are not
 *    here. They are taught live from the presentation flow and would show as
 *    empty sections with nothing to open.
 *
 * Where the brief names material that has not been supplied yet, the section
 * exists and says so rather than pretending to hold it.
 */

import type { CourseContent } from "./courseContent";

const A = "/assets/posh";

export const POSH_CONTENT: CourseContent = {
  slug: "posh-trainer",
  title: "PoSH & Workplace Dignity Facilitator Program (PoSH TTT)",
  intro:
    "Fifteen learning hours — twelve live with the founder, three guided here. Work through each item in order; the next one opens as you finish the one before it.",

  modules: [
    /* ------------------------------------------------------------------ */
    {
      id: "orientation",
      title: "Orientation and Pre-read",
      summary: "Read before the first live session.",
      items: [
        {
          id: "p-orientation-agreement",
          kind: "reading",
          title: "Certification Journey & Sensitive Learning Room Agreement",
          minutes: 10,
          meta: "Reading · to be signed",
          body: [
            "Read this before the first live session, then sign and return it. The programme deals with sensitive workplace situations and asks for thoughtful, respectful participation from everyone in the room.",
            "## Your certification journey",
            "The certification is based on demonstrated learning and application, not attendance alone. It moves through six stages: PREPARE — complete the pre-reading, diagnostic learning and legal baseline. LEARN — build understanding of the law, prevention, reporting, governance and inquiry. PRACTISE — apply the learning through scenarios, case analysis, worksheets and facilitation tasks. DEMONSTRATE — show your knowledge and facilitation capability through assessment. IMPROVE — use facilitator and assessor feedback to strengthen your practice. APPLY — transfer the learning into responsible workplace and training practice.",
            "## How we will learn",
            "Present, participate, practise. Present: build accurate knowledge and make complex concepts understandable. Participate: question, discuss, reflect and test assumptions respectfully. Practise: apply the learning to realistic workplace situations and facilitator tasks.",
            "## The learning room",
            "PoSH learning involves sensitive, personal and emotionally difficult subject matter. The agreement creates a room in which delegates can ask questions, challenge assumptions and practise difficult conversations without compromising dignity or procedural fairness — protecting privacy, challenging ideas rather than people, and avoiding both victim-blaming and respondent-bashing.",
          ],
          files: [
            {
              title: "Certification Journey & Sensitive Learning Room Agreement",
              meta: "Word document · sign and return",
              href: `${A}/certification-journey-and-learning-agreement.docx`,
            },
          ],
        },
        {
          id: "p-orientation-dignity",
          kind: "reading",
          title: "Dignity, Respect and Psychological Safety",
          minutes: 12,
          meta: "PDF · 2 pages",
          body: [
            "The ground the whole programme stands on: what dignity and respect mean in practice at work, and why psychological safety is what makes a PoSH conversation possible at all.",
            "Read it before the first session. It is short, and the live discussion assumes it.",
          ],
          files: [
            { title: "Dignity, Respect and Psychological Safety", meta: "PDF · 2 pages", href: `${A}/dignity-respect-psychological-safety.pdf` },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "clear-framework",
      title: "The CLEAR PoSH Framework",
      summary: "The framework you will facilitate with, and how to hold the room.",
      items: [
        {
          id: "p-clear-handout",
          kind: "reading",
          title: "The CLEAR PoSH Framework handout",
          minutes: 15,
          meta: "PDF · 5 pages",
          body: [
            "The framework the programme facilitates with, set out for use in a training room rather than on a slide.",
            "It covers how to explain unwelcome conduct, consent, context and impact — and works through what to say when a participant offers the most common objection in the room: “People are becoming too sensitive. It was only a joke, and there was no bad intention.”",
            "The point of that worked example is not to ban humour. It is to show how a facilitator keeps the discussion open while making clear that humour can cross a workplace boundary when it is sexual or gendered.",
          ],
          files: [
            { title: "CLEAR PoSH Framework handout", meta: "PDF · 5 pages", href: `${A}/clear-posh-framework-handout.pdf` },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "genesis",
      title: "Genesis and Legal Foundation",
      summary: "Where the law came from, and why that story matters in the room.",
      items: [
        {
          id: "p-genesis-film",
          kind: "reading",
          title: "Bhanwari Devi and the road to the PoSH Act",
          minutes: 8,
          meta: "Reading · film to follow",
          body: [
            "Every PoSH facilitator should be able to explain the lineage from memory: the assault on Bhanwari Devi, the petition that followed, the Vishaka Guidelines the Supreme Court laid down in 1997, and the sixteen years between those guidelines and the 2013 Act that replaced them.",
            "It matters in a training room because it answers the question participants actually ask — why does this law exist, and why in these words.",
            "A film on this — “Sexual Harassment At The Workplace In India | #MakeMyWorkplaceSafe” — is being added to this section.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "recognising",
      title: "Recognising Sexual Harassment",
      summary: "Telling a PoSH concern from other misconduct, and from too little information.",
      items: [
        {
          id: "p-recognising-guide",
          kind: "reading",
          title: "Recognising Sexual Harassment — quick reference",
          minutes: 12,
          meta: "PDF · 2 pages",
          body: [
            "Behaviour patterns, grey areas, and the language to use when describing them in a training room.",
            "Keep this one to hand while you work through the scenarios that follow.",
          ],
          files: [
            { title: "Recognising Sexual Harassment — quick reference guide", meta: "PDF · 2 pages", href: `${A}/recognising-sexual-harassment-quick-reference.pdf` },
          ],
        },
        {
          id: "p-recognising-apply",
          kind: "reading",
          title: "Apply your learning: PoSH, other misconduct, or more information?",
          minutes: 15,
          meta: "Practice · 2 scenarios",
          body: [
            "For each scenario, decide which response best reflects the facts currently available, then write down the fact, context or missing information that led you there. The purpose is not to rush to a label. It is to practise disciplined recognition.",
            "The three responses: A — a potential PoSH concern, where the facts may require consideration under the PoSH framework. B — another workplace issue, where the conduct appears non-sexual on the facts given. C — more information needed, where the available facts are not enough for a responsible conclusion.",
            "## Scenario 1 — repeated contact after a clear no",
            "A colleague repeatedly asks another employee out. She clearly says she is not interested and asks him to stop. He stops asking, but then begins staring at her persistently during meetings, in lifts and in common areas.",
            "## Scenario 2 — public performance criticism",
            "A manager tells an employee in front of the team that he is incompetent, lazy and needs to improve his work. The exchange is humiliating and inappropriate, but no sexual comments, gestures or conduct are described.",
            "Bring your reasoning to the live session — the discussion is where this activity pays off.",
          ],
        },
        {
          id: "p-recognising-v1",
          kind: "video",
          title: "Awareness film — 1 of 4",
          minutes: 6,
          videoId: "nNwrPjV3P38",
        },
        {
          id: "p-recognising-v2",
          kind: "video",
          title: "Awareness film — 2 of 4",
          minutes: 6,
          videoId: "MjRcjAkb8_4",
        },
        {
          id: "p-recognising-v3",
          kind: "video",
          title: "Awareness film — 3 of 4",
          minutes: 6,
          videoId: "gmFyzVlBiR4",
        },
        {
          id: "p-recognising-v4",
          kind: "video",
          title: "Awareness film — 4 of 4",
          minutes: 6,
          videoId: "i5zSD6xve4w",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "coverage",
      title: "Coverage, Definitions and Jurisdiction",
      summary: "Who is covered, what counts as a workplace, and where jurisdiction ends.",
      items: [
        {
          id: "p-coverage-guide",
          kind: "reading",
          title: "PoSH coverage and jurisdiction — quick reference",
          minutes: 12,
          meta: "PDF · 2 pages",
          body: [
            "Who the Act covers, what counts as a workplace once work happens on the road, in transport and on a video call, and where jurisdiction begins and ends.",
            "This is the section participants most often get wrong, so be able to answer it without reaching for a note.",
          ],
          files: [
            { title: "PoSH Coverage and Jurisdiction — quick reference guide", meta: "PDF · 2 pages", href: `${A}/posh-coverage-and-jurisdiction-quick-reference.pdf` },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "prevention",
      title: "Prevention and Internal Committee Governance",
      summary: "Constituting a credible IC, and the prevention work that reduces complaints.",
      items: [
        {
          id: "p-ic-checklist",
          kind: "reading",
          title: "Internal Committee — quick reference checklist",
          minutes: 12,
          meta: "PDF · 2 pages",
          body: [
            "Composition, the external member, the presiding officer, tenure and the governance hygiene that makes an Internal Committee credible before a complaint ever arrives.",
            "Useful twice over: in the training room, and the first time an organisation asks you to review their own committee.",
          ],
          files: [
            { title: "Internal Committee — quick reference checklist", meta: "PDF · 2 pages", href: `${A}/internal-committee-quick-reference-checklist.pdf` },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "inquiry",
      title: "Complaint Intake and Fair Inquiry",
      summary: "From the moment a complaint arrives to a report that holds up.",
      items: [
        {
          id: "p-intake-guide",
          kind: "reading",
          title: "Complaint intake and fair inquiry — process guide",
          minutes: 15,
          meta: "PDF · 2 pages",
          body: [
            "Intake, timelines, natural justice, evidence handling and witness conduct — the sequence an inquiry has to follow, and the points at which it most often goes wrong.",
          ],
          files: [
            { title: "Complaint Intake and Fair Inquiry — quick process guide", meta: "PDF · 2 pages", href: `${A}/complaint-intake-and-fair-inquiry-process-guide.pdf` },
          ],
        },
        {
          id: "p-report-checklist",
          kind: "reading",
          title: "Inquiry report structure — checklist",
          minutes: 10,
          meta: "PDF · 2 pages",
          body: [
            "What a defensible inquiry report contains, in the order it belongs. Findings have to be reasoned on the record; this is the structure that makes that visible.",
          ],
          files: [
            { title: "Inquiry Report Structure — quick checklist", meta: "PDF · 2 pages", href: `${A}/inquiry-report-structure-checklist.pdf` },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "additional-videos",
      title: "Additional Videos",
      summary: "Further viewing, alongside the programme.",
      items: [
        { id: "p-extra-v1", kind: "video", title: "Further viewing — 1 of 2", minutes: 8, videoId: "kkS6FcRIAMc" },
        { id: "p-extra-v2", kind: "video", title: "Further viewing — 2 of 2", minutes: 8, videoId: "uts4F3RHjhM" },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "case-laboratory",
      title: "Case Laboratory",
      summary: "Cases worked end to end.",
      items: [
        {
          id: "p-case-lab",
          kind: "reading",
          title: "Case Laboratory",
          minutes: 5,
          meta: "Materials in preparation",
          body: [
            "The Case Laboratory takes real-shape cases from intake to reasoned finding — the practice that separates a certified trainer from an informed one.",
            "The case pack is being prepared and will appear in this section. The live laboratory session runs regardless; this is where the written cases will sit afterwards.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "toolkit",
      title: "Trainer Toolkit",
      summary: "What you take away to run your own sessions.",
      items: [
        {
          id: "p-toolkit",
          kind: "reading",
          title: "Trainer Toolkit",
          minutes: 5,
          meta: "Materials in preparation",
          body: [
            "Session plans, slide decks, facilitation guides and templates — the material you use to run PoSH sessions of your own once you are certified.",
            "The toolkit is being assembled and will appear here. Everything in it is yours to use in your own practice.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "assessment",
      title: "Final Assessment",
      summary: "Twenty questions across the whole programme.",
      items: [
        {
          id: "p-final-assessment",
          kind: "quiz",
          title: "PoSH Final Assessment",
          minutes: 30,
          meta: "Quiz · 20 questions",
          questions: [
            { q: "The PoSH Act was enacted in which year?", options: ["1997", "2005", "2013", "2018"], answer: 2, explanation: "The Act was passed in 2013, sixteen years after the Vishaka Guidelines of 1997." },
            { q: "Which is an important element of sexual harassment under the PoSH Act?", options: ["Conduct must be intentional", "Conduct must be unwelcome", "Conduct must happen repeatedly", "Conduct must happen inside the office"], answer: 1, explanation: "Unwelcomeness is central. Intent, repetition and location are context, not the test." },
            { q: "Sexual harassment may include:", options: ["Physical conduct only", "Verbal conduct only", "Physical, verbal and non-verbal conduct", "Written complaints only"], answer: 2, explanation: "The definition covers physical, verbal and non-verbal conduct alike." },
            { q: "An Internal Committee is required where a workplace has:", options: ["5 or more employees", "10 or more employees", "20 or more women employees", "50 or more employees"], answer: 1, explanation: "Ten or more employees, counted without reference to gender." },
            { q: "Where a workplace has fewer than 10 employees, the complaint may ordinarily be made to:", options: ["Internal Committee", "Local Committee", "Finance Department", "Board of Directors"], answer: 1, explanation: "The Local Committee exists for exactly this, and for complaints against the employer." },
            { q: "Which of the following may be considered part of the workplace?", options: ["Official travel", "Employer-provided transport", "Work-related virtual meetings", "All of the above"], answer: 3, explanation: "The workplace extends to wherever work takes the employee, transport and virtual settings included." },
            { q: "A PoSH complaint should ordinarily be made within:", options: ["30 days", "3 months", "6 months", "1 year"], answer: 1, explanation: "Three months from the incident, extendable by a further three where the committee is satisfied there was reason for the delay." },
            { q: "A copy of the complaint should ordinarily be sent to the respondent within:", options: ["3 working days", "7 working days", "15 working days", "30 working days"], answer: 1, explanation: "Seven working days — the respondent cannot answer a case they have not seen." },
            { q: "The inquiry should ordinarily be completed within:", options: ["30 days", "60 days", "90 days", "180 days"], answer: 2, explanation: "Ninety days for the inquiry itself." },
            { q: "Conciliation may be considered:", options: ["At the request of the aggrieved woman", "Automatically in every case", "Only after inquiry", "Only by the employer"], answer: 0, explanation: "Only at her request. It is never imposed and never the default." },
            { q: "Natural justice requires:", options: ["Supporting only the complainant", "Supporting only the respondent", "Fair opportunity for both parties to be heard", "Management deciding the outcome"], answer: 2, explanation: "Both parties are heard, both see the material against them, and the decision-maker is impartial." },
            { q: "Failure to prove a complaint automatically means it was malicious.", options: ["True", "False"], answer: 1, explanation: "False, and this is the distinction facilitators must be clearest about. A complaint that cannot be proved is not thereby a false one." },
            { q: "The primary role of the Internal Committee during an inquiry is to:", options: ["Prove the complainant is correct", "Protect the respondent", "Conduct a fair inquiry and arrive at reasoned findings", "Protect the organisation's reputation"], answer: 2, explanation: "The committee's duty is to the process, not to either party or to the organisation's reputation." },
            { q: "Which of the following should not form the basis of conciliation under PoSH?", options: ["Apology", "Behavioural commitments", "Monetary settlement", "Appropriate non-monetary resolution"], answer: 2, explanation: "A monetary settlement may not be the basis of conciliation." },
            { q: "Which of the following may be considered as an interim measure during an inquiry?", options: ["Transfer of the complainant or respondent", "Leave for the aggrieved woman as provided under the process", "Restricting the respondent from reporting on the complainant's work performance where appropriate", "All of the above"], answer: 3, explanation: "All three are available as interim measures while an inquiry is under way." },
            { q: "If an allegation cannot be substantiated because there is insufficient evidence:", options: ["The complaint must automatically be treated as malicious", "The complainant must automatically be penalised", "Lack of evidence alone does not establish a malicious or false complaint", "The respondent must receive compensation"], answer: 2, explanation: "Malice has to be established on its own footing, separately and on evidence." },
            { q: "Which information is expected to remain confidential under the PoSH process?", options: ["Identity of the complainant", "Identity of the respondent and witnesses", "Inquiry proceedings and recommendations", "All of the above"], answer: 3, explanation: "Confidentiality covers all parties, the proceedings and the recommendations." },
            { q: "Which of the following is one responsibility of an employer under PoSH?", options: ["Conduct awareness programmes", "Maintain a safe working environment", "Display relevant PoSH information", "All of the above"], answer: 3, explanation: "All three, and they are obligations rather than good practice." },
            { q: "Is an External Member required as part of the Internal Committee under the PoSH Act?", options: ["Yes", "No", "Only if a complaint is received", "Only in organisations with more than 100 employees"], answer: 0, explanation: "Yes — an external member is required, and their independence is the point of them." },
            { q: "Who should ordinarily be appointed as the Presiding Officer of the Internal Committee?", options: ["Any senior employee", "A senior woman employee", "The External Member", "The HR Manager only"], answer: 1, explanation: "A senior woman employee at the workplace." },
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "feedback",
      title: "Delegate Feedback",
      summary: "Tell us how the programme went.",
      items: [
        {
          id: "p-feedback",
          kind: "reading",
          title: "Delegate Feedback Form",
          minutes: 5,
          meta: "Feedback",
          body: [
            "Your feedback shapes the next cohort, so please give it honestly.",
            "We ask you to rate five things from 1 (poor) to 5 (excellent): programme content, facilitator knowledge and delivery, practical examples and activities, relevance to your professional role, and the overall learning experience.",
            "Then three questions in your own words: what was the most useful part of the programme, what could we improve, and how confident do you feel now — very confident, confident, or needing more practice.",
            "The form is sent to you by email at the end of the programme.",
          ],
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "certificate",
      title: "Your Certificate",
      summary: "What you receive, and what it takes to receive it.",
      items: [
        {
          id: "p-certificate",
          kind: "reading",
          title: "Your certificate",
          minutes: 5,
          meta: "Completion",
          body: [
            "On completing the programme you receive two certificates: a Levitate PeopleSoft Certificate of Training Completion carrying a verifiable certificate ID, the completion date and the programme hours, and a SHRM Certificate of Completion showing the Professional Development Credits earned toward SHRM-CP® and SHRM-SCP® recertification.",
            "Certification follows demonstrated learning rather than attendance alone — the assessment and the facilitation practice are what it rests on.",
            "Certificates are issued after the final assessment and the delegate feedback are both in.",
          ],
        },
      ],
    },
  ],

  readingKit: [
    { title: "CLEAR PoSH Framework handout", meta: "PDF · 5 pages", href: `${A}/clear-posh-framework-handout.pdf` },
    { title: "Recognising Sexual Harassment — quick reference", meta: "PDF · 2 pages", href: `${A}/recognising-sexual-harassment-quick-reference.pdf` },
    { title: "PoSH Coverage and Jurisdiction — quick reference", meta: "PDF · 2 pages", href: `${A}/posh-coverage-and-jurisdiction-quick-reference.pdf` },
    { title: "Internal Committee — quick reference checklist", meta: "PDF · 2 pages", href: `${A}/internal-committee-quick-reference-checklist.pdf` },
    { title: "Complaint Intake and Fair Inquiry — process guide", meta: "PDF · 2 pages", href: `${A}/complaint-intake-and-fair-inquiry-process-guide.pdf` },
    { title: "Inquiry Report Structure — checklist", meta: "PDF · 2 pages", href: `${A}/inquiry-report-structure-checklist.pdf` },
    { title: "Dignity, Respect and Psychological Safety", meta: "PDF · 2 pages", href: `${A}/dignity-respect-psychological-safety.pdf` },
  ],
};
