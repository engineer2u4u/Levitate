import Script from "next/script";

/**
 * Google Ads global site tag.
 *
 * The measurement id is public — it is visible in the page source of every
 * site that runs one — so it lives here rather than in an environment
 * variable that would have to be set on every machine that builds the site.
 *
 * `afterInteractive` rather than `beforeInteractive`: a conversion tag has no
 * business competing with the page for the first paint, and Google's own
 * snippet is written to be dropped in after load.
 *
 * The data layer it creates is the same one `lib/track.ts` pushes named events
 * into, so the events the sales pages already emit arrive here without further
 * wiring.
 *
 * Set NEXT_PUBLIC_ANALYTICS_OFF=1 to leave it out of a build — used when
 * driving the site from a script, so automated runs do not land in the
 * reporting as real visits.
 */
const ADS_ID = "AW-18437850806";

export default function GoogleTag() {
  if (process.env.NEXT_PUBLIC_ANALYTICS_OFF === "1") return null;

  return (
    <>
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`} strategy="afterInteractive" />
      <Script id="google-tag" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${ADS_ID}');`}
      </Script>
    </>
  );
}
