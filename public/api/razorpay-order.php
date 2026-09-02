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

$order = rzp_api('POST', '/v1/orders', [
    'amount'   => $amount,
    'currency' => 'INR',
    // Razorpay caps the receipt at 40 characters.
    'receipt'  => substr('lvt_' . $slug . '_' . bin2hex(random_bytes(4)), 0, 40),
    'notes'    => ['course_slug' => $slug],
]);

echo json_encode([
    'ok'          => true,
    'orderId'     => $order['id'] ?? '',
    'amountPaise' => $amount,
    'currency'    => 'INR',
    'keyId'       => rzp_cfg('RAZORPAY_KEY_ID'),
]);
