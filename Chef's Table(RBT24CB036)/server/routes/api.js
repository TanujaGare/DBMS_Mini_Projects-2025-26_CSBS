const express = require('express');
const Order = require('../models/Order');
const Reservation = require('../models/Reservation');
const MenuItem = require('../models/MenuItem');
const InventoryItem = require('../models/InventoryItem');
const Staff = require('../models/Staff');

const router = express.Router();

// ── ORDERS ──
router.get('/orders', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json({ orders });
});
router.post('/orders', async (req, res) => {
  const { table, waiter, items, total, notes, status } = req.body;
  if (!table || !waiter || !Array.isArray(items) || !total) return res.status(400).json({ message: 'Invalid order payload' });
  const order = await Order.create({ table, waiter, items, total, notes, status: status || 'new', createdBy: req.user.id });
  res.status(201).json({ order });
});
router.put('/orders/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  Object.assign(order, req.body);
  await order.save();
  res.json({ order });
});
router.delete('/orders/:id', async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ message: 'Deleted', order });
});

// ── RESERVATIONS ──
router.get('/reservations', async (req, res) => {
  const reservations = await Reservation.find().sort({ time: 1 });
  res.json({ reservations });
});
router.post('/reservations', async (req, res) => {
  const reservation = await Reservation.create(req.body);
  res.status(201).json({ reservation });
});
router.put('/reservations/:id', async (req, res) => {
  const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!reservation) return res.status(404).json({ message: 'Not found' });
  res.json({ reservation });
});
router.delete('/reservations/:id', async (req, res) => {
  const reservation = await Reservation.findByIdAndDelete(req.params.id);
  if (!reservation) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

// ── MENU ITEMS ──
router.get('/menu', async (req, res) => {
  const items = await MenuItem.find().sort({ category: 1, name: 1 });
  res.json({ items });
});
router.post('/menu', async (req, res) => {
  const item = await MenuItem.create(req.body);
  res.status(201).json({ item });
});
router.put('/menu/:id', async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ item });
});
router.delete('/menu/:id', async (req, res) => {
  const item = await MenuItem.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

// ── INVENTORY ──
router.get('/inventory', async (req, res) => {
  const items = await InventoryItem.find().sort({ cat: 1, name: 1 });
  res.json({ items });
});
router.post('/inventory', async (req, res) => {
  const item = await InventoryItem.create(req.body);
  res.status(201).json({ item });
});
router.put('/inventory/:id', async (req, res) => {
  const item = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ item });
});
router.delete('/inventory/:id', async (req, res) => {
  const item = await InventoryItem.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

// ── STAFF ──
router.get('/staff', async (req, res) => {
  const staff = await Staff.find().sort({ name: 1 });
  res.json({ staff });
});
router.post('/staff', async (req, res) => {
  const member = await Staff.create(req.body);
  res.status(201).json({ member });
});
router.put('/staff/:id', async (req, res) => {
  const member = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!member) return res.status(404).json({ message: 'Not found' });
  res.json({ member });
});
router.delete('/staff/:id', async (req, res) => {
  const member = await Staff.findByIdAndDelete(req.params.id);
  if (!member) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;
