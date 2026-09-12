import type { MetadataRoute } from "next";
import { loadCatalog, visibleLmsCourses } from "@/lib/catalog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://levitatepeoplesoft.com";

// Required with `output: export` — emit sitemap.xml at build time.
export const dynamic = "force-static";

type Route = { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] };

/**
 * Emits /sitemap.xml at build time. Paths carry a trailing slash to match
 * `trailingSlash: true`, so the URLs here are exactly the ones Apache serves
 * (no redirect hop for crawlers).
 */
const LEADING: Route[] = [
  { path: "/", priority: 1.0, changeFrequency: "monthly" },
  { path: "/about-us/", priority: 0.9, changeFrequency: "monthly" },
  { path: "/certifications/", priority: 0.9, changeFrequency: "monthly" },
];

const TRAILING: Route[] = [
  // Paid-ad landing pages. Indexed rather than hidden: they are the best
  // answer the site has for "posh train the trainer" and the like, and a page
  // good enough to send paid traffic to is good enough to send crawlers to.
  { path: "/posh-train-the-trainer-certification/", priority: 0.9, changeFrequency: "weekly" },
  { path: "/pocso-train-the-trainer-certification/", priority: 0.9, changeFrequency: "weekly" },
  { path: "/dei-train-the-trainer-certification/", priority: 0.9, changeFrequency: "weekly" },
  { path: "/posh-2026-masterclass/", priority: 0.9, changeFrequency: "weekly" },
  { path: "/services/train-the-trainer/", priority: 0.9, changeFrequency: "monthly" },
  { path: "/corporate-soft-skills-training-service/", priority: 0.9, changeFrequency: "monthly" },
  { path: "/services/institutional/", priority: 0.8, changeFrequency: "monthly" },
  { path: "/hr-consulting-services/", priority: 0.8, changeFrequency: "monthly" },
  { path: "/parichita-kotnala/", priority: 0.7, changeFrequency: "yearly" },
  { path: "/contact/", priority: 0.8, changeFrequency: "yearly" },
  { path: "/privacy-policy/", priority: 0.3, changeFrequency: "yearly" },
  { path: "/disclaimer/", priority: 0.3, changeFrequency: "yearly" },
  { path: "/refund-policy/", priority: 0.3, changeFrequency: "yearly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // The per-program pages the Certifications menu points at: whatever the
  // admin has published and not hidden. The rest of the LMS is account-gated
  // working software and stays out of the sitemap.
  const courses = visibleLmsCourses(await loadCatalog());
  const routes: Route[] = [
    ...LEADING,
    ...courses.map((c) => ({ path: `/lms/course/${c.slug}/`, priority: 0.8, changeFrequency: "monthly" as const })),
    ...TRAILING,
  ];

  const lastModified = new Date();
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
