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
  searchAppointment,
  updateAppointmentStatus,
  getAvailableSlots,
  getAppointmentPdf
} = require('../controllers/appointmentController');

// Public route to book an appointment (NO authentication required)
router.post('/', createAppointment);

// Public route to check appointment slot availability (NO authentication required)
router.get('/available-slots', getAvailableSlots);

// Public route to check appointment status by ID (NO authentication required)
router.get('/status/:appointmentId', getAppointmentStatus);

// Public route to search appointment (NO authentication required, query param search)
router.get('/search', searchAppointment);

// Public route to download appointment confirmation PDF (NO authentication required, needed immediately after booking)
router.get('/:id/pdf', getAppointmentPdf);

// Protected Admin routes for Appointment Management
router.get('/', isAdminAuthenticated, getAllAppointments);
router.get('/:id', isAdminAuthenticated, getAppointmentById);
router.patch('/:id/status', isAdminAuthenticated, updateAppointmentStatus);
router.put('/:id', isAdminAuthenticated, updateAppointment);
router.delete('/:id', isAdminAuthenticated, deleteAppointment);

module.exports = router;

