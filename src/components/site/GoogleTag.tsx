import Script from "next/script";

/**
 * Google's global site tag, carrying two destinations:
 *
 *   - Google Analytics 4 (G-ZF8DHDXC06) — traffic and behaviour reporting.
 *   - Google Ads (AW-18437850806)      — conversions and the remarketing
 *                                        audience the campaigns bid on.
 *
 * One gtag.js load, two `config` calls — Google's documented way to run
 * several products from the same tag. Loading the library once per ID would
 * fetch the same script twice and register the page view twice over.
 *
 * The ids are public — they are in the page source of every site that runs
 * one — so they live here rather than in an environment variable that would
 * have to be set on every machine that builds the site.
 *
 * `afterInteractive` rather than `beforeInteractive`: measurement has no
 * business competing with the page for the first paint.
 *
 * The data layer it creates is the one `lib/track.ts` pushes named events
 * into, so enquire_click, whatsapp_click and the rest reach both products
 * without further wiring.
 *
 * Set NEXT_PUBLIC_ANALYTICS_OFF=1 to leave it out of a build — used when
 * driving the site from a script, so automated runs do not land in the
 * reporting as real visits. scripts/deploy.sh refuses such a build.
 */
export const GA_ID = "G-ZF8DHDXC06";
export const ADS_ID = "AW-18437850806";

export default function GoogleTag() {
  if (process.env.NEXT_PUBLIC_ANALYTICS_OFF === "1") return null;

  return (
    <>
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="google-tag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');
gtag('config', '${ADS_ID}');`}
      </Script>
    </>
  );
}
