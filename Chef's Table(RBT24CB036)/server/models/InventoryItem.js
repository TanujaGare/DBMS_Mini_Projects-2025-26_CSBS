const mongoose = require('mongoose');

const InventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cat: { type: String, required: true },
  qty: { type: Number, required: true },
  unit: { type: String, required: true },
  min: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InventoryItem', InventoryItemSchema);
