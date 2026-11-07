<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$body   = json_decode(file_get_contents('php://input'), true);

if ($method === 'POST') {
    $username = $body['username'] ?? '';
    $password = $body['password'] ?? '';

    if ($username === ADMIN_USER && password_verify($password, ADMIN_PASS)) {
        $token = bin2hex(random_bytes(32));
        $_SESSION['admin_token'] = $token;
        respond(['token' => $token, 'message' => 'Login successful']);
    } else {
        respond(['error' => 'Invalid credentials'], 401);
    }
}

if ($method === 'DELETE') {
    session_destroy();
    respond(['message' => 'Logged out']);
}
