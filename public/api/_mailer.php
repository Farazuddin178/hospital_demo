<?php
/*
 * Shared code for the website forms on the static (GoDaddy) build.
 * contact.php and book-appointment.php include this file; .htaccess blocks
 * direct requests to it. Submissions never pass through a third-party form
 * service.
 *
 * Sending tries these routes in order and stops at the first that works. The
 * route that last worked is tried first next time.
 *   1. GoDaddy Professional Email's outgoing server, signed in as info@
 *      (smtpout.secureserver.net, port 465, then 587). Needs the settings file.
 *   2. The hosting account's own mail server on localhost:25, which is how
 *      GoDaddy documents sending from websites on cPanel hosting.
 *   3. PHP's mail().
 *
 * Every failure is written to the PHP error log (cPanel > Metrics > Errors).
 * A request with the header X-Mail-Debug: sha256("oxygen-mail-debug|" + the
 * mailbox password) also gets the full attempt log back, so the setup can be
 * checked from outside cPanel without exposing anything to visitors.
 *
 * Settings file, never in git. Either:
 *   - /home/<cpanel user>/oxygen-mail-config.php, created in cPanel File
 *     Manager (one folder above public_html), or
 *   - api/_mail-config.php, written by the deploy workflow from the GitHub
 *     secret SMTP_PASSWORD (blocked from the web by .htaccess).
 *
 *   <?php
 *   return [
 *       'username' => 'info@oxygen-hospital.com',
 *       'password' => 'the mailbox password',
 *   ];
 *
 * Optional keys: 'host', 'port', 'secure' ('ssl' or 'tls') to try a specific
 * server first, and 'fallbacks' => false to try only that one.
 */

declare(strict_types=1);

const MAIL_TO = 'info@oxygen-hospital.com';
// Sender of every message. The SPF record covers both the hosting server and
// GoDaddy's mail servers for this domain.
const MAIL_FROM = 'info@oxygen-hospital.com';
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

/** A private scratch folder for the rate limiter and the preferred route. */
function state_dir(): ?string
{
    $dir = sys_get_temp_dir() . '/oxygen-forms';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true)) {
        return null;
    }
    return $dir;
}

function rate_limit(): void
{
    $dir = state_dir();
    if ($dir === null) {
        return; // No writable temp folder: skip limiting rather than block real patients.
    }
    // Behind Cloudflare, REMOTE_ADDR is Cloudflare's address, not the visitor's.
    $ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
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

/** The settings file, or null if there is none. */
function mail_config(): ?array
{
    $root = rtrim($_SERVER['DOCUMENT_ROOT'] ?? '', '/');
    $home = $root !== '' ? dirname($root) : dirname(__DIR__, 2);
    foreach ([$home . '/oxygen-mail-config.php', __DIR__ . '/_mail-config.php'] as $file) {
        if (!@is_file($file)) {
            continue;
        }
        $config = include $file;
        if (is_array($config) && !empty($config['username']) && !empty($config['password'])) {
            return $config;
        }
        error_log('[website form] ' . basename($file) . ' must return an array with username and password.');
    }
    return null;
}

/** The routes to try, in order. */
function mail_routes(?array $config): array
{
    $routes = [];
    $fallbacks = true;
    if ($config !== null) {
        $auth = [(string) $config['username'], (string) $config['password']];
        if (isset($config['host']) || isset($config['port'])) {
            $routes[] = [
                'label' => 'configured server',
                'host' => (string) ($config['host'] ?? 'smtpout.secureserver.net'),
                'port' => (int) ($config['port'] ?? 465),
                'secure' => (string) ($config['secure'] ?? 'ssl'),
                'auth' => $auth,
            ];
            $fallbacks = ($config['fallbacks'] ?? true) !== false;
        }
        if ($fallbacks) {
            $routes[] = ['label' => 'smtpout 465', 'host' => 'smtpout.secureserver.net', 'port' => 465, 'secure' => 'ssl', 'auth' => $auth];
            $routes[] = ['label' => 'smtpout 587', 'host' => 'smtpout.secureserver.net', 'port' => 587, 'secure' => 'tls', 'auth' => $auth];
        }
    }
    if ($fallbacks) {
        $routes[] = ['label' => 'localhost 25', 'host' => 'localhost', 'port' => 25, 'secure' => 'plain', 'auth' => null];
    }

    // Try the route that worked last time first.
    $dir = state_dir();
    $preferred = $dir !== null ? @file_get_contents($dir . '/route') : false;
    if (is_string($preferred) && $preferred !== '') {
        usort($routes, static fn (array $a, array $b): int => ($b['label'] === $preferred) <=> ($a['label'] === $preferred));
    }
    return $routes;
}

function remember_route(string $label): void
{
    $dir = state_dir();
    if ($dir !== null) {
        @file_put_contents($dir . '/route', $label, LOCK_EX);
    }
}

function send_and_respond(string $subject, array $lines, string $replyTo): void
{
    $body = implode("\n", $lines) . "\n\nSent from the form on " . ALLOWED_HOSTS[0] . ' at ' . gmdate('Y-m-d H:i') . " UTC.\n";
    $encodedSubject = '=?UTF-8?B?' . base64_encode(one_line($subject)) . '?=';
    $replyTo = one_line($replyTo);

    $config = mail_config();
    $summary = [$config === null ? 'settings file: missing' : 'settings file: found'];
    $log = $summary;

    foreach (mail_routes($config) as $route) {
        [$sent, $step, $detail] = smtp_send($route, $encodedSubject, $body, $replyTo);
        if ($sent) {
            remember_route($route['label']);
            finish(true, $config, $summary, $log, $route['label']);
        }
        $summary[] = $route['label'] . ': failed at ' . $step;
        $log[] = $route['label'] . ': failed at ' . $step . ': ' . $detail;
    }

    // Last resort: PHP's mail(), with and without setting the envelope sender.
    $headers = implode(CRLF, [
        'From: Oxygen Hospital Website <' . MAIL_FROM . '>',
        'Reply-To: ' . $replyTo,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ]);
    if (@mail(MAIL_TO, $encodedSubject, $body, $headers, '-f' . MAIL_FROM) || @mail(MAIL_TO, $encodedSubject, $body, $headers)) {
        finish(true, $config, $summary, $log, 'mail()');
    }
    $summary[] = 'mail(): refused';
    $log[] = 'mail(): refused: ' . (error_get_last()['message'] ?? 'returned false');

    finish(false, $config, $summary, $log);
}

function finish(bool $sent, ?array $config, array $summary, array $log, string $via = ''): void
{
    $debug = debug_allowed($config);
    if ($sent) {
        respond(200, $debug ? ['ok' => true, 'via' => $via, 'log' => $log] : ['ok' => true]);
    }
    // Visible in cPanel > Metrics > Errors, never to the visitor.
    error_log('[website form] could not send: ' . implode(' | ', $log));
    $body = ['error' => 'Could not send right now.', 'code' => $summary];
    if ($debug) {
        $body['log'] = $log;
    }
    respond(502, $body);
}

/** Full attempt logs only for requests that prove they know the mailbox password. */
function debug_allowed(?array $config): bool
{
    $given = (string) ($_SERVER['HTTP_X_MAIL_DEBUG'] ?? '');
    if ($config === null || $given === '') {
        return false;
    }
    return hash_equals(hash('sha256', 'oxygen-mail-debug|' . $config['password']), $given);
}

/**
 * Minimal SMTP client: implicit TLS ('ssl'), STARTTLS ('tls') or plain, with
 * optional AUTH LOGIN. Returns [sent, step reached, server reply or error].
 * The password never appears in the reply text.
 *
 * @return array{0: bool, 1: string, 2: string}
 */
function smtp_send(array $route, string $encodedSubject, string $body, string $replyTo): array
{
    $host = $route['host'];
    $from = $route['auth'][0] ?? MAIL_FROM;

    $context = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true, 'peer_name' => $host]]);
    $scheme = $route['secure'] === 'ssl' ? 'ssl://' : 'tcp://';
    $fp = @stream_socket_client($scheme . $host . ':' . $route['port'], $errno, $errstr, 8, STREAM_CLIENT_CONNECT, $context);
    if (!$fp) {
        return [false, 'connect', trim($errstr . ' (' . $errno . ')')];
    }
    stream_set_timeout($fp, 15);

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
            throw new RuntimeException($label . "\n" . (trim($reply) !== '' ? trim($reply) : 'no reply'));
        }
    };

    try {
        $step(null, [220], 'greeting');
        $step('EHLO oxygen-hospital.com', [250], 'EHLO');
        if ($route['secure'] === 'tls') {
            $step('STARTTLS', [220], 'STARTTLS');
            if (!@stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new RuntimeException("STARTTLS\nTLS negotiation failed");
            }
            $step('EHLO oxygen-hospital.com', [250], 'EHLO after STARTTLS');
        }
        if ($route['auth'] !== null) {
            $step('AUTH LOGIN', [334], 'sign-in');
            $step(base64_encode($route['auth'][0]), [334], 'sign-in');
            $step(base64_encode($route['auth'][1]), [235], 'sign-in (password)');
        }
        $step('MAIL FROM:<' . $from . '>', [250], 'sender');
        $step('RCPT TO:<' . MAIL_TO . '>', [250, 251], 'recipient');
        $step('DATA', [354], 'DATA');

        // Normalise line endings, then dot-stuff lines that start with ".".
        $text = str_replace(["\r\n", "\r"], "\n", $body);
        $text = (string) preg_replace('/^\./m', '..', $text);
        $text = str_replace("\n", CRLF, $text);

        $message = implode(CRLF, [
            'Date: ' . date('r'),
            'From: Oxygen Hospital Website <' . $from . '>',
            'To: <' . MAIL_TO . '>',
            'Reply-To: ' . $replyTo,
            'Subject: ' . $encodedSubject,
            'Message-ID: <' . bin2hex(random_bytes(12)) . '@oxygen-hospital.com>',
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
            '',
            $text,
        ]);
        $step($message . CRLF . '.', [250], 'message');
        fwrite($fp, 'QUIT' . CRLF);
        fclose($fp);
        return [true, 'sent', ''];
    } catch (Throwable $e) {
        @fwrite($fp, 'QUIT' . CRLF);
        fclose($fp);
        $parts = explode("\n", $e->getMessage(), 2);
        return [false, $parts[0], $parts[1] ?? ''];
    }
}
