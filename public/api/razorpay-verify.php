<?php
/**
 * Verifies a completed payment. Access follows this endpoint's answer and
 * nothing else.
 *
 * Two checks, because the first alone is not enough:
 *
 *   1. The signature. HMAC-SHA256 of "orderId|paymentId" keyed with the secret
 *      proves the pair came from Razorpay and not from a console.
 *   2. The payment itself, re-read from Razorpay. A valid signature says the
 *      pair is genuine; it does not say the money was captured, that the
 *      amount was right, or that the order was for the course now being
 *      unlocked. Someone who pays ₹1,000 for the demo would otherwise hold a
 *      signature that unlocks a ₹32,000 programme.
 */

declare(strict_types=1);

require __DIR__ . '/razorpay-common.php';
require __DIR__ . '/invoice.php';

$body = rzp_begin();

$orderId   = (string) ($body['orderId'] ?? '');
$paymentId = (string) ($body['paymentId'] ?? '');
$signature = (string) ($body['signature'] ?? '');
$slug      = (string) ($body['courseSlug'] ?? '');

if ($orderId === '' || $paymentId === '' || $signature === '') {
    rzp_fail('Incomplete payment details.');
}

$expected = hash_hmac('sha256', $orderId . '|' . $paymentId, rzp_cfg('RAZORPAY_KEY_SECRET'));
if (!hash_equals($expected, $signature)) {
    rzp_fail('This payment could not be verified.', 400);
}

$payment = rzp_api('GET', '/v1/payments/' . rawurlencode($paymentId));

$status = (string) ($payment['status'] ?? '');
if ($status !== 'captured' && $status !== 'authorized') {
    rzp_fail('That payment has not gone through (' . $status . ').', 402);
}
if ((string) ($payment['order_id'] ?? '') !== $orderId) {
    rzp_fail('This payment belongs to a different order.', 400);
}

// The order is this server's own record of the sale: the order endpoint wrote
// the course into its notes and the fee into its amount. It is what the
// payment is checked against — not today's fee, which an admin may have
// changed between checkout and payment. Checking the current fee would reject
// a genuine payment made at the old price.
$order   = rzp_api('GET', '/v1/orders/' . rawurlencode($orderId));
$notes   = is_array($order['notes'] ?? null) ? $order['notes'] : [];
$paidFor = (string) ($notes['course_slug'] ?? '');
if ($paidFor === '') {
    rzp_fail('This payment is not for a course sold here.', 400);
}
if ($slug !== '' && $slug !== $paidFor) {
    rzp_fail('This payment was for a different course.', 400);
}

$expectedAmount = (int) ($order['amount'] ?? 0);
if (
    $expectedAmount <= 0
    || ($order['currency'] ?? '') !== 'INR'
    || (int) ($payment['amount'] ?? 0) !== $expectedAmount
) {
    rzp_fail('The amount paid does not match the order.', 400);
}

$slugPaid = $paidFor !== '' ? $paidFor : $slug;

// Issued only now, on the far side of every check above. Failure here is
// reported, never fatal: the learner has paid and must not be told the
// payment failed because an invoice could not be numbered or emailed.
$invoice = lvt_issue_invoice($paymentId, $orderId, $expectedAmount, rzp_title_for($slugPaid), $notes);
$emailed = $invoice !== null && lvt_send_invoice($invoice);

echo json_encode([
    'ok'          => true,
    'verified'    => true,
    'invoiceNo'   => $invoice['invoice_no'] ?? null,
    'invoiceSent' => $emailed,
    'courseSlug'  => $slugPaid,
    'orderId'     => $orderId,
    'paymentId'   => $paymentId,
    'amountPaise' => $expectedAmount,
    'live'        => !rzp_is_test_mode(),
    'at'          => gmdate('c'),
]);
