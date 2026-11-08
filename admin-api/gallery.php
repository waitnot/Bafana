<?php
require_once 'config.php';
requireAuth();

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

if ($method === 'GET') {
    $images = $db->query("SELECT * FROM gallery_images ORDER BY sort_order, created_at DESC")->fetchAll();
    respond($images);
}

if ($method === 'POST') {
    if (!isset($_FILES['image'])) respond(['error' => 'image required'], 400);
    $file = $_FILES['image'];
    $ext  = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, ['jpg','jpeg','png','webp'])) respond(['error' => 'Invalid type'], 400);

    $filename = 'gallery_' . time() . '_' . uniqid() . '.' . $ext;
    $path = UPLOAD_PATH . 'gallery/' . $filename;
    if (!move_uploaded_file($file['tmp_name'], $path)) respond(['error' => 'Upload failed'], 500);

    $caption = $_POST['caption'] ?? '';
    $stmt = $db->prepare("INSERT INTO gallery_images (filename, url, caption) VALUES (?,?,?)");
    $stmt->execute([$filename, UPLOAD_URL . 'gallery/' . $filename, $caption]);
    respond(['id' => $db->lastInsertId(), 'url' => UPLOAD_URL . 'gallery/' . $filename]);
}

if ($method === 'DELETE') {
    if (!$id) respond(['error' => 'id required'], 400);
    $stmt = $db->prepare("SELECT filename FROM gallery_images WHERE id=?");
    $stmt->execute([$id]);
    $img = $stmt->fetch();
    if ($img) @unlink(UPLOAD_PATH . 'gallery/' . $img['filename']);
    $db->prepare("DELETE FROM gallery_images WHERE id=?")->execute([$id]);
    respond(['message' => 'Deleted']);
}
