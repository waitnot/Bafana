<?php
require_once 'config.php';

$db     = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$type   = $_GET['type'] ?? 'bookings'; // bookings | consultations | reviews
$id     = $_GET['id'] ?? null;
$table  = in_array($type, ['bookings','consultations','reviews']) ? $type : 'bookings';

// Public POST — save submission (no auth needed)
if ($method === 'POST' && !hasAuth()) {
    $body = json_decode(file_get_contents('php://input'), true);
    if ($table === 'bookings') {
        $stmt = $db->prepare("INSERT INTO bookings (name,email,phone,check_in,check_out,guests,room,message) VALUES (?,?,?,?,?,?,?,?)");
        $stmt->execute([$body['name']??'',$body['email']??'',$body['phone']??'',$body['checkIn']??null,$body['checkOut']??null,$body['guests']??'',$body['room']??'',$body['message']??'']);
    } elseif ($table === 'consultations') {
        $stmt = $db->prepare("INSERT INTO consultations (name,email,phone,project,message,visit_date) VALUES (?,?,?,?,?,?)");
        $stmt->execute([$body['name']??'',$body['email']??'',$body['phone']??'',$body['project']??'',$body['message']??'',$body['visitDate']??null]);
    } elseif ($table === 'reviews') {
        $stmt = $db->prepare("INSERT INTO reviews (name,rating,text) VALUES (?,?,?)");
        $stmt->execute([$body['name']??'', (int)($body['rating']??5), $body['text']??'']);
    }
    respond(['id' => $db->lastInsertId(), 'message' => 'Saved']);
}

// Admin routes — require auth
requireAuth();

if ($method === 'GET') {
    $rows = $db->query("SELECT * FROM $table ORDER BY submitted_at DESC")->fetchAll();
    respond($rows);
}

if ($method === 'PATCH') {
    $body = json_decode(file_get_contents('php://input'), true);
    if (!$id) respond(['error' => 'id required'], 400);
    $status = $body['status'] ?? 'New';
    $db->prepare("UPDATE $table SET status=? WHERE id=?")->execute([$status, $id]);
    respond(['message' => 'Status updated']);
}

if ($method === 'DELETE') {
    if (!$id) respond(['error' => 'id required'], 400);
    $db->prepare("DELETE FROM $table WHERE id=?")->execute([$id]);
    respond(['message' => 'Deleted']);
}
