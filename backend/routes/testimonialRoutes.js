const express = require('express');
const router = express.Router();
const multer = require('multer');
const { testimonialStorage } = require('../cloudConfig/cloudinary');
const upload = multer({ storage: testimonialStorage });
const { isAdminAuthenticated } = require('../middleware/authMiddleware');
const {
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonialController');

// Public route to view testimonials
router.get('/', getAllTestimonials);

// Protected Admin routes for Testimonial management
router.post('/', isAdminAuthenticated, upload.single('image'), createTestimonial);
router.put('/:id', isAdminAuthenticated, upload.single('image'), updateTestimonial);
router.delete('/:id', isAdminAuthenticated, deleteTestimonial);

module.exports = router;
