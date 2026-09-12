<?php
/**
 * RECOVERY COPY — belongs at public/api/razorpay-common.php.
 *
 * That path is currently blocked on this machine (the file was removed by
 * security software mid-session and the name cannot be recreated until a
 * reboot). Once it can be written again, this file moves there and this copy
 * is deleted. Nothing requires it from here.
 *
 * ---------------------------------------------------------------------------
 *
 * Shared plumbing for the two Razorpay endpoints.
 *
 * The site is a static export, so this is the only place that can hold a
 * secret or make a decision the browser is not allowed to make. Two decisions
 * live here and must never move to the client:
 *
 *   1. What a course costs. If the browser sent the amount, anyone could pay
 *      ₹1 for a ₹32,000 programme.
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
/* Catalogue — what a course costs, as the admin last saved it          */
/* ------------------------------------------------------------------ */
/**
 * A course's fee, title, state and session times, read from the admin's
 * database (Supabase `courses` + `sessions`).
 *
 * The browser never tells this server a price; this server asks the database
 * — with the same public key and the same public read the website makes, so
 * RLS returns only published courses. A course the database does not return
 * cannot be paid for.
 *
 * Cached for a minute above the web root, so a burst of checkouts is one
 * request. If Supabase cannot be reached, the last good copy is used; a server
 * that has never reached it falls back to the fixed tables below, which are
 * the prices it was deployed with.
 */
function rzp_catalog(string $slug): ?array
{
    static $memo = [];
    if (!preg_match('/^[a-z0-9-]{1,64}$/', $slug)) {
        return null;
    }
    if (array_key_exists($slug, $memo)) {
        return $memo[$slug];
    }

    $dir    = dirname($_SERVER['DOCUMENT_ROOT'] ?? __DIR__) . '/levitate-cache';
    $file   = $dir . '/course-' . $slug . '.json';
    $cached = is_readable($file) ? json_decode((string) file_get_contents($file), true) : null;
    if (is_array($cached) && time() - (int) ($cached['fetched'] ?? 0) < 60) {
        return $memo[$slug] = is_array($cached['course'] ?? null) ? $cached['course'] : null;
    }

    $url = rtrim(rzp_cfg('SUPABASE_URL'), '/');
    $key = rzp_cfg('SUPABASE_ANON_KEY');
    if ($url !== '' && $key !== '') {
        $rows = rzp_http_json(
            $url . '/rest/v1/courses?slug=eq.' . rawurlencode($slug) . '&status=eq.live'
                . '&select=' . rawurlencode('title,price_paise,price_on_request,site_status,sessions(starts_at,status)'),
            ['apikey: ' . $key, 'Authorization: Bearer ' . $key]
        );
        if (is_array($rows)) {
            // An empty answer is an answer: the course is not published.
            $course = is_array($rows[0] ?? null) ? $rows[0] : null;
            if (!is_dir($dir)) {
                @mkdir($dir, 0700, true);
            }
            @file_put_contents($file, json_encode(['fetched' => time(), 'course' => $course]), LOCK_EX);
            return $memo[$slug] = $course;
        }
        error_log('Catalogue unreachable for ' . $slug . '; using ' . (is_array($cached) ? 'the last good copy' : 'the deployed prices'));
    }

    if (is_array($cached)) {
        return $memo[$slug] = is_array($cached['course'] ?? null) ? $cached['course'] : null;
    }
    return $memo[$slug] = rzp_fallback_course($slug);
}

/** GET a JSON document. Null on any failure: the caller decides what that means. */
function rzp_http_json(string $url, array $headers): ?array
{
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER     => $headers,
            CURLOPT_TIMEOUT        => 8,
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        $res  = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
    } else {
        $ctx  = stream_context_create(['http' => ['header' => implode("\r\n", $headers), 'timeout' => 8, 'ignore_errors' => true]]);
        $res  = @file_get_contents($url, false, $ctx);
        $code = 0;
        foreach ($http_response_header ?? [] as $h) {
            if (preg_match('#^HTTP/\S+\s+(\d{3})#', $h, $m)) {
                $code = (int) $m[1];
            }
        }
    }
    if ($res === false || $code !== 200) {
        return null;
    }
    $data = json_decode((string) $res, true);
    return is_array($data) ? $data : null;
}

/** The deployed prices, shaped like a catalogue row. The last resort only. */
function rzp_fallback_course(string $slug): ?array
{
    $price = RZP_PRICES_PAISE[$slug] ?? null;
    if ($price === null) {
        return null;
    }
    $closes = RZP_CLOSES_AT[$slug] ?? null;
    return [
        'title'            => RZP_COURSE_TITLES[$slug] ?? $slug,
        'price_paise'      => $price,
        'price_on_request' => false,
        'site_status'      => 'enrolling',
        'sessions'         => $closes ? [['starts_at' => $closes, 'status' => 'open']] : [],
    ];
}

/**
 * What a course costs now, or null if it cannot be bought: unpublished, on
 * the waitlist, or with its fee still "on request".
 */
function rzp_price_for(string $slug): ?int
{
    $c = rzp_catalog($slug);
    if ($c === null || ($c['site_status'] ?? '') !== 'enrolling' || !empty($c['price_on_request'])) {
        return null;
    }
    $paise = (int) ($c['price_paise'] ?? 0);
    return $paise > 0 ? $paise : null;
}

/**
 * One-off sessions stop taking payment the moment they start. Courses are not
 * listed and stay open. Checked when an order is created, not at verification
 * — someone who opened checkout at 5:59 and paid at 6:01 has paid for a seat.
 */
const RZP_CLOSE_AT_START = ['posh-masterclass-2026'];

function rzp_is_closed(string $slug): bool
{
    if (!in_array($slug, RZP_CLOSE_AT_START, true)) {
        return false;
    }
    $times = [];
    foreach ((array) (rzp_catalog($slug)['sessions'] ?? []) as $s) {
        $t = strtotime((string) ($s['starts_at'] ?? ''));
        if ($t !== false && ($s['status'] ?? 'open') !== 'draft') {
            $times[] = $t;
        }
    }
    if (!$times && isset(RZP_CLOSES_AT[$slug])) {
        $times[] = strtotime(RZP_CLOSES_AT[$slug]);
    }
    return $times !== [] && time() >= min($times);
}

/** Printed on the invoice, so it comes from here rather than from the client. */
function rzp_title_for(string $slug): string
{
    $title = (string) (rzp_catalog($slug)['title'] ?? '');
    return $title !== '' ? $title : (RZP_COURSE_TITLES[$slug] ?? $slug);
}

/* ------------------------------------------------------------------ */
/* Deployed prices — the fallback when the database cannot be reached   */
/* ------------------------------------------------------------------ */
/**
 * Only ever used by rzp_fallback_course(). Kept so a server that cannot reach
 * Supabase and has no cached copy still charges the prices it shipped with,
 * rather than refusing every sale. The admin's database is the real source.
 */
const RZP_PRICES_PAISE = [
    'posh-trainer'        => 3200000,
    'pocso-child-safety'  => 2000000,
    'inclusive-workplace' => 4000000,
    'demo-course'         => 100000,
    // The early-bird fee, open until the session starts. The ₹2,999 standard
    // fee on the page is shown struck through and is never charged.
    'posh-masterclass-2026' => 199900,
];

/** Fallback start times for one-off sessions (see RZP_CLOSE_AT_START). */
const RZP_CLOSES_AT = [
    'posh-masterclass-2026' => '2026-09-27T11:30:00+05:30',
];

/** Fallback invoice titles. */
const RZP_COURSE_TITLES = [
    'posh-trainer'        => 'PoSH & Workplace Dignity Facilitator Program (PoSH TTT)',
    'pocso-child-safety'  => 'POCSO & Child Safety Facilitator Program (POCSO TTT)',
    'inclusive-workplace' => 'Inclusive Workplace Facilitator Program (DEI TTT)',
    'demo-course'         => 'Demo · Workplace Facilitation Essentials',
    'posh-masterclass-2026' => 'PoSH 2026: The New Compliance & Workplace Reality — Masterclass, 27 September 2026',
];

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
