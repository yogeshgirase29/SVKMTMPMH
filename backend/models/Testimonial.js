const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
    trim: true
  },
  feedback: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  image: {
    type: String // Cloudinary Image URL (optional/required)
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);
