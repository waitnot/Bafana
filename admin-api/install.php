<?php
require_once 'config.php';

$db = getDB();

$db->exec("
CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(200),
    description TEXT,
    long_description TEXT,
    beds VARCHAR(100),
    area VARCHAR(100),
    perfect_for VARCHAR(200),
    highlights TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS room_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    url VARCHAR(500),
    sort_order INT DEFAULT 0,
    is_primary TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS gallery_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    url VARCHAR(500),
    caption VARCHAR(255),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section VARCHAR(100) NOT NULL,
    `key` VARCHAR(100) NOT NULL,
    value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY section_key (section, `key`)
);

CREATE TABLE IF NOT EXISTS hero_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('desktop','mobile') NOT NULL,
    filename VARCHAR(255) NOT NULL,
    url VARCHAR(500),
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200),
    email VARCHAR(200),
    phone VARCHAR(100),
    check_in DATE,
    check_out DATE,
    guests VARCHAR(50),
    room VARCHAR(200),
    message TEXT,
    status ENUM('New','Contacted','Confirmed','Cancelled') DEFAULT 'New',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS consultations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200),
    email VARCHAR(200),
    phone VARCHAR(100),
    project VARCHAR(200),
    message TEXT,
    visit_date DATE,
    status ENUM('New','Contacted','Confirmed','Cancelled') DEFAULT 'New',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200),
    rating INT,
    text TEXT,
    status ENUM('Published','Hidden') DEFAULT 'Published',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
");

// Seed default rooms
$count = $db->query("SELECT COUNT(*) FROM rooms")->fetchColumn();
if ($count == 0) {
    $rooms = [
        ['Standard Double Room', 'Comfortable & Convenient', 'An inviting accommodation for couples or travellers.', '1 Double', 'Standard Room', 'Couples and individual leisure travellers', 1],
        ['Deluxe Twin Room', 'Individual Comfort, Shared Experience', 'Ideal for friends or colleagues.', '2 Single', 'Deluxe Room', 'Friends, colleagues and tour guests', 2],
        ['Deluxe Double Room', 'An Elevated Stay Experience', 'Enhanced accommodation for couples.', '1 Double', 'Deluxe Room', 'Couples and leisure travellers', 3],
        ['Standard Triple Room', 'More Room for Shared Memories', 'Accommodates three guests comfortably.', '3 Single', 'Triple Room', 'Families, friends and groups', 4],
        ['Executive Family Suite', 'Togetherness Meets Comfort', 'Suite-style for families and groups.', '2–3 Beds', 'Family Suite', 'Families and small groups', 5],
        ['Regal Executive Suite', 'Refined Comfort & Elegance', 'Distinguished suite for premium guests.', '1 King', 'Executive Suite', 'Premium leisure guests', 6],
        ['Premium Pyramid Suite', 'An Experience Inspired by Egypt', 'Signature suite inspired by Giza heritage.', '1 King', 'Premium Suite', 'Premium travellers and special occasions', 7],
    ];
    $stmt = $db->prepare("INSERT INTO rooms (name, type, description, beds, area, perfect_for, sort_order) VALUES (?,?,?,?,?,?,?)");
    foreach ($rooms as $r) {
        $stmt->execute($r);
    }
}

// Seed default content
$content = [
    ['hero', 'desktop_title', "Your Gateway to Egypt's Timeless Wonders"],
    ['hero', 'desktop_sub', 'Giza, Cairo – Egypt'],
    ['hero', 'mobile_text', "Your Gateway to Egypt's Timeless Wonders"],
    ['about', 'tagline', 'Experience Egyptian Hospitality, Comfort & Convenience.'],
    ['contact', 'address', 'Princess Street, Al Remaya, Kafr Nassar, Al Haram, Giza Governorate 3515001'],
    ['contact', 'phone', '+20 1034 962 229'],
    ['contact', 'email', 'info@bafanapyramidshotel.com'],
    ['contact', 'hours', 'Mon–Sat: 9:00 AM – 7:00 PM'],
    ['footer', 'tagline', 'Comfort. Hospitality. Timeless Experiences.'],
];
$stmt = $db->prepare("INSERT IGNORE INTO site_content (section, `key`, value) VALUES (?,?,?)");
foreach ($content as $c) {
    $stmt->execute($c);
}

echo json_encode(['success' => true, 'message' => 'Database installed successfully!']);
