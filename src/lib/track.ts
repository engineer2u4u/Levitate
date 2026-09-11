/**
 * Named conversion events, sent through the Google tag to GA4 and Ads.
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
  // GA4's own ecommerce names, so its purchase reports and revenue fill in
  // without mapping — and a GA4 purchase can be imported into Ads as-is.
  | "begin_checkout"
  | "purchase";

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
}
