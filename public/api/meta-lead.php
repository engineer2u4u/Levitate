<?php
/**
 * Reports a submitted enquiry to Meta as a Lead, from this server.
 *
 * The pixel in the browser reports it too, and both carry the same event_id,
 * so Meta counts one lead. This copy is the one that survives an ad blocker,
 * a tracking restriction or a tab closed on the thank-you state.
 *
 * Unlike the payment endpoints there is nothing to verify here: a static site
 * has no server-side enquiry to check against. The browser is therefore
 * trusted for the fact of the lead, which is why this endpoint says nothing
 * back, accepts only same-origin submissions, and sends only what Meta needs.
 * The cost of a bad actor calling it is noise in Meta's reporting, never
 * anything charged, granted or stored.
 *
 * Email and phone are hashed here (SHA-256) and never sent onward in the
 * clear; the access token is read from razorpay-config.php above the web
 * root and never reaches a browser.
 */

declare(strict_types=1);

require __DIR__ . '/razorpay-common.php';
require __DIR__ . '/meta-capi.php';

header('Content-Type: application/json; charset=utf-8');

/**
 * Same-origin only, with localhost allowed while the site is in test mode —
 * the same rule the payment endpoints use, so a development machine cannot
 * quietly feed the live pixel.
 */
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$isLocal = $origin !== '' && preg_match('#^http://(localhost|127\.0\.0\.1)(:\d+)?$#', $origin) === 1;
if ($isLocal && rzp_is_test_mode()) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false]);
    exit;
}

$body = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($body)) {
    $body = [];
}

// Answered before the call to Meta, and the same either way: the visitor's
// enquiry has already been sent, and nothing here should keep them waiting or
// tell a caller whether reporting is configured.
$sent = lvt_meta_capi_event([
    'event_name' => 'Lead',
    'event_id'   => (string) ($body['eventId'] ?? ''),
    'email'      => (string) ($body['email'] ?? ''),
    'phone'      => (string) ($body['phone'] ?? ''),
    'source_url' => (string) ($body['sourceUrl'] ?? ($_SERVER['HTTP_REFERER'] ?? '')),
    'fbc'        => (string) ($body['fbc'] ?? ''),
    'fbp'        => (string) ($body['fbp'] ?? ''),
]);

http_response_code(202);
echo json_encode(['ok' => true, 'reported' => $sent]);
