const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  doctorName: {
    en: { type: String, required: true, trim: true },
    mr: { type: String, required: true, trim: true }
  },
  specialization: {
    en: { type: String, required: true, trim: true },
    mr: { type: String, required: true, trim: true }
  },
  qualification: {
    en: { type: String, required: true, trim: true },
    mr: { type: String, required: true, trim: true }
  },
  experience: {
    en: { type: String, required: true, trim: true },
    mr: { type: String, required: true, trim: true }
  },
  department: {
    type: String, // e.g. "Cardiology" or ID reference. The requirement lists string department name matching department list.
    required: true,
    trim: true
  },
  image: {
    type: String, // Cloudinary Image URL
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  leaveSchedule: [
    {
      leaveType: {
        type: String,
        enum: ['Annual Leave', 'Conference', 'Training', 'Emergency Leave', 'Personal Leave', 'Hospital Duty Outside Campus', 'Other'],
        required: true
      },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      reason: { type: String, maxLength: 250 },
      status: {
        type: String,
        enum: ['Active', 'Cancelled'],
        default: 'Active'
      },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Doctor', DoctorSchema);
