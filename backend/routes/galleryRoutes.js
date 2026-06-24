const express = require('express');
const router = express.Router();
const multer = require('multer');
const { galleryStorage } = require('../cloudConfig/cloudinary');
const upload = multer({ storage: galleryStorage });
const { isAdminAuthenticated } = require('../middleware/authMiddleware');
const {
  getAllGallery,
  createGallery,
  deleteGallery,
  updateGallery
} = require('../controllers/galleryController');

// Public route to view gallery
router.get('/', getAllGallery);

// Protected Admin routes for Gallery management
router.post('/', isAdminAuthenticated, upload.single('image'), createGallery);
router.put('/:id', isAdminAuthenticated, upload.single('image'), updateGallery);
router.delete('/:id', isAdminAuthenticated, deleteGallery);

module.exports = router;
