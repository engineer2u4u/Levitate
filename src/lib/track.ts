/**
 * Named conversion events, sent through the Google tag to GA4 and Ads, and —
 * for the ones Meta has a standard event for — to the Meta Pixel.
 *
 * Names match the strategy deck so the conversion setup can be written
 * against them directly.
 */

type Payload = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type TrackEvent =
  | "enquire_click"
  | "reserve_seat_click"
  | "whatsapp_click"
  | "kit_download"
  | "kit_form_open"
  | "brochure_download"
  | "payment_success"
  // A submitted enquiry. GA4's recommended name for a lead, so Google Ads can
  // import it as a conversion without renaming.
  | "generate_lead"
  // GA4's own ecommerce names, so its purchase reports and revenue fill in
  // without mapping — and a GA4 purchase can be imported into Ads as-is.
  | "begin_checkout"
  | "purchase";

/**
 * Google Ads conversion actions, by the event that completes them.
 *
 * Ads counts a conversion from `gtag('event', 'conversion', { send_to })`
 * carrying the action's own label. Its instructions put that snippet on a
 * "thank you" page; this site has none — an enquiry is sent from the page it
 * was typed on — so it is sent here, on the submission Ads is paying for.
 *
 * A lead is worth a nominal 1 INR: the value has to be something for Ads to
 * report and bid on, and a made-up rupee figure per enquiry would be worse
 * than a placeholder everyone can recognise. A purchase, when its action
 * exists, reports the amount actually paid.
 */
const ADS_CONVERSIONS: Partial<Record<TrackEvent, { send_to: string; value?: number; currency?: string }>> = {
  generate_lead: { send_to: "AW-18437850806/k118CPCE8vEcELaN7ddE", value: 1.0, currency: "INR" },
};

/**
 * The Meta standard event each of ours corresponds to, with the parameters
 * Meta reads. Standard names are what Meta's ads optimise for and report on
 * without any custom setup. Events with no Meta counterpart are not sent.
 *
 * A kit download is not mapped: the kit form is an enquiry, so it already
 * reports a Lead through generate_lead.
 */
const META: Partial<Record<TrackEvent, (d: Payload) => [string, Payload]>> = {
  generate_lead: (d) => ["Lead", { content_name: d.programme, content_category: d.form }],
  begin_checkout: (d) => ["InitiateCheckout", { value: d.value, currency: d.currency }],
  // Meta requires value and currency on a Purchase.
  purchase: (d) => ["Purchase", { value: d.value, currency: d.currency }],
  whatsapp_click: (d) => ["Contact", { content_name: d.course }],
};

/**
 * One id per event occurrence, which a server-side copy of the same event
 * would repeat so Meta counts the pair once rather than twice.
 *
 * crypto.randomUUID needs a secure context; a page served over plain HTTP —
 * localhost aside — falls back to a random string, which is as unique as this
 * needs to be.
 */
export function newEventId(event: TrackEvent): string {
  const unique = globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `${event}.${unique}`;
}

/**
 * Meta's cookies, for the server's copy of an event: _fbc is the ad click
 * that brought the visitor, _fbp this browser. Both improve how well Meta
 * matches the conversion; neither identifies anyone to us.
 */
export function metaCookies(): { fbc?: string; fbp?: string } {
  if (typeof document === "undefined") return {};
  const read = (name: string) => document.cookie.split("; ").find((c) => c.startsWith(`${name}=`))?.split("=")[1];
  const fbc = read("_fbc");
  const fbp = read("_fbp");
  return { ...(fbc ? { fbc } : {}), ...(fbp ? { fbp } : {}) };
}

export function track(event: TrackEvent, data: Payload = {}) {
  if (typeof window === "undefined") return;
  try {
    // gtag.js sends only what arrives through gtag() — an object pushed onto
    // the data layer is read by a Tag Manager container, and this site runs
    // the plain Google tag, not a container. Fall back to the push when the
    // tag is absent (a build with analytics off), where it does no harm.
    // meta_event_id is plumbing for Meta's deduplication, not a measurement.
    const forGoogle = { ...data };
    delete forGoogle.meta_event_id;
    if (typeof window.gtag === "function") window.gtag("event", event, forGoogle);
    else (window.dataLayer ??= []).push({ event, ...forGoogle });

    // And, where the event completes one, the Google Ads conversion action.
    // Separate from the GA4 event above: Ads counts the send_to label, not
    // the event name.
    const ads = ADS_CONVERSIONS[event];
    if (ads && typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        ...ads,
        // A purchase reports what was paid; everything else keeps its nominal
        // value. Either way the currency comes from the action.
        ...(typeof data.value === "number" && event === "purchase" ? { value: data.value } : {}),
      });
    }
  } catch {
    // Analytics must never be able to break a page it only observes.
  }
  try {
    const meta = META[event];
    if (meta && typeof window.fbq === "function") {
      const [name, params] = meta(data);
      // Unset parameters are left out rather than sent empty.
      const sent = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ""));
      // The deduplication key Meta asks for. A purchase carries the id the
      // payment server was given, so its copy of the event pairs with this
      // one; everything else gets a fresh id, harmless on its own.
      const id = typeof data.meta_event_id === "string" && data.meta_event_id ? data.meta_event_id : newEventId(event);
      window.fbq("track", name, sent, { eventID: id });
    }
  } catch {
    // Same rule for the pixel.
  }
}
