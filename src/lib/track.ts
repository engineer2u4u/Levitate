/**
 * Named conversion events, pushed to the GTM data layer.
 *
 * The site carries no tag manager yet. This exists so the pages that generate
 * conversions are already emitting the events the ad platforms will need —
 * when the container goes in, the history of what fires where does not have to
 * be reconstructed from memory. Until then every call is a no-op.
 *
 * Names match the strategy deck so the tag configuration can be written
 * against them directly.
 */

type Payload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export type TrackEvent =
  | "enquire_click"
  | "reserve_seat_click"
  | "whatsapp_click"
  | "kit_download"
  | "kit_form_open"
  | "brochure_download"
  | "payment_success";

export function track(event: TrackEvent, data: Payload = {}) {
  if (typeof window === "undefined") return;
  try {
    (window.dataLayer ??= []).push({ event, ...data });
  } catch {
    // Analytics must never be able to break a page it only observes.
  }
}
