<?php
$host = 'localhost';
$user = 'root';
$pass = ''; // Default XAMPP password is empty
$db_name = 'parking_db';

$conn = new mysqli($host, $user, $pass, $db_name);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set timezone for PHP and MySQL to ensure times match perfectly
date_default_timezone_set('Asia/Kolkata');
$conn->query("SET time_zone = '+05:30'");
?>
