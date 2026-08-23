import type { Metadata } from "next";
import Dashboard from "@/components/lms/Dashboard";

export const metadata: Metadata = { title: "My Learning", robots: { index: false } };

export default function Page() {
  return <Dashboard />;
}
