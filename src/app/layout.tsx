import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Levitate PeopleSoft — Elevating Trainers. Transforming Workplaces.",
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
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Levitate PeopleSoft — Elevating Trainers. Transforming Workplaces.",
    description:
      "Practice-led certification programs, corporate learning interventions and institutional training solutions that build high-trust, inclusive and human-centred workplaces.",
    siteName: "Levitate PeopleSoft",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Levitate PeopleSoft — Elevating Trainers. Transforming Workplaces.",
    description:
      "Practice-led certification, corporate learning and institutional training for human-centred workplaces.",
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
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
