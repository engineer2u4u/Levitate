<?php
/**
 * Razorpay's own report of a captured payment.
 *
 * The verify endpoint records an enrolment the moment the browser reports a
 * payment — but only if the browser gets that far. Someone who pays and closes
 * the tab, or loses signal on the success screen, never calls it. Razorpay
 * calls this regardless, so their seat is recorded anyway.
 *
 * Trust comes from the signature: an HMAC of the raw body keyed with the
 * webhook secret set in the Razorpay dashboard (RAZORPAY_WEBHOOK_SECRET in
 * razorpay-config.php). The batch and account are read from the order's notes,
 * which only the order endpoint writes. The database function is idempotent on
 * the payment id, so this and verify reporting the same payment make one
 * enrolment.
 *
 * It does not issue an invoice — verify does, and cannot tell from here
 * whether it already has. A payment recorded only through this route shows
 * in the admin without an invoice number, which is the office's cue to raise
 * one.
 *
 * Set up in Razorpay → Settings → Webhooks: URL
 * https://levitatepeoplesoft.com/api/razorpay-webhook.php, event
 * payment.captured, and the same secret as RAZORPAY_WEBHOOK_SECRET.
 */

declare(strict_types=1);

require __DIR__ . '/razorpay-common.php';
require __DIR__ . '/supabase-common.php';

header('Content-Type: application/json; charset=utf-8');

$done = static function (int $code, array $body): never {
    http_response_code($code);
    echo json_encode($body);
    exit;
};

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    $done(405, ['ok' => false]);
}

$secret = rzp_cfg('RAZORPAY_WEBHOOK_SECRET');
if ($secret === '' || rzp_cfg('RAZORPAY_KEY_ID') === '' || rzp_cfg('RAZORPAY_KEY_SECRET') === '') {
    // Not set up yet. 503 makes Razorpay retry later instead of giving up.
    $done(503, ['ok' => false]);
}

$raw = file_get_contents('php://input') ?: '';
if ($raw === '' || strlen($raw) > 65536) {
    $done(400, ['ok' => false]);
}

$signature = (string) ($_SERVER['HTTP_X_RAZORPAY_SIGNATURE'] ?? '');
if ($signature === '' || !hash_equals(hash_hmac('sha256', $raw, $secret), $signature)) {
    $done(400, ['ok' => false]);
}

$event = json_decode($raw, true);
if (!is_array($event) || ($event['event'] ?? '') !== 'payment.captured') {
    // Anything else is acknowledged and ignored, so Razorpay stops sending it.
    $done(200, ['ok' => true, 'ignored' => true]);
}

$payment   = $event['payload']['payment']['entity'] ?? [];
$paymentId = (string) ($payment['id'] ?? '');
$orderId   = (string) ($payment['order_id'] ?? '');
if ($paymentId === '' || $orderId === '') {
    $done(200, ['ok' => true, 'ignored' => true]);
}

// Re-read from Razorpay rather than trusting the event body beyond its id:
// the notes and amount that matter are the order's.
$order = rzp_api('GET', '/v1/orders/' . rawurlencode($orderId));
$notes = is_array($order['notes'] ?? null) ? $order['notes'] : [];

if (($notes['batch_id'] ?? '') === '') {
    // Sold before batches existed, or while the database could not be asked.
    $done(200, ['ok' => true, 'ignored' => true]);
}

$amount = (int) ($order['amount'] ?? 0);
if ($amount <= 0 || (int) ($payment['amount'] ?? 0) !== $amount || ($order['currency'] ?? '') !== 'INR') {
    error_log('Webhook: payment ' . $paymentId . ' does not match its order; not recorded.');
    $done(200, ['ok' => true, 'ignored' => true]);
}

$enrolmentId = lvt_sb_record_paid_enrolment([
    'payment_id'   => $paymentId,
    'order_id'     => $orderId,
    'batch_id'     => (string) $notes['batch_id'],
    'user_id'      => (string) ($notes['user_id'] ?? ''),
    'email'        => (string) ($notes['customer_email'] ?? ($payment['email'] ?? '')),
    'name'         => (string) ($notes['customer_name'] ?? ''),
    'phone'        => (string) ($notes['customer_contact'] ?? ($payment['contact'] ?? '')),
    'amount_paise' => $amount,
    'invoice_no'   => '',
]);

if ($enrolmentId === null) {
    // A 500 makes Razorpay try again later, which is what a database hiccup needs.
    $done(500, ['ok' => false]);
}

$done(200, ['ok' => true]);
