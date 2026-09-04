<?php
/**
 * Issues the GST tax invoice for a verified payment and emails it.
 *
 * Razorpay's own payment receipt confirms that money moved. It is not a tax
 * invoice: it carries no GSTIN, no invoice number from a series, and no
 * CGST/SGST/IGST breakdown. A buyer paying ₹40,000 with 18% shown at checkout
 * is entitled to all three, and a registered buyer needs them to claim input
 * credit. This produces that document.
 *
 * Called from razorpay-verify.php once, after the payment has been confirmed
 * against Razorpay — never on the browser's say-so.
 */

declare(strict_types=1);

if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === basename(__FILE__)) {
    http_response_code(404);
    exit;
}

require_once __DIR__ . '/smtp.php';

/**
 * Microsoft 365 credentials, read from enquiry-config.php above the web root.
 * Deliberately the same file the contact form uses: one mailbox, one password
 * to rotate, and a setup already known to pass SPF, DKIM and DMARC.
 */
function lvt_mail_cfg(string $key, string $default = ''): string
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

/* ------------------------------------------------------------------ */
/* The seller                                                          */
/* ------------------------------------------------------------------ */
const LVT_SELLER = [
    'name'    => 'Levitate PeopleSoft',
    'gstin'   => '06AANFL3018J1Z9',
    'address' => "H 4022, 1st Floor, Versalia Ansal Esencia, Sector 67\nUrban Estate Gurgaon SO, Gurugram, Haryana 122001",
    'state'   => '06',
    'email'   => 'contactus@levitatepeoplesoft.com',
    'phone'   => '+91 70656 45999',
    'site'    => 'www.levitatepeoplesoft.com',
];

const LVT_INVOICE_PREFIX = 'LPS';
const LVT_GST_RATE = 18;

const LVT_STATES = [
    '01' => 'Jammu and Kashmir', '02' => 'Himachal Pradesh', '03' => 'Punjab', '04' => 'Chandigarh',
    '05' => 'Uttarakhand', '06' => 'Haryana', '07' => 'Delhi', '08' => 'Rajasthan',
    '09' => 'Uttar Pradesh', '10' => 'Bihar', '11' => 'Sikkim', '12' => 'Arunachal Pradesh',
    '13' => 'Nagaland', '14' => 'Manipur', '15' => 'Mizoram', '16' => 'Tripura',
    '17' => 'Meghalaya', '18' => 'Assam', '19' => 'West Bengal', '20' => 'Jharkhand',
    '21' => 'Odisha', '22' => 'Chhattisgarh', '23' => 'Madhya Pradesh', '24' => 'Gujarat',
    '26' => 'Dadra and Nagar Haveli and Daman and Diu', '27' => 'Maharashtra', '29' => 'Karnataka',
    '30' => 'Goa', '31' => 'Lakshadweep', '32' => 'Kerala', '33' => 'Tamil Nadu',
    '34' => 'Puducherry', '35' => 'Andaman and Nicobar Islands', '36' => 'Telangana',
    '37' => 'Andhra Pradesh', '38' => 'Ladakh', '97' => 'Other Territory',
];

/* ------------------------------------------------------------------ */
/* Storage — above the web root, like the credentials                  */
/* ------------------------------------------------------------------ */
function lvt_invoice_dir(): string
{
    $dir = dirname($_SERVER['DOCUMENT_ROOT'] ?? __DIR__) . '/levitate-invoices';
    if (!is_dir($dir)) {
        @mkdir($dir, 0700, true);
    }
    return $dir;
}

/** Indian financial year: April to March. "2026-27" for any date in FY 2026-27. */
function lvt_financial_year(int $ts): string
{
    $y = (int) date('Y', $ts);
    $m = (int) date('n', $ts);
    $start = $m >= 4 ? $y : $y - 1;
    return $start . '-' . substr((string) ($start + 1), 2);
}

/**
 * The next number in the series, allocated under an exclusive lock.
 *
 * A tax invoice series may not gap or repeat, and two people can pay at the
 * same second. flock is what makes "read, add one, write" a single step —
 * without it both would read the same number and both would be issued it.
 */
function lvt_next_invoice_no(string $fy): ?string
{
    $path = lvt_invoice_dir() . "/counter-$fy.txt";
    $fh = @fopen($path, 'c+');
    if (!$fh) {
        return null;
    }
    if (!flock($fh, LOCK_EX)) {
        fclose($fh);
        return null;
    }
    $n = (int) trim((string) stream_get_contents($fh));
    $n = $n < 1 ? 1 : $n + 1;
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, (string) $n);
    fflush($fh);
    flock($fh, LOCK_UN);
    fclose($fh);

    return sprintf('%s/%s/%03d', LVT_INVOICE_PREFIX, $fy, $n);
}

/* ------------------------------------------------------------------ */
/* Issue                                                               */
/* ------------------------------------------------------------------ */
/**
 * @param array $notes The order's notes — where the checkout form ended up.
 * @return array|null The invoice, or null if one could not be issued.
 */
function lvt_issue_invoice(string $paymentId, string $orderId, int $amountPaise, string $courseTitle, array $notes): ?array
{
    $record = lvt_invoice_dir() . '/' . preg_replace('/[^A-Za-z0-9_]/', '', $paymentId) . '.json';

    // Idempotent. Verify can be called again — a refresh, a retried request —
    // and a second call must return the first invoice rather than burn another
    // number on the same payment.
    if (is_readable($record)) {
        $prev = json_decode((string) file_get_contents($record), true);
        if (is_array($prev)) {
            return $prev;
        }
    }

    $ts = time();
    $no = lvt_next_invoice_no(lvt_financial_year($ts));
    if ($no === null) {
        return null;
    }

    // The fee is GST-inclusive, which is what the checkout shows and what was
    // charged, so the taxable value is worked back out of it.
    $base = (int) round($amountPaise / (1 + LVT_GST_RATE / 100));
    $tax  = $amountPaise - $base;

    $buyerGstin = strtoupper(trim((string) ($notes['customer_gstin'] ?? '')));
    $place = preg_match('/^[0-9]{2}/', $buyerGstin)
        ? substr($buyerGstin, 0, 2)
        : (string) ($notes['customer_state'] ?? LVT_SELLER['state']);
    if (!isset(LVT_STATES[$place])) {
        $place = LVT_SELLER['state'];
    }

    $intra = $place === LVT_SELLER['state'];
    $cgst = $intra ? (int) round($tax / 2) : 0;
    $sgst = $intra ? $tax - $cgst : 0;
    $igst = $intra ? 0 : $tax;

    $inv = [
        'invoice_no'   => $no,
        'issued_at'    => gmdate('c', $ts),
        'date'         => date('j F Y', $ts),
        'payment_id'   => $paymentId,
        'order_id'     => $orderId,
        'course'       => $courseTitle,
        'buyer'        => [
            'name'    => (string) ($notes['customer_name'] ?? ''),
            'email'   => (string) ($notes['customer_email'] ?? ''),
            'phone'   => (string) ($notes['customer_contact'] ?? ''),
            'gstin'   => $buyerGstin,
            'address' => (string) ($notes['customer_address'] ?? ''),
            'role'    => (string) ($notes['customer_role'] ?? ''),
        ],
        'place_of_supply' => $place . ' — ' . LVT_STATES[$place],
        'amounts'      => [
            'taxable' => $base,
            'cgst'    => $cgst,
            'sgst'    => $sgst,
            'igst'    => $igst,
            'total'   => $amountPaise,
        ],
    ];

    @file_put_contents($record, json_encode($inv, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
    @chmod($record, 0600);

    return $inv;
}

/* ------------------------------------------------------------------ */
/* Render and send                                                     */
/* ------------------------------------------------------------------ */
function lvt_money(int $paise): string
{
    return '₹' . number_format($paise / 100, 2);
}

function lvt_invoice_html(array $inv): string
{
    $e = static fn(string $v): string => htmlspecialchars($v, ENT_QUOTES, 'UTF-8');
    $a = $inv['amounts'];

    $taxRows = $a['igst'] > 0
        ? '<tr><td>IGST @ ' . LVT_GST_RATE . '%</td><td align="right">' . lvt_money($a['igst']) . '</td></tr>'
        : '<tr><td>CGST @ ' . (LVT_GST_RATE / 2) . '%</td><td align="right">' . lvt_money($a['cgst']) . '</td></tr>'
          . '<tr><td>SGST @ ' . (LVT_GST_RATE / 2) . '%</td><td align="right">' . lvt_money($a['sgst']) . '</td></tr>';

    $buyerGstin = $inv['buyer']['gstin'] !== ''
        ? '<div>GSTIN: <strong>' . $e($inv['buyer']['gstin']) . '</strong></div>' : '';
    $buyerAddr = $inv['buyer']['address'] !== ''
        ? '<div>' . $e($inv['buyer']['address']) . '</div>' : '';

    $seller = nl2br($e(LVT_SELLER['address']));

    return '<!doctype html><html><body style="margin:0;padding:24px;background:#f4f7f9;font:14px/1.6 Arial,Helvetica,sans-serif;color:#0a1b33">
<div style="max-width:680px;margin:0 auto;background:#fff;border:1px solid #e3eaf0;border-radius:12px;padding:28px 30px">
  <div style="display:flex;justify-content:space-between;align-items:flex-start">
    <div>
      <div style="font-size:19px;font-weight:bold">' . $e(LVT_SELLER['name']) . '</div>
      <div style="color:#5b6e82;font-size:12.5px">' . $seller . '</div>
      <div style="color:#5b6e82;font-size:12.5px">GSTIN: <strong>' . $e(LVT_SELLER['gstin']) . '</strong></div>
    </div>
    <div style="text-align:right">
      <div style="font-size:12px;letter-spacing:.14em;color:#1b8f88;font-weight:bold">TAX INVOICE</div>
      <div style="font-size:15px;font-weight:bold;margin-top:4px">' . $e($inv['invoice_no']) . '</div>
      <div style="color:#5b6e82;font-size:12.5px">' . $e($inv['date']) . '</div>
    </div>
  </div>

  <hr style="border:none;border-top:1px solid #eef2f6;margin:22px 0">

  <div style="font-size:11px;letter-spacing:.12em;color:#8296a9;font-weight:bold">BILL TO</div>
  <div style="margin-top:6px">
    <div style="font-weight:bold">' . $e($inv['buyer']['name']) . '</div>
    <div style="color:#5b6e82;font-size:13px">' . $e($inv['buyer']['email']) . '</div>
    ' . $buyerAddr . $buyerGstin . '
    <div style="color:#5b6e82;font-size:12.5px;margin-top:4px">Place of supply: ' . $e($inv['place_of_supply']) . '</div>
  </div>

  <table style="width:100%;border-collapse:collapse;margin-top:22px;font-size:13.5px">
    <tr style="background:#f4f7f9">
      <th align="left" style="padding:10px 12px">Description</th>
      <th align="right" style="padding:10px 12px">Amount</th>
    </tr>
    <tr><td style="padding:12px">' . $e($inv['course']) . '<div style="color:#8296a9;font-size:12px">Training services</div></td>
        <td align="right" style="padding:12px">' . lvt_money($a['taxable']) . '</td></tr>
  </table>

  <table style="width:100%;border-collapse:collapse;margin-top:10px;font-size:13.5px">
    <tr><td>Taxable value</td><td align="right">' . lvt_money($a['taxable']) . '</td></tr>
    ' . $taxRows . '
    <tr><td style="padding-top:10px;font-weight:bold;font-size:16px;border-top:1px solid #eef2f6">Total paid</td>
        <td align="right" style="padding-top:10px;font-weight:bold;font-size:16px;border-top:1px solid #eef2f6">' . lvt_money($a['total']) . '</td></tr>
  </table>

  <div style="margin-top:20px;color:#5b6e82;font-size:12.5px">
    Paid via Razorpay · Payment ID ' . $e($inv['payment_id']) . ' · Order ' . $e($inv['order_id']) . '
  </div>
  <div style="margin-top:16px;color:#8296a9;font-size:11.5px">
    This is a computer-generated invoice and needs no signature.<br>
    ' . $e(LVT_SELLER['email']) . ' · ' . $e(LVT_SELLER['phone']) . ' · ' . $e(LVT_SELLER['site']) . '
  </div>
</div></body></html>';
}

/**
 * Emails the invoice to the buyer, copying the office.
 *
 * Returns false rather than throwing: an invoice that could not be emailed is
 * worth reporting, but a mail outage must never fail the payment verification
 * that called it. The JSON record is already on disk either way, so nothing is
 * lost and it can be resent.
 */
function lvt_send_invoice(array $inv): bool
{
    $user = lvt_mail_cfg('SMTP_USER');
    $pass = lvt_mail_cfg('SMTP_PASS');
    $from = lvt_mail_cfg('MAIL_FROM', $user);
    if ($user === '' || $pass === '' || $inv['buyer']['email'] === '') {
        return false;
    }

    $subject = 'Tax invoice ' . $inv['invoice_no'] . ' · ' . $inv['course'];
    $headers = [
        'From: ' . LVT_SELLER['name'] . ' <' . $from . '>',
        'To: ' . $inv['buyer']['email'],
        'Reply-To: ' . LVT_SELLER['email'],
        'Subject: =?UTF-8?B?' . base64_encode($subject) . '?=',
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
        'Date: ' . date('r'),
    ];
    $body = chunk_split(base64_encode(lvt_invoice_html($inv)));

    try {
        // The office copy goes as an envelope recipient rather than a Cc header,
        // so the buyer's copy does not show an internal address.
        (new Smtp('smtp.office365.com', 587))->send(
            $user,
            $pass,
            $from,
            [$inv['buyer']['email'], LVT_SELLER['email']],
            implode("\r\n", $headers) . "\r\n\r\n" . $body
        );
        return true;
    } catch (Throwable $e) {
        error_log('Invoice ' . $inv['invoice_no'] . ' could not be emailed: ' . $e->getMessage());
        return false;
    }
}
