"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

/**
 * Meta (Facebook) Pixel — measures visits and conversions from Meta ads, and
 * builds the audiences those ads are shown to.
 *
 * The base code is Meta's own, as its Events Manager gives it. It records one
 * PageView when it loads; this site moves between pages without reloading, so
 * each later route change sends its own PageView here — without that, Meta
 * would see every visit as a single page.
 *
 * Conversions (Lead, InitiateCheckout, Purchase, Contact) are sent from
 * lib/track.ts alongside the Google events, so each is named in one place.
 *
 * The id is public — it is in the page source of every site that runs the
 * pixel. NEXT_PUBLIC_ANALYTICS_OFF=1 leaves it out, as it does the Google tag.
 */
export const META_PIXEL_ID = "3581363985351504";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function MetaPixel() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    // The base code has already counted the page it loaded on.
    if (first.current) {
      first.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  if (process.env.NEXT_PUBLIC_ANALYTICS_OFF === "1") return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`} />
      </noscript>
    </>
  );
}
