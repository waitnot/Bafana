<?php
require_once 'config.php';

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$id     = $_GET['id'] ?? null;

// ── GET — public, no auth needed (website reads rooms) ──────────────────────
if ($method === 'GET') {
    $rooms = $db->query("SELECT * FROM rooms ORDER BY sort_order, id")->fetchAll();

    // Fetch all images in ONE query, then group by room_id (avoids N+1 queries)
    $allImages = $db->query(
        "SELECT * FROM room_images ORDER BY is_primary DESC, sort_order ASC, id ASC"
    )->fetchAll();

    // Index images by room_id
    $imagesByRoom = [];
    foreach ($allImages as $img) {
        $imagesByRoom[$img['room_id']][] = $img;
    }

    foreach ($rooms as &$room) {
        $room['images'] = $imagesByRoom[$room['id']] ?? [];
    }
    unset($room);

    respond($rooms);
}

// All write operations require admin auth
requireAuth();

// ── POST — create room | upload image | set primary ─────────────────────────
if ($method === 'POST') {
    $action = $_GET['action'] ?? 'create';

    // Upload image to a room
    if ($action === 'upload_image') {
        // Support BOTH multipart/form-data (direct) AND JSON base64 (Cloudflare WAF bypass)
        $roomId    = null;
        $isPrimary = 0;
        $fileData  = null;
        $ext       = 'jpg';

        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

        if (strpos($contentType, 'multipart') !== false && isset($_FILES['image'])) {
            // Traditional multipart upload
            $roomId    = $_POST['room_id'] ?? null;
            $isPrimary = (int)($_POST['is_primary'] ?? 0);
            $file      = $_FILES['image'];
            $ext       = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            $allowed   = ['jpg', 'jpeg', 'png', 'webp'];
            if (!in_array($ext, $allowed)) respond(['error' => 'Invalid file type. Use JPG, PNG or WEBP.'], 400);
            if ($file['size'] > 20 * 1024 * 1024) respond(['error' => 'File too large (max 20 MB)'], 400);
            $fileData  = file_get_contents($file['tmp_name']);
        } else {
            // JSON base64 upload (Cloudflare WAF bypass)
            $body      = json_decode(file_get_contents('php://input'), true) ?? [];
            $roomId    = $body['room_id'] ?? null;
            $isPrimary = (int)($body['is_primary'] ?? 0);
            $b64       = $body['image_base64'] ?? '';
            $mimeHint  = $body['mime'] ?? 'image/jpeg';
            if (!$roomId || !$b64) respond(['error' => 'room_id and image_base64 required'], 400);
            // Strip data URL prefix if present
            if (strpos($b64, ',') !== false) $b64 = explode(',', $b64, 2)[1];
            $fileData = base64_decode($b64);
            if ($fileData === false || strlen($fileData) < 100) respond(['error' => 'Invalid base64 image data'], 400);
            if (strlen($fileData) > 20 * 1024 * 1024) respond(['error' => 'File too large (max 20 MB)'], 400);
            // Detect extension from mime or file magic
            $extMap = ['image/jpeg'=>'jpg','image/jpg'=>'jpg','image/png'=>'png','image/webp'=>'webp'];
            $ext = $extMap[$mimeHint] ?? 'jpg';
            // Try magic bytes
            if (substr($fileData, 0, 4) === "\x89PNG") $ext = 'png';
            elseif (substr($fileData, 0, 4) === 'RIFF') $ext = 'webp';
        }

        if (!$roomId) respond(['error' => 'room_id required'], 400);
        if (!$fileData) respond(['error' => 'No image data received'], 400);

        $filename = 'room_' . $roomId . '_' . time() . '_' . uniqid() . '.' . $ext;
        $destPath = UPLOAD_PATH . 'rooms/' . $filename;

        if (file_put_contents($destPath, $fileData) === false) {
            respond(['error' => 'Upload failed — cannot write file'], 500);
        }

        // Auto-primary for first image
        $countStmt = $db->prepare("SELECT COUNT(*) FROM room_images WHERE room_id=?");
        $countStmt->execute([$roomId]);
        $existingCount = (int)$countStmt->fetchColumn();
        if ($existingCount === 0) $isPrimary = 1;

        if ($isPrimary) {
            $db->prepare("UPDATE room_images SET is_primary=0 WHERE room_id=?")->execute([$roomId]);
        }

        $stmt = $db->prepare("INSERT INTO room_images (room_id, filename, url, is_primary) VALUES (?,?,?,?)");
        $url  = UPLOAD_URL . 'rooms/' . $filename;
        $stmt->execute([$roomId, $filename, $url, $isPrimary]);

        respond([
            'id'         => $db->lastInsertId(),
            'url'        => $url,
            'filename'   => $filename,
            'is_primary' => $isPrimary
        ]);
    }

    // Set an image as primary
    if ($action === 'set_primary') {
        $imageId = $_GET['image_id'] ?? null;
        if (!$imageId) respond(['error' => 'image_id required'], 400);

        // Get the room_id for this image
        $imgStmt = $db->prepare("SELECT room_id FROM room_images WHERE id=?");
        $imgStmt->execute([$imageId]);
        $img = $imgStmt->fetch();
        if (!$img) respond(['error' => 'Image not found'], 404);

        // Clear all primaries for this room, then set this one
        $db->prepare("UPDATE room_images SET is_primary=0 WHERE room_id=?")->execute([$img['room_id']]);
        $db->prepare("UPDATE room_images SET is_primary=1 WHERE id=?")->execute([$imageId]);

        respond(['message' => 'Primary image updated']);
    }

    // Create new room
    $body = json_decode(file_get_contents('php://input'), true) ?? [];
    $stmt = $db->prepare(
        "INSERT INTO rooms (name,type,description,long_description,beds,area,perfect_for,highlights,sort_order)
         VALUES (?,?,?,?,?,?,?,?,?)"
    );
    $stmt->execute([
        $body['name']             ?? '',
        $body['type']             ?? '',
        $body['description']      ?? '',
        $body['long_description'] ?? '',
        $body['beds']             ?? '',
        $body['area']             ?? '',
        $body['perfect_for']      ?? '',
        $body['highlights']       ?? '',
        (int)($body['sort_order'] ?? 0)
    ]);
    respond(['id' => $db->lastInsertId(), 'message' => 'Room created']);
}

// ── PUT — update room details ────────────────────────────────────────────────
if ($method === 'PUT') {
    if (!$id) respond(['error' => 'id required'], 400);
    $body = json_decode(file_get_contents('php://input'), true) ?? [];
    $stmt = $db->prepare(
        "UPDATE rooms SET name=?,type=?,description=?,long_description=?,beds=?,area=?,perfect_for=?,highlights=?,sort_order=?
         WHERE id=?"
    );
    $stmt->execute([
        $body['name']             ?? '',
        $body['type']             ?? '',
        $body['description']      ?? '',
        $body['long_description'] ?? '',
        $body['beds']             ?? '',
        $body['area']             ?? '',
        $body['perfect_for']      ?? '',
        $body['highlights']       ?? '',
        (int)($body['sort_order'] ?? 0),
        $id
    ]);
    respond(['message' => 'Room updated']);
}

// ── DELETE — remove room or image ────────────────────────────────────────────
if ($method === 'DELETE') {
    $action = $_GET['action'] ?? 'room';

    if ($action === 'image') {
        $imageId = $_GET['image_id'] ?? null;
        if (!$imageId) respond(['error' => 'image_id required'], 400);

        $stmt = $db->prepare("SELECT filename, room_id FROM room_images WHERE id=?");
        $stmt->execute([$imageId]);
        $img = $stmt->fetch();

        if ($img) {
            // Delete the physical file
            $filePath = UPLOAD_PATH . 'rooms/' . $img['filename'];
            if (file_exists($filePath)) @unlink($filePath);

            // If this was primary, make the next image primary
            $db->prepare("DELETE FROM room_images WHERE id=?")->execute([$imageId]);

            $nextStmt = $db->prepare(
                "SELECT id FROM room_images WHERE room_id=? ORDER BY sort_order ASC, id ASC LIMIT 1"
            );
            $nextStmt->execute([$img['room_id']]);
            $next = $nextStmt->fetch();
            if ($next) {
                $db->prepare("UPDATE room_images SET is_primary=1 WHERE id=?")->execute([$next['id']]);
            }
        } else {
            $db->prepare("DELETE FROM room_images WHERE id=?")->execute([$imageId]);
        }

        respond(['message' => 'Image deleted']);
    }

    // Delete entire room (cascade deletes images via FK, also remove files)
    if (!$id) respond(['error' => 'id required'], 400);

    // Remove image files first
    $imgStmt = $db->prepare("SELECT filename FROM room_images WHERE room_id=?");
    $imgStmt->execute([$id]);
    foreach ($imgStmt->fetchAll() as $img) {
        $filePath = UPLOAD_PATH . 'rooms/' . $img['filename'];
        if (file_exists($filePath)) @unlink($filePath);
    }

    $db->prepare("DELETE FROM rooms WHERE id=?")->execute([$id]);
    respond(['message' => 'Room deleted']);
}
