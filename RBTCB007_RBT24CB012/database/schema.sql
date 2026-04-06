-- ============================================================
--  Vehicle Rental Management System - Database Schema
--  MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS vehicle_rental_db;
USE vehicle_rental_db;

-- ---------------------------------------------------------------
-- 1. VEHICLES
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vehicles (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    brand         VARCHAR(100)   NOT NULL,
    model         VARCHAR(100)   NOT NULL,
    category      ENUM('Car','SUV','Bike','Van','Truck') NOT NULL DEFAULT 'Car',
    year          YEAR           NOT NULL,
    license_plate VARCHAR(20)    NOT NULL UNIQUE,
    price_per_day DECIMAL(10,2)  NOT NULL,
    status        ENUM('available','rented','maintenance') NOT NULL DEFAULT 'available',
    color         VARCHAR(50),
    fuel_type     ENUM('Petrol','Diesel','Electric','Hybrid') DEFAULT 'Petrol',
    seats         INT DEFAULT 5,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------
-- 2. CUSTOMERS
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    full_name      VARCHAR(150)  NOT NULL,
    email          VARCHAR(150)  NOT NULL UNIQUE,
    phone          VARCHAR(20)   NOT NULL,
    license_number VARCHAR(50)   NOT NULL UNIQUE,
    address        TEXT,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------
-- 3. RENTALS
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rentals (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id    INT           NOT NULL,
    customer_id   INT           NOT NULL,
    start_date    DATE          NOT NULL,
    end_date      DATE          NOT NULL,
    total_cost    DECIMAL(10,2) NOT NULL DEFAULT 0,
    status        ENUM('active','completed','cancelled') NOT NULL DEFAULT 'active',
    notes         TEXT,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    returned_at   TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (vehicle_id)  REFERENCES vehicles(id)  ON DELETE RESTRICT,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
);
