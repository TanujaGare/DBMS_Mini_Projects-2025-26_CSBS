const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  table: { type: Number, required: true },
  waiter: { type: String, required: true },
  items: [{ type: String, required: true }],
  total: { type: Number, required: true },
  status: { type: String, enum: ['new','cooking','ready','served'], default: 'new' },
  notes: { type: String, default: '' },
  time: { type: String, default: () => new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true }) },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
