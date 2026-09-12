"use client";

import { usePathname } from "next/navigation";

/**
 * Routes that take over the whole window. The course player is a place to work
 * through material, not a page to browse: a marquee, a nav, a learner bar and a
 * footer around it push the reading column down and invite the learner back out
 * of the course they just opened.
 */
export const isImmersive = (pathname: string) => pathname.startsWith("/lms/learn");

/**
 * The paid-ad landing pages. A visitor there arrived from an ad for one thing
 * and the page is built around a single action; a pop-up asking what they are
 * interested in interrupts the answer they came for.
 */
const LANDING_PAGES = [
  "/posh-train-the-trainer-certification",
  "/pocso-train-the-trainer-certification",
  "/dei-train-the-trainer-certification",
  "/posh-2026-masterclass",
];

export const isLanding = (pathname: string) =>
  LANDING_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

/**
 * Hides site chrome on those routes.
 *
 * A wrapper rather than a separate layout because the App Router nests layouts
 * instead of replacing them — anything in the root or /lms layout renders on
 * every descendant, including a route that wants none of it. Each chrome piece
 * is wrapped here instead, and the check runs at build time as well as in the
 * browser, so the exported HTML for /lms/learn/* never contains the chrome and
 * there is nothing to flash away on hydration.
 */
export default function ChromeGate({
  children,
  hideOnLanding = false,
}: {
  children: React.ReactNode;
  /** Also hide on the landing pages. */
  hideOnLanding?: boolean;
}) {
  const pathname = usePathname() ?? "";
  if (isImmersive(pathname) || (hideOnLanding && isLanding(pathname))) return null;
  return <>{children}</>;
}
