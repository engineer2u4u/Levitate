/**
 * Programme FAQs, as supplied by the client for the website.
 *
 * Answers can carry more than one paragraph, so each is an array — the page
 * renders them as separate paragraphs rather than one run-on block.
 * Keyed by course slug, like the brochure content.
 */
/** Answers may carry {starts}, {starts_short} and {fee}; wherever they are
 *  shown they are filled from the course's catalogue entry (lib/catalog.ts). */
export type Faq = { q: string; a: string[] };

export const POSH_FAQS: Faq[] = [
  {
    q: "What is the PoSH Train-the-Trainer Certification Programme?",
    a: [
      "The PoSH Train-the-Trainer Certification Programme is an intensive, practice-led programme designed to build the legal understanding, practical judgement and facilitation capability required to confidently deliver PoSH awareness and sensitisation sessions in workplace settings.",
    ],
  },
  {
    q: "Who can enrol in the programme?",
    a: [
      "The programme is suitable for HR and L&D professionals, Internal Committee members, legal and compliance professionals, consultants, trainers, educators, corporate professionals, independent facilitators and aspiring PoSH trainers.",
      "You do not need to come from an HR background to participate.",
    ],
  },
  {
    q: "Do I need prior experience in PoSH or training?",
    a: [
      "No. Prior PoSH or facilitation experience is not mandatory. The programme takes participants through the foundations of PoSH while progressively building practical application and trainer capability.",
    ],
  },
  {
    q: "What does TTT mean?",
    a: [
      "TTT stands for Train-the-Trainer. This means the programme goes beyond understanding PoSH law and focuses on helping participants develop the skills required to facilitate PoSH learning effectively for workplace audiences.",
    ],
  },
  {
    q: "What will I learn during the programme?",
    a: [
      "You will learn the core PoSH law, workplace sexual harassment, Internal Committee responsibilities, complaint and inquiry processes, compliance requirements and practical case application.",
      "The programme also introduces Levitate PeopleSoft's CLEAR PoSH Framework™, while building the facilitation, training-design and delivery skills needed to conduct effective PoSH sessions confidently.",
    ],
  },
  {
    q: "Is the programme theoretical or practical?",
    a: [
      "The programme follows a practice-led learning approach using workplace scenarios, case studies, discussions, role plays, trainer exercises, applied case laboratories and knowledge checks.",
      "The objective is not only to understand PoSH, but to learn how to interpret, apply and facilitate it in real workplace situations.",
    ],
  },
  {
    q: "Will I learn about the Internal Committee and inquiry process?",
    a: [
      "Yes. The programme covers the role, responsibilities and governance of the Internal Committee, along with complaint intake, inquiry principles, procedural considerations, case scenarios, compliance and organisational accountability.",
      "It is designed to help participants understand and explain these processes with greater clarity and confidence.",
    ],
  },
  {
    q: "Will I learn how to conduct PoSH awareness and sensitisation sessions?",
    a: [
      "Yes. A significant part of the programme focuses on trainer craft — how to structure a PoSH session, communicate legal concepts simply, facilitate sensitive conversations, use cases and activities, respond to participant questions and handle difficult or resistant audiences.",
    ],
  },
  {
    q: "Can I conduct PoSH training professionally after completing the programme?",
    a: [
      "The programme is designed to build the knowledge and facilitation competencies required to deliver PoSH awareness and sensitisation sessions.",
      "Participants wishing to offer PoSH training or consulting as a professional service should also continue building relevant workplace experience, legal understanding and professional capability, and ensure that their services and representations comply with applicable requirements.",
    ],
  },
  {
    q: "Will there be practical activities and assessments?",
    a: [
      "Yes. The programme includes case-based activities, facilitation exercises, module-wise knowledge checks and assessment components designed to reinforce both PoSH understanding and trainer capability.",
      "Successful completion of the prescribed programme and assessment requirements is necessary for certification.",
    ],
  },
  {
    q: "Will I receive learning materials and trainer resources?",
    a: [
      "Yes. Participants receive programme learning resources and access to a structured trainer toolkit, which may include facilitation guides, session plans, case materials, templates, activity resources and other downloadable materials relevant to the certification journey.",
    ],
  },
  {
    q: "Will I receive LMS access?",
    a: [
      "Yes. Participants receive 90 days of access to Levitate PeopleSoft's dedicated Learning Management System (LMS).",
      "The LMS serves as the programme's central learning and resource hub, providing access to recorded sessions, module resources, trainer toolkit materials, templates, downloadable resources, quizzes and learning-progress tracking.",
    ],
  },
  {
    q: "Is there any support after the programme?",
    a: [
      "Yes. Participants become part of a dedicated programme support community/WhatsApp group, where they can seek clarification on learning-related questions as they begin applying their knowledge.",
      "Levitate PeopleSoft also provides ongoing learning support to certified participants.",
    ],
  },
  {
    q: "Will I receive a certificate after completing the programme?",
    a: [
      "Yes. Participants who successfully meet the programme's completion and assessment requirements will receive a PoSH Train-the-Trainer Certificate from Levitate PeopleSoft.",
      "Levitate PeopleSoft is an SHRM Recertification Provider, authorised to offer eligible learning programmes for SHRM Professional Development Credits (PDCs). Participants who successfully complete this eligible programme may earn the applicable PDCs toward SHRM-CP® or SHRM-SCP® recertification.",
    ],
  },
  {
    q: "Does the Levitate PeopleSoft certification expire?",
    a: [
      "No. The Levitate PeopleSoft PoSH Train-the-Trainer Certificate does not carry an expiry date once the participant has successfully completed the programme and certification requirements.",
    ],
  },
  {
    q: "What happens if I miss a live session?",
    a: [
      "As this is a live, instructor-led certification programme, participants are encouraged to attend all scheduled sessions.",
      "Where recordings are made available through the LMS, participants may use them to revisit missed learning; however, attendance, assessment and certification requirements will continue to apply as per the applicable batch policy.",
    ],
  },
];

/**
 * POCSO FAQs, drafted from the programme's own brochure — the schedule, the
 * eight modules, the audience and the inclusions all come from there. Nothing
 * here claims anything the brochure does not.
 */
export const POCSO_FAQS: Faq[] = [
  {
    q: "What is the POCSO & Child Safety Facilitator Programme?",
    a: [
      "It is a practice-led Train-the-Trainer certification that prepares professionals to facilitate child-safety and POCSO awareness sessions with legal clarity, age-appropriate communication and responsible reporting.",
      "It is designed around what a facilitator has to do in the room, not only what the law says — how to explain it, how to adapt it for an audience, how to handle difficult questions, and how to respond if a child discloses.",
    ],
  },
  {
    q: "Who should attend?",
    a: [
      "Educators, teachers, principals and school leaders; school counsellors and child-safety professionals; NGO and social-sector professionals; HR and L&D professionals; corporate and independent trainers; institutional leaders in child-facing environments; consultants and aspiring POCSO facilitators; psychologists, child psychologists and special educators.",
    ],
  },
  {
    q: "When does the next batch run?",
    a: [
      "From {starts} — three evenings, two hours a day, 6:00 to 8:00 PM, live online. Nine hours in total across eight modules.",
    ],
  },
  {
    q: "Do I need a legal background?",
    a: [
      "No. The programme builds the legal understanding you need from the ground up, and spends most of its time on applying it — recognising signals, using age-appropriate language, responding to a disclosure and knowing the reporting pathway.",
    ],
  },
  {
    q: "What does the curriculum cover?",
    a: [
      "Eight modules: foundations of POCSO and the Levitate GUARD Child Safety Framework™; ground rules for safe and sensitive facilitation; the law, offences and the child-protection ecosystem; age-appropriate child-safety communication; recognising signals, grooming and vulnerability; disclosure, response and responsible reporting; prevention and institutional child-safety systems; and a trainer mastery and certification practicum.",
    ],
  },
  {
    q: "What certificate do I receive?",
    a: [
      "Two: a Levitate PeopleSoft Certificate of Training Completion carrying a verifiable certificate ID, the completion date and the programme hours, and a SHRM Certificate of Completion showing the Professional Development Credits earned toward SHRM-CP® and SHRM-SCP® recertification.",
      "Levitate PeopleSoft is a SHRM Recertification Provider and a CPD-accredited, ISO 9001:2015 certified organisation.",
    ],
  },
  {
    q: "What do I get to run my own sessions?",
    a: [
      "A complete trainer toolkit: presentation deck, case studies, templates, facilitation guides and session plans, alongside dedicated LMS access with recorded sessions, module resources, downloadable templates and knowledge checks.",
    ],
  },
  {
    q: "What if I miss a session?",
    a: [
      "Sessions are recorded and available through the LMS, so a missed evening can be caught up before the next one. The facilitation practice is live, though, so attending is worth arranging where you can.",
    ],
  },
  {
    q: "Can my school or organisation enrol a group?",
    a: [
      "Yes. Institutional cohorts and group enrolments are arranged directly — write to contactus@levitatepeoplesoft.com or message us on WhatsApp and we will set it up.",
    ],
  },
];

/**
 * DEI FAQs, drafted from the programme's own brochure — the twenty hours, the
 * thirteen modules, the BRIDGE framework, the audience and the inclusions all
 * come from there. Nothing here claims anything the brochure does not.
 */
export const DEI_FAQS: Faq[] = [
  {
    q: "What is the Inclusive Workplace Facilitator Programme (DEI TTT)?",
    a: [
      "It is a 20-hour applied Train-the-Trainer certification anchored in the BRIDGE Inclusion Framework, built to translate inclusion from concept into everyday workplace behaviour.",
      "It is a facilitator certification rather than an awareness course: as much of it is about designing and running DEI sessions as about the content of them.",
    ],
  },
  {
    q: "Who should attend?",
    a: [
      "HR and L&D professionals; DEI, culture and employee-experience professionals; people managers and inclusive leaders; employee resource group and inclusion leads; workplace trainers and facilitators; HR consultants and independent professionals; aspiring DEI facilitators; and new trainers, freelance or corporate.",
    ],
  },
  {
    q: "When does the next batch run?",
    a: [
      "The batch starts {starts}, live online, across 20 learning hours and thirteen modules. Session timings are being confirmed and will be shared before the batch opens.",
    ],
  },
  {
    q: "What is the BRIDGE Inclusion Framework?",
    a: [
      "The structure the programme facilitates with: Bias visible, Respectful language, Inclusive decisions, Dialogue over debate, Growing belonging, Everyday allyship.",
      "It exists to give a facilitator something to hold on to in a live room — when a conversation turns difficult, it tells you which move you are making and why.",
    ],
  },
  {
    q: "What does the curriculum cover?",
    a: [
      "Thirteen modules: DEI foundations and the global inclusion landscape; identity, intersectionality, privilege and power; bias, stereotypes and inclusive decision-making; inclusive communication, microaggressions and constructive dialogue; dimensions of diversity and intersectional inclusion; cultural intelligence; psychological safety, belonging and inclusive teams; allyship, bystander intervention and inclusive leadership; the inclusive employee lifecycle and organisational DEI; designing powerful DEI learning experiences; facilitating sensitive and difficult conversations; managing resistance, hot moments and challenging questions; and case facilitation, debriefing and audience adaptation.",
    ],
  },
  {
    q: "Do I need a DEI background to enrol?",
    a: [
      "No. The programme builds the concepts from the ground up and then spends its time on application — designing sessions, handling resistance and facilitating conversations across difference.",
    ],
  },
  {
    q: "What certificate do I receive?",
    a: [
      "Two: a Levitate PeopleSoft Certificate of Training Completion carrying a verifiable certificate ID, the completion date and the programme hours, and a SHRM Certificate of Completion showing the Professional Development Credits earned toward SHRM-CP® and SHRM-SCP® recertification.",
      "Levitate PeopleSoft is a SHRM Recertification Provider and a CPD-accredited, ISO 9001:2015 certified organisation.",
    ],
  },
  {
    q: "What do I get to run my own sessions?",
    a: [
      "A trainer toolkit: presentation deck, case studies, templates, facilitation guides and session plans, alongside dedicated LMS access with recorded sessions, module resources, downloadable templates and knowledge checks.",
    ],
  },
  {
    q: "Can my organisation enrol a group?",
    a: [
      "Yes. Group and in-house cohorts are arranged directly — write to contactus@levitatepeoplesoft.com or message us on WhatsApp and we will set it up.",
    ],
  },
];

export const FAQS: Record<string, Faq[]> = {
  "posh-trainer": POSH_FAQS,
  "pocso-child-safety": POCSO_FAQS,
  "inclusive-workplace": DEI_FAQS,
};

export const faqsBySlug = (slug: string): Faq[] | undefined => FAQS[slug];
