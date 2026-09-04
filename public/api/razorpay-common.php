<?php
/**
 * Shared plumbing for the two Razorpay endpoints.
 *
 * The site is a static export, so this is the only place that can hold a
 * secret or make a decision the browser is not allowed to make. Two decisions
 * live here and must never move to the client:
 *
 *   1. What a course costs. If the browser sent the amount, anyone could pay
 *      ₹1 for a ₹25,000 programme.
 *   2. Whether a payment happened. The browser's word for it is worthless —
 *      the success handler can be called by hand from the console.
 *
 * Credentials are never stored in this file or in git. They are read from the
 * environment, or from razorpay-config.php placed one level ABOVE the web root
 * so it can never be served over HTTP. Same arrangement as enquiry-config.php.
 */

declare(strict_types=1);

// Defines functions only; there is nothing to run and nothing to leak, but a
// direct hit should still not look like a working endpoint.
if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === basename(__FILE__)) {
    http_response_code(404);
    exit;
}

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */
function rzp_cfg(string $key, string $default = ''): string
{
    static $file = null;
    if ($file === null) {
        $file = [];
        $path = dirname($_SERVER['DOCUMENT_ROOT'] ?? __DIR__) . '/razorpay-config.php';
        if (is_readable($path)) {
            $loaded = require $path;
            if (is_array($loaded)) {
                $file = $loaded;
            }
        }
    }
    $env = getenv($key);
    if ($env !== false && $env !== '') {
        return $env;
    }
    return isset($file[$key]) ? (string) $file[$key] : $default;
}

/** Test keys are the only ones a development machine may drive. */
function rzp_is_test_mode(): bool
{
    return str_starts_with(rzp_cfg('RAZORPAY_KEY_ID'), 'rzp_test_');
}

/* ------------------------------------------------------------------ */
/* Prices — the server's copy, and the only one that counts             */
/* ------------------------------------------------------------------ */
/**
 * Deliberately duplicated from src/lib/lms/courses.ts rather than derived from
 * it. The client's copy decides what to display; this one decides what is
 * charged, and a build artefact the browser can edit must not be able to reach
 * it. A course absent here cannot be paid for at all.
 */
const RZP_PRICES_PAISE = [
    'posh-trainer'        => 2500000,
    'pocso-child-safety'  => 2000000,
    'inclusive-workplace' => 4000000,
    'demo-course'         => 100000,
];

function rzp_price_for(string $slug): ?int
{
    return RZP_PRICES_PAISE[$slug] ?? null;
}

/** Printed on the invoice, so it comes from here rather than from the client. */
const RZP_COURSE_TITLES = [
    'posh-trainer'        => 'PoSH & Workplace Dignity Facilitator Program (PoSH TTT)',
    'pocso-child-safety'  => 'POCSO & Child Safety Facilitator Program (POCSO TTT)',
    'inclusive-workplace' => 'Inclusive Workplace Facilitator Program (DEI TTT)',
    'demo-course'         => 'Demo · Workplace Facilitation Essentials',
];

function rzp_title_for(string $slug): string
{
    return RZP_COURSE_TITLES[$slug] ?? $slug;
}

/* ------------------------------------------------------------------ */
/* Request plumbing                                                    */
/* ------------------------------------------------------------------ */
function rzp_fail(string $message, int $code = 400): never
{
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $message]);
    exit;
}

/**
 * Same-origin is always allowed. Localhost is allowed only while the
 * configured key is a test key, so the development hole closes itself the
 * moment live keys go in — there is no separate switch to remember.
 */
function rzp_begin(): array
{
    header('Content-Type: application/json; charset=utf-8');

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '' && rzp_is_test_mode() && preg_match('#^http://(localhost|127\.0\.0\.1)(:\d+)?$#', $origin)) {
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
        rzp_fail('POST only.', 405);
    }

    if (rzp_cfg('RAZORPAY_KEY_ID') === '' || rzp_cfg('RAZORPAY_KEY_SECRET') === '') {
        rzp_fail('Payments are not configured yet on the server.', 500);
    }

    $raw = file_get_contents('php://input') ?: '';
    if (strlen($raw) > 8192) {
        rzp_fail('Request too large.', 413);
    }
    $body = json_decode($raw, true);
    return is_array($body) ? $body : [];
}

/* ------------------------------------------------------------------ */
/* Razorpay API                                                        */
/* ------------------------------------------------------------------ */
/**
 * @param string     $method GET or POST
 * @param string     $path   e.g. "/v1/orders"
 * @param array|null $payload JSON body for POST
 * @return array Decoded response
 */
function rzp_api(string $method, string $path, ?array $payload = null): array
{
    $url  = 'https://api.razorpay.com' . $path;
    $auth = base64_encode(rzp_cfg('RAZORPAY_KEY_ID') . ':' . rzp_cfg('RAZORPAY_KEY_SECRET'));
    $json = $payload === null ? null : json_encode($payload);

    $headers = ['Authorization: Basic ' . $auth, 'Content-Type: application/json'];

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST  => $method,
            CURLOPT_HTTPHEADER     => $headers,
            CURLOPT_TIMEOUT        => 20,
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        if ($json !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
        }
        $res = curl_exec($ch);
        $err = curl_error($ch);
        curl_close($ch);
        if ($res === false) {
            rzp_fail('Could not reach the payment gateway: ' . $err, 502);
        }
    } else {
        // SiteGround has cURL, but a stream fallback costs little and keeps the
        // endpoint working on a host that does not.
        $ctx = stream_context_create(['http' => [
            'method'        => $method,
            'header'        => implode("\r\n", $headers),
            'content'       => $json ?? '',
            'timeout'       => 20,
            'ignore_errors' => true,
        ]]);
        $res = @file_get_contents($url, false, $ctx);
        if ($res === false) {
            rzp_fail('Could not reach the payment gateway.', 502);
        }
    }

    $data = json_decode((string) $res, true);
    if (!is_array($data)) {
        rzp_fail('The payment gateway returned something unreadable.', 502);
    }
    if (isset($data['error'])) {
        // Razorpay's own message is safe to surface: it describes the request,
        // never the credentials.
        rzp_fail((string) ($data['error']['description'] ?? 'Payment gateway error.'), 502);
    }
    return $data;
}
