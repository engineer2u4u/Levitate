"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Course } from "@/lib/lms/types";
import {
  FALLBACK_CATALOG,
  asLmsCourse,
  catalogCourse,
  fetchCatalog,
  narrowToBuild,
  visibleLmsCourses,
  type Catalog,
} from "@/lib/catalog";

const CatalogContext = createContext<Catalog>(FALLBACK_CATALOG);

/**
 * Hands every page the catalogue, and keeps it current.
 *
 * `initial` is the copy the build rendered with, so the first paint matches
 * the exported HTML exactly and there is nothing to hydrate differently. As
 * the page loads it asks the database again, and a change saved in the admin
 * since the build replaces what is on screen.
 *
 * A failed refresh changes nothing: the build's copy is still a correct page.
 */
export default function CatalogProvider({ initial, children }: { initial: Catalog; children: React.ReactNode }) {
  const [catalog, setCatalog] = useState(initial);

  useEffect(() => {
    const controller = new AbortController();
    void fetchCatalog({ fresh: true, signal: controller.signal }).then((db) => {
      if (db) setCatalog(narrowToBuild(initial, db));
    });
    return () => controller.abort();
  }, [initial]);

  return <CatalogContext.Provider value={catalog}>{children}</CatalogContext.Provider>;
}

export const useCatalog = () => useContext(CatalogContext);

/** One catalogue entry — any course, the masterclass included. */
export function useCatalogCourse(slug: string) {
  const catalog = useCatalog();
  return useMemo(() => catalogCourse(catalog, slug), [catalog, slug]);
}

/** An LMS course, with its facts from the catalogue. */
export function useCourse(slug: string) {
  const entry = useCatalogCourse(slug);
  return useMemo(() => asLmsCourse(entry), [entry]);
}

/** The LMS courses the public may see, in the admin's order. */
export function useVisibleCourses() {
  const catalog = useCatalog();
  return useMemo(() => visibleLmsCourses(catalog), [catalog]);
}

/** Every LMS course, hidden ones included — a testing build lists them. */
export function useLmsCourses() {
  const catalog = useCatalog();
  return useMemo(() => catalog.courses.map(asLmsCourse).filter((c): c is Course => Boolean(c)), [catalog]);
}
