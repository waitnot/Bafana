<?php
require_once 'config.php';
requireAuth();

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $section = $_GET['section'] ?? null;
    if ($section) {
        $stmt = $db->prepare("SELECT * FROM site_content WHERE section=?");
        $stmt->execute([$section]);
    } else {
        $stmt = $db->query("SELECT * FROM site_content ORDER BY section, `key`");
    }
    $rows = $stmt->fetchAll();
    // Convert to nested object: { hero: { title: '...', sub: '...' } }
    $out = [];
    foreach ($rows as $r) {
        $out[$r['section']][$r['key']] = $r['value'];
    }
    respond($out);
}

if ($method === 'PUT') {
    $body = json_decode(file_get_contents('php://input'), true);
    // body: { section: 'hero', key: 'title', value: '...' }
    // OR:   { updates: [ {section,key,value}, ... ] }
    if (isset($body['updates'])) {
        $stmt = $db->prepare("INSERT INTO site_content (section, `key`, value) VALUES (?,?,?) ON DUPLICATE KEY UPDATE value=?");
        foreach ($body['updates'] as $u) {
            $stmt->execute([$u['section'], $u['key'], $u['value'], $u['value']]);
        }
        respond(['message' => 'Content updated']);
    }
    $stmt = $db->prepare("INSERT INTO site_content (section, `key`, value) VALUES (?,?,?) ON DUPLICATE KEY UPDATE value=?");
    $stmt->execute([$body['section'], $body['key'], $body['value'], $body['value']]);
    respond(['message' => 'Content updated']);
}

// Hero image upload
if ($method === 'POST') {
    $type = $_POST['type'] ?? 'desktop'; // desktop | mobile
    if (!isset($_FILES['image'])) respond(['error' => 'image required'], 400);
    $file = $_FILES['image'];
    $ext  = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, ['jpg','jpeg','png','webp'])) respond(['error' => 'Invalid type'], 400);

    $filename = 'hero_' . $type . '_' . time() . '.' . $ext;
    $path = UPLOAD_PATH . 'hero/' . $filename;
    if (!move_uploaded_file($file['tmp_name'], $path)) respond(['error' => 'Upload failed'], 500);

    // Deactivate old
    $db->prepare("UPDATE hero_images SET is_active=0 WHERE type=?")->execute([$type]);
    $url = UPLOAD_URL . 'hero/' . $filename;
    $db->prepare("INSERT INTO hero_images (type, filename, url) VALUES (?,?,?)")->execute([$type, $filename, $url]);

    // Update content table too
    $key = $type === 'desktop' ? 'desktop_image' : 'mobile_image';
    $db->prepare("INSERT INTO site_content (section,`key`,value) VALUES ('hero',?,?) ON DUPLICATE KEY UPDATE value=?")->execute([$key, $url, $url]);

    respond(['url' => $url, 'message' => 'Hero image updated']);
}
