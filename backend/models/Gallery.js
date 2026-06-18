const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String, // Cloudinary Image URL
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Hospital', 'Events', 'Equipment', 'Facilities']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Gallery', GallerySchema);
