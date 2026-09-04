<?php
/**
 * Enquiry form handler — relays through Microsoft 365 SMTP.
 *
 * The domain publishes SPF "-all" (only Microsoft may send) and DMARC
 * p=quarantine, so mail sent with PHP mail() from this server would fail
 * alignment and be junked. Authenticating to Microsoft and letting it do the
 * sending keeps SPF, DKIM and DMARC all passing.
 *
 * Credentials are never stored in this file or in git. They are read from the
 * environment, or from enquiry-config.php placed one level ABOVE the web root
 * so it can never be served over HTTP.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */
function cfg(string $key, string $default = ''): string
{
    static $file = null;
    if ($file === null) {
        $file = [];
        $path = dirname($_SERVER['DOCUMENT_ROOT'] ?? __DIR__) . '/enquiry-config.php';
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

const SMTP_HOST = 'smtp.office365.com';
const SMTP_PORT = 587;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
function fail(string $message, int $code = 400): never
{
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $message]);
    exit;
}

function field(string $name, int $max = 2000): string
{
    $v = $_POST[$name] ?? '';
    if (!is_string($v)) {
        return '';
    }
    // Strip CR/LF from short fields to prevent header injection.
    $v = trim($v);
    return mb_substr($v, 0, $max);
}

function headerSafe(string $v): string
{
    return trim(str_replace(["\r", "\n", "\0"], ' ', $v));
}

/** RFC 2047 encode a header value so non-ASCII survives. */
function encodeHeader(string $v): string
{
    $v = headerSafe($v);
    return preg_match('/[^\x20-\x7E]/', $v) ? '=?UTF-8?B?' . base64_encode($v) . '?=' : $v;
}

/* ------------------------------------------------------------------ */
/* Minimal SMTP client (STARTTLS + AUTH LOGIN)                         */
/* ------------------------------------------------------------------ */
require_once __DIR__ . '/smtp.php';

/* ------------------------------------------------------------------ */
/* Handle the request                                                  */
/* ------------------------------------------------------------------ */
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fail('Method not allowed', 405);
}

// Honeypot: real people never fill this in.
if (field('company_website') !== '') {
    echo json_encode(['ok' => true]);   // silently accept, send nothing
    exit;
}

$name  = field('name', 120);
$email = field('email', 200);
$phone = field('phone', 60);

if ($name === '' || $email === '' || $phone === '') {
    fail('Please fill in your name, email and phone.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail('That email address does not look right.');
}

$org        = field('organization', 200);
$intent     = field('intent', 200);
$people     = field('participants', 60);
$mode       = field('mode', 60);
$message    = field('message', 5000);
$sourcePage = field('source', 200);

$user = cfg('SMTP_USER');
$pass = cfg('SMTP_PASS');
$from = cfg('MAIL_FROM', $user);
$toRaw = cfg('MAIL_TO', 'contactus@levitatepeoplesoft.com');
$to = array_values(array_filter(array_map('trim', explode(',', $toRaw))));

if ($user === '' || $pass === '') {
    fail('Mail is not configured yet on the server.', 500);
}

$subjectBits = array_filter([$intent ?: 'Website enquiry', $org]);
$subject = 'Enquiry: ' . implode(' — ', $subjectBits);

$rows = [
    'Name'         => $name,
    'Email'        => $email,
    'Phone'        => $phone,
    'Organization' => $org,
    'Enquiry about' => $intent,
    'Participants' => $people,
    'Preferred mode' => $mode,
    'Page'         => $sourcePage,
];

$lines = ["New enquiry from the Levitate PeopleSoft website", str_repeat('=', 46), ''];
foreach ($rows as $k => $v) {
    if ($v !== '') {
        $lines[] = str_pad($k . ':', 16) . $v;
    }
}
if ($message !== '') {
    $lines[] = '';
    $lines[] = 'Message:';
    $lines[] = $message;
}
$lines[] = '';
$lines[] = 'Received: ' . date('D, d M Y H:i:s O');
$text = implode("\n", $lines);

$boundaryless = [
    'Date: ' . date('r'),
    'From: ' . encodeHeader('Levitate PeopleSoft Website') . ' <' . headerSafe($from) . '>',
    'To: ' . implode(', ', array_map('headerSafe', $to)),
    'Reply-To: ' . encodeHeader($name) . ' <' . headerSafe($email) . '>',
    'Subject: ' . encodeHeader($subject),
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: levitate-website',
    '',
    $text,
];

try {
    (new Smtp(SMTP_HOST, SMTP_PORT))->send($user, $pass, $from, $to, implode("\r\n", $boundaryless));
    echo json_encode(['ok' => true]);
} catch (Throwable $e) {
    error_log('[enquiry] ' . $e->getMessage());
    fail('We could not send your enquiry just now. Please email us directly.', 502);
}
