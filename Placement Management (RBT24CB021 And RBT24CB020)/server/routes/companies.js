const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const { auth, adminOnly } = require('../middleware/auth');

// Get all companies
router.get('/', auth, async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get company by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create company (admin)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { name, website, contactNo, logo } = req.body;
    const company = new Company({ name, website, contactNo, logo });
    await company.save();
    res.status(201).json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update company (admin)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete company (admin)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json({ message: 'Company deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
