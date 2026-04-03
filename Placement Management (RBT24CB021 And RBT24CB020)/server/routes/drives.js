const express = require('express');
const router = express.Router();
const Drive = require('../models/Drive');
const { auth, adminOnly } = require('../middleware/auth');

// Get all drives (with company populated)
router.get('/', auth, async (req, res) => {
  try {
    const drives = await Drive.find().populate('company').sort({ arrivalDate: -1 });
    res.json(drives);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get drive by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id).populate('company');
    if (!drive) return res.status(404).json({ message: 'Drive not found' });
    res.json(drive);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create drive (admin)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const drive = new Drive(req.body);
    await drive.save();
    const populated = await Drive.findById(drive._id).populate('company');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update drive (admin)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const drive = await Drive.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('company');
    if (!drive) return res.status(404).json({ message: 'Drive not found' });
    res.json(drive);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete drive (admin)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const drive = await Drive.findByIdAndDelete(req.params.id);
    if (!drive) return res.status(404).json({ message: 'Drive not found' });
    res.json({ message: 'Drive deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
