<?php
/*
 * Shared code for the website forms on the static (GoDaddy) build.
 * contact.php and book-appointment.php include this file; .htaccess blocks
 * direct requests to it. Mail goes out through the hosting account's own mail
 * server, so the submissions never pass through a third-party form service.
 */

declare(strict_types=1);

const MAIL_TO = 'info@oxygen-hospital.com';
const MAIL_FROM = 'website@oxygen-hospital.com';
// Only pages on these hosts may post here.
const ALLOWED_HOSTS = ['oxygen-hospital.com', 'www.oxygen-hospital.com'];
// Per visitor: at most this many submissions in RATE_WINDOW seconds.
const RATE_LIMIT = 5;
const RATE_WINDOW = 600;

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
    $headers = [
        'From: Oxygen Hospital Website <' . MAIL_FROM . '>',
        'Reply-To: ' . one_line($replyTo),
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ];
    $body = implode("\n", $lines) . "\n\nSent from the form on " . (ALLOWED_HOSTS[0]) . ' at ' . gmdate('Y-m-d H:i') . " UTC.\n";
    $encodedSubject = '=?UTF-8?B?' . base64_encode(one_line($subject)) . '?=';

    $headerBlock = implode("\r\n", $headers);
    // Setting the envelope sender (-f) keeps SPF aligned, but some shared
    // hosts refuse it; fall back to the host's default sender if so.
    $sent = @mail(MAIL_TO, $encodedSubject, $body, $headerBlock, '-f' . MAIL_FROM);
    if (!$sent) {
        $first = error_get_last()['message'] ?? 'unknown';
        $sent = @mail(MAIL_TO, $encodedSubject, $body, $headerBlock);
        if (!$sent) {
            // Visible in cPanel > Metrics > Errors, never to the visitor.
            error_log('[website form] mail() failed. With -f: ' . $first . ' | without -f: ' . (error_get_last()['message'] ?? 'unknown'));
        }
    }
    if (!$sent) {
        respond(502, ['error' => 'Could not send right now.']);
    }
    respond(200, ['ok' => true]);
}
