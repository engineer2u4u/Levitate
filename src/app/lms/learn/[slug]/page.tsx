import type { Metadata } from "next";
import { COURSES } from "@/lib/lms/courses";
import { COURSE_CONTENT } from "@/lib/lms/courseContent";
import LessonPlayer from "@/components/lms/LessonPlayer";
import CoursePlayer from "@/components/lms/CoursePlayer";

/** Both the catalogue courses and the self-paced ones get a learn page. */
export function generateStaticParams() {
  const slugs = new Set([...COURSES.map((c) => c.slug), ...Object.keys(COURSE_CONTENT)]);
  return [...slugs].map((slug) => ({ slug }));
}

export const metadata: Metadata = { title: "Course", robots: { index: false } };

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Courses authored as modules and submodules use the self-paced player; the
  // cohort courses keep the staged one until their content is migrated.
  return slug in COURSE_CONTENT ? <CoursePlayer slug={slug} /> : <LessonPlayer slug={slug} />;
}
