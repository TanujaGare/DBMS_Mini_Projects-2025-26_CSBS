# Vehicle Parking Management System

A simple and efficient web-based Vehicle Parking Management System developed using PHP and MySQL.

## 🚀 Features
- **Admin Login**: Secure access to the system.
- **Vehicle Entry**: Auto-assignment of parking slots for Cars and Bikes.
- **Vehicle Exit**: Automated calculation of parking duration and fees.
- **Parking Records**: View history of all parked vehicles.
- **Responsive UI**: Clean interface built with HTML/CSS.

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3
- **Backend**: PHP (Vanilla)
- **Database**: MySQL

## ⚙️ Installation Guide

1. **Setup Server**
   - Install XAMPP (or WAMP/MAMP).
   - Start **Apache** and **MySQL** modules.

2. **Setup Database**
   - Go to `http://localhost/phpmyadmin`
   - Create a new database named `parking_db`.
   - Import the `database.sql` file provided in this folder OR copy-paste the SQL content into the SQL tab.

3. **Deploy Project**
   - Move the `parking_system` folder to `htdocs` (usually `C:\xampp\htdocs\`).

4. **Run Application**
   - Open browser and visit: `http://localhost/parking_system/`
   - Login Credentials:
     - **Username**: admin
     - **Password**: admin123

## 📂 Folder Structure
```
parking_system/
├── index.php       # Admin Login
├── entry.php       # Vehicle Entry Form
├── exit.php        # Manage Exits & Billing
├── records.php     # View Parking History
├── db.php          # Database Connection
├── style.css       # Stylesheet
├── database.sql    # Database Schema
└── README.md       # Project Documentation
```

## 📝 Academic Implementation Details
- **Joins**: Used JOIN operations to fetch vehicle and slot details in records.
- **Transactions**: Used for data integrity during vehicle entry and slot assignment.
- **Normalization**: Database is normalized with separate tables for Vehicle, Slots, and Records.
