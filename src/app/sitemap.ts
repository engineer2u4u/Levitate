import type { MetadataRoute } from "next";
import { VISIBLE_COURSES as COURSES } from "@/lib/lms/courses";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://levitatepeoplesoft.com";

// Required with `output: export` — emit sitemap.xml at build time.
export const dynamic = "force-static";

/**
 * Emits /sitemap.xml at build time. Paths carry a trailing slash to match
 * `trailingSlash: true`, so the URLs here are exactly the ones Apache serves
 * (no redirect hop for crawlers).
 */
const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "monthly" },
  { path: "/about-us/", priority: 0.9, changeFrequency: "monthly" },
  { path: "/certifications/", priority: 0.9, changeFrequency: "monthly" },
  // The per-program pages the Certifications menu points at. The rest of the
  // LMS is account-gated working software and stays out of the sitemap.
  ...COURSES.map((c) => ({ path: `/lms/course/${c.slug}/`, priority: 0.8, changeFrequency: "monthly" as const })),
  { path: "/services/train-the-trainer/", priority: 0.9, changeFrequency: "monthly" },
  { path: "/corporate-soft-skills-training-service/", priority: 0.9, changeFrequency: "monthly" },
  { path: "/services/institutional/", priority: 0.8, changeFrequency: "monthly" },
  { path: "/hr-consulting-services/", priority: 0.8, changeFrequency: "monthly" },
  { path: "/parichita-kotnala/", priority: 0.7, changeFrequency: "yearly" },
  { path: "/contact/", priority: 0.8, changeFrequency: "yearly" },
  { path: "/privacy-policy/", priority: 0.3, changeFrequency: "yearly" },
  { path: "/disclaimer/", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
