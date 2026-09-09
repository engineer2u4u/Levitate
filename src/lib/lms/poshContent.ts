/**
 * The PoSH TTT course as it is taught in the LMS.
 *
 * Authored from "LMS PoSH Content.docx" and the handouts supplied beside it.
 * This takes precedence over the curriculum-derived content, because the
 * curriculum describes the syllabus while this is the material a learner
 * actually works through.
 *
 * Three rules from the brief shape it:
 *
 *  - Sections are named for the session, not "Module 1, Module 2". A learner
 *    scanning the rail should see what they are about to study.
 *  - Modules with "no specific documents" against them — 1, 2 and 9 — are not
 *    here. They are taught live from the presentation flow and would show as
 *    empty sections with nothing to open.
 *  - The handouts are transcribed rather than attached. Nobody should have to
 *    download a PDF, leave the page and lose their place to read the material
 *    they came for; the reading kit at the end is where the files still live,
 *    because that is a take-away rather than a lesson.
 *
 * Body text supports "## " headings, "- " bullets and **bold**.
 */

import type { CourseContent } from "./courseContent";

export const POSH_CONTENT: CourseContent = {
  slug: "posh-trainer",
  title: "PoSH & Workplace Dignity Facilitator Program (PoSH TTT)",
  intro:
    "Fifteen learning hours — twelve live with the founder, three guided here. Work through each item in order; the next one opens as you finish the one before it.",

  modules: [
    /* ================================================================== */
    {
      id: "orientation",
      title: "Orientation and Pre-read",
      summary: "Read before the first live session.",
      items: [
        {
          id: "p-orientation-agreement",
          kind: "reading",
          title: "Certification Journey & Sensitive Learning Room Agreement",
          minutes: 12,
          meta: "Reading · signature required",
          body: [
            "Read this before the first live session. The programme deals with sensitive workplace situations and requires thoughtful, respectful participation. By signing at the end, you confirm that you understand the certification journey and agree to the learning-room expectations below.",

            "## Your certification journey",
            "This certification is based on demonstrated learning and application — not attendance alone. Your journey will move through six stages.",
            "- **Prepare** — complete pre-reading, diagnostic learning and the legal baseline.",
            "- **Learn** — build understanding of the law, prevention, reporting, governance and inquiry.",
            "- **Practise** — apply learning through scenarios, case analysis, worksheets and facilitation tasks.",
            "- **Demonstrate** — show your knowledge and facilitation capability through assessment.",
            "- **Improve** — use facilitator and assessor feedback to strengthen your practice.",
            "- **Apply** — transfer the learning into responsible workplace and training practice.",

            "## How we will learn: present, participate, practise",
            "- **Present** — build accurate knowledge and make complex concepts understandable.",
            "- **Participate** — question, discuss, reflect and test assumptions respectfully.",
            "- **Practise** — apply learning to realistic workplace situations and facilitator tasks.",

            "## Your responsibility as a delegate",
            "Come prepared, participate professionally, respect the sensitivity of the subject, complete the guided LMS work and demonstrate your own learning during the assessment activities.",

            "## Sensitive Learning Room Agreement",
            "PoSH learning can involve sensitive, personal and emotionally difficult subject matter. This agreement creates a respectful learning environment in which delegates can ask questions, challenge assumptions and practise difficult conversations without compromising dignity or procedural fairness.",
            "- **Protect privacy.** Discuss patterns and learning points without revealing identifiable information about real people, complaints or workplaces.",
            "- **Challenge ideas, not people.** Disagreement is welcome; personal attacks, ridicule or shaming are not.",
            "- **Avoid victim-blaming and respondent-bashing.** Use neutral language and do not assume facts or outcomes before a fair process.",
            "- **Personal sharing is always optional.** No delegate is required to disclose a personal experience. You may pass on any activity or question that feels too personal.",
            "- **Understand the limits of confidentiality.** We will respect privacy, but absolute confidentiality cannot be promised where a disclosure creates a legal or organisational duty to act or escalate.",
            "- **Use precise, non-graphic language.** Ask only what is necessary for learning. Avoid unnecessary graphic details or sensational discussion.",
            "- **Take care of yourself and others.** You may pause, step away or seek support if the content becomes distressing. Distress will never be treated as disruption.",
            "- **Keep live complaints out of the training room.** The programme is for learning and practice, not for investigating active complaints. If you need support with a real matter, speak privately with the facilitator so the appropriate route can be discussed.",
          ],
          acknowledgement: {
            statement:
              "I confirm that I have read and understood the Certification Journey and Sensitive Learning Room Agreement. I agree to participate respectfully, protect privacy, avoid prejudging real or fictional complaints, and follow the learning-room expectations throughout the programme. I understand that successful certification requires active completion of the learning and assessment requirements, not attendance alone.",
          },
        },

        {
          id: "p-orientation-dignity",
          kind: "reading",
          title: "Dignity, Respect and Psychological Safety at Work",
          minutes: 12,
          meta: "Pre-session reading",
          body: [
            "Before your first live session, please read this short primer. You do not need any prior knowledge of PoSH. Its purpose is to help you understand the human and cultural foundation behind the law — why dignity, respectful boundaries and the confidence to speak up matter before we begin studying legal definitions and procedures.",

            "## Why this reading comes before the law",
            "PoSH is often introduced as legislation, a policy or a complaint process. But the reason those mechanisms exist is fundamentally human: people should be able to work without being humiliated, sexualised, intimidated or made to feel unsafe. A strong PoSH programme therefore begins by understanding the culture the law is trying to protect.",

            "## 1. Dignity: the non-negotiable baseline",
            "Dignity means recognising the inherent worth of every person at work. It is reflected in how colleagues speak to one another, how power is exercised, how boundaries are respected and how concerns are handled. Dignity does not depend on designation, seniority or popularity.",
            "- People are treated respectfully, even when there is disagreement or performance pressure.",
            "- Personal and professional boundaries are recognised rather than tested or trivialised.",
            "- Concerns are heard without ridicule, retaliation or unnecessary exposure.",

            "## 2. Respect: what we do matters",
            "Respect is visible in everyday behaviour — the jokes we make, the comments we normalise, the messages we send, the way we respond to a 'no', and what leaders reward, challenge or ignore. Good intention does not automatically make conduct appropriate. Workplace behaviour must also be understood through context, boundaries and whether it is welcome.",

            "## 3. Boundaries: comfort and consent can change",
            "Workplace boundaries are not fixed forever. A person may be comfortable with an interaction at one time and uncomfortable later. A friendly relationship, previous consent or informal workplace culture does not remove another person's right to set or change a boundary. Respect means noticing and responding appropriately when a boundary is communicated.",

            "## 4. Psychological safety: the ability to speak up",
            "Psychological safety is the confidence to ask questions, raise concerns, report inappropriate behaviour or say no without fearing professional cost. It does not mean every conversation will be comfortable or that every concern will produce a preferred outcome. It means people can use workplace processes without being silenced, mocked or punished for speaking up.",

            "## 5. Belonging and equity: strengthening trust",
            "Belonging means people feel included, valued and able to contribute. Equity means people are treated fairly while recognising that individuals may start from different positions or need different forms of support. Together, these conditions influence whether employees trust workplace systems enough to raise concerns when something feels wrong.",

            "## Connecting culture to PoSH",
            "Dignity, respect, boundaries and the ability to speak up are what prevention rests on. The law is what happens when they fail.",
          ],
        },
      ],
    },

    /* ================================================================== */
    {
      id: "clear-framework",
      title: "The CLEAR PoSH Framework",
      summary: "The framework you facilitate with, and how to hold the room.",
      items: [
        {
          id: "p-clear-framework",
          kind: "reading",
          title: "The CLEAR PoSH Framework™",
          minutes: 15,
          meta: "Reading · Module 3",
          body: [
            "A practical methodology for navigating a PoSH training session, a workplace disclosure or an inquiry. Use CLEAR as your professional compass throughout the programme; later modules deepen the legal and procedural knowledge behind each letter.",

            "## The five-part framework",
            "- **C — Clarity on the Law.** Ground the conversation in the PoSH Act, applicable Rules and organisational policy.",
            "- **L — Listening Without Judgment.** Receive questions and experiences fairly, without rushing to conclusions.",
            "- **E — Explaining Boundaries.** Make unwelcome conduct, consent, impact and professional boundaries understandable.",
            "- **A — Addressing Resistance.** Respond calmly to minimisation, defensiveness, myths and difficult questions.",
            "- **R — Responsible Reporting.** Guide concerns and disclosures towards safe, accurate support and reporting pathways.",
            "**Anchor question.** When you are in the room and unsure what to do next, ask yourself: which letter am I in right now?",

            "## C — Clarity on the Law",
            "- Know the legal foundation before simplifying it.",
            "- Translate technical provisions into accurate, plain language.",
            "- Correct myths without overstating the law.",
            "- Separate legal requirements, good practice and organisational policy.",
            "*Trainer pause:* what is legally accurate here, and how can I explain it simply?",

            "## L — Listening Without Judgment",
            "- Allow the person to speak without interruption.",
            "- Listen fairly and avoid assumptions about either party.",
            "- Separate facts, perceptions and inferences.",
            "- Do not investigate or promise an outcome during a disclosure.",
            "*Trainer pause:* what must I understand before I respond?",

            "## E — Explaining Boundaries",
            "- Explain 'unwelcome' conduct, consent, context and impact.",
            "- Use relatable workplace examples without sensationalising.",
            "- Distinguish friendliness and mutual interaction from unwelcome conduct.",
            "- Include verbal, non-verbal and physical behaviour.",
            "*Trainer pause:* what boundary or concept needs to become clearer?",

            "## A — Addressing Resistance",
            "- Stay calm; do not shame or enter into a debate.",
            "- Acknowledge the concern, examine the assumption and return to principle.",
            "- Address minimisation, hierarchy and power dynamics.",
            "- Correct myths about intent, compliments, false complaints and scope.",
            "*Trainer pause:* what resistance is preventing understanding?",

            "## R — Responsible Reporting",
            "- Explain available reporting and support routes accurately.",
            "- Encourage action without pressuring the person or promising results.",
            "- Protect confidentiality within statutory and process limits.",
            "- Direct urgent safety concerns to the appropriate organisational channel.",
            "*Trainer pause:* what is the safest, most accurate next step?",

            "## Application map",
            "- **Explaining the law** — C + E. Accuracy and accessible language.",
            "- **Receiving a disclosure** — L + E + R. Listen, clarify and guide next steps.",
            "- **Supporting an inquiry process** — C + L + A + R. Fairness, resistance and process.",
            "- **Facilitating a PoSH session** — all five. Integrate the complete framework.",

            "## Worked example: “It was only a joke.”",
            "During a PoSH session, a participant says: “People are becoming too sensitive. It was only a joke, and there was no bad intention.”",
            "**First, hold the nuance.** A joke is not automatically sexual harassment, and the trainer should not deliver a verdict without facts. The correct response is to examine the nature of the remark, whether it was sexual or gendered, whether it was unwelcome, the context, repetition, power relationship and its effect on the workplace.",
            "**Why 'only a joke' may not end the discussion:**",
            "- Calling something humour does not remove its content or workplace impact.",
            "- Lack of harmful intention does not automatically make unwelcome sexual or gendered conduct acceptable.",
            "- A person may laugh because of discomfort, hierarchy or social pressure; laughter alone does not prove welcome conduct.",
            "- A single incident may still require attention depending on its nature and seriousness.",
            "- The facilitator must explain the principle without declaring that a specific unexamined incident is legally proved sexual harassment.",

            "## The same example, through CLEAR",
            "- **C — clarify the principle.** “Intent gives us context, but we must also examine the nature of the remark, whether it was unwelcome and the surrounding circumstances.”",
            "- **L — explore before concluding.** “What makes you see it as harmless? Let us understand the situation before forming a view.”",
            "- **E — explain the boundary.** “Humour can cross a workplace boundary when it is sexual or gendered, unwelcome, humiliating, repeated after discomfort, or contributes to a hostile environment.”",
            "- **A — address minimisation.** “The purpose is not to ban humour. It is to ensure that humour does not compromise dignity, safety or someone's ability to participate at work.”",
            "- **R — explain the next step.** “If someone feels uncomfortable, they may seek support or use the organisation's reporting route. Any concern must be handled respectfully and confidentially within the applicable process.”",

            "**Remember:** CLEAR is not a rigid script. It is a pause-and-respond discipline — ground yourself in law, listen fairly, explain clearly, address resistance and guide responsible action.",
          ],
        },
      ],
    },

    /* ================================================================== */
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
            "A film on this, “Sexual Harassment At The Workplace In India | #MakeMyWorkplaceSafe”, is being added to this section.",
          ],
        },
      ],
    },

    /* ================================================================== */
    {
      id: "recognising",
      title: "Recognising Sexual Harassment",
      summary: "Telling a PoSH concern from other misconduct, and from too little information.",
      items: [
        {
          id: "p-recognising-guide",
          kind: "reading",
          title: "Recognising Sexual Harassment",
          minutes: 14,
          meta: "Quick reference · Module 5",
          body: [
            "Recognition requires more than spotting uncomfortable behaviour. A trainer should consider the nature of the conduct, whether it is unwelcome, the workplace context and the information available before drawing conclusions.",

            "## Start with the statutory lens",
            "Section 2(n) of the PoSH Act describes sexual harassment as one or more unwelcome acts or behaviour of a sexual nature, whether directly or by implication. Three questions follow from it.",
            "- **Unwelcome.** Was the conduct unwanted, objected to, uncomfortable in context, or continued despite a boundary? A trainer should not assume welcome or unwelcome merely from familiarity or a prior relationship.",
            "- **Sexual in nature.** Does the conduct have a sexual character — physical, verbal, non-verbal or digital? Not every unpleasant workplace interaction is sexual harassment.",
            "- **Workplace context.** Did the conduct arise at, from or during work — including work travel, events, transport, virtual meetings, messages or other work-connected spaces?",

            "## Forms of conduct to recognise",
            "- **Physical.** Unwanted touching or physical contact; sexual advances; blocking or following where the conduct is sexual in nature.",
            "- **Verbal.** Sexually coloured remarks; sexual jokes or innuendo; repeated sexual or personal propositions; sexualised comments about appearance or relationships.",
            "- **Non-verbal and digital.** Staring or ogling; sexually suggestive gestures or materials; pornography; unwelcome sexual messages, images or online conduct.",

            "## Two common patterns",
            "- **Quid pro quo — “this for that”.** A work-related benefit, opportunity or favourable treatment is linked, directly or indirectly, to sexual cooperation; or a detriment is threatened after refusal.",
            "- **Hostile or intimidating environment.** Sexual conduct or related circumstances create an intimidating, offensive, humiliating or hostile work environment, or interfere with work, health or safety.",
            "**Remember: recognition is not the same as deciding a complaint.**",

            "## Grey areas: pause before you label",
            "Future PoSH trainers will often be asked “Is this sexual harassment?” before enough facts are available. Use these questions to structure the discussion, identify what is known and recognise what still needs clarification.",
            "- Is the conduct sexual in nature?",
            "- What indicates that the conduct was unwelcome?",
            "- What is the workplace or work-related connection?",
            "- Was there repetition, escalation or continuation after a boundary was communicated?",
            "- Is there a hierarchy, dependency or other power imbalance?",
            "- What relevant messages, documents, witnesses or surrounding context may exist?",
            "- Could the behaviour also fall under another workplace policy or management process?",
            "- What information is still missing before a fair conclusion can be reached?",

            "## Important nuances",
            "- Consent may change or be withdrawn. Previously welcome conduct may later become unwelcome.",
            "- A consensual workplace relationship is not automatically sexual harassment, although separate professionalism or conflict-of-interest issues may arise.",
            "- Performance feedback, deadlines, work pressure or the ordinary exercise of management rights are not automatically sexual harassment simply because they are unwelcome.",
            "- Intent is not a statutory element by itself. Avoid reducing the analysis to “they did not mean it” or “it was only a joke”.",
            "- In training, help learners identify indicators and process — do not turn a classroom scenario into a final legal finding on incomplete facts.",

            "**Trainer takeaway.** A strong PoSH trainer teaches people to recognise concerns early while preserving fairness. The goal is not instant labelling; it is to understand the behaviour, context, boundaries and appropriate next step.",
          ],
        },

        {
          id: "p-recognising-apply",
          kind: "reading",
          title: "Apply your learning: PoSH, other misconduct, or more information?",
          minutes: 15,
          meta: "Practice · 2 scenarios",
          body: [
            "For each scenario, choose the response that best reflects the facts currently available. Then note the fact, context or missing information that influenced your decision. The purpose is not to rush to a label, but to practise disciplined recognition and analysis.",
            "- **A — potential PoSH concern.** The facts may require consideration under the PoSH framework.",
            "- **B — other workplace issue.** The conduct appears non-sexual on the facts provided.",
            "- **C — need more information.** The available facts are insufficient for a responsible conclusion.",

            "## Scenario 1 — repeated contact after a clear no",
            "A colleague repeatedly asks another employee out. She clearly says she is not interested and asks him to stop. He stops asking, but then begins staring at her persistently during meetings, in lifts and in common areas.",

            "## Scenario 2 — public performance criticism",
            "A manager tells an employee in front of the team that he is incompetent, lazy and needs to improve his work. The exchange is humiliating and inappropriate, but no sexual comments, gestures or conduct are described.",

            "Decide on each, write down the key fact that took you there, and bring your reasoning to the live session — the discussion is where this activity pays off.",
          ],
        },

        { id: "p-recognising-v1", kind: "video", title: "Awareness film — 1 of 4", minutes: 6, videoId: "nNwrPjV3P38" },
        { id: "p-recognising-v2", kind: "video", title: "Awareness film — 2 of 4", minutes: 6, videoId: "MjRcjAkb8_4" },
        { id: "p-recognising-v3", kind: "video", title: "Awareness film — 3 of 4", minutes: 6, videoId: "gmFyzVlBiR4" },
        { id: "p-recognising-v4", kind: "video", title: "Awareness film — 4 of 4", minutes: 6, videoId: "i5zSD6xve4w" },
      ],
    },

    /* ================================================================== */
    {
      id: "coverage",
      title: "Coverage, Definitions and Jurisdiction",
      summary: "Who is covered, what counts as a workplace, and which forum applies.",
      items: [
        {
          id: "p-coverage-guide",
          kind: "reading",
          title: "PoSH Coverage & Jurisdiction",
          minutes: 14,
          meta: "Quick reference · Module 6",
          body: [
            "Coverage and jurisdiction questions often arise before a complaint can be routed correctly. Use this to identify who may be covered, whether there is a workplace connection, and which complaint forum may be relevant.",

            "## 1. Who may be protected?",
            "PoSH protection is not limited to permanent employees. Under the Act the statutory complainant is an aggrieved woman, and coverage can extend across different forms of work and workplace interaction.",
            "- Regular, temporary, ad hoc and daily-wage workers.",
            "- Women engaged for remuneration, on a voluntary basis or otherwise.",
            "- Employees engaged directly or through an agent.",
            "- Contract workers, probationers, trainees and apprentices.",
            "- A woman visiting a workplace in connection with the workplace context.",

            "## 2. What can count as a workplace?",
            "Workplace is broader than the physical office. The key question is whether the place or interaction arose out of or during employment, or has a sufficient work-related connection.",
            "- Office premises, meeting rooms, cafeterias and common areas.",
            "- Work-related travel, conferences, client locations and official events.",
            "- Employer-provided transportation or work-related travel arrangements.",
            "- Team outings and other activities connected with work.",
            "- Work-from-home and virtual meetings.",
            "- Work-related email, messaging, social-media or other digital interactions.",
            "**Trainer reminder.** Do not decide jurisdiction only by asking “was it inside the office?” An off-site, after-hours or digital interaction may still require a workplace-nexus assessment.",

            "## 3. Which complaint forum may be relevant?",
            "- **Workplace with 10 or more employees** — Internal Committee (IC).",
            "- **Workplace with fewer than 10 employees** — Local Committee (LC).",
            "- **Complaint against the employer** — Local Committee (LC).",

            "## 4. A simple jurisdiction lens",
            "- **Who is involved?** Check the status of the aggrieved woman and respondent, and their relationship to work. Confirm whether the PoSH framework may apply.",
            "- **Where or how did it happen?** Office, travel, transport, client site, event, work-from-home or work-related digital interaction. Assess whether there is a workplace nexus.",
            "- **How many employees?** Ten or more indicates the IC; fewer than ten indicates the LC.",
            "- **Is the complaint against the employer?** If so, the Local Committee.",
            "- **Are facts incomplete?** Location, employment link, organisation size, reporting structure or digital context — do not guess; seek the missing information.",

            "## 5. What a PoSH trainer should reinforce",
            "- Coverage and forum should be identified from the facts, not assumptions.",
            "- An interaction occurring after working hours is not automatically outside the workplace context.",
            "- A virtual or digital interaction can still have a work-related nexus.",
            "- Not every uncomfortable workplace interaction is necessarily sexual harassment; other organisational policies may also be relevant.",
            "- Where important facts are missing, the responsible answer is to seek more information before concluding.",

            "**Quick decision path.** Person covered? → Workplace nexus? → Organisation size and respondent role? → Appropriate forum → Verify missing facts before advising.",
          ],
        },
      ],
    },

    /* ================================================================== */
    {
      id: "prevention",
      title: "Prevention and Internal Committee Governance",
      summary: "Whether a committee is properly constituted, documented, visible and able to function.",
      items: [
        {
          id: "p-ic-checklist",
          kind: "reading",
          title: "Internal Committee Constitution & Governance",
          minutes: 15,
          meta: "Quick reference checklist · Module 7",
          body: [
            "Use this to review whether an Internal Committee appears properly constituted, documented, visible and capable of functioning. Work through each item and note any action required.",

            "## 1. Applicability and coverage",
            "- Has the organisation identified each workplace or unit where an IC is required?",
            "- Is the applicable IC clearly mapped to the employees and workplace it covers?",

            "## 2. Composition",
            "- Is the Presiding Officer a senior woman employee, as required?",
            "- Are there at least two employee members?",
            "- Do employee members have suitable experience, commitment to the cause of women, social-work exposure or legal knowledge, as applicable?",
            "- Has an eligible External Member been appointed?",
            "- Are at least one-half of the total IC members women?",

            "## 3. Appointment and tenure",
            "- Has the IC been formally constituted through written appointment or constitution orders?",
            "- Are the appointment dates and tenure of members clearly recorded?",
            "- Is there a process to fill vacancies or replace members when required?",

            "## 4. Independence, ethics and confidentiality",
            "- Are potential conflicts of interest identified and managed?",
            "- Do members understand their duty to remain impartial and avoid prejudgment?",
            "- Have members been briefed on statutory confidentiality requirements?",

            "## 5. Capability and functioning",
            "- Have IC members received appropriate PoSH capability or inquiry training?",
            "- Can members receive complaints and understand the complaint-handling process?",
            "- Do members understand natural justice, procedural fairness and evidence-based inquiry?",
            "- Is the IC equipped to document proceedings and prepare reasoned findings and recommendations?",

            "## 6. Visibility and access",
            "- Are IC details and complaint routes clearly communicated to employees?",
            "- Are contact details accessible to remote and off-site employees as well?",
            "- Do employees know where and how to raise a PoSH complaint?",

            "## 7. Governance and records",
            "- Are IC meetings and governance reviews conducted and documented?",
            "- Are complaint, inquiry and committee records stored securely?",
            "- Are PoSH awareness and IC training records maintained?",
            "- Are annual reporting responsibilities understood and tracked?",

            "## 8. Special contexts, where applicable",
            "- For higher education institutions, have the additional composition and representation requirements been checked?",
            "- Does the organisation understand when the Local Committee may be the appropriate forum?",

            "**Trainer note.** This checklist is a quick diagnostic aid. A 'yes' response does not by itself establish full statutory compliance; organisational structure, applicable rules and factual context should be reviewed where necessary.",
          ],
        },
      ],
    },

    /* ================================================================== */
    {
      id: "inquiry",
      title: "Complaint Intake and Fair Inquiry",
      summary: "From the moment a complaint arrives to a report that holds up.",
      items: [
        {
          id: "p-intake-guide",
          kind: "reading",
          title: "Complaint Intake & Fair Inquiry",
          minutes: 18,
          meta: "Quick process guide · Module 8",
          body: [
            "The complaint-handling and inquiry sequence covered in the programme. It is a reference aid, not a substitute for the PoSH Act, the Rules, applicable service rules or organisation policy.",

            "## 1. Receive and acknowledge the complaint",
            "- Receive the written complaint and available supporting material through the recognised complaint route.",
            "- Record the date of receipt and preserve the complaint and related records securely.",
            "- Check whether the complaint falls within the relevant workplace and forum, and note applicable timelines.",
            "- Communicate respectfully and avoid judging, interrogating or promising a particular outcome at intake.",

            "## 2. Explain options and early process",
            "- Explain the role of the Internal Committee and the next procedural steps.",
            "- Where the aggrieved woman requests conciliation, consider it before inquiry; a monetary settlement is not the basis of conciliation.",
            "- If the matter proceeds formally, ensure the members handling the inquiry are free from relevant conflicts of interest.",
            "- Provide the respondent the complaint and material required by the applicable procedure, and allow the prescribed opportunity to respond.",

            "## 3. Prepare the inquiry file and plan",
            "- Identify each allegation separately and prepare a clear chronology of dates and events.",
            "- List relevant witnesses, documents, messages, emails, records or other material that may assist the inquiry.",
            "- Prepare focused questions for the complainant, respondent and witnesses; avoid unnecessary graphic or humiliating questioning.",
            "- Plan hearings, logistics and timelines, and maintain a confidential, organised case file.",

            "## 4. Conduct a fair inquiry",
            "- Follow the principles of natural justice and give both parties a fair opportunity to present relevant information.",
            "- Listen without prejudgment and distinguish emotion, assumption and opinion from evidentiary material.",
            "- Provide sufficient adverse material to enable a meaningful response, in accordance with the applicable procedure.",
            "- Consider interim measures requested or appropriate during the inquiry, without treating them as a finding on the merits.",

            "## 5. Assess evidence and reach reasoned findings",
            "- Check whether the information collected is complete enough to address each allegation.",
            "- Compare statements, identify areas of agreement and disagreement, and examine supporting or circumstantial evidence.",
            "- Assess each allegation against the relevant law, rules, policy and evidence rather than intuition or stereotype.",
            "- Record clear reasons for the finding on each allegation.",

            "## 6. Recommend and report",
            "- Where an allegation is not upheld, recommend no action on that allegation.",
            "- Where an allegation is upheld, make recommendations in line with the Act, applicable service rules or policy, and the facts found.",
            "- Prepare the inquiry report with the process followed, material considered, analysis, findings and recommendations.",
            "- Make the report available to the concerned parties and employer as required, and preserve confidentiality.",

            "## Key timelines covered in the programme",
            "- **Complaint filing** — ordinarily within 3 months from the incident, or the last incident in a series; an extension may be considered.",
            "- **Complaint shared with respondent** — within 7 working days.",
            "- **Respondent response** — within 10 working days.",
            "- **Inquiry completion** — within 90 days.",
            "- **Inquiry report after completion** — within 10 days of completion of the inquiry.",
            "- **Appeal** — within 90 days.",

            "**Fair-process reminder.** A complaint is an allegation requiring fair examination. The IC should neither presume the complaint is proved nor presume it is false. Confidentiality, impartiality, opportunity to respond and reasoned decision-making run through the entire process.",

            "## At intake: do and avoid",
            "- **Do** create an enabling, respectful environment. **Avoid** aggressive or adversarial questioning.",
            "- **Do** listen attentively and without preconceived conclusions. **Avoid** insisting on unnecessary graphic detail.",
            "- **Do** treat both complainant and respondent with respect. **Avoid** interrupting or debating a party while they speak.",
            "- **Do** record relevant information accurately and securely. **Avoid** discussing complaint details casually or beyond those who need to know.",

            "## Inquiry discipline",
            "- Keep the allegation, the evidence and the finding distinct.",
            "- Give both parties a fair opportunity to present and respond to relevant material.",
            "- Maintain confidentiality while preserving procedural fairness.",
            "- Document the reasons that support the final findings and recommendations.",
          ],
        },

        {
          id: "p-report-checklist",
          kind: "reading",
          title: "Inquiry Report Structure",
          minutes: 12,
          meta: "Quick checklist · Module 8",
          body: [
            "Use this when reviewing or preparing the structure of an inquiry report. The report should reflect the actual process and evidence in the case; unnecessary personal information should not be added merely to complete a template.",

            "## A. Case and committee details",
            "- Case or reference number, where used.",
            "- Names and designations of the parties, as required for the confidential report.",
            "- Relevant employment and reporting relationship details.",
            "- Names and designations of the IC members involved.",
            "- Date the complaint was received.",
            "- Date the complaint and material were shared with the respondent.",
            "- Date the inquiry was completed and the report prepared.",

            "## B. Allegations and jurisdiction",
            "- Each allegation stated clearly and separately.",
            "- Relevant dates, places and context.",
            "- Workplace and PoSH applicability considered.",
            "- Any jurisdiction or limitation issue recorded.",

            "## C. Process followed",
            "- How the complaint was received and acknowledged.",
            "- Respondent response and material received.",
            "- Conciliation details, if requested or applicable.",
            "- Interim measures, if any.",
            "- Inquiry meetings, hearings and attendance.",
            "- Procedural opportunities provided to both parties.",
            "- Natural justice and conflict-of-interest considerations.",

            "## D. Witnesses and evidence",
            "- Witnesses considered and relevant statements.",
            "- Documents, emails, chats, records or other evidence considered.",
            "- Relevant circumstantial evidence, if any.",
            "- Material contradictions or corroboration identified.",
            "- Chronology of relevant events established.",

            "## E. Analysis and findings",
            "- Each allegation analysed against relevant evidence.",
            "- Applicable legal or policy provision identified where needed.",
            "- Reasons stated clearly for each finding.",
            "- Findings distinguish fact and evidence from assumption.",
            "- Outcome for each allegation recorded clearly.",

            "## F. Recommendations",
            "- Recommendation linked to the findings.",
            "- Where a complaint is not upheld, a no-action recommendation recorded as appropriate.",
            "- Where a complaint is upheld, action aligned with applicable rules and policy.",
            "- Compensation considerations addressed where relevant.",
            "- Any rehabilitation or workplace support recommendation recorded where appropriate.",

            "## G. Finalisation and confidentiality",
            "- Report notes confidentiality requirements.",
            "- Report distribution and availability recorded as required.",
            "- Reasons for recommendations documented.",
            "- Any conflict or personal interest declaration considered, where used.",
            "- Report signed and authenticated by the participating IC members.",

            "**Quality check.** Before finalising, ask: does the report show what was alleged, how the process was conducted, what evidence was considered, why the IC reached each finding, and how each recommendation follows from those findings? The reasoning should be understandable from the report itself.",
          ],
        },
      ],
    },

    /* ================================================================== */
    {
      id: "additional-videos",
      title: "Additional Videos",
      summary: "Further viewing, alongside the programme.",
      items: [
        { id: "p-extra-v1", kind: "video", title: "Further viewing — 1 of 2", minutes: 8, videoId: "kkS6FcRIAMc" },
        { id: "p-extra-v2", kind: "video", title: "Further viewing — 2 of 2", minutes: 8, videoId: "uts4F3RHjhM" },
      ],
    },

    /* ================================================================== */
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

    /* ================================================================== */
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

    /* ================================================================== */
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
            { q: "A PoSH complaint should ordinarily be made within:", options: ["30 days", "3 months", "6 months", "1 year"], answer: 1, explanation: "Three months from the incident, extendable where the committee is satisfied there was reason for the delay." },
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

    /* ================================================================== */
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

    /* ================================================================== */
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

  /* The files still exist, as a take-away rather than as a lesson. */
  readingKit: [
    { title: "CLEAR PoSH Framework handout", meta: "PDF · 5 pages", href: "/assets/posh/clear-posh-framework-handout.pdf" },
    { title: "Recognising Sexual Harassment — quick reference", meta: "PDF · 2 pages", href: "/assets/posh/recognising-sexual-harassment-quick-reference.pdf" },
    { title: "PoSH Coverage and Jurisdiction — quick reference", meta: "PDF · 2 pages", href: "/assets/posh/posh-coverage-and-jurisdiction-quick-reference.pdf" },
    { title: "Internal Committee — quick reference checklist", meta: "PDF · 2 pages", href: "/assets/posh/internal-committee-quick-reference-checklist.pdf" },
    { title: "Complaint Intake and Fair Inquiry — process guide", meta: "PDF · 2 pages", href: "/assets/posh/complaint-intake-and-fair-inquiry-process-guide.pdf" },
    { title: "Inquiry Report Structure — checklist", meta: "PDF · 2 pages", href: "/assets/posh/inquiry-report-structure-checklist.pdf" },
    { title: "Dignity, Respect and Psychological Safety", meta: "PDF · 2 pages", href: "/assets/posh/dignity-respect-psychological-safety.pdf" },
  ],
};
