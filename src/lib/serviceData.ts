// Per-service page content, ported from ServicePage.dc.html
import type { ServiceKey } from "./site";

export type ServicePageData = {
  crumb: string;
  eyebrow: string;
  title: string;
  lede: string;
  img: string;
  facts: { k: string; v: string }[];
  introHeading: string;
  intro: string[];
  outcomes: string[];
  bestFor: string;
  deliverTitle: string;
  deliverables: string[];
  listEyebrow: string;
  listHeading: string;
  listGrid: string;
  items: { num: string; t: string; d: string }[];
  processEyebrow: string;
  processHeading: string;
  process: { num: string; title: string; desc: string }[];
  certEyebrow: string;
  certHeading: string;
  certBody: string;
  certNotes: { t: string; d: string }[];
  certLabel: string;
  certName: string;
  certLine1: string;
  certLine2: string;
  certLine3: string;
  certProgram: string;
  certCaption: string;
  audience: string[];
  formHeading: string;
  formSub: string;
  orgLabel: string;
  orgPlaceholder: string;
  pickLabel: string;
  options: string[];
  msgPlaceholder: string;
  formButton: string;
  faqs: { q: string; a: string }[];
};

export const PAGES: Record<ServiceKey, ServicePageData> = {
  ttt: {
    crumb: "Train-the-Trainer",
    eyebrow: "01 · Train-the-Trainer Certifications",
    title: "Train-the-Trainer Certification Programs",
    lede: "Practice-led facilitator certifications for professionals who want to build capability, credibility and confidence as trainers, facilitators and trusted voices in workplace learning.",
    img: "/assets/founder-speaking.jpeg",
    facts: [{ k: "Format", v: "Live · 2–4 days" }, { k: "Cohort", v: "12–25 participants" }, { k: "Assessment", v: "Practice + written" }, { k: "Credential", v: "Certificate + ID" }],
    introHeading: "Certification built for facilitators, not slide-readers",
    intro: [
      "Six pathways cover the conversations workplaces most struggle to hold well: leadership, inclusion, wellbeing, POSH, POCSO and future HR readiness. Each is designed around the practical reality of standing in front of a room — not around theory decks.",
      "Every cohort runs on live facilitation practice. Participants design a session segment, deliver it, receive structured feedback from the faculty and peers, then re-run it. Difficult-question drills, resistance handling and case-based discussion are built into each day.",
      "Certification is linked to participation, practice, reflection and assessment — not attendance. Participants leave with a session plan they have already delivered once, and a toolkit they can reuse in their own organization from the following week.",
    ],
    outcomes: ["Design a session from outcome backwards", "Facilitate practice with live feedback", "Handle resistance and difficult questions", "Use workplace cases, not generic examples", "Adapt content across seniority levels", "Assess and debrief participant learning"],
    bestFor: "HR professionals, L&D leaders, managers, educators, consultants, coaches, trainers, psychologists, counsellors, HR students and aspiring workplace facilitators.",
    deliverTitle: "What participants receive",
    deliverables: ["Facilitator guide and slide master for the chosen pathway", "Case-study pack drawn from real workplace situations", "Sample session plans (60-min, half-day, full-day)", "Difficult-questions FAQ and resistance playbook", "Certificate with unique verification ID"],
    listEyebrow: "Certification pathways",
    listHeading: "Six certification programs across the conversations workplaces need most",
    listGrid: "repeat(3,1fr)",
    items: [
      { num: "01", t: "Certified Corporate Leadership Facilitator", d: "Powered by the HUMAN Leadership Framework — facilitate leadership conversations on trust, coaching, feedback, accountability and team growth." },
      { num: "02", t: "Certified Inclusive Workplace Facilitator", d: "DEI Train-the-Trainer — lead conversations on inclusion, unconscious bias, belonging and psychological safety, including managing resistance." },
      { num: "03", t: "Certified Workplace Wellbeing Facilitator", d: "Applied mental health and wellbeing — facilitate stress, burnout and psychological safety conversations with sensitivity and ethical boundaries." },
      { num: "04", t: "Certified POSH & Workplace Dignity Facilitator", d: "POSH Train-the-Trainer — awareness sessions, manager sensitisation and IC capability building with legal clarity and facilitation maturity." },
      { num: "05", t: "Certified POCSO & Child Safety Facilitator", d: "POCSO Train-the-Trainer — age-appropriate, institution-sensitive child-safety sessions and responsible reporting conversations." },
      { num: "06", t: "HR Edge Certification", d: "Integrated DEI, POSH and wellbeing certification for MBA-HR, PGDM-HR students and early-career HR professionals." },
    ],
    processEyebrow: "How certification runs",
    processHeading: "From enrolment to a credential you can stand behind",
    process: [
      { num: "1", title: "Enrol & orient", desc: "A short discovery conversation confirms the right pathway. Pre-reading and a self-assessment set the baseline before day one." },
      { num: "2", title: "Learn the content", desc: "Faculty-led sessions build subject depth — concepts, legal clarity where applicable, workplace cases and the boundaries of the facilitator role." },
      { num: "3", title: "Facilitate & be coached", desc: "Each participant designs and delivers a live session segment, then receives structured feedback from faculty and peers and re-runs it." },
      { num: "4", title: "Assess & certify", desc: "Assessment covers practice, reflection and a written component. Certificates carry a unique verification ID on successful completion." },
    ],
    certEyebrow: "Your credential",
    certHeading: "A certificate that reflects practice, not presence",
    certBody: "On successful completion, participants receive a Levitate PeopleSoft facilitator certificate naming the specific pathway completed, with a unique verification ID and the assessment basis stated on the credential.",
    certNotes: [
      { t: "Pathway-specific", d: "The certificate names the exact certification completed — leadership, DEI, wellbeing, POSH, POCSO or HR Edge." },
      { t: "Assessment-linked", d: "Issued on participation, facilitation practice, reflection and assessment — never on attendance alone." },
      { t: "Verifiable", d: "Each certificate carries a unique ID your employer or client can verify with us." },
    ],
    certLabel: "Train-the-Trainer Certification",
    certName: "Participant Name",
    certLine1: "This certifies that",
    certLine2: "has successfully completed the",
    certLine3: "including facilitation practice, reflection and assessment",
    certProgram: "Certified Corporate Leadership Facilitator Program",
    certCaption: "sample credential — pathway name reflects the program completed",
    audience: ["HR professionals", "L&D leaders", "People managers", "Educators", "Consultants", "Coaches", "Independent trainers", "Psychologists & counsellors", "HR students"],
    formHeading: "Enquire about a certification pathway",
    formSub: "Tell us your experience and goals — we will recommend the right pathway and share the next cohort dates.",
    orgLabel: "Organization (optional)",
    orgPlaceholder: "Where you work",
    pickLabel: "Which pathway interests you most? *",
    options: ["Corporate Leadership", "DEI", "Wellbeing", "POSH", "POCSO", "HR Edge", "Not sure yet"],
    msgPlaceholder: "Your facilitation experience so far, and what you want to be able to run",
    formButton: "Send certification enquiry",
    faqs: [
      { q: "Do I need prior training experience?", a: "No. Cohorts include first-time facilitators and experienced trainers. The practice feedback is calibrated to where you start — what matters is willingness to facilitate live during the program." },
      { q: "How long does certification take?", a: "Most pathways run across 2–4 days of live sessions, with pre-reading before and an assessment submission after. Exact structure depends on the pathway." },
      { q: "Can I run sessions in my organization afterwards?", a: "Yes — that is the point. You leave with a facilitator guide, slide master, case pack and session plans for the pathway you complete." },
    ],
  },
  corporate: {
    crumb: "Corporate Training",
    eyebrow: "02 · Corporate Training Solutions",
    title: "Customized Learning Interventions for Modern Workplaces",
    lede: "Practical, outcome-focused training interventions that strengthen leadership, communication, collaboration, workplace culture and people capability — designed around your business context.",
    img: "/assets/audience-red-hall.jpeg",
    facts: [{ k: "Scoping", v: "TNA-led" }, { k: "Delivery", v: "In-person · online · blended" }, { k: "Group size", v: "15–150 per batch" }, { k: "Measurement", v: "Pre/post indicators" }],
    introHeading: "Not one-size-fits-all workshops",
    intro: [
      "Every intervention begins with understanding the business context, participant profile, team challenges and desired behavioural outcomes. We would rather run a shorter, sharper program on the two behaviours that matter than a generic three-day catalogue module.",
      "Programs are built around your own scenarios. We collect real (anonymised) situations from managers and HR during scoping and write them into the case discussions, so participants recognise the problem in the room.",
      "Delivery is flexible — in-person, live online or blended, across single-site or multi-location cohorts. Where useful, we run manager and team sessions in sequence so language and expectations line up on both sides.",
    ],
    outcomes: ["Programs scoped to real capability gaps", "Your own workplace scenarios written in", "Manager and team sessions in sequence", "Practical tools managers keep using", "Pre/post indicators to show movement", "Action plans owned by participants"],
    bestFor: "Organizations building people capability across levels — from senior leadership to first-time managers — including teams in growth, change or culture transformation.",
    deliverTitle: "What the engagement includes",
    deliverables: ["Training Needs Analysis summary and program design note", "Customized session materials and participant workbooks", "Facilitated delivery across agreed cohorts and locations", "Manager action-plan templates and follow-through prompts", "Post-program feedback report with observations and recommendations"],
    listEyebrow: "Key training areas",
    listHeading: "Seven capability areas we deliver against",
    listGrid: "repeat(4,1fr)",
    items: [
      { num: "01", t: "Leadership & Manager Capability", d: "Delegation, coaching skills, feedback conversations, accountability, prioritization, one-on-ones, decision-making and team development." },
      { num: "02", t: "Communication & Professional Presence", d: "Business communication, interpersonal effectiveness, presentation skills, email etiquette, stakeholder communication and professional confidence." },
      { num: "03", t: "Team Collaboration & Culture Building", d: "Teamwork, trust, collaboration, conflict handling, cross-functional working, ownership and team effectiveness." },
      { num: "04", t: "Personality Development & Effectiveness", d: "Self-awareness, confidence, workplace behaviour, professional etiquette, adaptability, ownership and personal effectiveness." },
      { num: "05", t: "Workplace Wellbeing & Psychological Safety", d: "Stress awareness, burnout prevention, emotional wellbeing, psychological safety, manager sensitivity and supportive practices." },
      { num: "06", t: "Diversity, Equity & Inclusion", d: "Inclusive leadership, unconscious bias, respectful behaviour, gender sensitivity, belonging, allyship and everyday workplace inclusion." },
      { num: "07", t: "POSH & Workplace Dignity", d: "POSH awareness, manager sensitisation, Internal Committee capability building and respectful workplace behaviour programs with legal clarity." },
    ],
    processEyebrow: "The Levitate Learning Blueprint",
    processHeading: "Learning that begins with context and ends with workplace application",
    process: [
      { num: "1", title: "Diagnose", desc: "Business context, participant profile, capability gaps and workplace challenges — via stakeholder discussions, Training Needs Analysis, role expectations and surveys." },
      { num: "2", title: "Design", desc: "Insights become a focused learning journey: outcomes, modules, format, case scenarios and materials aligned to your teams and language." },
      { num: "3", title: "Facilitate", desc: "Interactive delivery with real workplace cases, role plays, reflection, group discussion and practical tools that keep participants involved." },
      { num: "4", title: "Measure", desc: "Feedback, pre/post indicators, action plans, manager inputs and outcome reviews — so learning shows up as visible behaviour." },
    ],
    certEyebrow: "Participation record",
    certHeading: "Recognition your employees can keep on file",
    certBody: "Participants in corporate interventions receive a certificate of participation naming the specific program delivered for your organization — useful for internal L&D records, appraisal evidence and compliance documentation where applicable.",
    certNotes: [
      { t: "Named to your program", d: "The credential carries the exact intervention title delivered for your organization and the delivery period." },
      { t: "Compliance-friendly", d: "For POSH and dignity programs, records are structured to support your internal compliance documentation." },
      { t: "L&D reporting", d: "Issued alongside a feedback report you can take into your own L&D and appraisal reviews." },
    ],
    certLabel: "Certificate of Participation",
    certName: "Employee Name",
    certLine1: "This certifies that",
    certLine2: "participated in the",
    certLine3: "delivered for your organization by Levitate PeopleSoft",
    certProgram: "Leadership & Manager Capability Program",
    certCaption: "sample record — program name reflects your customized intervention",
    audience: ["Senior leadership teams", "Middle & people managers", "First-time managers", "Emerging leaders", "Project managers & team leads", "HR and L&D teams", "Cross-functional teams", "Client-facing teams", "High-potential employees"],
    formHeading: "Request a customized training proposal",
    formSub: "Share your context and we will come back with a scoped program outline, format options and commercials.",
    orgLabel: "Organization *",
    orgPlaceholder: "Company name",
    pickLabel: "Primary capability area *",
    options: ["Leadership & managers", "Communication", "Collaboration & culture", "Wellbeing", "DEI", "POSH", "Multiple areas"],
    msgPlaceholder: "Team profile, capability gaps, timelines and any internal drivers behind this",
    formButton: "Request a proposal",
    faqs: [
      { q: "How quickly can a program be designed and delivered?", a: "A focused single-topic program can be scoped and delivered in 2–3 weeks. Multi-cohort or multi-location interventions typically need 4–6 weeks from first conversation." },
      { q: "Do you deliver across multiple locations?", a: "Yes. We run multi-city and multi-batch rollouts, and mix in-person and live online delivery where geography or shift patterns require it." },
      { q: "How do you show the program worked?", a: "Through pre- and post-learning indicators, participant action plans, manager inputs and an outcome review after delivery — reported back to you in writing." },
    ],
  },
  institutional: {
    crumb: "Institutional Training",
    eyebrow: "03 · Institutional Training",
    title: "From Campus to Career: Preparing Students for Professional Success",
    lede: "HR-led programs for colleges, universities, business schools and professional institutions that turn academic learning into corporate readiness.",
    img: "/assets/students-group.png",
    facts: [{ k: "Format", v: "1–5 day modules" }, { k: "Cohort", v: "Up to 150 students" }, { k: "Practice", v: "Mock interviews & GDs" }, { k: "Credential", v: "Participation / HR Edge" }],
    introHeading: "What employers look for beyond the degree",
    intro: [
      "Our student programs build communication skills, professional conduct, interview preparedness, career clarity and a practical understanding of what organizations expect in the first two years of a career.",
      "Sessions are run by practitioners who have sat on the hiring side of the table. Students get mock interviews with real HR feedback, group-discussion practice, resume review and a candid view of how they come across to a recruiter.",
      "Programs are scheduled around the placement calendar — pre-placement readiness, internship preparation, or a semester-long track. For HR postgraduates, the HR Edge Certification adds an applied credential beyond the degree.",
    ],
    outcomes: ["Interview-ready introductions and answers", "Resumes reviewed against recruiter expectations", "Group-discussion and presentation practice", "Clarity on workplace norms and etiquette", "Confidence in professional communication", "An applied credential for HR students"],
    bestFor: "Final-year UG/PG students, placement and internship-readiness cohorts, early-career professionals, and MBA-HR / PGDM-HR students for the HR Edge Certification.",
    deliverTitle: "What institutions receive",
    deliverables: ["Program design mapped to your placement calendar", "Student workbooks and self-practice material", "Mock interview and group-discussion panels with feedback", "Cohort-level readiness observations for your placement cell", "Participation certificates; HR Edge certification where applicable"],
    listEyebrow: "Institutional training areas",
    listHeading: "Five programs that bridge campus and corporate",
    listGrid: "repeat(3,1fr)",
    items: [
      { num: "01", t: "Campus to Corporate Readiness", d: "Workplace expectations, corporate behaviour, communication standards and professional conduct in the first months of a career." },
      { num: "02", t: "Communication & Corporate Etiquette", d: "Email writing, presentation skills, group discussions, professional communication and business etiquette." },
      { num: "03", t: "Interview & Career Readiness", d: "Resume building, personal introduction, HR interview preparation, mock interviews with feedback and job-search confidence." },
      { num: "04", t: "Professional Skills for the Workplace", d: "Time management, teamwork, problem-solving, critical thinking, adaptability, ownership and workplace discipline." },
      { num: "05", t: "HR Edge Certification", d: "An integrated certification for MBA-HR, PGDM-HR and HR postgraduate students combining DEI, POSH and workplace wellbeing." },
    ],
    processEyebrow: "How we work with institutions",
    processHeading: "Built around your placement calendar, not ours",
    process: [
      { num: "1", title: "Align with the placement cell", desc: "We understand your cohort profile, recruiter expectations, placement timelines and where students typically struggle in interviews." },
      { num: "2", title: "Design the track", desc: "Modules are sequenced across available slots — readiness first, then communication and etiquette, then interview practice close to the drive." },
      { num: "3", title: "Deliver with practice", desc: "Interactive sessions plus mock interviews, group discussions and presentation practice with individual feedback for every student." },
      { num: "4", title: "Report readiness", desc: "The placement cell receives cohort-level observations on strengths, common gaps and students who need additional support." },
    ],
    certEyebrow: "Student credential",
    certHeading: "A credential that means something to a recruiter",
    certBody: "Students receive a certificate naming the program completed. For MBA-HR and PGDM-HR cohorts, the HR Edge Certification records an applied, assessment-based credential in DEI, POSH and workplace wellbeing — a genuine differentiator in HR interviews.",
    certNotes: [
      { t: "Program-specific", d: "Names the module completed — readiness, communication, interview preparation or HR Edge." },
      { t: "Assessment-based for HR Edge", d: "HR Edge certification is linked to participation, practice and assessment, not attendance." },
      { t: "Interview-ready evidence", d: "Something concrete to point to when a recruiter asks what the student has done beyond coursework." },
    ],
    certLabel: "HR Edge Certification",
    certName: "Student Name",
    certLine1: "This certifies that",
    certLine2: "has successfully completed the",
    certLine3: "integrated DEI, POSH and workplace wellbeing curriculum with assessment",
    certProgram: "HR Edge Certification for Future HR Professionals",
    certCaption: "sample credential — issued per program completed",
    audience: ["Final-year UG students", "Postgraduate students", "Placement-readiness cohorts", "Internship-readiness cohorts", "Early-career professionals", "MBA-HR & PGDM-HR students", "HR postgraduates"],
    formHeading: "Request an institutional training proposal",
    formSub: "Tell us your cohort size, timelines and placement calendar — we will propose a track that fits your slots.",
    orgLabel: "Institution *",
    orgPlaceholder: "College or university name",
    pickLabel: "Which program are you planning? *",
    options: ["Campus to corporate", "Communication & etiquette", "Interview readiness", "Professional skills", "HR Edge Certification", "Full track"],
    msgPlaceholder: "Cohort size, year of study, available slots and placement timelines",
    formButton: "Request institutional proposal",
    faqs: [
      { q: "How large can a batch be?", a: "Awareness and readiness sessions run comfortably up to 150 students. Interview practice and group discussions are split into smaller panels so every student gets individual feedback." },
      { q: "Can this fit around our academic timetable?", a: "Yes. Modules are designed to slot into available periods — full days, half-days or weekly sessions across a semester." },
      { q: "Is HR Edge only for HR students?", a: "The certification is designed for MBA-HR, PGDM-HR and HR postgraduate cohorts. Other students are better served by the readiness and interview preparation modules." },
    ],
  },
  advisory: {
    crumb: "HR Advisory",
    eyebrow: "04 · HR Advisory & Workplace Culture Consulting",
    title: "HR Advisory & Workplace Culture Consulting",
    lede: "Practical HR advisory and workplace culture support for organizations that want to strengthen people practices, compliance readiness and employee experience.",
    img: "/assets/hr-conclave-stage.jpeg",
    facts: [{ k: "Engagement", v: "Project or retained" }, { k: "Starting point", v: "Diagnostic review" }, { k: "Focus", v: "POSH · policy · culture" }, { k: "Experience", v: "35+ and 15+ years" }],
    introHeading: "Judgment from decades of institutional and global HR practice",
    intro: [
      "Our advisory work combines 35+ years of institutional HR leadership at scale with 15+ years of global HR practice — disciplined process paired with contemporary workplace expectations.",
      "Most engagements start with a short diagnostic: what your policies say, what managers actually do, and where the gap creates risk or friction. You get a written view of what to fix first, sequenced by effort and exposure.",
      "From there we work alongside your HR and leadership teams — POSH and IC readiness, policy review, manager practices, employee relations guidance and the everyday habits that shape employee experience. No templates dropped and left.",
    ],
    outcomes: ["A clear picture of current-state risk", "POSH and IC readiness you can evidence", "Policies people can actually follow", "Managers equipped for hard conversations", "Performance and feedback rhythms that hold", "Capability planning ahead of growth"],
    bestFor: "Growing organizations, HR teams, leadership teams, institutions and businesses looking for practical HR and workplace culture support.",
    deliverTitle: "Typical deliverables",
    deliverables: ["Diagnostic note with prioritised recommendations", "Reviewed and updated policy documents", "IC constitution, process and capability-building support", "Manager guidance notes and conversation frameworks", "Review cadence with your HR and leadership team"],
    listEyebrow: "Advisory areas",
    listHeading: "Seven areas where we support HR and leadership teams",
    listGrid: "repeat(3,1fr)",
    items: [
      { num: "01", t: "POSH Compliance & IC Advisory", d: "Internal Committee formation, capability building, process readiness and compliance support with legal clarity." },
      { num: "02", t: "HR Policy Review & Process Support", d: "Reviewing and strengthening policies, workplace processes and documentation for clarity, consistency and usability." },
      { num: "03", t: "Manager Capability & People Practices", d: "Building the everyday manager practices that drive trust, performance and retention." },
      { num: "04", t: "Employee Relations & Sensitivity Guidance", d: "Practical guidance on sensitive workplace situations, employee relations and responsible HR response." },
      { num: "05", t: "Performance & Feedback Frameworks", d: "Designing and supporting performance conversations, feedback rhythms and review frameworks that managers sustain." },
      { num: "06", t: "Workplace Culture & Employee Experience", d: "Advisory on culture signals, psychological safety, inclusion and employee experience across the lifecycle." },
      { num: "07", t: "Leadership & Capability Planning", d: "Planning people capability and leadership development ahead of growth, change or transformation." },
    ],
    processEyebrow: "How an engagement runs",
    processHeading: "Diagnose, prioritise, implement, review",
    process: [
      { num: "1", title: "Diagnostic", desc: "A focused review of policies, practices and current pain points through document review and conversations with HR, managers and leadership." },
      { num: "2", title: "Prioritise", desc: "A written view of what to address first — sequenced by risk exposure, effort and what your team can realistically absorb." },
      { num: "3", title: "Implement", desc: "We work alongside your team on the agreed items: policy updates, IC readiness, manager guidance, framework design and rollout support." },
      { num: "4", title: "Review", desc: "A review cadence keeps changes alive — checking what stuck, what did not, and what the next quarter should pick up." },
    ],
    certEyebrow: "Engagement record",
    certHeading: "Documentation you can put in front of a board or auditor",
    certBody: "Advisory engagements close with a written record of the work completed — scope, recommendations, actions taken and the review cadence agreed. For POSH and IC work, documentation is structured to support your compliance file.",
    certNotes: [
      { t: "Written, not verbal", d: "Every engagement produces a documented diagnostic, recommendation set and closure note." },
      { t: "Compliance-ready", d: "POSH and IC deliverables are structured for your statutory documentation and internal audit needs." },
      { t: "Owned by your team", d: "Deliverables are written so your HR team can maintain them after the engagement ends." },
    ],
    certLabel: "Engagement Completion Record",
    certName: "Organization Name",
    certLine1: "This confirms that",
    certLine2: "completed an advisory engagement covering",
    certLine3: "with recommendations, actions and review cadence documented",
    certProgram: "POSH Compliance & Internal Committee Advisory",
    certCaption: "sample record — scope reflects your engagement",
    audience: ["Growing organizations", "HR teams", "Leadership teams", "Educational institutions", "Businesses scaling their people function", "Organizations preparing for POSH compliance"],
    formHeading: "Start an advisory conversation",
    formSub: "Tell us where you need support and we will propose a practical, right-sized engagement.",
    orgLabel: "Organization *",
    orgPlaceholder: "Company or institution name",
    pickLabel: "Where do you need support first? *",
    options: ["POSH & IC advisory", "Policy review", "Manager capability", "Employee relations", "Performance frameworks", "Culture & experience", "Not sure yet"],
    msgPlaceholder: "Headcount, current HR setup and what prompted this conversation",
    formButton: "Request an advisory conversation",
    faqs: [
      { q: "Do you take on retained advisory work?", a: "Yes. Some clients engage us for a defined project; others retain us for a set number of hours a month for ongoing guidance and review." },
      { q: "Can you help us set up an Internal Committee from scratch?", a: "Yes — constitution, member briefing, process design, documentation and capability-building sessions for IC members and managers." },
      { q: "Do you work with small organizations?", a: "Regularly. Smaller teams often need this most, and engagements are scoped to a size and budget that makes sense at your stage." },
    ],
  },
};
