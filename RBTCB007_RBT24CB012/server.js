require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------------------------------------------------
// Database Connection Pool
// ---------------------------------------------------------------
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME     || 'vehicle_rental_db',
  waitForConnections: true,
  connectionLimit: 10,
});

// Test connection on startup
pool.getConnection()
  .then(conn => { console.log('✅ MySQL connected successfully'); conn.release(); })
  .catch(err => { console.error('❌ MySQL connection failed:', err.message); });

// ---------------------------------------------------------------
// DASHBOARD STATS
// ---------------------------------------------------------------
app.get('/api/dashboard', async (req, res) => {
  try {
    const [[{ total_vehicles }]] = await pool.query('SELECT COUNT(*) AS total_vehicles FROM vehicles');
    const [[{ available }]]      = await pool.query("SELECT COUNT(*) AS available FROM vehicles WHERE status='available'");
    const [[{ active_rentals }]] = await pool.query("SELECT COUNT(*) AS active_rentals FROM rentals WHERE status='active'");
    const [[{ total_customers }]]= await pool.query('SELECT COUNT(*) AS total_customers FROM customers');
    const [[{ total_revenue }]]  = await pool.query("SELECT IFNULL(SUM(total_cost),0) AS total_revenue FROM rentals WHERE status='completed'");

    const [recent_rentals] = await pool.query(`
      SELECT r.id, c.full_name AS customer, v.brand, v.model, v.license_plate,
             r.start_date, r.end_date, r.total_cost, r.status
      FROM rentals r
      JOIN customers c ON r.customer_id = c.id
      JOIN vehicles  v ON r.vehicle_id  = v.id
      ORDER BY r.created_at DESC LIMIT 5
    `);

    res.json({ total_vehicles, available, active_rentals, total_customers, total_revenue, recent_rentals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------
// VEHICLES
// ---------------------------------------------------------------
app.get('/api/vehicles', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vehicles ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/vehicles/available', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM vehicles WHERE status='available' ORDER BY brand");
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/vehicles', async (req, res) => {
  const { brand, model, category, year, license_plate, price_per_day, color, fuel_type, seats } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO vehicles (brand, model, category, year, license_plate, price_per_day, color, fuel_type, seats) VALUES (?,?,?,?,?,?,?,?,?)',
      [brand, model, category, year, license_plate, price_per_day, color, fuel_type, seats]
    );
    res.status(201).json({ id: result.insertId, message: 'Vehicle added successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/vehicles/:id', async (req, res) => {
  const { brand, model, category, year, license_plate, price_per_day, status, color, fuel_type, seats } = req.body;
  try {
    await pool.query(
      'UPDATE vehicles SET brand=?, model=?, category=?, year=?, license_plate=?, price_per_day=?, status=?, color=?, fuel_type=?, seats=? WHERE id=?',
      [brand, model, category, year, license_plate, price_per_day, status, color, fuel_type, seats, req.params.id]
    );
    res.json({ message: 'Vehicle updated successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/vehicles/:id', async (req, res) => {
  try {
    const [[{ count }]] = await pool.query("SELECT COUNT(*) AS count FROM rentals WHERE vehicle_id=? AND status='active'", [req.params.id]);
    if (count > 0) return res.status(400).json({ error: 'Cannot delete vehicle with active rentals' });
    await pool.query('DELETE FROM vehicles WHERE id=?', [req.params.id]);
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ---------------------------------------------------------------
// CUSTOMERS
// ---------------------------------------------------------------
app.get('/api/customers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/customers', async (req, res) => {
  const { full_name, email, phone, license_number, address } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO customers (full_name, email, phone, license_number, address) VALUES (?,?,?,?,?)',
      [full_name, email, phone, license_number, address]
    );
    res.status(201).json({ id: result.insertId, message: 'Customer added successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/customers/:id', async (req, res) => {
  const { full_name, email, phone, license_number, address } = req.body;
  try {
    await pool.query(
      'UPDATE customers SET full_name=?, email=?, phone=?, license_number=?, address=? WHERE id=?',
      [full_name, email, phone, license_number, address, req.params.id]
    );
    res.json({ message: 'Customer updated successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    const [[{ count }]] = await pool.query("SELECT COUNT(*) AS count FROM rentals WHERE customer_id=? AND status='active'", [req.params.id]);
    if (count > 0) return res.status(400).json({ error: 'Cannot delete customer with active rentals' });
    await pool.query('DELETE FROM customers WHERE id=?', [req.params.id]);
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ---------------------------------------------------------------
// RENTALS
// ---------------------------------------------------------------
app.get('/api/rentals', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, c.full_name AS customer_name, c.phone AS customer_phone,
             v.brand, v.model, v.license_plate, v.category
      FROM rentals r
      JOIN customers c ON r.customer_id = c.id
      JOIN vehicles  v ON r.vehicle_id  = v.id
      ORDER BY r.created_at DESC
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/rentals', async (req, res) => {
  const { vehicle_id, customer_id, start_date, end_date, notes } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [[vehicle]] = await conn.query("SELECT price_per_day, status FROM vehicles WHERE id=?", [vehicle_id]);
    if (!vehicle) throw new Error('Vehicle not found');
    if (vehicle.status !== 'available') throw new Error('Vehicle is not available for rent');

    const days = Math.ceil((new Date(end_date) - new Date(start_date)) / (1000*60*60*24));
    if (days <= 0) throw new Error('End date must be after start date');
    const total_cost = days * vehicle.price_per_day;

    const [result] = await conn.query(
      'INSERT INTO rentals (vehicle_id, customer_id, start_date, end_date, total_cost, notes) VALUES (?,?,?,?,?,?)',
      [vehicle_id, customer_id, start_date, end_date, total_cost, notes]
    );
    await conn.query("UPDATE vehicles SET status='rented' WHERE id=?", [vehicle_id]);
    await conn.commit();
    res.status(201).json({ id: result.insertId, total_cost, days, message: 'Rental created successfully' });
  } catch (err) {
    await conn.rollback();
    res.status(400).json({ error: err.message });
  } finally { conn.release(); }
});

app.put('/api/rentals/:id/return', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [[rental]] = await conn.query("SELECT * FROM rentals WHERE id=?", [req.params.id]);
    if (!rental) throw new Error('Rental not found');
    if (rental.status !== 'active') throw new Error('Rental is not active');

    await conn.query("UPDATE rentals SET status='completed', returned_at=NOW() WHERE id=?", [req.params.id]);
    await conn.query("UPDATE vehicles SET status='available' WHERE id=?", [rental.vehicle_id]);
    await conn.commit();
    res.json({ message: 'Vehicle returned successfully' });
  } catch (err) {
    await conn.rollback();
    res.status(400).json({ error: err.message });
  } finally { conn.release(); }
});

app.put('/api/rentals/:id/cancel', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [[rental]] = await conn.query("SELECT * FROM rentals WHERE id=?", [req.params.id]);
    if (!rental) throw new Error('Rental not found');
    if (rental.status !== 'active') throw new Error('Rental is not active');

    await conn.query("UPDATE rentals SET status='cancelled' WHERE id=?", [req.params.id]);
    await conn.query("UPDATE vehicles SET status='available' WHERE id=?", [rental.vehicle_id]);
    await conn.commit();
    res.json({ message: 'Rental cancelled successfully' });
  } catch (err) {
    await conn.rollback();
    res.status(400).json({ error: err.message });
  } finally { conn.release(); }
});

// ---------------------------------------------------------------
// Serve frontend
// ---------------------------------------------------------------
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚗 Vehicle Rental Server running at http://localhost:${PORT}`);
});
