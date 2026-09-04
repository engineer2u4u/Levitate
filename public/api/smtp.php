<?php
/**
 * Minimal SMTP client (STARTTLS + AUTH LOGIN).
 *
 * Extracted from enquiry.php so the invoice mailer sends the same way the
 * contact form already does. That matters more than tidiness: the domain
 * publishes SPF "-all" and DMARC p=quarantine, so mail must go out
 * authenticated through Microsoft 365 or it is junked. A second, slightly
 * different sender would be a second thing to get wrong.
 */

declare(strict_types=1);

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
