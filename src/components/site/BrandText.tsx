/**
 * Keeps "PoSH" in its brand casing inside an uppercase label.
 *
 * The site's eyebrows and tag chips are styled `text-transform: uppercase`,
 * which flattens PoSH to POSH however the string is written. This leaves the
 * rest of the label uppercased and lifts that one token out of it, so the
 * design keeps its all-caps labels without losing the spelling.
 */
export default function BrandText({ children }: { children: string }) {
  const parts = children.split(/(PoSH)/g);
  return (
    <>
      {parts.map((part, i) =>
        part === "PoSH" ? (
          <span key={i} style={{ textTransform: "none" }}>PoSH</span>
        ) : (
          part
        ),
      )}
    </>
  );
}
