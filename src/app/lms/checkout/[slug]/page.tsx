import type { Metadata } from "next";
import { COURSES } from "@/lib/lms/courses";
import Checkout from "@/components/lms/Checkout";

export function generateStaticParams() {
  return COURSES.map((c) => ({ slug: c.slug }));
}

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <Checkout slug={slug} />;
}
