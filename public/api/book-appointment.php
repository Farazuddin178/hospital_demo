<?php
// Appointment form on the static build. Same rules as src/lib/schemas.ts (appointmentSchema).

declare(strict_types=1);
require __DIR__ . '/_mailer.php';

$data = read_request();
stop_if_bot($data);

$fullName = field($data, 'fullName', 80);
$email = require_email(field($data, 'email', 120));
$phone = require_phone(field($data, 'phone', 20));
$department = field($data, 'department', 80);
$preferredDate = field($data, 'preferredDate', 10);
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $preferredDate)) {
    respond(400, ['error' => 'Invalid submission.']);
}
$notes = field($data, 'notes', 500, false);

rate_limit();

send_and_respond(
    "Appointment request: $fullName, $department, $preferredDate",
    [
        "Name: $fullName",
        "Phone: $phone",
        "Email: $email",
        "Department: $department",
        "Preferred date: $preferredDate",
        '',
        'Notes: ' . ($notes !== '' ? $notes : 'none'),
    ],
    $email
);
