<?php
/**
 * The payment server's calls to Supabase.
 *
 * Three kinds, with three levels of trust:
 *
 *   · Public reads (the next open batch, seats left) use the anon key — the
 *     same access the website itself has.
 *   · "Who is this?" checks a learner's access token by asking Supabase Auth
 *     for the user it belongs to. Supabase verifies the token; nothing here
 *     decodes or trusts it on its own.
 *   · Recording a verified payment uses the service key, and only to call the
 *     one database function made for it (record_paid_enrolment), which is
 *     granted to the service role and nobody else.
 *
 * The service key is read from razorpay-config.php above the web root
 * (SUPABASE_SERVICE_KEY), never from this file or git, and never sent to a
 * browser or into an error message.
 */

declare(strict_types=1);

if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === basename(__FILE__)) {
    http_response_code(404);
    exit;
}

require_once __DIR__ . '/razorpay-common.php';

/**
 * One request to Supabase. Returns [status code, decoded body or null].
 * Never exits: every caller here must be able to carry on when Supabase is
 * unreachable, because a payment that has been taken must still be answered.
 */
function lvt_sb_request(string $method, string $path, string $bearer, ?array $payload = null): array
{
    $url = rtrim(rzp_cfg('SUPABASE_URL'), '/');
    $anon = rzp_cfg('SUPABASE_ANON_KEY');
    if ($url === '' || $anon === '') {
        return [0, null];
    }
    // The service key is its own apikey; everything else identifies as anon.
    $apikey = $bearer === rzp_cfg('SUPABASE_SERVICE_KEY') && $bearer !== '' ? $bearer : $anon;
    $headers = [
        'apikey: ' . $apikey,
        'Authorization: Bearer ' . ($bearer !== '' ? $bearer : $anon),
        'Content-Type: application/json',
        'Accept: application/json',
    ];
    $json = $payload === null ? null : json_encode($payload);

    if (function_exists('curl_init')) {
        $ch = curl_init($url . $path);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST  => $method,
            CURLOPT_HTTPHEADER     => $headers,
            CURLOPT_TIMEOUT        => 10,
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        if ($json !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
        }
        $res  = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
    } else {
        $ctx = stream_context_create(['http' => [
            'method'        => $method,
            'header'        => implode("\r\n", $headers),
            'content'       => $json ?? '',
            'timeout'       => 10,
            'ignore_errors' => true,
        ]]);
        $res  = @file_get_contents($url . $path, false, $ctx);
        $code = 0;
        foreach ($http_response_header ?? [] as $h) {
            if (preg_match('#^HTTP/\S+\s+(\d{3})#', $h, $m)) {
                $code = (int) $m[1];
            }
        }
    }
    if ($res === false) {
        return [0, null];
    }
    $data = json_decode((string) $res, true);
    return [$code, $data];
}

/**
 * The account an access token belongs to, as Supabase Auth reports it, or
 * null for a missing, expired or forged token.
 *
 * @return array{id: string, email: string}|null
 */
function lvt_sb_user(string $jwt): ?array
{
    if ($jwt === '' || strlen($jwt) > 4096) {
        return null;
    }
    [$code, $data] = lvt_sb_request('GET', '/auth/v1/user', $jwt);
    if ($code !== 200 || !is_array($data) || !is_string($data['id'] ?? null)) {
        return null;
    }
    return ['id' => $data['id'], 'email' => (string) ($data['email'] ?? '')];
}

/**
 * The batch a course is selling now: the soonest upcoming or running batch
 * that is open for enrolment. False when Supabase could not be asked — the
 * caller decides whether that blocks a sale — and null when it answered that
 * there is none.
 *
 * @return array{id: string, name: string, seats_left: int}|null|false
 */
function lvt_sb_next_batch(string $slug)
{
    if (!preg_match('/^[a-z0-9-]{1,64}$/', $slug)) {
        return null;
    }
    [$code, $rows] = lvt_sb_request(
        'GET',
        '/rest/v1/batches?select=' . rawurlencode('id,name,starts_on,courses!inner(slug)')
            . '&courses.slug=eq.' . rawurlencode($slug)
            . '&status=in.(upcoming,running)&enrolment_open=eq.true'
            . '&order=starts_on.asc.nullslast&limit=1',
        ''
    );
    if ($code !== 200 || !is_array($rows)) {
        return false;
    }
    $batch = $rows[0] ?? null;
    if (!is_array($batch) || !is_string($batch['id'] ?? null)) {
        return null;
    }
    [$seatCode, $left] = lvt_sb_request('POST', '/rest/v1/rpc/batch_seats_left', '', ['p_batch' => $batch['id']]);
    return [
        'id'         => $batch['id'],
        'name'       => (string) ($batch['name'] ?? ''),
        // Unknown counts as available: the database refuses nothing it has
        // already taken money for, and a lookup failure should not block a sale.
        'seats_left' => $seatCode === 200 && is_numeric($left) ? (int) $left : PHP_INT_MAX,
    ];
}

/** Records a verified payment as a paid enrolment. The enrolment id, or null. */
function lvt_sb_record_paid_enrolment(array $args): ?string
{
    $service = rzp_cfg('SUPABASE_SERVICE_KEY');
    if ($service === '') {
        error_log('SUPABASE_SERVICE_KEY is not configured; payment ' . ($args['payment_id'] ?? '?') . ' was not recorded as an enrolment.');
        return null;
    }
    [$code, $data] = lvt_sb_request('POST', '/rest/v1/rpc/record_paid_enrolment', $service, ['p' => $args]);
    if ($code !== 200 || !is_string($data)) {
        error_log('record_paid_enrolment failed for payment ' . ($args['payment_id'] ?? '?') . ' (HTTP ' . $code . ')');
        return null;
    }
    return $data;
}
