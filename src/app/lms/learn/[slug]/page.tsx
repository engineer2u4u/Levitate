import type { Metadata } from "next";
import { COURSES } from "@/lib/lms/courses";
import LessonPlayer from "@/components/lms/LessonPlayer";

export function generateStaticParams() {
  return COURSES.map((c) => ({ slug: c.slug }));
}

export const metadata: Metadata = { title: "Course", robots: { index: false } };

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LessonPlayer slug={slug} />;
}
