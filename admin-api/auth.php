<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$body   = json_decode(file_get_contents('php://input'), true);

if ($method === 'POST') {
    $username = $body['username'] ?? '';
    $password = $body['password'] ?? '';

    if ($username === 'admin' && $password === 'bafana2026') {
        // Return the static token
        respond(['token' => STATIC_TOKEN, 'message' => 'Login successful']);
    } else {
        respond(['error' => 'Invalid credentials'], 401);
    }
}

if ($method === 'DELETE') {
    respond(['message' => 'Logged out']);
}
