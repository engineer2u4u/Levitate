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
class Smtp
{
    /** @var resource */
    private $sock;

    public function __construct(private string $host, private int $port, private int $timeout = 20) {}

    private function read(): string
    {
        $data = '';
        while (($line = fgets($this->sock, 515)) !== false) {
            $data .= $line;
            // Last line of a reply has a space in the 4th position.
            if (strlen($line) < 4 || $line[3] === ' ') {
                break;
            }
        }
        return $data;
    }

    private function cmd(string $cmd, string $expect): string
    {
        fwrite($this->sock, $cmd . "\r\n");
        $reply = $this->read();
        if (!str_starts_with($reply, $expect)) {
            throw new RuntimeException('SMTP: expected ' . $expect . ', got: ' . trim($reply));
        }
        return $reply;
    }

    public function send(string $user, string $pass, string $from, array $to, string $data): void
    {
        $ctx = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true]]);
        $sock = @stream_socket_client(
            "tcp://{$this->host}:{$this->port}",
            $errno,
            $errstr,
            $this->timeout,
            STREAM_CLIENT_CONNECT,
            $ctx
        );
        if (!$sock) {
            throw new RuntimeException("SMTP connect failed: $errstr ($errno)");
        }
        $this->sock = $sock;
        stream_set_timeout($this->sock, $this->timeout);

        $this->read();                               // greeting
        $ehlo = 'levitatepeoplesoft.com';
        $this->cmd("EHLO $ehlo", '250');
        $this->cmd('STARTTLS', '220');

        if (!stream_socket_enable_crypto($this->sock, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            throw new RuntimeException('SMTP: TLS negotiation failed');
        }
        $this->cmd("EHLO $ehlo", '250');             // must re-EHLO after TLS

        $this->cmd('AUTH LOGIN', '334');
        $this->cmd(base64_encode($user), '334');
        $this->cmd(base64_encode($pass), '235');

        $this->cmd('MAIL FROM:<' . $from . '>', '250');
        foreach ($to as $rcpt) {
            $this->cmd('RCPT TO:<' . $rcpt . '>', '250');
        }
        $this->cmd('DATA', '354');

        // Dot-stuffing: a lone "." would end the message early.
        $body = preg_replace('/^\./m', '..', str_replace("\n", "\r\n", str_replace("\r\n", "\n", $data)));
        fwrite($this->sock, $body . "\r\n.\r\n");
        $reply = $this->read();
        if (!str_starts_with($reply, '250')) {
            throw new RuntimeException('SMTP: message rejected: ' . trim($reply));
        }

        fwrite($this->sock, "QUIT\r\n");
        fclose($this->sock);
    }
}

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
