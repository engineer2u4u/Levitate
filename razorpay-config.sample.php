<?php
/**
 * Copy this to razorpay-config.php ONE LEVEL ABOVE the web root on the server
 * — the same place enquiry-config.php already lives — and fill in the secret.
 *
 * Above the web root is the whole point: a file inside public_html can be
 * fetched over HTTP, and a misconfigured server will happily hand out .php
 * source. Nothing here belongs in git, in the Next.js bundle, or in any
 * NEXT_PUBLIC_* variable.
 *
 * On SiteGround the path is typically:
 *   /home/<account>/www/levitatepeoplesoft.com/razorpay-config.php
 * i.e. beside public_html, not inside it.
 */

return [
    // Safe to be public — it already is, in the checkout URL.
    'RAZORPAY_KEY_ID'     => 'rzp_test_xxxxxxxxxxxxxx',

    // Never leaves the server. Razorpay -> Settings -> API Keys.
    'RAZORPAY_KEY_SECRET' => 'PUT_THE_TEST_KEY_SECRET_HERE',

    // Where fees and titles come from: the admin's Supabase project. The public
    // (anon) key is enough — the same read the website makes.
    'SUPABASE_URL'        => 'https://xxxxxxxxxxxxxxxxxxxx.supabase.co',
    'SUPABASE_ANON_KEY'   => 'PUT_THE_SUPABASE_ANON_KEY_HERE',

    // Records a verified payment as a paid enrolment, through the one database
    // function granted to it (record_paid_enrolment). Supabase -> Project
    // Settings -> API Keys: prefer a revocable "secret" key (sb_secret_...) over
    // the legacy service_role key. Without it payments still go through and are
    // invoiced, but the learner's enrolment has to be added by hand.
    'SUPABASE_SERVICE_KEY' => 'PUT_THE_SUPABASE_SECRET_KEY_HERE',

    // Razorpay -> Settings -> Webhooks: URL .../api/razorpay-webhook.php, event
    // payment.captured, and this same secret. Records the enrolment even when
    // the buyer closes the browser before the success screen.
    'RAZORPAY_WEBHOOK_SECRET' => 'PUT_THE_WEBHOOK_SECRET_HERE',

    /*
     * Meta Conversions API — reports each verified purchase to Meta from this
     * server as well as from the browser, so a blocked or closed browser does
     * not lose the sale. Both copies carry the same event id, so Meta counts
     * them once.
     *
     * Events Manager -> Data sources -> your pixel -> Settings -> Conversions
     * API -> Generate access token. Leave it out and only the pixel reports.
     * The pixel id defaults to the one the site's base code carries.
     */
    'META_CAPI_TOKEN' => 'PUT_THE_META_CONVERSIONS_API_TOKEN_HERE',
    // 'META_PIXEL_ID' => '3581363985351504',
];
