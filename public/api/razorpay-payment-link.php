<?php
/**
 * Makes a Razorpay payment link for a seat the office is selling by hand.
 *
 * The admin used to create the link in Razorpay's dashboard and paste it into
 * the enrolment form, which is slow and gets the amount wrong often enough to
 * matter. This makes the link from the batch's own price instead, and attaches
 * the enrolment's id to it so the webhook can mark the right seat paid.
 *
 * What it will not do:
 *   - take an amount from the browser without checking it. The price comes
 *     from the batch in the database; a passed amount is only ever accepted as
 *     a discount, never as a rise, and never as free;
 *   - answer anyone who is not a signed-in admin.
 *
 * POST { accessToken, batchId, enrolmentId, name, email, phone?, amountPaise? }
 * -> { ok: true, url, id, amountPaise }
 */

declare(strict_types=1);

require_once __DIR__ . '/razorpay-common.php';
require_once __DIR__ . '/supabase-common.php';

$body = rzp_begin();

/* ------------------------------------------------------------ caller */

$token = (string) ($body['accessToken'] ?? '');
$user  = $token === '' ? null : lvt_sb_user($token);
if ($user === null) {
    rzp_fail('Sign in to the admin portal first.', 401);
}
if (!lvt_sb_is_admin($token, (string) $user["id"])) {
    rzp_fail('Only an admin can create a payment link.', 403);
}

/* ------------------------------------------------------------- input */

$batchId     = (string) ($body['batchId'] ?? '');
$enrolmentId = (string) ($body['enrolmentId'] ?? '');
$name        = trim((string) ($body['name'] ?? ''));
$email       = trim((string) ($body['email'] ?? ''));
$phone       = preg_replace('/[^0-9+]/', '', (string) ($body['phone'] ?? '')) ?? '';

$uuid = '/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i';
if (!preg_match($uuid, $batchId)) {
    rzp_fail('Which batch is this for?');
}
if ($enrolmentId !== '' && !preg_match($uuid, $enrolmentId)) {
    rzp_fail('That enrolment id is not one.');
}
if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    rzp_fail('A name and a real email address, so the receipt reaches someone.');
}

/* ------------------------------------------------- price, from the batch */

[$code, $rows] = lvt_sb_request(
    'GET',
    '/rest/v1/batches?select=' . rawurlencode('id,name,price_paise,courses!inner(slug,title)')
        . '&id=eq.' . rawurlencode($batchId) . '&limit=1',
    $token
);
if ($code !== 200 || !is_array($rows) || !isset($rows[0])) {
    rzp_fail('That batch could not be read.', 502);
}

$batch  = $rows[0];
$course = is_array($batch['courses'] ?? null) ? $batch['courses'] : [];
$listed = (int) ($batch['price_paise'] ?? 0);

if ($listed < 100) {
    rzp_fail('This batch has no price yet. Set one on the batch, then make the link.');
}

// A discount is the office's to give; a rise is not, and nor is free.
$amount = $listed;
if (isset($body['amountPaise']) && $body['amountPaise'] !== '' && $body['amountPaise'] !== null) {
    $asked = (int) $body['amountPaise'];
    if ($asked < 100) {
        rzp_fail('The amount has to be at least ₹1.');
    }
    if ($asked > $listed) {
        rzp_fail('That is more than the batch price. Change the batch price if the fee has gone up.');
    }
    $amount = $asked;
}

/* ---------------------------------------------------------------- link */

$title = (string) ($course['title'] ?? 'Levitate programme');
$payload = [
    'amount'       => $amount,
    'currency'     => 'INR',
    'accept_partial' => false,
    'description'  => mb_substr($title . ' · ' . (string) ($batch['name'] ?? ''), 0, 2048),
    'customer'     => array_filter([
        'name'    => mb_substr($name, 0, 128),
        'email'   => $email,
        'contact' => $phone !== '' ? $phone : null,
    ]),
    // The office shares the link itself, over WhatsApp or email, so Razorpay
    // is told not to send its own notification on top.
    'notify'         => ['sms' => false, 'email' => false],
    'reminder_enable' => true,
    'notes' => array_filter([
        'batch_id'     => $batchId,
        'enrolment_id' => $enrolmentId !== '' ? $enrolmentId : null,
        'course_slug'  => (string) ($course['slug'] ?? ''),
        'issued_by'    => (string) ($user['id'] ?? ''),
        // Marks a discounted link as one, so the dashboard shows why it is not
        // the list price.
        'list_paise'   => $amount === $listed ? null : (string) $listed,
    ]),
];

$link = rzp_api('POST', '/v1/payment_links', $payload);

if (!is_string($link['short_url'] ?? null)) {
    $why = is_string($link['error']['description'] ?? null) ? $link['error']['description'] : 'Razorpay would not make the link.';
    rzp_fail($why, 502);
}

echo json_encode([
    'ok'          => true,
    'url'         => $link['short_url'],
    'id'          => (string) ($link['id'] ?? ''),
    'amountPaise' => $amount,
]);
