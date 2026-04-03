const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { auth, adminOnly } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Get all students (admin)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const students = await Student.find().select('-password').sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get student by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update student profile
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role === 'student' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, phone, branch, cgpa, resumeUrl, password } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (branch !== undefined) updateData.branch = branch;
    if (cgpa !== undefined) updateData.cgpa = cgpa;
    if (resumeUrl !== undefined) updateData.resumeUrl = resumeUrl;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
