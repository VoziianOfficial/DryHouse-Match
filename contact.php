<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$recipientEmail = 'support@dryhousematch.com';
$siteName = 'DryHouse Match';
$minimumSubmitSeconds = 2;

function respond(bool $success, string $message, int $statusCode = 200): void
{
    http_response_code($statusCode);

    echo json_encode([
        'success' => $success,
        'message' => $message
    ]);

    exit;
}

function cleanInput(?string $value): string
{
    $value = trim((string) $value);
    $value = strip_tags($value);
    $value = preg_replace('/[\x00-\x1F\x7F]/u', '', $value);

    return $value ?? '';
}

function cleanMessage(?string $value): string
{
    $value = trim((string) $value);
    $value = strip_tags($value);
    $value = preg_replace("/\r\n|\r|\n/", "\n", $value);
    $value = preg_replace('/[ \t]+/', ' ', $value);

    return $value ?? '';
}

function hasHeaderInjection(string $value): bool
{
    return (bool) preg_match('/[\r\n]/', $value);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Invalid request method.', 405);
}

$honeypot = cleanInput($_POST['website'] ?? '');

if ($honeypot !== '') {
    respond(false, 'Please check the required fields and try again.', 400);
}

$formStartedRaw = cleanInput($_POST['formStarted'] ?? '');
$formStarted = is_numeric($formStartedRaw) ? ((int) $formStartedRaw / 1000) : 0;
$currentTime = time();

if ($formStarted > 0 && ($currentTime - $formStarted) < $minimumSubmitSeconds) {
    respond(false, 'Please check the required fields and try again.', 400);
}

$fullName = cleanInput($_POST['fullName'] ?? '');
$email = cleanInput($_POST['email'] ?? '');
$phone = cleanInput($_POST['phone'] ?? '');
$service = cleanInput($_POST['service'] ?? '');
$message = cleanMessage($_POST['message'] ?? '');
$sourcePage = cleanInput($_POST['sourcePage'] ?? 'Website request form');
$privacyConsent = cleanInput($_POST['privacyConsent'] ?? '');

if ($fullName === '' || mb_strlen($fullName) < 2) {
    respond(false, 'Please enter your full name.', 422);
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Please enter a valid email address.', 422);
}

if ($phone === '' || mb_strlen($phone) < 7) {
    respond(false, 'Please enter a valid phone number.', 422);
}

if ($service === '') {
    respond(false, 'Please select a service category.', 422);
}

if ($message === '' || mb_strlen($message) < 10) {
    respond(false, 'Please add a short description of your request.', 422);
}

if ($privacyConsent !== 'yes') {
    respond(false, 'Please confirm the consent statement before submitting.', 422);
}

if (
    hasHeaderInjection($fullName) ||
    hasHeaderInjection($email) ||
    hasHeaderInjection($phone) ||
    hasHeaderInjection($service) ||
    hasHeaderInjection($sourcePage)
) {
    respond(false, 'Please check the required fields and try again.', 400);
}

$allowedServices = [
    'Active Leak Damage',
    'Standing Water Cleanup',
    'Burst Pipe Damage',
    'Flooded Basement',
    'Storm & Flood Damage',
    'Moisture & Mold Concerns'
];

if (!in_array($service, $allowedServices, true)) {
    respond(false, 'Please select a valid service category.', 422);
}

$subject = 'New DryHouse Match Request: ' . $service;

$emailBody = "New request submitted through {$siteName}\n\n";
$emailBody .= "Platform clarification:\n";
$emailBody .= "DryHouse Match is an independent provider-matching platform. Submitting this request does not create a service agreement. Final pricing, availability, scheduling, warranties, and service terms are provided by participating providers.\n\n";
$emailBody .= "Request details:\n";
$emailBody .= "Name: {$fullName}\n";
$emailBody .= "Email: {$email}\n";
$emailBody .= "Phone: {$phone}\n";
$emailBody .= "Service category: {$service}\n";
$emailBody .= "Source page: {$sourcePage}\n\n";
$emailBody .= "Message:\n{$message}\n\n";
$emailBody .= "Consent:\n";
$emailBody .= "The user confirmed that submitting the form does not create a service agreement and that they may be contacted by participating providers about the request.\n";

$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'From: DryHouse Match <no-reply@dryhousematch.com>';
$headers[] = 'Reply-To: ' . $fullName . ' <' . $email . '>';
$headers[] = 'X-Mailer: PHP/' . phpversion();

$mailSent = @mail(
    $recipientEmail,
    $subject,
    $emailBody,
    implode("\r\n", $headers)
);

if (!$mailSent) {
    respond(false, 'Your request could not be sent right now. Please try again later.', 500);
}

respond(true, 'Thank you. Your request has been received.');
