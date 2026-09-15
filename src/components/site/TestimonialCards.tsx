/**
 * Written testimonials as a static grid — the homepage's card, without its
 * marquee. A programme page has a handful of them, and a handful reads better
 * held still than scrolling past.
 */
export type WrittenTestimonial = { name: string; quote: string };

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

export default function TestimonialCards({ items }: { items: WrittenTestimonial[] }) {
  return (
    <div className="site-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
      {items.map((t) => (
        <figure
          key={t.name}
          style={{ margin: 0, display: "flex", flexDirection: "column", gap: 14, background: "#fff", border: "1px solid #e3eaf0", borderRadius: 18, padding: "26px 26px 22px", boxShadow: "0 10px 30px rgba(10,27,51,.05)" }}
        >
          <div aria-label="Rated 5 out of 5" style={{ color: "#f5b942", fontSize: 15, letterSpacing: 2 }}>★★★★★</div>
          <blockquote style={{ margin: 0, flex: 1, font: "400 14.5px/1.7 'Plus Jakarta Sans',sans-serif", color: "#3d5064" }}>
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <figcaption style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              aria-hidden
              style={{ width: 40, height: 40, flex: "none", borderRadius: "50%", background: "linear-gradient(135deg,#2fc4bc,#2f7fd6)", color: "#fff", font: "700 14px 'Plus Jakarta Sans',sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {initials(t.name)}
            </span>
            <span style={{ font: "700 14px 'Plus Jakarta Sans',sans-serif", color: "#0a1b33" }}>{t.name}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
