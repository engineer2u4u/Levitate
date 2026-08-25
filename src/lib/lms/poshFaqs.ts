/**
 * Programme FAQs, as supplied by the client for the website.
 *
 * Answers can carry more than one paragraph, so each is an array — the page
 * renders them as separate paragraphs rather than one run-on block.
 * Keyed by course slug, like the brochure content.
 */
export type Faq = { q: string; a: string[] };

export const POSH_FAQS: Faq[] = [
  {
    q: "What is the POSH Train-the-Trainer Certification Programme?",
    a: [
      "The POSH Train-the-Trainer Certification Programme is an intensive, practice-led programme designed to build the legal understanding, practical judgement and facilitation capability required to confidently deliver POSH awareness and sensitisation sessions in workplace settings.",
    ],
  },
  {
    q: "Who can enrol in the programme?",
    a: [
      "The programme is suitable for HR and L&D professionals, Internal Committee members, legal and compliance professionals, consultants, trainers, educators, corporate professionals, independent facilitators and aspiring POSH trainers.",
      "You do not need to come from an HR background to participate.",
    ],
  },
  {
    q: "Do I need prior experience in POSH or training?",
    a: [
      "No. Prior POSH or facilitation experience is not mandatory. The programme takes participants through the foundations of POSH while progressively building practical application and trainer capability.",
    ],
  },
  {
    q: "What does TTT mean?",
    a: [
      "TTT stands for Train-the-Trainer. This means the programme goes beyond understanding POSH law and focuses on helping participants develop the skills required to facilitate POSH learning effectively for workplace audiences.",
    ],
  },
  {
    q: "What will I learn during the programme?",
    a: [
      "You will learn the core POSH law, workplace sexual harassment, Internal Committee responsibilities, complaint and inquiry processes, compliance requirements and practical case application.",
      "The programme also introduces Levitate PeopleSoft's CLEAR POSH Framework™, while building the facilitation, training-design and delivery skills needed to conduct effective POSH sessions confidently.",
    ],
  },
  {
    q: "Is the programme theoretical or practical?",
    a: [
      "The programme follows a practice-led learning approach using workplace scenarios, case studies, discussions, role plays, trainer exercises, applied case laboratories and knowledge checks.",
      "The objective is not only to understand POSH, but to learn how to interpret, apply and facilitate it in real workplace situations.",
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
    q: "Will I learn how to conduct POSH awareness and sensitisation sessions?",
    a: [
      "Yes. A significant part of the programme focuses on trainer craft — how to structure a POSH session, communicate legal concepts simply, facilitate sensitive conversations, use cases and activities, respond to participant questions and handle difficult or resistant audiences.",
    ],
  },
  {
    q: "Can I conduct POSH training professionally after completing the programme?",
    a: [
      "The programme is designed to build the knowledge and facilitation competencies required to deliver POSH awareness and sensitisation sessions.",
      "Participants wishing to offer POSH training or consulting as a professional service should also continue building relevant workplace experience, legal understanding and professional capability, and ensure that their services and representations comply with applicable requirements.",
    ],
  },
  {
    q: "Will there be practical activities and assessments?",
    a: [
      "Yes. The programme includes case-based activities, facilitation exercises, module-wise knowledge checks and assessment components designed to reinforce both POSH understanding and trainer capability.",
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
      "Yes. Participants who successfully meet the programme's completion and assessment requirements will receive a POSH Train-the-Trainer Certificate from Levitate PeopleSoft.",
      "Levitate PeopleSoft is an SHRM Recertification Provider, authorised to offer eligible learning programmes for SHRM Professional Development Credits (PDCs). Participants who successfully complete this eligible programme may earn the applicable PDCs toward SHRM-CP® or SHRM-SCP® recertification.",
    ],
  },
  {
    q: "Does the Levitate PeopleSoft certification expire?",
    a: [
      "No. The Levitate PeopleSoft POSH Train-the-Trainer Certificate does not carry an expiry date once the participant has successfully completed the programme and certification requirements.",
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

export const FAQS: Record<string, Faq[]> = {
  "posh-trainer": POSH_FAQS,
};

export const faqsBySlug = (slug: string): Faq[] | undefined => FAQS[slug];
