<?php
// CORS first
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
$allowed = ['https://bafanapyramidshotel.com','https://www.bafanapyramidshotel.com','http://localhost:5173','http://localhost:3000'];
if (in_array($origin, $allowed)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: *");
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');
header('Content-Type: application/json');
// Tell Cloudflare and browsers never to cache API responses
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Surrogate-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ── Method override ──
// Cloudflare WAF blocks PUT/DELETE/PATCH. Tunnel them through POST via ?_method=PUT
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $methodOverride = $_GET['_method'] ?? '';
    if (in_array(strtoupper($methodOverride), ['PUT', 'DELETE', 'PATCH'])) {
        $_SERVER['REQUEST_METHOD'] = strtoupper($methodOverride);
    }
}

// Database
define('DB_HOST', 'localhost');
define('DB_NAME', 'bafana');
define('DB_USER', 'BafanaPyramids');
define('DB_PASS', 'BafanaPyramids123');

// Static permanent token — never expires
define('STATIC_TOKEN', 'bafana_admin_token_2026_secure_xyz789');

// URLs
define('SITE_URL', 'https://bafanapyramidshotel.com');
define('API_URL',  'https://bafanapyramidshotel.com/admin-api');
define('UPLOAD_PATH', __DIR__ . '/uploads/');
define('UPLOAD_URL',  API_URL . '/uploads/');

// Ensure upload directories exist
foreach (['rooms', 'gallery', 'hero'] as $dir) {
    $p = UPLOAD_PATH . $dir;
    if (!is_dir($p)) @mkdir($p, 0755, true);
}

function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $pdo = new PDO(
                'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
                DB_USER, DB_PASS,
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

function respond($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit();
}

// Get Authorization header reliably across Apache/CGI/FastCGI/Cloudflare
function getAuthHeader() {
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        if (isset($headers['Authorization'])) return $headers['Authorization'];
        if (isset($headers['authorization'])) return $headers['authorization'];
    }
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) return $_SERVER['HTTP_AUTHORIZATION'];
    if (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) return $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    // Query param fallback — most reliable through Cloudflare
    if (isset($_GET['token'])) return 'Bearer ' . $_GET['token'];
    return '';
}

// Simple static token validation
function requireAuth() {
    $auth  = getAuthHeader();
    $token = str_replace('Bearer ', '', trim($auth));
    if ($token !== STATIC_TOKEN) {
        respond(['error' => 'Unauthorized'], 401);
    }
}

// Check if Authorization header is present (for public vs admin routes)
function hasAuth() {
    return getAuthHeader() !== '';
}
