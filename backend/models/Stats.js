const mongoose = require('mongoose');

const StatsSchema = new mongoose.Schema({
  beds: {
    type: Number,
    required: true,
    default: 0
  },
  doctors: {
    type: Number,
    required: true,
    default: 0
  },
  campusArea: {
    type: String,
    required: true,
    default: ''
  },
  emergencyStatus: {
    type: String,
    required: true,
    default: 'Active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Stats', StatsSchema);
