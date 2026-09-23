/**
 * Turning a certificate on screen into a file the learner can keep.
 *
 * The certificate is an SVG drawn over the artwork plate (see
 * `certificateArt.ts`), which is exactly what should be exported — so both
 * formats start from that same SVG rather than from a second drawing that
 * would drift from it.
 *
 * Two things have to be carried into the file first. An SVG rasterised
 * through an `<img>` cannot fetch anything: no plate, no webfont. So the plate
 * is inlined as a data URI and Plus Jakarta Sans is fetched once and embedded
 * as `@font-face`. Georgia needs no help — it is a system font, and the
 * browser has it while rendering.
 *
 * The PDF is written by hand. It holds one JPEG and nothing else, which is a
 * page, an image object and a two-line content stream — far less than the
 * weight of a PDF library for a file of this shape.
 */

/* --------------------------------------------------------------- fonts */

const FONT_CSS =
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";

let fontFaces: Promise<string> | null = null;

const toBase64 = (buf: ArrayBuffer) => {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
};

/**
 * The webfont as `@font-face` rules with the files embedded.
 *
 * Fetched once per page. If Google Fonts cannot be reached the export still
 * runs and the browser falls back — a certificate in the wrong sans is worth
 * more to someone than an error where their download should have been.
 */
async function embeddedFont(): Promise<string> {
  fontFaces ??= (async () => {
    try {
      const css = await (await fetch(FONT_CSS)).text();
      const blocks = css.split("@font-face").slice(1);
      const seen = new Set<string>();
      const rules: string[] = [];
      for (const block of blocks) {
        const url = /src:\s*url\((https:\/\/[^)]+\.woff2)\)/.exec(block)?.[1];
        const weight = /font-weight:\s*(\d+)/.exec(block)?.[1];
        // One file per weight: Google serves the same weight several times
        // over, once per unicode range, and the Latin one comes last.
        if (!url || !weight) continue;
        const data = toBase64(await (await fetch(url)).arrayBuffer());
        const rule = `@font-face{font-family:'Plus Jakarta Sans';font-style:normal;font-weight:${weight};src:url(data:font/woff2;base64,${data}) format('woff2');}`;
        const key = `${weight}`;
        if (seen.has(key)) rules[rules.findIndex((r) => r.includes(`font-weight:${weight};`))] = rule;
        else {
          seen.add(key);
          rules.push(rule);
        }
      }
      return rules.join("");
    } catch {
      return "";
    }
  })();
  return fontFaces;
}

/* --------------------------------------------------------------- raster */

const dataUri = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the certificate artwork."));
    reader.readAsDataURL(blob);
  });

/** Every `<image>` in the SVG, carried in rather than referenced. */
async function inlinePlates(svg: SVGSVGElement) {
  const images = Array.from(svg.querySelectorAll("image"));
  await Promise.all(
    images.map(async (el) => {
      const href = el.getAttribute("href") ?? el.getAttribute("xlink:href");
      if (!href || href.startsWith("data:")) return;
      const blob = await (await fetch(href)).blob();
      const uri = await dataUri(blob);
      el.setAttribute("href", uri);
      el.removeAttribute("xlink:href");
    }),
  );
}

/**
 * The certificate as a canvas at the plate's own resolution, or larger.
 *
 * `scale` is there because a certificate is printed as well as looked at: at 2
 * the 1600-wide Award plate lands at 3200px, which prints cleanly on A4.
 */
export async function certificateCanvas(svg: SVGSVGElement, scale = 2): Promise<HTMLCanvasElement> {
  const box = svg.viewBox.baseVal;
  const width = box?.width || svg.clientWidth;
  const height = box?.height || svg.clientHeight;

  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(height));
  await inlinePlates(clone);

  const font = await embeddedFont();
  if (font) {
    const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    style.textContent = font;
    clone.insertBefore(style, clone.firstChild);
  }

  const source = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(new Blob([source], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("The certificate could not be prepared for download."));
      img.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("This browser cannot prepare the download.");
    // The plate does not cover every pixel at every aspect, and a transparent
    // PNG turned into a JPEG would come out black.
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

const canvasBlob = (canvas: HTMLCanvasElement, type: string, quality?: number) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("The download could not be created."))),
      type,
      quality,
    );
  });

/* ------------------------------------------------------------------ pdf */

const ascii = (text: string) => {
  const out = new Uint8Array(text.length);
  for (let i = 0; i < text.length; i += 1) out[i] = text.charCodeAt(i) & 0xff;
  return out;
};

/**
 * A one-page PDF holding a single JPEG.
 *
 * JPEG data goes in untouched under `DCTDecode`, which is why the raster is
 * exported as a JPEG rather than a PNG — a PNG would have to be re-encoded
 * with a Flate predictor to live in a PDF, and nobody would see the
 * difference on a certificate.
 *
 * Cross-reference offsets are byte counts, so the file is assembled as bytes
 * from the start rather than as a string that is encoded at the end.
 */
function pdfWithImage(jpeg: Uint8Array, pixelW: number, pixelH: number): Blob {
  // A4's long edge, so the page is a sensible size whatever the plate's shape.
  const long = 842;
  const pageW = pixelW >= pixelH ? long : (long * pixelW) / pixelH;
  const pageH = pixelW >= pixelH ? (long * pixelH) / pixelW : long;
  const size = (n: number) => n.toFixed(2);

  const parts: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;
  const push = (chunk: Uint8Array) => {
    parts.push(chunk);
    length += chunk.length;
  };
  const write = (text: string) => push(ascii(text));
  const startObject = () => offsets.push(length);

  write("%PDF-1.4\n");

  startObject();
  write("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

  startObject();
  write("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");

  startObject();
  write(
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${size(pageW)} ${size(pageH)}]` +
      ` /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`,
  );

  startObject();
  write(
    `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${pixelW} /Height ${pixelH}` +
      ` /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`,
  );
  push(jpeg);
  write("\nendstream\nendobj\n");

  const content = `q ${size(pageW)} 0 0 ${size(pageH)} 0 0 cm /Im0 Do Q\n`;
  startObject();
  write(`5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}endstream\nendobj\n`);

  const xref = length;
  let table = `xref\n0 ${offsets.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) table += `${String(offset).padStart(10, "0")} 00000 n \n`;
  write(table);
  write(`trailer\n<< /Size ${offsets.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);

  return new Blob(parts as BlobPart[], { type: "application/pdf" });
}

/* -------------------------------------------------------------- saving */

function save(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoked late: Safari has not finished with the URL when click() returns.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** Strips a name down to something every filesystem will accept. */
export const fileStem = (...parts: string[]) =>
  parts
    .join("-")
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90) || "certificate";

export async function downloadCertificatePng(svg: SVGSVGElement, stem: string) {
  // Smaller than the PDF.s: a PNG of a plate this detailed is lossless and
  // heavy, and this is the copy people put in a post or an email.
  const canvas = await certificateCanvas(svg, 1.5);
  save(await canvasBlob(canvas, "image/png"), `${stem}.png`);
}

export async function downloadCertificatePdf(svg: SVGSVGElement, stem: string) {
  const canvas = await certificateCanvas(svg);
  const jpeg = new Uint8Array(await (await canvasBlob(canvas, "image/jpeg", 0.94)).arrayBuffer());
  save(pdfWithImage(jpeg, canvas.width, canvas.height), `${stem}.pdf`);
}
