/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";

/**
 * Monoline credential marks — single 64x64 grid, 3.5 stroke, round caps,
 * drawn with currentColor. Shared by the Accreditations grid and the
 * Credentials strip so both stay in sync.
 *
 * A credential supplies either `paths` (drawn in the house monoline style) or
 * `img`, for bodies that issue a fixed badge we are not free to redraw.
 */
export type Credential = {
  key: string;
  label: string;
  sub: string;
  title: string;
  paths?: ReactNode;
  img?: string;
};

export const CREDENTIALS: Credential[] = [
  {
    key: "iso",
    label: "ISO Certified",
    sub: "ISO 9001:2015",
    title: "ISO certified",
    paths: (
      <>
        <path d="M 32.00 6.00 L 35.56 9.40 L 40.24 7.88 L 41.98 12.49 L 46.85 13.15 L 46.42 18.06 L 50.52 20.77 L 48.00 25.00 L 50.52 29.23 L 46.42 31.94 L 46.85 36.85 L 41.98 37.51 L 40.24 42.12 L 35.56 40.60 L 32.00 44.00 L 28.44 40.60 L 23.76 42.12 L 22.02 37.51 L 17.15 36.85 L 17.58 31.94 L 13.48 29.23 L 16.00 25.00 L 13.48 20.77 L 17.58 18.06 L 17.15 13.15 L 22.02 12.49 L 23.76 7.88 L 28.44 9.40 Z" />
        <path d="M23.5 25.5 L29.5 31.5 L40.5 20.5" />
        <path d="M23 40 V56 L32 50.5 L41 56 V40" />
      </>
    ),
  },
  {
    key: "dpiit",
    label: "DPIIT Recognised",
    sub: "",
    title: "DPIIT recognised startup",
    paths: (
      <>
        <path d="M32 6 L53 13.5 V31 C53 43.5 44 51.5 32 58 C20 51.5 11 43.5 11 31 V13.5 Z" />
        <path d="M21 37.5 L28.5 30 L34 35.5 L43 25.5" />
        <path d="M35.5 25.5 H43 V33" />
      </>
    ),
  },
  {
    key: "msme",
    label: "MSME Registered",
    sub: "Micro / Small / Medium",
    title: "MSME registered",
    paths: (
      <>
        <path d="M6 54 H58" />
        <path d="M11 54 V38 A3 3 0 0 1 14 35 H21 A3 3 0 0 1 24 38 V54" />
        <path d="M26 54 V28 A3 3 0 0 1 29 25 H36 A3 3 0 0 1 39 28 V54" />
        <path d="M41 54 V17 A3 3 0 0 1 44 14 H51 A3 3 0 0 1 54 17 V54" />
        <path d="M17.5 43 v0.1" />
        <path d="M32.5 33 v0.1" />
        <path d="M47.5 22 v0.1" />
      </>
    ),
  },
  {
    key: "udyam",
    label: "Udyam Registration",
    sub: "UDYAM-HR-05-0195892",
    title: "Udyam registration",
    paths: (
      <>
        <path d="M11 12 A4 4 0 0 1 15 8 H32 L40 16 V48 A4 4 0 0 1 36 52 H15 A4 4 0 0 1 11 48 Z" />
        <path d="M32 8 V16 H40" />
        <path d="M18 25 H31" />
        <path d="M18 33 H27" />
        <circle cx="49" cy="38" r="9" />
        <path d="M44.5 45.5 V58 L49 54.5 L53.5 58 V45.5" />
      </>
    ),
  },
  {
    key: "shrm",
    label: "SHRM Recertification Provider",
    sub: "SHRM-CP | SHRM-SCP",
    title: "SHRM Recertification Provider",
    img: "/assets/accreditations/shrm.png",
  },
];

export const byKey = (k: string) => CREDENTIALS.find((c) => c.key === k)!;

export function CredentialIcon({ c, size }: { c: Credential; size: number }) {
  // Issued badges ship as artwork; only the monoline marks are drawn inline.
  if (c.img) {
    return (
      <img
        src={c.img}
        alt={c.title}
        width={size}
        height={size}
        style={{ display: "block", width: size, height: size, objectFit: "contain", flex: "none" }}
      />
    );
  }
  return (
    <span style={{ display: "block", width: size, height: size, color: "#1b8f88", flex: "none" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        role="img"
        aria-label={c.title}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <title>{c.title}</title>
        {c.paths}
      </svg>
    </span>
  );
}
