import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import ScrollToTop from "@/components/home/ScrollToTop";
import LmsChrome from "@/components/lms/LmsChrome";
import { SessionProvider } from "@/components/lms/useSession";

export const metadata: Metadata = {
  title: { default: "Levitate Learning", template: "%s · Levitate Learning" },
  description:
    "Enrol in Levitate PeopleSoft certification courses, learn through staged modules between live sessions, and earn a verifiable certificate on completion.",
};

export default function LmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SiteHeader />
      <LmsChrome />
      {children}
      <SiteFooter />
      <ScrollToTop />
    </SessionProvider>
  );
}
