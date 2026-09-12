import type { Metadata } from "next";
import { COURSES } from "@/lib/lms/courses";
import { catalogCourse, loadCatalog } from "@/lib/catalog";
import CourseDetail from "@/components/lms/CourseDetail";

/**
 * Every course with a page in code prerenders — the curriculum and the
 * certificate live here, not in the database. Its title and description come
 * from the catalogue the build read.
 */
export function generateStaticParams() {
  return COURSES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = catalogCourse(await loadCatalog(), slug);
  return course
    ? { title: course.title, description: course.desc }
    : { title: "Course not found" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CourseDetail slug={slug} />;
}
