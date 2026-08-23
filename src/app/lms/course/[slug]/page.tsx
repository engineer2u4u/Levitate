import type { Metadata } from "next";
import { COURSES, courseBySlug } from "@/lib/lms/courses";
import CourseDetail from "@/components/lms/CourseDetail";

/** Every course is known at build time, so the whole catalogue prerenders. */
export function generateStaticParams() {
  return COURSES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = courseBySlug(slug);
  return course
    ? { title: course.title, description: course.desc }
    : { title: "Course not found" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CourseDetail slug={slug} />;
}
