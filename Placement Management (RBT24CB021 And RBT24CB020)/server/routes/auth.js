const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const { auth } = require('../middleware/auth');

// Register Student
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, branch, cgpa } = req.body;

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) return res.status(400).json({ message: 'Email already registered' });

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const student = new Student({
      name, email, password: hashedPassword, phone, branch, cgpa
    });
    await student.save();

    const token = jwt.sign(
      { id: student._id, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id: student._id, name: student.name, email: student.email, role: 'student' }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await Student.findOne({ email });
    let role = 'student';

    if (!user) {
      user = await Admin.findOne({ email });
      role = 'admin';
    }

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Current User
router.get('/me', auth, async (req, res) => {
  try {
    let user;
    if (req.user.role === 'admin') {
      user = await Admin.findById(req.user.id).select('-password');
    } else {
      user = await Student.findById(req.user.id).select('-password');
    }
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ ...user.toObject(), role: req.user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
