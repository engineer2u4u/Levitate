/**
 * POCSO & Child Safety Facilitator Program (POCSO TTT) — the learner's journey.
 *
 * Authored content, like `poshContent.ts`, rather than the syllabus-derived
 * kind: the curriculum says what the programme covers, this is what a delegate
 * actually works through.
 *
 * Three modules at this stage, which is deliberate and not a stub. Orientation
 * opens at enrolment; the case laboratory and the facilitator toolkit are
 * released by the office after the live sessions they belong to — the same
 * arrangement PoSH uses, and the reason `release` lives in the database rather
 * than here.
 *
 * Item ids are the contract with the database: `courses.modules[].itemIds`
 * lists them, progress is stored against them, and `issue_certificate` insists
 * on every one. Renaming an id silently resets a delegate's progress and can
 * stall certificates for the whole course, so they are append-only in
 * practice.
 */

import type { CourseContent } from "./courseContent";

export const POCSO_CONTENT: CourseContent = {
  slug: "pocso-child-safety",
  title: "POCSO & Child Safety Facilitator Program (POCSO TTT)",
  intro:
    "The programme deals with child sexual abuse, safeguarding, disclosures and the legal duties that follow them. Start with the orientation film and the learning agreement; the case laboratory and the facilitator toolkit open as the live sessions are held.",

  modules: [
    /* ================================================================== */
    {
      id: "orientation",
      title: "Orientation",
      summary: "Watch before the first live session, then sign the agreement.",
      items: [
        {
          id: "pc-orientation-film",
          kind: "video",
          title: "Programme Overview",
          minutes: 5,
          videoId: "yFmRfjeasXM",
          body: [
            "Your facilitator introduces the programme: what it covers, how the sessions run, and what certification asks of you.",
          ],
        },

        {
          id: "pc-orientation-agreement",
          kind: "reading",
          title: "Sensitive Learning Agreement",
          minutes: 8,
          meta: "Reading · signature required",
          body: [
            "This programme addresses child sexual abuse, safeguarding, disclosures and legal responsibilities. The agreement below creates a respectful, psychologically safe and professionally responsible learning environment. Read it before the first live session, and sign at the end to confirm you accept it.",

            "## Participant commitments",
            "- I will engage respectfully and avoid victim-blaming, shaming or dismissive language.",
            "- I will not share identifiable details of children, survivors, families or ongoing cases in group discussions.",
            "- I understand that personal disclosure is never required as part of participation.",
            "- I will avoid graphic or sensational descriptions that are unnecessary for learning.",
            "- I understand that confidentiality has limits where child-safeguarding or legal reporting responsibilities may apply.",
            "- I will respect professional boundaries and will not use the programme to diagnose, investigate or determine guilt in a specific case.",
            "- I will use case examples, tools and resources in a child-sensitive, age-appropriate and responsible manner.",
            "- I understand that the programme is educational and does not replace case-specific legal advice, investigation, therapy or statutory processes.",
            "- If any content is personally distressing, I may step away and seek appropriate support.",

            "## Programme principle",
            "Protect with knowledge. Respond with responsibility. Facilitate with care.",
          ],
          acknowledgement: {
            statement:
              "I have read and understood the Sensitive Learning Agreement and agree to participate in the programme in accordance with these principles. I will engage respectfully, protect the privacy of children, survivors and families, avoid prejudging any specific case, and use the programme's materials in a child-sensitive and responsible manner.",
          },
        },
      ],
    },

    /* ================================================================== */
    {
      id: "case-laboratory",
      title: "Case Laboratory",
      summary: "Ten judgments, worked through against the Act.",
      items: [
        {
          id: "pc-case-lab",
          kind: "download",
          title: "Applied Case Laboratory — 10 Judgment Cases",
          minutes: 60,
          meta: "PDF · 40 pages",
          body: [
            "Ten decided cases, taken through the facts, the questions the court had to answer and what each one settles about applying the Act in practice.",
            "Download the pack and bring your reasoning to the live laboratory session — the discussion is where this work pays off, and arriving having only skimmed it is the difference between watching the session and being in it.",
          ],
          downloads: [
            {
              title: "Levitate PeopleSoft POCSO Applied Case Laboratory — 10 Judgment Cases",
              meta: "PDF · 40 pages",
              href: "/assets/pocso/pocso-applied-case-laboratory.pdf",
            },
          ],
        },
      ],
    },

    /* ================================================================== */
    {
      id: "toolkit",
      title: "Facilitator Toolkit",
      summary: "What you take away to run your own sessions.",
      items: [
        {
          id: "pc-toolkit",
          kind: "download",
          title: "Facilitator Toolkit",
          minutes: 10,
          meta: "Materials in preparation",
          body: [
            "Session plans, slide decks, facilitation guides and templates — the material you use to run POCSO and child safety sessions of your own once you are certified. Everything in it is yours to use in your own practice.",
          ],
          // Empty on purpose until the files arrive. A download item with
          // nothing in it says so and lets the learner past, rather than
          // holding the Proceed button on a file that does not exist yet.
          downloads: [],
        },
      ],
    },
  ],

  // The kit released at the end of the course is the toolkit module above, so
  // there is nothing separate to hold back here.
  readingKit: [],
};
