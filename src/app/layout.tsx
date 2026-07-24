import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Levitate PeopleSoft — Elevating Trainers. Transforming Workplaces.",
  description:
    "Practice-led certification programs, corporate learning interventions and institutional training solutions that build high-trust, inclusive and human-centred workplaces.",
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
