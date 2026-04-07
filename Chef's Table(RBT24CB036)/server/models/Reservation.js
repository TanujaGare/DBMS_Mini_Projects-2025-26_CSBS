const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, default: '' },
  date: { type: String, default: 'Today' },
  time: { type: String, required: true },
  guests: { type: Number, required: true },
  pref: { type: String, default: 'Any' },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['confirmed', 'pending', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reservation', ReservationSchema);
