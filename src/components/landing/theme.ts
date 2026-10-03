/**
 * The type, widths and buttons the landing pages share.
 *
 * These lived in SalesPage, which was fine while it was the only page that
 * used them. The masterclass page imported them from there, and now so does
 * the registration card both pages mount — which would have made SalesPage
 * import from a module that imports from SalesPage. They sit here instead, on
 * their own, with nothing to import.
 */

export const SANS = "'Plus Jakarta Sans',sans-serif";

/**
 * One content width for every section on the page.
 *
 * The sections used to run at 1180, 1080, 900, 860 and 780 — each chosen on
 * its own merits, and together a column whose edges wandered in and out as you
 * scrolled. Every section now shares one edge. Paragraphs keep a readable
 * measure inside it, so text does not run the full width; the boxes do.
 */
export const MAX = 1180;
export const MEASURE = 760;

/**
 * One type scale.
 *
 * Body copy had drifted across 13.5, 14, 14.5 and 15px and card titles across
 * 15.5 and 16. The headings are set to match the shared sections this page
 * embeds — accreditations, testimonials, client logos — so the page reads as
 * one document rather than several stitched together.
 */
export const T = {
  eyebrow: `700 12px ${SANS}`,
  h2: `700 clamp(26px,2.8vw,36px)/1.15 ${SANS}`,
  lead: `400 16px/1.75 ${SANS}`,
  cardTitle: `700 17px/1.35 ${SANS}`,
  body: `400 15px/1.75 ${SANS}`,
  item: `600 15px/1.55 ${SANS}`,
  small: `500 13px/1.6 ${SANS}`,
} as const;

export const ctaPrimary: React.CSSProperties = {
  cursor: "pointer",
  border: "none",
  background: "linear-gradient(120deg,#2fc4bc,#2f7fd6)",
  color: "#fff",
  font: `700 15px ${SANS}`,
  padding: "15px 30px",
  borderRadius: 999,
};

export const ctaGhost: React.CSSProperties = {
  display: "inline-block",
  background: "transparent",
  border: "1.5px solid rgba(255,255,255,.4)",
  color: "#fff",
  font: `700 15px ${SANS}`,
  padding: "14px 26px",
  borderRadius: 999,
};
