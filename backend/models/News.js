const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true, trim: true },
    mr: { type: String, required: true, trim: true }
  },
  description: {
    en: { type: String, required: true, trim: true },
    mr: { type: String, required: true, trim: true }
  },
  image: {
    type: String, // Cloudinary Image URL
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('News', NewsSchema);
