<?php
require_once 'config.php';
requireAuth();

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

// GET — list all rooms with their images
if ($method === 'GET') {
    $rooms = $db->query("SELECT * FROM rooms ORDER BY sort_order")->fetchAll();
    foreach ($rooms as &$room) {
        $room['images'] = $db->prepare("SELECT * FROM room_images WHERE room_id=? ORDER BY sort_order");
        $room['images']->execute([$room['id']]);
        $room['images'] = $room['images']->fetchAll();
    }
    respond($rooms);
}

// POST — create room or upload image
if ($method === 'POST') {
    $action = $_GET['action'] ?? 'create';

    if ($action === 'upload_image') {
        $roomId = $_POST['room_id'] ?? null;
        if (!$roomId || !isset($_FILES['image'])) {
            respond(['error' => 'room_id and image required'], 400);
        }
        $file = $_FILES['image'];
        $ext  = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg','jpeg','png','webp'];
        if (!in_array($ext, $allowed)) respond(['error' => 'Invalid file type'], 400);

        $filename = 'room_' . $roomId . '_' . time() . '_' . uniqid() . '.' . $ext;
        $path = UPLOAD_PATH . 'rooms/' . $filename;

        if (!move_uploaded_file($file['tmp_name'], $path)) {
            respond(['error' => 'Upload failed'], 500);
        }

        $isPrimary = $_POST['is_primary'] ?? 0;
        if ($isPrimary) {
            $db->prepare("UPDATE room_images SET is_primary=0 WHERE room_id=?")->execute([$roomId]);
        }

        $stmt = $db->prepare("INSERT INTO room_images (room_id, filename, url, is_primary) VALUES (?,?,?,?)");
        $stmt->execute([$roomId, $filename, UPLOAD_URL . 'rooms/' . $filename, $isPrimary ? 1 : 0]);

        respond(['id' => $db->lastInsertId(), 'url' => UPLOAD_URL . 'rooms/' . $filename, 'filename' => $filename]);
    }

    // Create room
    $body = json_decode(file_get_contents('php://input'), true);
    $stmt = $db->prepare("INSERT INTO rooms (name,type,description,long_description,beds,area,perfect_for,highlights,sort_order) VALUES (?,?,?,?,?,?,?,?,?)");
    $stmt->execute([
        $body['name'] ?? '', $body['type'] ?? '', $body['description'] ?? '',
        $body['long_description'] ?? '', $body['beds'] ?? '', $body['area'] ?? '',
        $body['perfect_for'] ?? '', $body['highlights'] ?? '', $body['sort_order'] ?? 0
    ]);
    respond(['id' => $db->lastInsertId(), 'message' => 'Room created']);
}

// PUT — update room
if ($method === 'PUT') {
    if (!$id) respond(['error' => 'id required'], 400);
    $body = json_decode(file_get_contents('php://input'), true);
    $stmt = $db->prepare("UPDATE rooms SET name=?,type=?,description=?,long_description=?,beds=?,area=?,perfect_for=?,highlights=?,sort_order=? WHERE id=?");
    $stmt->execute([
        $body['name'] ?? '', $body['type'] ?? '', $body['description'] ?? '',
        $body['long_description'] ?? '', $body['beds'] ?? '', $body['area'] ?? '',
        $body['perfect_for'] ?? '', $body['highlights'] ?? '', $body['sort_order'] ?? 0, $id
    ]);
    respond(['message' => 'Room updated']);
}

// DELETE — delete room or image
if ($method === 'DELETE') {
    $action = $_GET['action'] ?? 'room';
    if ($action === 'image') {
        $imageId = $_GET['image_id'] ?? null;
        if (!$imageId) respond(['error' => 'image_id required'], 400);
        $img = $db->prepare("SELECT filename FROM room_images WHERE id=?")->execute([$imageId]);
        $img = $db->query("SELECT filename FROM room_images WHERE id=$imageId")->fetch();
        if ($img) {
            @unlink(UPLOAD_PATH . 'rooms/' . $img['filename']);
        }
        $db->prepare("DELETE FROM room_images WHERE id=?")->execute([$imageId]);
        respond(['message' => 'Image deleted']);
    }
    if (!$id) respond(['error' => 'id required'], 400);
    $db->prepare("DELETE FROM rooms WHERE id=?")->execute([$id]);
    respond(['message' => 'Room deleted']);
}
