// Generic disclaimer / privacy policy content.
// NOTE: template wording — have it reviewed by a legal advisor before go-live.
import { contact } from "./site";

export type LegalSection = { h: string; p?: string[]; list?: string[] };
export type LegalDoc = {
  slug: string;
  title: string;
  intro: string;
  sections: LegalSection[];
};

const ORG = "Levitate PeopleSoft";

export const privacyPolicy: LegalDoc = {
  slug: "privacy-policy",
  title: "Privacy Policy",
  intro: `${ORG} respects your privacy. This policy explains what information we collect through this website, why we collect it, how we use it and the choices available to you.`,
  sections: [
    {
      h: "Information we collect",
      p: [
        "We only collect information you choose to give us. When you submit an enquiry form on this website, we collect the details you enter — typically your name, email address, phone or WhatsApp number, organization or institution name, the nature of your enquiry, approximate participant numbers, preferred delivery mode and any message you write.",
        "Our website may also collect limited technical information automatically, such as browser type, device type and pages visited, in aggregate form. This is used only to understand how the site is performing.",
      ],
    },
    {
      h: "How we use your information",
      list: [
        "To respond to your enquiry and share relevant program or service information",
        "To prepare and send proposals, cohort dates or engagement details you have asked for",
        "To maintain a record of our correspondence with you",
        "To improve our programs, services and website experience",
      ],
    },
    {
      h: "We do not share your personal information",
      p: [
        "As per our data privacy commitment, we do not sell, rent or trade your personal information, and we do not share it with third parties for their own marketing purposes.",
        "Your details remain securely in our database and are used only to respond to your enquiry and to provide the services you have asked about. Information may be shared only where it is necessary to deliver a service you have requested, or where we are required to do so by law.",
      ],
    },
    {
      h: "Data retention",
      p: [
        "We retain enquiry information for as long as it is needed to respond to you, to deliver the services requested, and to meet any legal or record-keeping obligations. You may ask us to delete your information at any time.",
      ],
    },
    {
      h: "Data security",
      p: [
        "We take reasonable technical and organisational measures to protect the information you share with us against loss, misuse and unauthorised access. No method of transmission over the internet is completely secure, but we work to protect your information using appropriate safeguards.",
      ],
    },
    {
      h: "Cookies",
      p: [
        "This website may use essential cookies required for the site to function, and may use analytics cookies to understand aggregate usage. You can control or disable cookies through your browser settings.",
      ],
    },
    {
      h: "Third-party content",
      p: [
        "Some pages embed third-party content, such as videos hosted on YouTube, or link to external websites. Those services have their own privacy policies, and we are not responsible for their practices. We use privacy-enhanced embedding where available.",
      ],
    },
    {
      h: "Your choices and rights",
      list: [
        "Ask what personal information we hold about you",
        "Ask us to correct information that is inaccurate or incomplete",
        "Ask us to delete your information from our records",
        "Withdraw consent for further communication at any time",
      ],
    },
    {
      h: "Confidentiality in training and advisory work",
      p: [
        "Information shared with us during training programs, assessments, facilitation practice or HR advisory engagements is treated as confidential. Sensitive workplace matters discussed in PoSH, POCSO, wellbeing or advisory contexts are handled with professional discretion and are not disclosed except where required by law.",
      ],
    },
    {
      h: "Changes to this policy",
      p: ["We may update this policy from time to time. Any changes will be published on this page."],
    },
    {
      h: "Contact us",
      p: [
        `If you have questions about this policy, or wish to exercise any of the choices above, contact us at ${contact.email} or ${contact.phone}. ${ORG}, ${contact.address}.`,
      ],
    },
  ],
};

export const disclaimer: LegalDoc = {
  slug: "disclaimer",
  title: "Disclaimer",
  intro: `The information on this website is provided by ${ORG} for general information about our certification programs, training solutions and advisory services. Please read this disclaimer carefully.`,
  sections: [
    {
      h: "General information only",
      p: [
        "The content on this website is provided for general information and awareness purposes. While we take care to keep information accurate and current, we make no representation or warranty of any kind about the completeness, accuracy or suitability of the information for any particular purpose.",
      ],
    },
    {
      h: "Not legal or professional advice",
      p: [
        "Our programs and website content cover subjects that intersect with law and regulation, including the Prevention of Sexual Harassment (PoSH) framework, POCSO and related workplace compliance matters. This content is educational and is not legal advice.",
        "Nothing on this website, and nothing delivered in an awareness or training session, creates a lawyer-client or other professional advisory relationship. Organizations should obtain independent legal counsel for specific compliance obligations, investigations or decisions.",
      ],
    },
    {
      h: "Training and certification outcomes",
      p: [
        "Certification is awarded on successful completion of program requirements, including participation, practice activities and assessment where applicable. Completing a program does not guarantee employment, assignments, business outcomes or any specific professional result.",
        "Certificates issued by us confirm completion of our program. They are not a government licence, statutory accreditation or authorisation to practise in any regulated capacity.",
      ],
    },
    {
      h: "Advisory engagements",
      p: [
        "HR advisory and workplace culture support is provided on the basis of the information made available to us by the client. Recommendations are practical and experience-led, and responsibility for implementation, decisions and compliance remains with the client organization.",
      ],
    },
    {
      h: "Wellbeing content",
      p: [
        "Workplace mental health and wellbeing content is intended to build awareness, sensitivity and supportive workplace practices. It is not a substitute for diagnosis, therapy, counselling or treatment by a qualified mental health professional. If you or someone at your workplace needs support, please seek appropriate professional help.",
      ],
    },
    {
      h: "External links and third-party content",
      p: [
        "This website may contain links to external sites and embedded third-party content. We do not control and are not responsible for the content, accuracy or practices of those sites and services.",
      ],
    },
    {
      h: "Logos and trademarks",
      p: [
        "Organization names, logos and marks shown on this website belong to their respective owners and are displayed to indicate organizations and institutions we have worked with, or credentials we hold. Their display does not imply endorsement unless expressly stated.",
      ],
    },
    {
      h: "Testimonials and imagery",
      p: [
        "Testimonials reflect individual experiences and are not a guarantee of any particular outcome. Photographs shown on this website are from our sessions and programs, or are used for illustrative purposes.",
      ],
    },
    {
      h: "Limitation of liability",
      p: [
        `To the extent permitted by law, ${ORG} shall not be liable for any loss or damage arising from reliance on information contained on this website.`,
      ],
    },
    {
      h: "Contact us",
      p: [`For questions about this disclaimer, contact us at ${contact.email} or ${contact.phone}.`],
    },
  ],
};

export const legalDocs: Record<string, LegalDoc> = {
  [privacyPolicy.slug]: privacyPolicy,
  [disclaimer.slug]: disclaimer,
};
