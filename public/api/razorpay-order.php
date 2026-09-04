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

$body = rzp_begin();

$slug = (string) ($body['courseSlug'] ?? '');
if ($slug === '' || !preg_match('/^[a-z0-9-]{1,64}$/', $slug)) {
    rzp_fail('Unknown course.');
}

$amount = rzp_price_for($slug);
if ($amount === null) {
    rzp_fail('This course is not open for payment.');
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

$notes = ['course_slug' => $slug];
foreach ([
    'customer_name'      => $customer['name'] ?? '',
    'customer_email'     => $customer['email'] ?? '',
    'customer_contact'   => $customer['contact'] ?? '',
    'customer_gstin'     => $billing['gstin'] ?? '',
    'customer_address'   => $billing['address'] ?? '',
    'customer_role'      => $billing['designation'] ?? '',
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
]);
