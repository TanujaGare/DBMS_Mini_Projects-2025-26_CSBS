const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  branch: { type: String, default: '' },
  cgpa: { type: Number, default: 0 },
  resumeUrl: { type: String, default: '' },
  role: { type: String, default: 'student' }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
