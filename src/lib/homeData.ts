// Content ported from "Levitate Homepage Light.dc.html" (Claude Design project)

export const contact = {
  email: "contactus@levitatepeoplesoft.com",
  phone: "+91-70656 45999",
  whatsapp: "https://wa.me/917065645999",
};

export const navLinks = ["Home", "Services", "Certifications", "About Us", "Contact"];

export type Service = { num: string; title: string; desc: string };
export const services: Service[] = [
  {
    num: "01",
    title: "Train-the-Trainer Certification Programs",
    desc: "Practice-led workplace facilitator certifications in Corporate Leadership Facilitation, Diversity, Equity & Inclusion, Applied Workplace Mental Health & Wellbeing, PoSH and POCSO — along with HR Edge certification for future HR professionals.",
  },
  {
    num: "02",
    title: "Corporate Training Solutions",
    desc: "Customized, outcome-focused interventions that strengthen leadership, communication, collaboration and culture.",
  },
  {
    num: "03",
    title: "Institutional Training",
    desc: "Campus-to-corporate readiness, communication, interview preparation and professional skills for students.",
  },
  {
    num: "04",
    title: "HR Advisory & Workplace Culture Consulting",
    desc: "PoSH compliance, IC advisory, HR policy review, people practices and employee experience support.",
  },
];

export type BlueprintStep = {
  num: string;
  title: string;
  short: string;
  img: string;
  desc: string;
  chips: string[];
};
export const blueprintSteps: BlueprintStep[] = [
  {
    num: "1",
    title: "Diagnose",
    short: "Understand context & gaps",
    img: "/assets/workshop-tables.jpeg",
    desc: "We begin by understanding the business context, participant profile, capability gaps and workplace challenges — through stakeholder discussions, Training Needs Analysis, role expectations, surveys and real organizational priorities.",
    chips: ["Stakeholder discussions", "Training Needs Analysis", "Surveys & feedback", "Role expectations"],
  },
  {
    num: "2",
    title: "Design",
    short: "Build the learning journey",
    img: "/assets/audience-red-hall.jpeg",
    desc: "Insights become a focused learning journey — defining outcomes, designing modules, selecting the right format, building case scenarios and aligning the program to the needs of your team, institution or organization.",
    chips: ["Outcome definition", "Module design", "Case scenarios", "Format selection"],
  },
  {
    num: "3",
    title: "Facilitate",
    short: "Bring learning to life",
    img: "/assets/workshop-handsup.jpeg",
    desc: "We bring learning to life through interactive facilitation — real workplace cases, role plays, reflection exercises, group discussions, practical tools and blended learning methods that keep participants engaged.",
    chips: ["Role plays", "Workplace cases", "Group discussions", "Blended learning"],
  },
  {
    num: "4",
    title: "Measure",
    short: "Make impact visible",
    img: "/assets/founder-speaking.jpeg",
    desc: "We assess learning impact through feedback, reflection, pre- and post-learning indicators, action plans, manager inputs and outcome reviews — so learning translates into visible behaviour and workplace application.",
    chips: ["Pre/post indicators", "Action plans", "Manager inputs", "Outcome reviews"],
  },
];

export type Cert = {
  num: string;
  tag: string;
  title: string;
  sub: string;
  desc: string;
};
export const certs: Cert[] = [
  {
    num: "01",
    tag: "Leadership Certification · TTT",
    title: "Corporate Leadership Facilitator Program (CLF TTT)",
    sub: "Powered by the HUMAN Leadership Framework",
    desc: "Facilitate leadership conversations on trust, coaching, feedback, accountability and team growth.",
  },
  {
    num: "02",
    tag: "DEI · TTT",
    title: "Inclusive Workplace Facilitator Program (DEI TTT)",
    sub: "Diversity, Equity & Inclusion Certification",
    desc: "Lead meaningful conversations on inclusion, unconscious bias, belonging and psychological safety.",
  },
  {
    num: "03",
    tag: "Workplace Wellbeing · TTT",
    title: "Workplace Wellbeing Facilitator Program (Mental Health & Wellbeing TTT)",
    sub: "Applied Mental Health & Wellbeing Certification",
    desc: "Facilitate workplace mental-health conversations with confidence, sensitivity and ethical responsibility.",
  },
  {
    num: "04",
    tag: "PoSH · TTT",
    title: "PoSH & Workplace Dignity Facilitator Program (PoSH TTT)",
    sub: "PoSH Train-the-Trainer Certification",
    desc: "PoSH awareness, manager sensitisation and IC capability building — with legal clarity and maturity.",
  },
  {
    num: "05",
    tag: "POCSO · TTT",
    title: "POCSO & Child Safety Facilitator Program (POCSO TTT)",
    sub: "POCSO Train-the-Trainer Certification",
    desc: "Child-safety awareness sessions with sensitivity, legal clarity and responsible communication.",
  },
  {
    num: "06",
    tag: "HR Edge certification · TTT",
    title: "HR Edge certification (HR Students)",
    sub: "Integrated DEI, PoSH & Wellbeing Certification",
    desc: "A career advantage for MBA-HR, PGDM-HR and early-career HR professionals entering modern workplaces.",
  },
];

export type WhyPoint = { t: string; d: string };
export const whyPoints: WhyPoint[] = [
  {
    t: "Global content with workplace relevance",
    d: "Global workplace content, practical HR insights and real-world application.",
  },
  {
    t: "Practice-led learning",
    d: "Cases, role plays, reflection, discussion and facilitation practice — not only theory.",
  },
  {
    t: "Designed for sensitive conversations",
    d: "Leadership, DEI, wellbeing, PoSH and POCSO facilitated with confidence, clarity and care.",
  },
  {
    t: "Trainer toolkits included",
    d: "Templates, case studies, facilitation guides, session plans and workplace-ready tools.",
  },
  {
    t: "Assessment-based certification",
    d: "Linked to participation, practice, reflection and assessment — not just attendance.",
  },
];

export type ImpactStat = {
  to: number;
  dec: number;
  suffix: string;
  label: string;
};
export const impactStats: ImpactStat[] = [
  { to: 2000, dec: 0, suffix: "+", label: "Participants trained" },
  { to: 15, dec: 0, suffix: "+", label: "Years global HR experience" },
  { to: 35, dec: 0, suffix: "+", label: "Years HR legacy (ONGC)" },
];

export type VideoTestimonial = {
  /** YouTube video id — also drives the card thumbnail via i.ytimg.com. */
  id: string;
  /** The clip's YouTube title. Not shown on the card — it names the play
   *  button and the lightbox iframe for screen readers. */
  title: string;
  /** Vertical (Shorts) clip — the lightbox sizes itself 9:16 instead of 16:9. */
  portrait?: boolean;
};

/** Short client clips, played in the homepage lightbox. */
export const videoTestimonials: VideoTestimonial[] = [
  { id: "Nk4QnjDjhMM", title: "Advocate Esha Pimpulekar Shares Her Experience with Parichita | POCSO Training Testimonial" },
  { id: "pFPoeH8_Szs", title: "GenXAI Shares Their Experience with Parichitta | Client Testimonial" },
  { id: "omuq1o5ZNLk", title: "Poonam Bharkat Shares Her Experience with Parichitta | Client Testimonial" },
  { id: "ZQ4Sc2QetDM", title: "Priyanka Pawar Shares Her Experience with Parichita's Training Sessions | Client Testimonial" },
  { id: "n_86rMA9hPM", title: "Archana Malhotra Shares Her Experience with Parichita | POCSO Training Testimonial", portrait: true },
];

export type Testimonial = {
  initials: string;
  name: string;
  role: string;
  quote: string;
};
export const testimonials: Testimonial[] = [
  {
    initials: "KV",
    name: "Kanishk Vij",
    role: "International Affairs | Diplomacy | Indian Politics | Public Policy, Konrad-Adenauer-Stiftung",
    quote:
      "Understanding unconscious bias is critical for anyone shaping public policy — the decisions we make today affect diverse communities in ways we don't always see. Levitate's session gave us the tools to recognise those blind spots, which is essential training for future policymakers and bureaucrats.",
  },
  {
    initials: "NG",
    name: "Naresh Goli",
    role: "Founder, Cliniwings",
    quote:
      "Training has helped our students get truly corporate-ready. The practical, real-world approach to personality development and interview skills has made a visible difference in how confidently they step into the professional world.",
  },
  {
    initials: "DK",
    name: "Dilpreet Kaur",
    role: "Associate Director, Chitkara",
    quote:
      "Levitate's institutional training has been instrumental in preparing our students to be corporate-ready. From personality development to mastering the art of interviews in a real work environment, the sessions gave students practical exposure they simply don't get in a classroom.",
  },
  {
    initials: "MB",
    name: "Manisha Bisht",
    role: "HR Manager, Krystelis",
    quote:
      "As an IC member, the quarterly sessions run by Levitate have made a real difference. They keep us updated, help us handle inquiries with more confidence, and give us a space to ask questions we wouldn't otherwise get answered.",
  },
  {
    initials: "KP",
    name: "Khushboo Paliwal",
    role: "VP, GenXAI",
    quote:
      "The quarterly IC sessions with Levitate have been extremely valuable for our Internal Committee. Each session brings clarity on evolving compliance requirements and practical guidance on handling real cases.",
  },
];

export const tickerA = [
  "Corporate Leadership Facilitation",
  "Diversity, Equity & Inclusion",
  "Workplace Mental Health & Wellbeing",
  "PoSH Train-the-Trainer",
  "POCSO & Child Safety",
  "SHRM recertification provider",
  "HR Edge certification (HR Students)",
  "Flexible Training Modes",
  "Delivered by Industry Experts",
  "Hands-On Learning",
];

export const tickerB = [
  "ISO Certified Organization",
  "DPIIT Recognition",
  "UDYAM Recognition",
  "2000+ Participants Trained",
  "SHRM recertification provider",
  "Train-the-Trainer Programs",
  "Campus to Corporate",
  "HR Advisory & Culture Consulting",
  "Assessment-Based Certification",
  "Trainer Toolkits Included",
];

export const gallery = [
  "/assets/founder-speaking.jpeg",
  "/assets/group-chitkara.jpeg",
  "/assets/session-auditorium-talk.jpg",
  "/assets/workshop-tables.jpeg",
  "/assets/audience-red-hall.jpeg",
  "/assets/session-office-workshop.jpg",
  "/assets/workshop-handsup.jpeg",
  "/assets/outdoor-group.jpeg",
  "/assets/plant-gift.jpeg",
  "/assets/school-group.jpeg",
  "/assets/students-group.png",
  "/assets/award-speaker.jpeg",
];

export const founders = [
  {
    img: "/assets/parichita.jpg",
    alt: "Parichita Kotnala speaking",
    imgPos: "50% 50%",
    name: "Parichita Kotnala",
    role: "Founder & Managing Partner · Global HR Leader",
    bio: "15+ years of global HR leadership across India, the UK, Europe and North America — spanning leadership enablement, workplace culture, DEI, PoSH, POCSO, wellbeing and people advisory. She leads Levitate's practice-led certification programs for credible workplace facilitators.",
  },
  {
    img: "/assets/ravindra.png",
    alt: "Mr. Ravindra Prem Nath",
    imgPos: "50% 30%",
    name: "Mr. Ravindra Prem Nath",
    role: "Director",
    bio: "35+ years of institutional HR leadership at one of India's leading public sector enterprises — people management, employee relations, HR governance and organizational learning. He founded Levitate PeopleSoft in 2023 and guides it with deep practical HR judgment.",
  },
];
