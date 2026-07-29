# Enquiry form → Microsoft 365

The site is static, so the forms post to a small PHP handler that ships in
`public/api/enquiry.php` and runs on SiteGround's Apache.

## Why it relays through Microsoft rather than just using PHP `mail()`

The domain publishes:

```
SPF    v=spf1 include:spf.protection.outlook.com -all
DMARC  v=DMARC1; p=quarantine; ...
```

`-all` means **only Microsoft's servers may send mail as this domain**.
SiteGround's server is not on that list, so mail sent with `mail()` fails SPF,
fails DMARC alignment, and gets filed as junk. Authenticating to Microsoft and
letting it do the sending keeps SPF, DKIM and DMARC all passing.

## One-time setup

### 1. Create the sending mailbox

Use a real mailbox you own — for example `website@levitatepeoplesoft.com` (a
dedicated one is tidier than sending as `contactus@`).

### 2. Allow SMTP AUTH for that mailbox

Microsoft disables SMTP AUTH by default on modern tenants.

**Microsoft 365 admin centre → Users → Active users → (the mailbox) → Mail →
Manage email apps → tick _Authenticated SMTP_ → Save.**

### 3. Create an app password

Basic username/password is refused when MFA is on. In **My Account → Security
info → Add sign-in method → App password**, create one and copy it.

> If app passwords are unavailable, security defaults are likely enabled.
> Either disable security defaults, or use a transactional mail service
> instead (see below).

### 4. Put the credentials on the server

Create `enquiry-config.php` **one directory above the web root** so it can
never be served over HTTP:

```
~/www/levitatepeoplesoft.com/enquiry-config.php      ← here
~/www/levitatepeoplesoft.com/public_html/            ← web root
```

```php
<?php
return [
    'SMTP_USER' => 'website@levitatepeoplesoft.com',  // the mailbox
    'SMTP_PASS' => 'your-app-password',               // app password
    'MAIL_FROM' => 'website@levitatepeoplesoft.com',  // must match SMTP_USER
    'MAIL_TO'   => 'contactus@levitatepeoplesoft.com',// where enquiries land
];
```

`MAIL_TO` accepts a comma-separated list for multiple recipients.

Then lock it down:

```bash
chmod 600 ~/www/levitatepeoplesoft.com/enquiry-config.php
```

That file is deliberately **not** in git.

### 5. Test

Submit the contact form on the live site. On failure the handler writes the
SMTP error to the PHP error log — check it in Site Tools, or:

```bash
ssh siteground 'tail -30 ~/www/levitatepeoplesoft.com/public_html/error_log'
```

## How the mail is addressed

- **From:** your own mailbox — required, or SPF fails.
- **Reply-To:** the enquirer. Hitting reply answers them directly.

Setting `From:` to the visitor's address is the classic mistake and is exactly
what gets these mails junked.

## Spam protection

A hidden `company_website` honeypot field is included. Bots fill it; people
never see it. Submissions with it filled are accepted silently and discarded.

## If SMTP AUTH cannot be enabled

Swap the transport for a transactional service — **Resend**, **Brevo** or
**SendGrid**. All have free tiers that cover this volume, better deliverability
reporting, and only need an API key. The form and handler stay the same; only
the send step in `enquiry.php` changes.
