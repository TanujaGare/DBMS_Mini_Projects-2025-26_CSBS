-- Create Database
CREATE DATABASE IF NOT EXISTS parking_db;
USE parking_db;

-- Table: admin
CREATE TABLE IF NOT EXISTS admin (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Table: vehicle
CREATE TABLE IF NOT EXISTS vehicle (
    vehicle_id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type ENUM('Car', 'Bike') NOT NULL,
    owner_name VARCHAR(100) NOT NULL
);

-- Table: parking_slot
CREATE TABLE IF NOT EXISTS parking_slot (
    slot_id INT PRIMARY KEY AUTO_INCREMENT,
    slot_number VARCHAR(10) UNIQUE NOT NULL,
    slot_type ENUM('Car', 'Bike') NOT NULL,
    status ENUM('Available', 'Occupied') DEFAULT 'Available'
);

-- Table: parking_record
CREATE TABLE IF NOT EXISTS parking_record (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    vehicle_id INT NOT NULL,
    slot_id INT NOT NULL,
    entry_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    exit_time DATETIME,
    total_amount DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (vehicle_id) REFERENCES vehicle(vehicle_id) ON DELETE CASCADE,
    FOREIGN KEY (slot_id) REFERENCES parking_slot(slot_id) ON DELETE CASCADE
);

-- Insert Sample Admin (password: admin123)
-- In a real app, use password_hash(). For this simple academic project, we store as is or simple hash if requested.
-- User requested "simple", but security is best practice. I'll use plain text for simplicity as per "Easy to understand code" and academic level usually accepts it, 
-- but I'll add a comment.
INSERT INTO admin (username, password) VALUES ('admin', 'admin123');

-- Insert Sample Slots
INSERT INTO parking_slot (slot_number, slot_type, status) VALUES 
('C-101', 'Car', 'Available'),
('C-102', 'Car', 'Available'),
('C-103', 'Car', 'Available'),
('C-104', 'Car', 'Available'),
('C-105', 'Car', 'Available'),
('B-201', 'Bike', 'Available'),
('B-202', 'Bike', 'Available'),
('B-203', 'Bike', 'Available'),
('B-204', 'Bike', 'Available'),
('B-205', 'Bike', 'Available');
