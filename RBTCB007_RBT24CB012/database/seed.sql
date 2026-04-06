-- ============================================================
--  Vehicle Rental Management System - Seed Data
-- ============================================================
USE vehicle_rental_db;

-- ---------------------------------------------------------------
-- Sample Vehicles
-- ---------------------------------------------------------------
INSERT INTO vehicles (brand, model, category, year, license_plate, price_per_day, status, color, fuel_type, seats) VALUES
('Toyota',     'Camry',        'Car',   2022, 'MH01AB1234', 2500.00, 'available',   'White',  'Petrol',  5),
('Honda',      'City',         'Car',   2023, 'MH02CD5678', 2200.00, 'available',   'Silver', 'Petrol',  5),
('Hyundai',    'Creta',        'SUV',   2023, 'MH03EF9012', 3000.00, 'rented',      'Black',  'Diesel',  5),
('Mahindra',   'Thar',         'SUV',   2022, 'MH04GH3456', 3500.00, 'available',   'Red',    'Diesel',  4),
('Royal Enfield','Bullet 350', 'Bike',  2023, 'MH05IJ7890', 800.00,  'available',   'Black',  'Petrol',  2),
('Honda',      'Activa 6G',    'Bike',  2023, 'MH06KL2345', 400.00,  'available',   'Blue',   'Petrol',  2),
('Toyota',     'Innova',       'Van',   2022, 'MH07MN6789', 4000.00, 'available',   'Pearl',  'Diesel',  7),
('Ford',       'Transit',      'Truck', 2021, 'MH08OP1234', 5500.00, 'maintenance', 'White',  'Diesel',  3),
('Maruti',     'Swift',        'Car',   2023, 'MH09QR5678', 1800.00, 'available',   'Orange', 'Petrol',  5),
('Kia',        'Seltos',       'SUV',   2023, 'MH10ST9012', 3200.00, 'available',   'Grey',   'Petrol',  5);

-- ---------------------------------------------------------------
-- Sample Customers
-- ---------------------------------------------------------------
INSERT INTO customers (full_name, email, phone, license_number, address) VALUES
('Rahul Sharma',   'rahul.sharma@email.com',   '9876543210', 'DL-1234567890', '12, MG Road, Delhi'),
('Priya Patel',    'priya.patel@email.com',    '9876543211', 'MH-0987654321', '45, FC Road, Pune'),
('Amit Singh',     'amit.singh@email.com',     '9876543212', 'KA-1122334455', '78, Brigade Road, Bangalore'),
('Sneha Reddy',    'sneha.reddy@email.com',    '9876543213', 'TS-5566778899', '23, Banjara Hills, Hyderabad'),
('Vikram Joshi',   'vikram.joshi@email.com',   '9876543214', 'GJ-9988776655', '56, CG Road, Ahmedabad'),
('Anjali Mehta',   'anjali.mehta@email.com',   '9876543215', 'RJ-4433221100', '90, MI Road, Jaipur');

-- ---------------------------------------------------------------
-- Sample Rentals
-- ---------------------------------------------------------------
INSERT INTO rentals (vehicle_id, customer_id, start_date, end_date, total_cost, status, notes) VALUES
(3,  2, '2026-03-15', '2026-03-18', 9000.00,  'active',    'Customer needs GPS'),
(1,  1, '2026-03-10', '2026-03-12', 5000.00,  'completed', 'Returned on time'),
(5,  3, '2026-03-01', '2026-03-03', 1600.00,  'completed', 'No issues'),
(7,  4, '2026-03-18', '2026-03-20', 8000.00,  'active',    'Wedding event'),
(2,  5, '2026-02-20', '2026-02-25', 11000.00, 'completed', 'Business trip');
