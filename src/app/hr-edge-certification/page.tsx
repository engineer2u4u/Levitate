import type { Metadata } from "next";
import Landing from "./Landing";

/**
 * noindex, because this is the same programme as /lms/course/hr-edge and two
 * pages competing for one set of words is worse than one. Ad traffic arrives
 * by link, not by search, so nothing is lost by keeping it out of the index —
 * and `follow` so any link on it still counts.
 */
export const metadata: Metadata = {
  title: "HR EDGE — Certified MNC-Ready HR Practitioner Programme",
  description:
    "Think like an HR Business Partner: business understanding, manager conversations and people decisions, built on the EDGE Framework. Request the outline, dates and fee.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <Landing />;
}
