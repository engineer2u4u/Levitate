import type { Metadata } from "next";
import Certificates from "@/components/lms/Certificates";

export const metadata: Metadata = { title: "Certificates", robots: { index: false } };

export default function Page() {
  return <Certificates />;
}
