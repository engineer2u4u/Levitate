import type { Metadata, Viewport } from "next";
import ShrmMarquee from "@/components/site/ShrmMarquee";
import EnquiryPopup from "@/components/site/EnquiryPopup";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// Social platforms require absolute image URLs. Override per environment with
// NEXT_PUBLIC_SITE_URL (e.g. a staging domain) — defaults to production.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://levitatepeoplesoft.com";

const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Levitate PeopleSoft",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Levitate PeopleSoft — Workplace Facilitator & Corporate Trainer Certification",
    template: "%s · Levitate PeopleSoft",
  },
  description:
    "Practice-led certification programs, corporate learning interventions and institutional training solutions that build high-trust, inclusive and human-centred workplaces.",
  keywords: [
    "Train-the-Trainer certification",
    "corporate training",
    "HR advisory",
    "POSH training",
    "POCSO training",
    "DEI facilitation",
    "workplace wellbeing",
    "Levitate PeopleSoft",
  ],
  applicationName: "Levitate PeopleSoft",
  authors: [{ name: "Levitate PeopleSoft" }],
  icons: {
    icon: "/assets/cropped-Levitate_peoplesoft-32x32.png",
    apple: "/assets/cropped-Levitate_peoplesoft-32x32.png",
  },
  // No explicit og/twitter title+description here: Next falls back to each
  // page's own title/description, so shared subpage links show their own name.
  openGraph: {
    siteName: "Levitate PeopleSoft",
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ShrmMarquee />
        {children}
        <EnquiryPopup />
      </body>
    </html>
  );
}
