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
 * Hides site chrome on those routes.
 *
 * A wrapper rather than a separate layout because the App Router nests layouts
 * instead of replacing them — anything in the root or /lms layout renders on
 * every descendant, including a route that wants none of it. Each chrome piece
 * is wrapped here instead, and the check runs at build time as well as in the
 * browser, so the exported HTML for /lms/learn/* never contains the chrome and
 * there is nothing to flash away on hydration.
 */
export default function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  return isImmersive(pathname) ? null : <>{children}</>;
}
