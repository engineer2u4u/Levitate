import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import ScrollToTop from "@/components/home/ScrollToTop";
import LmsChrome from "@/components/lms/LmsChrome";
import { SessionProvider } from "@/components/lms/useSession";
import ChromeGate from "@/components/site/ChromeGate";

export const metadata: Metadata = {
  title: { default: "Levitate Learning", template: "%s · Levitate Learning" },
  description:
    "Enrol in Levitate PeopleSoft certification courses, learn through staged modules between live sessions, and earn a verifiable certificate on completion.",
};

export default function LmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ChromeGate>
        <SiteHeader />
        <LmsChrome />
      </ChromeGate>
      {children}
      <ChromeGate>
        <SiteFooter />
        <ScrollToTop />
      </ChromeGate>
    </SessionProvider>
  );
}
