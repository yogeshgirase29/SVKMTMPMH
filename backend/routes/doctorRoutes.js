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
  toggleDoctorStatus,
  getDoctorLeaves,
  addDoctorLeave,
  updateDoctorLeave,
  deleteDoctorLeave,
  getDoctorAvailability,
  getDoctorCalendarStatus
} = require('../controllers/doctorController');

// Public and admin retrieval routes
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/availability', getDoctorAvailability);
router.get('/:id/calendar', getDoctorCalendarStatus);

// Protected Admin routes for Doctor Management
router.post('/', isAdminAuthenticated, upload.single('image'), createDoctor);
router.put('/:id', isAdminAuthenticated, upload.single('image'), updateDoctor);
router.delete('/:id', isAdminAuthenticated, deleteDoctor);

// Toggle Availability Status
router.patch('/:id/status', isAdminAuthenticated, toggleDoctorStatus);

// Leave Management (Admin protected)
router.get('/:id/leaves', isAdminAuthenticated, getDoctorLeaves);
router.post('/:id/leaves', isAdminAuthenticated, addDoctorLeave);
router.put('/:id/leaves/:leaveId', isAdminAuthenticated, updateDoctorLeave);
router.delete('/:id/leaves/:leaveId', isAdminAuthenticated, deleteDoctorLeave);

module.exports = router;
