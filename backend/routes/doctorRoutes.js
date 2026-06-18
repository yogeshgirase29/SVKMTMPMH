const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudConfig/cloudinary');
const upload = multer({ storage });
const { isAdminAuthenticated } = require('../middleware/authMiddleware');
const {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  toggleDoctorStatus
} = require('../controllers/doctorController');

// Public and admin retrieval routes
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);

// Protected Admin routes for Doctor Management
router.post('/', isAdminAuthenticated, upload.single('image'), createDoctor);
router.put('/:id', isAdminAuthenticated, upload.single('image'), updateDoctor);
router.delete('/:id', isAdminAuthenticated, deleteDoctor);

// Toggle Availability Status
router.patch('/:id/status', isAdminAuthenticated, toggleDoctorStatus);

module.exports = router;
