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

export function track(event: TrackEvent, data: Payload = {}) {
  if (typeof window === "undefined") return;
  try {
    // gtag.js sends only what arrives through gtag() — an object pushed onto
    // the data layer is read by a Tag Manager container, and this site runs
    // the plain Google tag, not a container. Fall back to the push when the
    // tag is absent (a build with analytics off), where it does no harm.
    if (typeof window.gtag === "function") window.gtag("event", event, data);
    else (window.dataLayer ??= []).push({ event, ...data });
  } catch {
    // Analytics must never be able to break a page it only observes.
  }
  try {
    const meta = META[event];
    if (meta && typeof window.fbq === "function") {
      const [name, params] = meta(data);
      // Unset parameters are left out rather than sent empty.
      window.fbq("track", name, Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== "")));
    }
  } catch {
    // Same rule for the pixel.
  }
}
