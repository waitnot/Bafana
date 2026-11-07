<?php
// ── Database Configuration ──
// Replace these with your cPanel MySQL credentials
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_db_name');       // e.g. username_bafana
define('DB_USER', 'your_db_user');       // e.g. username_admin
define('DB_PASS', 'your_db_password');

// ── Admin Credentials ──
define('ADMIN_USER', 'admin');
define('ADMIN_PASS', password_hash('bafana2026', PASSWORD_DEFAULT));

// ── Site URL ──
define('SITE_URL', 'https://bafanapyramidshotel.com');
define('API_URL',  'https://bafanapyramidshotel.com/admin-api');
define('UPLOAD_PATH', __DIR__ . '/uploads/');
define('UPLOAD_URL',  API_URL . '/uploads/');

// ── CORS ──
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ── DB Connection ──
function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $pdo = new PDO(
                'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
                DB_USER,
                DB_PASS,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                 PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
            );
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'DB connection failed: ' . $e->getMessage()]);
            exit();
        }
    }
    return $pdo;
}

// ── JSON response helper ──
function respond($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit();
}

// ── Auth check ──
function requireAuth() {
    $headers = getallheaders();
    $token   = $headers['Authorization'] ?? '';
    $token   = str_replace('Bearer ', '', $token);
    $valid   = $_SESSION['admin_token'] ?? '';
    if (!$token || $token !== $valid) {
        respond(['error' => 'Unauthorized'], 401);
    }
}

session_start();
