const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  departmentName: {
    en: { type: String, required: true, unique: true, trim: true },
    mr: { type: String, required: true, unique: true, trim: true }
  },
  description: {
    en: { type: String, trim: true, default: '' },
    mr: { type: String, trim: true, default: '' }
  },
  icon: {
    type: String, // String identifier for icon, e.g., 'Heart', 'Activity'
    default: 'Activity'
  },
  image: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Department', DepartmentSchema);
