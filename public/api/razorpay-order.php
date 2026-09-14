<?php
/**
 * Creates a Razorpay order.
 *
 * The client sends only which course it wants. The amount comes from this
 * server's own price table and is written into the order, so what the learner
 * is charged is never something the browser proposed. The slug goes into the
 * order's notes as well, which is what lets the verify step confirm that the
 * payment which came back belongs to the course being unlocked.
 */

declare(strict_types=1);

require __DIR__ . '/razorpay-common.php';
require __DIR__ . '/supabase-common.php';

$body = rzp_begin();

$slug = (string) ($body['courseSlug'] ?? '');
if ($slug === '' || !preg_match('/^[a-z0-9-]{1,64}$/', $slug)) {
    rzp_fail('Unknown course.');
}

$amount = rzp_price_for($slug);
if ($amount === null) {
    rzp_fail('This course is not open for payment.');
}
if (rzp_is_closed($slug)) {
    rzp_fail('Registrations for this session have closed.');
}

/**
 * A public page asks for live payments only. While the server still holds
 * test keys, it is turned away here rather than being handed a checkout that
 * would accept a test card — a "registration" nobody paid for.
 */
if (($body['requireLive'] ?? false) === true && rzp_is_test_mode()) {
    rzp_fail('Online payment is not open yet. Please call or WhatsApp us to reserve your seat.', 503);
}

/**
 * Everything the checkout form collects, carried onto the order.
 *
 * Razorpay's own payment receipt goes to the email and phone below, and the
 * notes are what the dashboard shows against the payment — so the details an
 * invoice needs live with the payment rather than in a browser that has since
 * closed. Notes cap at 15 pairs of 256 characters, so each one is trimmed to
 * fit rather than risking the whole order being rejected for one long address.
 */
$note = static function (string $v): string {
    // Control characters would come back mangled; collapse whitespace too, so a
    // pasted multi-line address stays one readable line.
    $v = preg_replace('/[[:space:]]+/u', ' ', trim($v)) ?? '';
    return mb_substr($v, 0, 256);
};

$customer = is_array($body['customer'] ?? null) ? $body['customer'] : [];
$billing  = is_array($body['billing'] ?? null) ? $body['billing'] : [];

/**
 * Which run of the course is being bought — decided here, never taken from
 * the browser — and who is buying it.
 *
 * Both go into the order's notes, which only this server writes and the
 * verify step reads back from Razorpay. That is what lets verify record the
 * enrolment on the right batch and the right account without trusting
 * anything the browser says after paying.
 *
 * If the database cannot be asked, the sale still goes ahead: the payment is
 * real either way, and the office can place it from the Razorpay record. If
 * it answers that there is no open batch, or that the batch is full, the
 * sale is refused before anyone is charged.
 */
$batch = lvt_sb_next_batch($slug);
if ($batch === null) {
    rzp_fail('There is no open batch to enrol in right now. Please contact us to join the next one.');
}
if (is_array($batch) && $batch['seats_left'] < 1) {
    rzp_fail('This batch is full. Please contact us to join the next one.');
}

// A signed-in learner's token, sent in the body (Apache on shared hosting can
// strip an Authorization header before PHP sees it). Checked with Supabase.
$buyer = lvt_sb_user(is_string($body['accessToken'] ?? null) ? $body['accessToken'] : '');

$notes = ['course_slug' => $slug];
if (is_array($batch)) {
    $notes['batch_id'] = $batch['id'];
}
if ($buyer !== null) {
    $notes['user_id'] = $buyer['id'];
}
foreach ([
    'customer_name'      => $customer['name'] ?? '',
    'customer_email'     => $customer['email'] ?? '',
    'customer_contact'   => $customer['contact'] ?? '',
    'customer_gstin'     => $billing['gstin'] ?? '',
    'customer_state'     => $billing['stateCode'] ?? '',
    'customer_address'   => $billing['address'] ?? '',
    'customer_role'      => $billing['designation'] ?? '',
    'customer_org'       => $billing['organisation'] ?? '',
] as $k => $v) {
    $v = $note(is_string($v) ? $v : '');
    if ($v !== '') {
        $notes[$k] = $v;
    }
}

$order = rzp_api('POST', '/v1/orders', [
    'amount'   => $amount,
    'currency' => 'INR',
    // Razorpay caps the receipt at 40 characters.
    'receipt'  => substr('lvt_' . $slug . '_' . bin2hex(random_bytes(4)), 0, 40),
    'notes'    => $notes,
]);

echo json_encode([
    'ok'          => true,
    'orderId'     => $order['id'] ?? '',
    'amountPaise' => $amount,
    'currency'    => 'INR',
    'keyId'       => rzp_cfg('RAZORPAY_KEY_ID'),
    'live'        => !rzp_is_test_mode(),
]);
