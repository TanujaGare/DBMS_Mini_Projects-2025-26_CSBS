const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  position: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  ctc: { type: String, default: '' },
  stipend: { type: String, default: '' },
  jobLocation: { type: String, default: '' },
  skillsRequired: [{ type: String }],
  selectionProcedure: { type: String, default: '' },
  minCGPA: { type: Number, default: 0 },
  arrivalDate: { type: Date },
  deadline: { type: Date },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' }
}, { timestamps: true });

module.exports = mongoose.model('Drive', driveSchema);
