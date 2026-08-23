import type { Metadata } from "next";
import LiveSessions from "@/components/lms/LiveSessions";

export const metadata: Metadata = { title: "Live Sessions", robots: { index: false } };

export default function Page() {
  return <LiveSessions />;
}
