/**
 * Certificate layout, ported from the LMS admin's editable format.
 *
 * The finished artwork ("plate") is the background and only the fields that
 * change are drawn over it, at coordinates measured from the reference. That
 * is what keeps the output identical to the design rather than a lookalike —
 * the trademarks, the engraved border and the signatures stay as artwork.
 *
 * The site only ever shows specimen certificates, so the admin's drawn
 * fallback, PNG export and sharing are not carried over.
 */

/** One canvas per format, matching each plate's own proportions. */
export const CANVASES = {
  shrm: { w: 1536, h: 1024 },
  excellence: { w: 1600, h: 900 },
} as const;

export type CertificateTemplate = keyof typeof CANVASES;

export const PLATES: Record<CertificateTemplate, string> = {
  shrm: "/certificates/shrm.jpg",
  excellence: "/certificates/excellence.jpg",
};

/**
 * Splits text into lines of at most `max` characters, breaking on spaces.
 *
 * SVG text does not wrap, and a certificate carries exactly one piece of
 * unpredictable text — the course name.
 */
export function wrap(text: string, max: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [""];
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    if (!line) line = w;
    else if (`${line} ${w}`.length <= max) line += ` ${w}`;
    else {
      lines.push(line);
      line = w;
    }
  }
  lines.push(line);
  return lines;
}

export type RichWord = { text: string; bold: boolean };
export type RichLine = RichWord[];

/**
 * Wraps a run of mixed-weight words into lines.
 *
 * The Award format sets the course title on the same line as its lead-in, so
 * the two cannot be laid out as separate blocks without gaining a line the
 * artwork has no room for.
 */
export function wrapRich(words: RichWord[], max: number): RichLine[] {
  const lines: RichLine[] = [];
  let line: RichLine = [];
  let length = 0;

  for (const word of words) {
    const cost = (line.length ? 1 : 0) + word.text.length;
    if (line.length && length + cost > max) {
      lines.push(line);
      line = [word];
      length = word.text.length;
    } else {
      line.push(word);
      length += cost;
    }
  }
  if (line.length) lines.push(line);
  return lines.length ? lines : [[]];
}

export const richWords = (text: string, bold: boolean): RichWord[] =>
  text.trim().split(/\s+/).filter(Boolean).map((t) => ({ text: t, bold }));

/** Splits `**emphasis**` out of a line of copy. */
export function parseRich(text: string): RichWord[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .flatMap((chunk) =>
      chunk.startsWith("**") && chunk.endsWith("**")
        ? richWords(chunk.slice(2, -2), true)
        : richWords(chunk, false),
    );
}

/**
 * Merges neighbouring words of the same weight into one run — one `tspan` per
 * weight change rather than one per word.
 */
export function runsOf(line: RichLine): RichWord[] {
  const runs: RichWord[] = [];
  for (const word of line) {
    const last = runs[runs.length - 1];
    if (last && last.bold === word.bold) last.text += ` ${word.text}`;
    else runs.push({ text: word.text, bold: word.bold });
  }
  return runs;
}

/**
 * Fits `count` lines into a fixed band, centred on it.
 *
 * A plate's text sits at fixed coordinates, so anything drawn over it has to
 * stay inside the space the artwork left. Long titles get tighter leading and
 * smaller type instead of more room.
 */
export function fitBlock(count: number, centre: number, steps: number[], sizes: number[]) {
  const i = Math.min(count - 1, steps.length - 1);
  const step = steps[Math.max(0, i)];
  const size = sizes[Math.max(0, i)];
  return { step, size, startY: centre - ((count - 1) * step) / 2 };
}

/** A region of the plate covered before the real value is written over it. */
export type MaskRegion = { id: string; x: number; y: number; w: number; h: number };

export const MASKS: Record<CertificateTemplate, MaskRegion[]> = {
  // Measured off the artwork. Every rectangle stays inside the plate's white
  // field — a patch that strayed onto the engraved border would erase it.
  shrm: [
    { id: "name", x: 200, y: 338, w: 1150, h: 84 },
    // 478 threads a six-pixel gap: the artwork's "Completed the" drops its p to
    // ~476, and the course title's capitals start at ~481.
    { id: "course", x: 250, y: 478, w: 1050, h: 84 },
    { id: "pdcs", x: 330, y: 610, w: 900, h: 46 },
  ],
  excellence: [
    { id: "name", x: 480, y: 268, w: 1040, h: 86 },
    // The whole three-line paragraph, redrawn rather than patched around: the
    // course title shares a line with its lead-in.
    { id: "course", x: 450, y: 368, w: 1100, h: 124 },
    { id: "chip", x: 740, y: 505, w: 520, h: 58 },
    { id: "certId", x: 200, y: 780, w: 180, h: 34 },
    { id: "issued", x: 200, y: 828, w: 180, h: 34 },
  ],
};

/**
 * The plate's own background colour behind each patch.
 *
 * Sampled from the artwork once and written down, rather than read from a
 * canvas on every page view: the plates ship with the build and do not change,
 * so there is nothing to discover at runtime. Note `certId` and `issued` sit on
 * the blue panel — assuming white would leave a visible block there.
 */
export const MASK_COLORS: Record<CertificateTemplate, Record<string, string>> = {
  shrm: {
    name: "rgb(254, 254, 254)",
    course: "rgb(255, 255, 255)",
    pdcs: "rgb(254, 254, 254)",
  },
  excellence: {
    name: "rgb(254, 254, 254)",
    course: "rgb(253, 253, 253)",
    chip: "rgb(245, 246, 250)",
    certId: "rgb(4, 113, 154)",
    issued: "rgb(2, 115, 147)",
  },
};

/** What a specimen certificate says. */
export type CertificateIssue = {
  template: CertificateTemplate;
  recipientName: string;
  courseName: string;
  completedOn: string;
  hours: string;
  pdcs: string;
  certificateId: string;
  /** Trailing clause on the Award certificate; falls back to the POSH line. */
  closing?: string;
};

export const ORG_NAME = "Levitate PeopleSoft";

/** `**…**` marks what the artwork sets in bold. */
export const CLOSING_NOTE =
  "under the **Prevention of Sexual Harassment at Workplace** (POSH Act, 2013).";

/**
 * The SHRM recognition statement, shown with the certificates on every
 * programme page. It describes the organisation, not any one course.
 */
export const SHRM_ACCREDITATION = {
  title: "SHRM Professional Development Credits",
  body:
    "Levitate PeopleSoft is recognised by SHRM to offer Professional Development Credits (PDCs), applicable toward SHRM-CP® and SHRM-SCP® recertification, for participants who successfully complete our certification programmes.",
  note:
    "This accreditation reflects Levitate PeopleSoft's commitment to delivering globally benchmarked, practice-led learning that stands up to professional and institutional scrutiny — giving participants a credential that is recognised well beyond the classroom.",
  badges: ["ISO 9001:2015 Certified", "DPIIT Recognised", "Udyam Registration"],
};

/** One specimen certificate as the gallery renders it. */
export type CertificateCard = {
  title: string;
  caption: string;
  issue: CertificateIssue;
};

/** Specimen values — the same on every programme, so nothing reads as real. */
const SPECIMEN = { completedOn: "Sep 2026", certificateId: "2026-09-001" };

/** Both certificates a programme awards, carrying that programme's name. */
export function certificateCards(certificate: { name: string; closing: string; hours: string }): CertificateCard[] {
  return [
    {
      title: "SHRM Certificate of Completion",
      caption: "Issued with the PDCs earned toward SHRM-CP® and SHRM-SCP® recertification.",
      issue: {
        template: "shrm",
        recipientName: "",
        courseName: certificate.name,
        completedOn: SPECIMEN.completedOn,
        hours: certificate.hours,
        pdcs: "",
        certificateId: SPECIMEN.certificateId,
      },
    },
    {
      title: "Levitate PeopleSoft Certificate of Training Completion",
      caption: "Carries a verifiable certificate ID, the completion date and the programme hours.",
      issue: {
        template: "excellence",
        recipientName: "",
        courseName: certificate.name,
        completedOn: SPECIMEN.completedOn,
        hours: certificate.hours,
        pdcs: "",
        certificateId: SPECIMEN.certificateId,
        closing: certificate.closing,
      },
    },
  ];
}
