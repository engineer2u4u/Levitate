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
];
