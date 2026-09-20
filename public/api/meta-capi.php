<?php
/**
 * Reports a conversion to Meta from this server (the Conversions API).
 *
 * The pixel in the browser already reports it. A browser, though, is the one
 * place the report can go missing: an ad blocker, a tracking restriction, a
 * closed tab. The server has none of those problems, and it reports only what
 * it has verified with Razorpay.
 *
 * Both copies carry the same event_id, which is how Meta knows they are one
 * conversion and not two. The id is made in the browser and travels here with
 * the payment it belongs to.
 *
 * What is sent about the buyer — email and phone — is hashed with SHA-256, as
 * Meta requires; the plain values never leave this server. The access token is
 * read from razorpay-config.php above the web root (META_CAPI_TOKEN), never
 * from here, and never reaches a browser.
 *
 * Nothing here can fail a payment: every problem is logged and swallowed. A
 * conversion Meta did not hear about is a reporting gap; a payment refused
 * over one would be a lost sale.
 */

declare(strict_types=1);

if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === basename(__FILE__)) {
    http_response_code(404);
    exit;
}

/** Meta's own pixel id, the one the site's base code carries. */
const LVT_META_PIXEL_ID = '3581363985351504';

/** Hashed as Meta asks: trimmed, lowercased, then SHA-256. Absent stays absent. */
function lvt_meta_hash(string $value): ?string
{
    $value = trim(strtolower($value));
    return $value === '' ? null : hash('sha256', $value);
}

/** Digits only, as Meta asks for a phone number, then hashed. */
function lvt_meta_hash_phone(string $value): ?string
{
    $digits = preg_replace('/[^0-9]/', '', $value) ?? '';
    return $digits === '' ? null : hash('sha256', $digits);
}

/**
 * Sends one conversion. Returns true when Meta accepted it.
 *
 * $args: event_name, event_id, value, currency, email, phone, source_url.
 */
function lvt_meta_capi_event(array $args): bool
{
    $token = rzp_cfg('META_CAPI_TOKEN');
    $pixel = rzp_cfg('META_PIXEL_ID', LVT_META_PIXEL_ID);
    $eventId = trim((string) ($args['event_id'] ?? ''));

    if ($token === '') {
        // Not configured yet: the pixel still reports on its own.
        return false;
    }
    if ($eventId === '') {
        // Without the shared id Meta would count this a second time.
        error_log('Meta CAPI: no event_id for ' . ($args['event_name'] ?? '?') . ' — not sent, to avoid double counting.');
        return false;
    }

    $userData = array_filter([
        'em' => lvt_meta_hash((string) ($args['email'] ?? '')),
        'ph' => lvt_meta_hash_phone((string) ($args['phone'] ?? '')),
        // Meta matches on these two as well; they describe the buyer's
        // browser, which is the one this conversion came from.
        'client_ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
        'client_user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
        // Meta's cookies, when the browser passed them on.
        'fbc' => $args['fbc'] ?? null,
        'fbp' => $args['fbp'] ?? null,
    ], static fn ($v) => $v !== null && $v !== '');

    $event = array_filter([
        'event_name'       => (string) ($args['event_name'] ?? 'Purchase'),
        'event_time'       => time(),
        'event_id'         => $eventId,
        'event_source_url' => $args['source_url'] ?? null,
        'action_source'    => 'website',
        'user_data'        => $userData,
        'custom_data'      => array_filter([
            'value'    => isset($args['value']) ? (float) $args['value'] : null,
            'currency' => $args['currency'] ?? null,
        ], static fn ($v) => $v !== null),
    ], static fn ($v) => $v !== null && $v !== []);

    // Meta's endpoint. Overridable only so this can be pointed at a local
    // stub when testing; unset everywhere else.
    $base = rtrim(rzp_cfg('META_GRAPH_BASE', 'https://graph.facebook.com/v21.0'), '/');
    $url = $base . '/' . rawurlencode($pixel) . '/events';
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 8,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS     => json_encode(['data' => [$event], 'access_token' => $token]),
    ]);
    $response = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($status !== 200) {
        // The token is in the request, never in the log.
        error_log('Meta CAPI: ' . ($args['event_name'] ?? '?') . ' ' . $eventId . ' rejected (HTTP ' . $status . ')'
            . ($error !== '' ? ' ' . $error : '') . ' ' . substr((string) $response, 0, 300));
        return false;
    }
    return true;
}
