<?php
/*
 * Shared code for the website forms on the static (GoDaddy) build.
 * contact.php and book-appointment.php include this file; .htaccess blocks
 * direct requests to it. Submissions never pass through a third-party form
 * service.
 *
 * Sending: PHP's mail() is refused on this GoDaddy hosting plan, so the mailer
 * signs in to the hospital's own mailbox (GoDaddy Professional Email) over
 * SMTP, the way an email app does. The sign-in details live in a settings file
 * OUTSIDE public_html, created once in cPanel File Manager. It is never in git
 * and deploys never touch it:
 *
 *   /home/<cpanel user>/oxygen-mail-config.php
 *
 *   <?php
 *   return [
 *       'username' => 'info@oxygen-hospital.com',
 *       'password' => 'the mailbox password',
 *   ];
 *
 * Optional keys, shown with their defaults:
 *   'host' => 'smtpout.secureserver.net', 'port' => 465, 'secure' => 'ssl'
 *   ('secure' => 'tls' with 'port' => 587 uses STARTTLS instead.)
 *
 * Without that file it falls back to mail().
 */

declare(strict_types=1);

const MAIL_TO = 'info@oxygen-hospital.com';
const MAIL_FROM = 'website@oxygen-hospital.com';
// Only pages on these hosts may post here.
const ALLOWED_HOSTS = ['oxygen-hospital.com', 'www.oxygen-hospital.com'];
// Per visitor: at most this many submissions in RATE_WINDOW seconds.
const RATE_LIMIT = 5;
const RATE_WINDOW = 600;

const CRLF = "\r\n";

function respond(int $status, array $body): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($body);
    exit;
}

/** The decoded JSON body of a same-site POST, or an error response. */
function read_request(): array
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: POST');
        respond(405, ['error' => 'Method not allowed.']);
    }

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '' && !in_array(parse_url($origin, PHP_URL_HOST), ALLOWED_HOSTS, true)) {
        respond(403, ['error' => 'Forbidden.']);
    }

    $raw = file_get_contents('php://input', false, null, 0, 20000);
    $data = json_decode((string) $raw, true);
    if (!is_array($data)) {
        respond(400, ['error' => 'Invalid submission.']);
    }
    return $data;
}

/** A trimmed string field, checked for presence and length. */
function field(array $data, string $key, int $max, bool $required = true): string
{
    $value = isset($data[$key]) && is_string($data[$key]) ? trim($data[$key]) : '';
    if (($required && $value === '') || mb_strlen($value) > $max) {
        respond(400, ['error' => 'Invalid submission.']);
    }
    return $value;
}

function require_email(string $value): string
{
    if (filter_var($value, FILTER_VALIDATE_EMAIL) === false) {
        respond(400, ['error' => 'Invalid submission.']);
    }
    return $value;
}

function require_phone(string $value, bool $required = true): string
{
    if (($value !== '' || $required) && !preg_match('/^[0-9+()\-\s]{7,20}$/', $value)) {
        respond(400, ['error' => 'Invalid submission.']);
    }
    return $value;
}

/** Bots fill the hidden "company" field; pretend success so they learn nothing. */
function stop_if_bot(array $data): void
{
    if (!empty($data['company'])) {
        respond(200, ['ok' => true]);
    }
}

function rate_limit(): void
{
    // Behind Cloudflare, REMOTE_ADDR is Cloudflare's address, not the visitor's.
    $ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $dir = sys_get_temp_dir() . '/oxygen-forms';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true)) {
        return; // No writable temp folder: skip limiting rather than block real patients.
    }
    $file = $dir . '/' . hash('sha256', $ip);
    $now = time();
    $hits = [];
    if (is_file($file)) {
        foreach (explode(',', (string) file_get_contents($file)) as $t) {
            if ((int) $t > $now - RATE_WINDOW) {
                $hits[] = (int) $t;
            }
        }
    }
    if (count($hits) >= RATE_LIMIT) {
        header('Retry-After: ' . RATE_WINDOW);
        respond(429, ['error' => 'Too many requests. Please try again shortly.']);
    }
    $hits[] = $now;
    @file_put_contents($file, implode(',', $hits), LOCK_EX);
}

/** Header values must be single-line, or a visitor could inject extra headers. */
function one_line(string $value): string
{
    return trim((string) preg_replace('/[\r\n]+/', ' ', $value));
}

function send_and_respond(string $subject, array $lines, string $replyTo): void
{
    $body = implode("\n", $lines) . "\n\nSent from the form on " . ALLOWED_HOSTS[0] . ' at ' . gmdate('Y-m-d H:i') . " UTC.\n";
    $encodedSubject = '=?UTF-8?B?' . base64_encode(one_line($subject)) . '?=';
    $replyTo = one_line($replyTo);

    $config = mail_config();
    if ($config !== null) {
        $result = smtp_send($config, MAIL_TO, $encodedSubject, $body, $replyTo);
        $sent = $result === true;
        if (!$sent) {
            // Visible in cPanel > Metrics > Errors, never to the visitor.
            error_log('[website form] SMTP failed: ' . $result);
        }
    } else {
        $headers = implode(CRLF, [
            'From: Oxygen Hospital Website <' . MAIL_FROM . '>',
            'Reply-To: ' . $replyTo,
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
        ]);
        // Setting the envelope sender (-f) keeps SPF aligned, but some shared
        // hosts refuse it; fall back to the host's default sender if so.
        $sent = @mail(MAIL_TO, $encodedSubject, $body, $headers, '-f' . MAIL_FROM);
        if (!$sent) {
            $first = error_get_last()['message'] ?? 'unknown';
            $sent = @mail(MAIL_TO, $encodedSubject, $body, $headers);
            if (!$sent) {
                error_log('[website form] mail() failed; add oxygen-mail-config.php to send over SMTP. With -f: '
                    . $first . ' | without -f: ' . (error_get_last()['message'] ?? 'unknown'));
            }
        }
    }

    if (!$sent) {
        respond(502, ['error' => 'Could not send right now.']);
    }
    respond(200, ['ok' => true]);
}

/** The SMTP settings file one folder above public_html, or null if absent. */
function mail_config(): ?array
{
    $root = rtrim($_SERVER['DOCUMENT_ROOT'] ?? '', '/');
    $home = $root !== '' ? dirname($root) : dirname(__DIR__, 2);
    $file = $home . '/oxygen-mail-config.php';
    if (!is_file($file)) {
        return null;
    }
    $config = include $file;
    if (!is_array($config) || empty($config['username']) || empty($config['password'])) {
        error_log('[website form] oxygen-mail-config.php must return an array with username and password.');
        return null;
    }
    return $config;
}

/**
 * Minimal authenticated SMTP client: implicit TLS on 465, or STARTTLS on 587.
 * Returns true, or a description of the step that failed (never the password).
 *
 * @return true|string
 */
function smtp_send(array $cfg, string $to, string $encodedSubject, string $body, string $replyTo)
{
    $host = (string) ($cfg['host'] ?? 'smtpout.secureserver.net');
    $port = (int) ($cfg['port'] ?? 465);
    $secure = (string) ($cfg['secure'] ?? 'ssl');
    $user = (string) $cfg['username'];

    $context = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true]]);
    $scheme = $secure === 'ssl' ? 'ssl://' : 'tcp://';
    $fp = @stream_socket_client($scheme . $host . ':' . $port, $errno, $errstr, 20, STREAM_CLIENT_CONNECT, $context);
    if (!$fp) {
        return "connect to $host:$port failed: $errstr ($errno)";
    }
    stream_set_timeout($fp, 20);

    // One SMTP reply, which may span several "250-..." lines.
    $read = static function () use ($fp): string {
        $reply = '';
        while (($line = fgets($fp, 1024)) !== false) {
            $reply .= $line;
            if (strlen($line) < 4 || $line[3] === ' ') {
                break;
            }
        }
        return $reply;
    };
    $step = static function (?string $command, array $expect, string $label) use ($fp, $read): void {
        if ($command !== null) {
            fwrite($fp, $command . CRLF);
        }
        $reply = $read();
        if (!in_array((int) substr($reply, 0, 3), $expect, true)) {
            throw new RuntimeException($label . ': ' . trim($reply));
        }
    };

    try {
        $step(null, [220], 'greeting');
        $step('EHLO oxygen-hospital.com', [250], 'EHLO');
        if ($secure === 'tls') {
            $step('STARTTLS', [220], 'STARTTLS');
            if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new RuntimeException('TLS negotiation failed');
            }
            $step('EHLO oxygen-hospital.com', [250], 'EHLO after STARTTLS');
        }
        $step('AUTH LOGIN', [334], 'AUTH');
        $step(base64_encode($user), [334], 'AUTH username');
        $step(base64_encode((string) $cfg['password']), [235], 'AUTH password (check the mailbox password)');
        $step('MAIL FROM:<' . $user . '>', [250], 'MAIL FROM');
        $step('RCPT TO:<' . $to . '>', [250, 251], 'RCPT TO');
        $step('DATA', [354], 'DATA');

        // Normalise line endings, then dot-stuff lines that start with ".".
        $text = str_replace(["\r\n", "\r"], "\n", $body);
        $text = (string) preg_replace('/^\./m', '..', $text);
        $text = str_replace("\n", CRLF, $text);

        $domain = substr((string) strrchr($user, '@'), 1) ?: 'oxygen-hospital.com';
        $message = implode(CRLF, [
            'Date: ' . date('r'),
            'From: Oxygen Hospital Website <' . $user . '>',
            'To: <' . $to . '>',
            'Reply-To: ' . $replyTo,
            'Subject: ' . $encodedSubject,
            'Message-ID: <' . bin2hex(random_bytes(12)) . '@' . $domain . '>',
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
            '',
            $text,
        ]);
        $step($message . CRLF . '.', [250], 'message');
        fwrite($fp, 'QUIT' . CRLF);
        fclose($fp);
        return true;
    } catch (Throwable $e) {
        @fwrite($fp, 'QUIT' . CRLF);
        fclose($fp);
        return $e->getMessage();
    }
}
