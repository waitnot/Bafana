<?php
require_once 'config.php';

$uri  = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = trim(str_replace('/admin-api', '', $uri), '/');
$parts = explode('/', $path);
$endpoint = $parts[0] ?? '';

switch ($endpoint) {
    case 'auth':      require 'auth.php';     break;
    case 'rooms':     require 'rooms.php';    break;
    case 'gallery':   require 'gallery.php';  break;
    case 'content':   require 'content.php';  break;
    case 'bookings':  require 'bookings.php';  break;
    case 'install':   require 'install.php';  break;
    default:
        respond(['message' => 'Bafana Pyramids Admin API', 'version' => '1.0', 'endpoints' => ['auth','rooms','gallery','content','bookings','install']]);
}
