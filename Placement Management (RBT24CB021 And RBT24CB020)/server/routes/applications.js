const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Drive = require('../models/Drive');
const Student = require('../models/Student');
const { auth, adminOnly, studentOnly } = require('../middleware/auth');

// Apply to a drive (student)
router.post('/', auth, studentOnly, async (req, res) => {
  try {
    const { driveId } = req.body;

    // Check drive exists
    const drive = await Drive.findById(driveId);
    if (!drive) return res.status(404).json({ message: 'Drive not found' });

    // Check deadline
    if (drive.deadline && new Date(drive.deadline) < new Date()) {
      return res.status(400).json({ message: 'Application deadline has passed' });
    }

    // Check CGPA eligibility
    const student = await Student.findById(req.user.id);
    if (drive.minCGPA && student.cgpa < drive.minCGPA) {
      return res.status(400).json({ message: `Minimum CGPA of ${drive.minCGPA} required` });
    }

    // Check duplicate
    const existing = await Application.findOne({ student: req.user.id, drive: driveId });
    if (existing) return res.status(400).json({ message: 'Already applied to this drive' });

    const application = new Application({
      student: req.user.id,
      drive: driveId
    });
    await application.save();

    const populated = await Application.findById(application._id)
      .populate({ path: 'drive', populate: { path: 'company' } })
      .populate('student', '-password');

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my applications (student)
router.get('/my', auth, studentOnly, async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate({ path: 'drive', populate: { path: 'company' } })
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get applicants for a drive (admin)
router.get('/drive/:driveId', auth, adminOnly, async (req, res) => {
  try {
    const applications = await Application.find({ drive: req.params.driveId })
      .populate('student', '-password')
      .populate({ path: 'drive', populate: { path: 'company' } })
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update application status (admin)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('student', '-password')
      .populate({ path: 'drive', populate: { path: 'company' } });

    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all applications (admin) - for dashboard stats
router.get('/all', auth, adminOnly, async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('student', '-password')
      .populate({ path: 'drive', populate: { path: 'company' } })
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
