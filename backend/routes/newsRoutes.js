const express = require('express');
const router = express.Router();
const multer = require('multer');
const { newsStorage } = require('../cloudConfig/cloudinary');
const upload = multer({ storage: newsStorage });
const { isAdminAuthenticated } = require('../middleware/authMiddleware');
const {
  getAllNews,
  createNews,
  updateNews,
  deleteNews
} = require('../controllers/newsController');

// Public route to view news
router.get('/', getAllNews);

// Protected Admin routes for News management
router.post('/', isAdminAuthenticated, upload.single('image'), createNews);
router.put('/:id', isAdminAuthenticated, upload.single('image'), updateNews);
router.delete('/:id', isAdminAuthenticated, deleteNews);

module.exports = router;
