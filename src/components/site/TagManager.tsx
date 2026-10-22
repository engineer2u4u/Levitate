import Script from "next/script";

/**
 * Google Tag Manager.
 *
 * A container rather than a tag: what it loads is decided in GTM's own
 * interface rather than here, which is the point of it — marketing can add a
 * conversion or a remarketing tag without a deploy.
 *
 * It runs ALONGSIDE the gtag in GoogleTag.tsx, which carries GA4 and Google
 * Ads directly. That is deliberate, and it is also the thing to watch: if the
 * container is ever given its own GA4 or Ads tag for the same property, every
 * page view and every conversion is counted twice. The container is the place
 * to check that, not this file.
 *
 * `afterInteractive`, like the rest of the measurement here: it has no
 * business competing with the page for the first paint.
 *
 * Set NEXT_PUBLIC_ANALYTICS_OFF=1 to leave it out of a build, as with the
 * other tags — scripts/deploy.sh refuses such a build.
 */
export const GTM_ID = "GTM-52X9MG9P";

export default function TagManager() {
  if (process.env.NEXT_PUBLIC_ANALYTICS_OFF === "1") return null;

  return (
    <Script id="gtm" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}

/**
 * The no-JavaScript half, which GTM asks to be the first thing in <body>.
 *
 * It does nothing for a visitor with scripts on, and nothing at all for the
 * events this site sends — those go through the data layer. It is here
 * because the container's own reporting counts these views, and leaving it
 * out makes a quiet hole in the numbers rather than an obvious one.
 */
export function TagManagerNoScript() {
  if (process.env.NEXT_PUBLIC_ANALYTICS_OFF === "1") return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
