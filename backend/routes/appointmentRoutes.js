const express = require('express');
const router = express.Router();
const { isAdminAuthenticated } = require('../middleware/authMiddleware');
const {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentStatus,
  getAvailableSlots
} = require('../controllers/appointmentController');

// Public route to book an appointment (NO authentication required)
router.post('/', createAppointment);

// Public route to check appointment slot availability (NO authentication required)
router.get('/available-slots', getAvailableSlots);

// Public route to check appointment status (NO authentication required)
router.get('/status/:appointmentId', getAppointmentStatus);

// Protected Admin routes for Appointment Management
router.get('/', isAdminAuthenticated, getAllAppointments);
router.get('/:id', isAdminAuthenticated, getAppointmentById);
router.put('/:id', isAdminAuthenticated, updateAppointment);
router.delete('/:id', isAdminAuthenticated, deleteAppointment);

module.exports = router;
