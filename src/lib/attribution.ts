/**
 * Where a visitor came from, kept until they enquire.
 *
 * A visitor who clicks a Google ad on Monday and fills the form on Thursday
 * arrives on Thursday by typing the address — so the source has to be noted
 * on the visit that brought them, not read off the visit that converts. Each
 * page load looks at its URL and referrer once and keeps two touches in the
 * browser:
 *
 *   - first: the visit that introduced them, never overwritten;
 *   - last:  the most recent visit that had a source. A later direct visit
 *            does not replace it, because "they typed the address" says
 *            nothing about what sent them.
 *
 * Nothing leaves the browser until an enquiry is sent. Both touches expire
 * after 90 days, so a visitor from last year does not credit last year's ad.
 */

export type Channel =
  | "google_ads"
  | "google_search"
  | "meta_ads"
  | "meta"
  | "other_search"
  | "linkedin"
  | "youtube"
  | "email"
  | "campaign"
  | "referral"
  | "direct";

export type Touch = {
  channel: Channel;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  gclid: string;
  fbclid: string;
  /** The external page they came from, when the browser says. */
  referrer: string;
  /** Path and query of the page they arrived on. */
  landing_page: string;
  at: string;
};

type Stored = { v: 1; first: Touch; last: Touch };

const KEY = "lvt_src";
const MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;

/** Mediums that mean somebody paid for the click. */
const PAID = /^(cpc|ppc|paid|paid[-_ ]?social|paidsocial|ads?|sem|display|cpm|cpv)$/;
const META_SOURCES = /^(meta|facebook|fb|instagram|ig|messenger|an|audience_network)$/;

/** A referrer's host — or, for an Android app, its package name. */
function referrerHost(referrer: string): string {
  if (!referrer) return "";
  try {
    const u = new URL(referrer);
    return u.protocol === "android-app:" ? u.hostname || u.pathname.replace(/^\/+/, "").split("/")[0] : u.hostname;
  } catch {
    return "";
  }
}

function fromHost(host: string): Channel {
  const h = host.toLowerCase().replace(/^www\./, "");
  // Webmail first: mail.google.com would otherwise pass for a Google search.
  if (/(^|\.)(mail\.google\.com|outlook\.live\.com|outlook\.office\.com|mail\.yahoo\.com)$/.test(h) || h === "com.google.android.gm") return "email";
  if (/(^|\.)google\.[a-z.]+$/.test(h) || h === "com.google.android.googlequicksearchbox") return "google_search";
  if (/(^|\.)(bing\.com|duckduckgo\.com|yahoo\.com|ecosia\.org|search\.brave\.com)$/.test(h) || /(^|\.)yandex\.[a-z.]+$/.test(h)) return "other_search";
  if (/(^|\.)(facebook\.com|fb\.com|fb\.me|instagram\.com|threads\.net|messenger\.com)$/.test(h) || /^com\.(facebook|instagram)\./.test(h)) return "meta";
  if (/(^|\.)(linkedin\.com|lnkd\.in)$/.test(h) || h === "com.linkedin.android") return "linkedin";
  if (/(^|\.)(youtube\.com|youtu\.be)$/.test(h)) return "youtube";
  return "referral";
}

/**
 * The channel a single visit belongs to.
 *
 * Click ids are the strongest signal: Google adds gclid to every ad click on
 * its own, so a Google ad needs no tagging at all. Meta adds fbclid to ad
 * clicks AND to ordinary link clicks from posts, so fbclid alone cannot tell
 * paid from free — that takes utm_medium on the ad, which is why a Meta ad
 * without UTM tags is counted under "Facebook / Instagram".
 */
export function classify(params: URLSearchParams, referrer: string): Channel {
  const src = (params.get("utm_source") ?? "").trim().toLowerCase();
  const med = (params.get("utm_medium") ?? "").trim().toLowerCase();

  if (params.get("gclid") || params.get("gbraid") || params.get("wbraid")) return "google_ads";
  if (/^(google|adwords|googleads|google_ads)$/.test(src) && PAID.test(med)) return "google_ads";
  if ((META_SOURCES.test(src) || params.get("fbclid")) && PAID.test(med)) return "meta_ads";
  if (META_SOURCES.test(src)) return "meta";
  if (med === "email" || med === "newsletter" || src === "newsletter") return "email";
  if (src === "linkedin") return "linkedin";
  if (src === "youtube") return "youtube";
  if (src) return "campaign";
  if (params.get("fbclid")) return "meta";

  const host = referrerHost(referrer);
  return host ? fromHost(host) : "direct";
}

const param = (p: URLSearchParams, k: string, max = 200) => (p.get(k) ?? "").trim().slice(0, max);

function touchHere(): Touch {
  const params = new URLSearchParams(window.location.search);
  // A referrer from this site is navigation, not a source.
  const external = document.referrer && referrerHost(document.referrer) !== window.location.hostname ? document.referrer : "";
  return {
    channel: classify(params, external),
    utm_source: param(params, "utm_source"),
    utm_medium: param(params, "utm_medium"),
    utm_campaign: param(params, "utm_campaign"),
    // The landing pages' own ?kw= is the ad keyword, so it stands in for a
    // missing utm_term.
    utm_term: param(params, "utm_term") || param(params, "kw"),
    utm_content: param(params, "utm_content"),
    gclid: param(params, "gclid", 300) || param(params, "gbraid", 300) || param(params, "wbraid", 300),
    fbclid: param(params, "fbclid", 300),
    referrer: external.slice(0, 500),
    landing_page: `${window.location.pathname}${window.location.search}`.slice(0, 500),
    at: new Date().toISOString(),
  };
}

/** Kept in memory as well, so a browser that refuses storage still has this visit. */
let memory: Stored | null = null;
let captured = false;

function read(): Stored | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as Stored) : null;
    if (parsed?.v === 1 && parsed.first && parsed.last) return parsed;
  } catch {
    // Private mode, blocked storage, or a value that is not ours.
  }
  return memory;
}

function write(s: Stored) {
  memory = s;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // Memory still holds it for this visit.
  }
}

/** Notes this visit's source. Once per page load; later calls do nothing. */
export function captureAttribution() {
  if (typeof window === "undefined" || captured) return;
  captured = true;

  const now = touchHere();
  let stored = read();
  if (stored && Date.now() - new Date(stored.first.at).getTime() > MAX_AGE_MS) stored = null;

  if (!stored) return write({ v: 1, first: now, last: now });
  // A direct visit keeps the last visit that had a source.
  if (now.channel !== "direct") write({ ...stored, last: now });
}

/** The enquiry's columns: where the visitor last came from, and first. */
export function attributionFields(): Record<string, string> {
  if (typeof window === "undefined") return {};
  captureAttribution();
  const s = read();
  if (!s) return {};
  const { last, first } = s;
  return {
    channel: last.channel,
    first_channel: first.channel,
    utm_source: last.utm_source,
    utm_medium: last.utm_medium,
    utm_campaign: last.utm_campaign,
    utm_term: last.utm_term,
    utm_content: last.utm_content,
    gclid: last.gclid,
    fbclid: last.fbclid,
    referrer: last.referrer,
    landing_page: last.landing_page,
  };
}

export const CHANNEL_LABEL: Record<Channel, string> = {
  google_ads: "Google Ads",
  google_search: "Google search",
  meta_ads: "Meta Ads",
  meta: "Facebook / Instagram",
  other_search: "Other search engine",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  email: "Email",
  campaign: "Other campaign",
  referral: "Other website",
  direct: "Direct",
};

/** The columns the enquiry row gains — dropped on retry against an older table. */
export const ATTRIBUTION_COLUMNS = [
  "channel",
  "first_channel",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "referrer",
  "landing_page",
] as const;
