/**
 * The course catalogue: what the website shows about each course, and when it
 * runs.
 *
 * The admin portal is the source. Its Courses and Sessions screens write the
 * Supabase `courses` and `sessions` tables, and the site reads them twice:
 *
 *   - once when it is built, in the root layout, so the exported HTML — what
 *     Google indexes and what a slow connection shows first — is current;
 *   - again in the browser as a page loads (CatalogProvider), so a change
 *     saved in the admin shows within seconds, without a deploy.
 *
 * The constants in this repo (COURSES, site.ts batches, MASTERCLASS) are the
 * FALLBACK: what a build uses if it cannot reach the database. They are a
 * snapshot of the catalogue on 12 September 2026 and are not edited any more.
 *
 * Only the facts live here. The teaching content — curriculum, lessons,
 * certificates — stays in code, so a course the database adds after a build
 * has no page to show until the next deploy, and the browser refresh leaves
 * it out rather than linking to a 404.
 */

import type { Course } from "./lms/types";
import { COURSES, formatFee } from "./lms/courses";
import { batches as SITE_BATCHES } from "./site";
import { MASTERCLASS } from "./masterclass";

/* ------------------------------------------------------------------ types */

export type CatalogSession = {
  /** "2026-10-03". The date the site formats, in whatever style it needs. */
  startsOn: string | null;
  /** "6:00 – 8:00 PM" — printed as given. */
  timeLabel: string;
  topic: string;
  /** Exact instants, where the minute matters (the masterclass closes then). */
  startsAt: string | null;
  endsAt: string | null;
};

/** The Upcoming Batches card. Row values have their placeholders filled. */
export type BatchCard = {
  show: boolean;
  tag: string;
  title: string;
  short: string;
  statusLabel: string;
  rows: { k: string; v: string }[];
  feeNote: string;
  cta: string;
};

export type CatalogCourse = {
  slug: string;
  title: string;
  short: string;
  tag: string;
  category: string;
  desc: string;
  /** Placeholders filled. */
  mode: string;
  duration: string;
  status: "enrolling" | "waitlist";
  hidden: boolean;
  /** Null means "On request". */
  feePaise: number | null;
  /** The struck-through standard fee. Never charged. */
  listPricePaise: number | null;
  /** Placeholders filled. */
  priceNote: string;
  modulesLabel: string;
  hoursLabel: string;
  facilitator: string;
  img: string;
  sortOrder: number;
  /** The start shown while there are no session dates: "October 2026". */
  startsLabel: string;
  batch: BatchCard | null;
  /** Earliest first. */
  sessions: CatalogSession[];
};

export type Catalog = {
  /** Where this copy came from — a fallback build is worth knowing about. */
  source: "database" | "fallback";
  courses: CatalogCourse[];
};

/* ------------------------------------------------------------------ dates */

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * A calendar date's parts, read from "YYYY-MM-DD" as written. Never through
 * `new Date(iso)` alone: that is midnight UTC, which a browser west of UTC
 * would print as the day before.
 */
function dateParts(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return { y, m, d, dow: new Date(Date.UTC(y, m - 1, d)).getUTCDay() };
}

/** "3 October" */
export const dateLong = (iso: string) => {
  const p = dateParts(iso);
  return `${p.d} ${MONTHS[p.m - 1]}`;
};

/** "3 Oct" */
export const dateShort = (iso: string) => {
  const p = dateParts(iso);
  return `${p.d} ${MONTHS[p.m - 1].slice(0, 3)}`;
};

/** "Sat 3 October" */
export const dateWithDay = (iso: string) => {
  const p = dateParts(iso);
  return `${DAYS[p.dow]} ${p.d} ${MONTHS[p.m - 1]}`;
};

/** "Friday, 25 September 2026" */
export const dateFull = (iso: string) => {
  const p = dateParts(iso);
  const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][p.dow];
  return `${day}, ${p.d} ${MONTHS[p.m - 1]} ${p.y}`;
};

/** "Fri, 25 Sep 2026" */
export const dateCompact = (iso: string) => {
  const p = dateParts(iso);
  return `${DAYS[p.dow]}, ${p.d} ${MONTHS[p.m - 1].slice(0, 3)} ${p.y}`;
};

/** Day and month for a calendar tile: { day: "03", month: "Oct" }. */
export const dateTile = (iso: string) => {
  const p = dateParts(iso);
  return { day: String(p.d).padStart(2, "0"), month: MONTHS[p.m - 1].slice(0, 3) };
};

/* ------------------------------------------------------------ derived text */

/** The first dated session — the batch start. */
export const firstSession = (c: Pick<CatalogCourse, "sessions">) => c.sessions.find((s) => s.startsOn) ?? null;

/** "3 October", or the course's own label while it has no dates. */
export const startsText = (c: Pick<CatalogCourse, "sessions" | "startsLabel">) => {
  const s = firstSession(c);
  return s?.startsOn ? dateLong(s.startsOn) : c.startsLabel;
};

/** "3 Oct", or the label. */
export const startsShortText = (c: Pick<CatalogCourse, "sessions" | "startsLabel">) => {
  const s = firstSession(c);
  return s?.startsOn ? dateShort(s.startsOn) : c.startsLabel;
};

/**
 * Fills the placeholders an admin can put into any text the site prints:
 *
 *   {starts}        "3 October"
 *   {starts_short}  "3 Oct"
 *   {fee}           "₹32,000" (or "On request")
 *
 * So a date written once, as a session, reaches every sentence that mentions
 * it — the price note, the batch card, an FAQ answer — rather than each one
 * being edited by hand and one being missed.
 */
export function fill(text: string, c: Pick<CatalogCourse, "sessions" | "startsLabel" | "feePaise"> | null | undefined): string {
  if (!c || !text.includes("{")) return text;
  return text.replace(/\{(starts|starts_short|fee)\}/g, (_, key: string) =>
    key === "starts" ? startsText(c) : key === "starts_short" ? startsShortText(c) : formatFee(c.feePaise),
  );
}

/** Placeholders filled on every field that may carry them. */
function finish(c: CatalogCourse): CatalogCourse {
  return {
    ...c,
    mode: fill(c.mode, c),
    priceNote: fill(c.priceNote, c),
    batch: c.batch ? { ...c.batch, rows: c.batch.rows.map((r) => ({ k: r.k, v: fill(r.v, c) })) } : null,
  };
}

/* --------------------------------------------------------------- fallback */

/** Session dates as they stood on 12 September 2026. */
const at = (day: string, from: string, to: string): CatalogSession => ({
  startsOn: day,
  timeLabel: "6:00 – 8:00 PM",
  topic: "",
  startsAt: `${day}T${from}:00+05:30`,
  endsAt: `${day}T${to}:00+05:30`,
});

const FALLBACK_SESSIONS: Record<string, CatalogSession[]> = {
  "posh-trainer": [
    { ...at("2026-10-03", "18:00", "20:00"), topic: "Foundations & the CLEAR framework" },
    { ...at("2026-10-04", "18:00", "20:00"), topic: "Legal genesis & applied definitions" },
    { ...at("2026-10-10", "18:00", "20:00"), topic: "Recognition, coverage & jurisdiction" },
    { ...at("2026-10-11", "18:00", "20:00"), topic: "IC governance & fair inquiry practice" },
    { ...at("2026-10-17", "18:00", "20:00"), topic: "Case laboratory · live inquiry simulation" },
    { ...at("2026-10-18", "18:00", "20:00"), topic: "Trainer craft & facilitation assessment" },
  ],
  "pocso-child-safety": [at("2026-10-24", "18:00", "20:00")],
  "inclusive-workplace": [{ startsOn: "2026-10-10", timeLabel: "To be confirmed", topic: "", startsAt: null, endsAt: null }],
  [MASTERCLASS.slug]: [
    { startsOn: MASTERCLASS.startsAt.slice(0, 10), timeLabel: MASTERCLASS.time, topic: "", startsAt: MASTERCLASS.startsAt, endsAt: MASTERCLASS.endsAt },
  ],
};

/** site.ts keys its batch cards by title; the catalogue keys everything by slug. */
const BATCH_SLUGS: Record<string, string> = {
  "PoSH TTT Certification": "posh-trainer",
  "Diversity, Equity & Inclusion Batch": "inclusive-workplace",
  "POCSO TTT Certification": "pocso-child-safety",
  "Mental Health & Well-being Batch": "workplace-wellbeing",
};

function fallbackBatch(slug: string): BatchCard | null {
  const b = SITE_BATCHES.find((x) => BATCH_SLUGS[x.title] === slug);
  if (!b) return null;
  return { show: true, tag: b.tag, title: b.title, short: b.short ?? "", statusLabel: b.status, rows: b.rows, feeNote: b.feeNote, cta: b.cta };
}

function fromCode(c: Course, i: number): CatalogCourse {
  return {
    slug: c.slug,
    title: c.title,
    short: c.short,
    tag: c.tag,
    category: "",
    desc: c.desc,
    mode: c.mode,
    duration: "",
    status: c.status,
    hidden: Boolean(c.hidden),
    feePaise: c.feePaise,
    listPricePaise: null,
    priceNote: c.priceNote,
    modulesLabel: c.modulesLabel,
    hoursLabel: c.hoursLabel,
    facilitator: c.facilitator,
    img: c.img,
    sortOrder: c.hidden ? 99 : i + 1,
    startsLabel: c.slug === "workplace-wellbeing" ? "October 2026" : "",
    batch: fallbackBatch(c.slug),
    sessions: FALLBACK_SESSIONS[c.slug] ?? [],
  };
}

/** The masterclass has its own page rather than a course in code. */
const MASTERCLASS_FALLBACK: CatalogCourse = {
  slug: MASTERCLASS.slug,
  title: `${MASTERCLASS.title} ${MASTERCLASS.titleRest}`,
  short: "PoSH 2026 Masterclass",
  tag: "Masterclass",
  category: "Masterclass",
  desc: MASTERCLASS.sub,
  mode: "Live masterclass",
  duration: MASTERCLASS.duration,
  status: "enrolling",
  hidden: true,
  feePaise: MASTERCLASS.feePaise,
  listPricePaise: MASTERCLASS.standardPaise,
  priceNote: "Early bird · incl. of taxes",
  modulesLabel: "",
  hoursLabel: MASTERCLASS.duration,
  facilitator: "Parichita Kotnala",
  img: "",
  sortOrder: 50,
  startsLabel: "",
  batch: null,
  sessions: FALLBACK_SESSIONS[MASTERCLASS.slug],
};

export const FALLBACK_CATALOG: Catalog = {
  source: "fallback",
  courses: [...COURSES.map(fromCode), MASTERCLASS_FALLBACK].map(finish),
};

/* --------------------------------------------------------------- database */

type SessionRow = { starts_on: string | null; time_label: string; topic: string; starts_at: string | null; ends_at: string | null; status: string };

type CourseRow = {
  slug: string; title: string; short: string; tag: string; category: string; description: string;
  mode: string; duration: string; site_status: string; hidden: boolean; price_paise: number;
  price_on_request: boolean; price_note: string; list_price_paise: number | null; modules_label: string;
  hours_label: string; facilitator_name: string; image: string; sort_order: number; starts_label: string;
  batch: Partial<{ show: boolean; tag: string; title: string; short: string; status_label: string; rows: { k: string; v: string }[]; fee_note: string; cta: string }> | null;
  sessions: SessionRow[] | null;
};

/**
 * Exactly the columns the anonymous role may read (migration 0008 grants
 * them column by column). Asking for `*` would be refused.
 */
const SELECT = [
  "slug", "title", "short", "tag", "category", "description", "mode", "duration", "site_status", "hidden",
  "price_paise", "price_on_request", "price_note", "list_price_paise", "modules_label", "hours_label",
  "facilitator_name", "image", "sort_order", "starts_label", "batch",
  "sessions(starts_on,time_label,topic,starts_at,ends_at,status)",
].join(",");

const str = (v: unknown) => (typeof v === "string" ? v : "");

function fromRow(r: CourseRow): CatalogCourse {
  const code = COURSES.find((c) => c.slug === r.slug);
  const b = r.batch && typeof r.batch === "object" ? r.batch : null;
  return finish({
    slug: r.slug,
    title: r.title,
    short: str(r.short) || code?.short || r.title,
    tag: str(r.tag),
    category: str(r.category),
    desc: str(r.description),
    mode: str(r.mode),
    duration: str(r.duration),
    status: r.site_status === "enrolling" ? "enrolling" : "waitlist",
    hidden: Boolean(r.hidden),
    feePaise: r.price_on_request || !(r.price_paise > 0) ? null : r.price_paise,
    listPricePaise: typeof r.list_price_paise === "number" && r.list_price_paise > 0 ? r.list_price_paise : null,
    priceNote: str(r.price_note),
    modulesLabel: str(r.modules_label),
    hoursLabel: str(r.hours_label),
    facilitator: str(r.facilitator_name) || code?.facilitator || "",
    // A course without an uploaded image keeps the one its page was built with.
    img: str(r.image) || code?.img || "",
    sortOrder: Number.isFinite(r.sort_order) ? r.sort_order : 0,
    startsLabel: str(r.starts_label),
    batch:
      b && b.show
        ? {
            show: true,
            tag: str(b.tag),
            title: str(b.title),
            short: str(b.short),
            statusLabel: str(b.status_label),
            rows: Array.isArray(b.rows) ? b.rows.filter((x) => x && typeof x.k === "string").map((x) => ({ k: x.k, v: str(x.v) })) : [],
            feeNote: str(b.fee_note),
            cta: str(b.cta),
          }
        : null,
    sessions: (r.sessions ?? [])
      // The public read already drops drafts; closed sessions have run.
      .filter((s) => s.status === "open")
      .map((s) => ({ startsOn: s.starts_on, timeLabel: str(s.time_label), topic: str(s.topic), startsAt: s.starts_at, endsAt: s.ends_at }))
      .sort((a, b) => (a.startsOn ?? "9999").localeCompare(b.startsOn ?? "9999")),
  });
}

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, "");
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * The published catalogue, straight from the database. Null when it cannot be
 * had — not configured, unreachable, or an answer that is not a list.
 *
 * `fresh` is for the browser, where the HTTP cache would otherwise hand back
 * the catalogue from before the admin's save. It is not used during the build:
 * a no-store fetch there would mark every page as dynamic, which a static
 * export cannot produce.
 */
export async function fetchCatalog(opts: { fresh?: boolean; signal?: AbortSignal } = {}): Promise<Catalog | null> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  const url =
    `${SUPABASE_URL}/rest/v1/courses?select=${encodeURIComponent(SELECT)}` +
    `&status=eq.live&order=sort_order.asc,title.asc`;
  try {
    const res = await fetch(url, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      signal: opts.signal,
      ...(opts.fresh ? { cache: "no-store" as const } : {}),
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as unknown;
    if (!Array.isArray(rows)) return null;
    return { source: "database", courses: (rows as CourseRow[]).map(fromRow) };
  } catch {
    return null;
  }
}

let buildCatalog: Promise<Catalog> | null = null;

/**
 * The catalogue a build renders with: the database's, or the fallback if it
 * cannot be reached. Memoised, so the forty-odd pages of one build ask once.
 */
export function loadCatalog(): Promise<Catalog> {
  buildCatalog ??= fetchCatalog().then((db) => {
    if (db) return db;
    console.warn("[catalog] Supabase could not be reached — building with the fallback catalogue in src/lib/catalog.ts.");
    return FALLBACK_CATALOG;
  });
  return buildCatalog;
}

/**
 * The browser's copy, narrowed to the courses this build has pages for.
 *
 * A course the admin added since the build has no page yet, so it waits for
 * the next deploy rather than appearing as a link to a 404. A course the
 * database no longer returns has been unpublished, and goes.
 */
export function narrowToBuild(built: Catalog, db: Catalog): Catalog {
  const slugs = new Set(built.courses.map((c) => c.slug));
  return { source: "database", courses: db.courses.filter((c) => slugs.has(c.slug)) };
}

/* ------------------------------------------------------------ lookups */

export const catalogCourse = (catalog: Catalog, slug: string) => catalog.courses.find((c) => c.slug === slug);

/**
 * A catalogue entry as the LMS's `Course` — the facts from the catalogue, the
 * certificate wording from code. Null for anything without a course in code
 * (the masterclass), which the LMS has no pages for.
 */
export function asLmsCourse(c: CatalogCourse | undefined): Course | undefined {
  const code = c && COURSES.find((x) => x.slug === c.slug);
  if (!c || !code) return undefined;
  return {
    ...code,
    title: c.title,
    short: c.short,
    tag: c.tag,
    mode: c.mode,
    desc: c.desc,
    img: c.img,
    status: c.status,
    feePaise: c.feePaise,
    priceNote: c.priceNote,
    modulesLabel: c.modulesLabel,
    hoursLabel: c.hoursLabel,
    facilitator: c.facilitator,
    hidden: c.hidden,
  };
}

/** LMS courses the public may see, in the admin's order. */
export const visibleLmsCourses = (catalog: Catalog): Course[] =>
  catalog.courses
    .filter((c) => !c.hidden)
    .map(asLmsCourse)
    .filter((c): c is Course => Boolean(c));

/** Cards for the Upcoming Batches list: dated batches first, earliest first. */
export const batchCards = (catalog: Catalog) =>
  catalog.courses
    .filter((c) => c.batch?.show)
    .sort((a, b) => (firstSession(a)?.startsOn ?? "9999").localeCompare(firstSession(b)?.startsOn ?? "9999"));
