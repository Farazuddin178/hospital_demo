<?php
// Contact form on the static build. Same rules as src/lib/schemas.ts (contactSchema).

declare(strict_types=1);
require __DIR__ . '/_mailer.php';

$data = read_request();
stop_if_bot($data);

$firstName = field($data, 'firstName', 60);
$lastName = field($data, 'lastName', 60);
$email = require_email(field($data, 'email', 120));
$phone = require_phone(field($data, 'phone', 20, false), false);
$message = field($data, 'message', 1000);
if (mb_strlen($message) < 10) {
    respond(400, ['error' => 'Invalid submission.']);
}

rate_limit();

send_and_respond(
    "Website enquiry from $firstName $lastName",
    [
        "Name: $firstName $lastName",
        "Email: $email",
        'Phone: ' . ($phone !== '' ? $phone : 'not given'),
        '',
        $message,
    ],
    $email
);
