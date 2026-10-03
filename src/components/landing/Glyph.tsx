/**
 * The line icons the landing pages and the registration card share, in one
 * stroke weight.
 */

export type GlyphName = "calendar" | "clock" | "hourglass" | "person" | "lock";

export function Glyph({ name, size = 24, color = "#1b8f88" }: { name: GlyphName; size?: number; color?: string }) {
  const p = { fill: "none", stroke: color, strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      {name === "calendar" && (<><rect x="3.5" y="5" width="17" height="15" rx="2.5" {...p} /><path d="M3.5 10h17M8 3v4M16 3v4" {...p} /></>)}
      {name === "clock" && (<><circle cx="12" cy="12" r="8.5" {...p} /><path d="M12 7.5V12l3 2" {...p} /></>)}
      {name === "hourglass" && (<path d="M6.5 3h11M6.5 21h11M7.5 3c0 5 9 5 9 9s-9 4-9 9M16.5 3c0 5-9 5-9 9s9 4 9 9" {...p} />)}
      {name === "person" && (<><circle cx="12" cy="8" r="4" {...p} /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" {...p} /></>)}
      {name === "lock" && (<><rect x="5" y="11" width="14" height="10" rx="2" {...p} /><path d="M8 11V8a4 4 0 0 1 8 0v3" {...p} /></>)}
    </svg>
  );
}

