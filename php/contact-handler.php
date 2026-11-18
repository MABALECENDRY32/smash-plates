<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	http_response_code(405);
	echo json_encode(['success' => false, 'message' => 'This form only accepts POST requests.']);
	exit;
}

$name = trim((string) ($_POST['name'] ?? ''));
$whatsapp = trim((string) ($_POST['whatsapp'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

if ($name === '' || $whatsapp === '' || $message === '') {
	http_response_code(422);
	echo json_encode(['success' => false, 'message' => 'Please complete all fields before sending your request.']);
	exit;
}

if (strlen($name) > 100 || strlen($whatsapp) > 40 || strlen($message) > 2000) {
	http_response_code(422);
	echo json_encode(['success' => false, 'message' => 'One or more fields are too long.']);
	exit;
}

$recipient = 'info@smashplate.co.za';
$subject = 'New SMASH PLATE contact request';
$body = "Name: {$name}\nWhatsApp: {$whatsapp}\n\nMessage:\n{$message}";
$headers = "From: website@smashplate.co.za\r\nReply-To: {$recipient}\r\n";

if (!@mail($recipient, $subject, $body, $headers)) {
	http_response_code(500);
	echo json_encode(['success' => false, 'message' => 'We could not send your request right now. Please try WhatsApp directly.']);
	exit;
}

echo json_encode(['success' => true, 'message' => 'Your request was sent successfully.']);
