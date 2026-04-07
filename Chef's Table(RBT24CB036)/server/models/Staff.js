const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  shift: { type: String, default: 'Evening' },
  phone: { type: String, default: '' },
  emoji: { type: String, default: '🧑' },
  status: { type: String, enum: ['on-shift', 'break', 'off'], default: 'on-shift' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Staff', StaffSchema);
