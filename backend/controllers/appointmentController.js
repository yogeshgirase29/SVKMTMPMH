const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { appointmentJoiSchema } = require('../validations/schemas');

// Get all appointments (Admin search and filtering)
const getAllAppointments = async (req, res, next) => {
  try {
    const { search, status, department, doctor, date } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { appointmentId: { $regex: search, $options: 'i' } },
        { patientName: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (department && department !== 'All') {
      query.department = department;
    }

    if (doctor && doctor !== 'All') {
      query.doctor = doctor;
    }

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.appointmentDate = { $gte: start, $lte: end };
    }

    const appointments = await Appointment.find(query).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    next(error);
  }
};

// Get a single appointment details
const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    return res.status(200).json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
};

// Create a new appointment (Public or Admin booking)
const createAppointment = async (req, res, next) => {
  try {
    const { error } = appointmentJoiSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { 
      patientName, 
      mobile, 
      email, 
      department, 
      departmentMr, 
      doctor, 
      doctorMr, 
      appointmentDate, 
      appointmentSlot, 
      message, 
      status 
    } = req.body;

    // Prevent double booking for the same doctor, date, and slot
    const selectedDate = new Date(appointmentDate);
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);

    const doubleBooked = await Appointment.findOne({
      doctor,
      appointmentDate: { $gte: start, $lte: end },
      appointmentSlot,
      status: { $ne: 'Cancelled' }
    });

    if (doubleBooked) {
      return res.status(400).json({
        success: false,
        message: 'This slot is already booked for this doctor on this day. Please select a different slot.'
      });
    }

    const newAppointment = new Appointment({
      patientName,
      mobile,
      email: email || undefined,
      department,
      departmentMr,
      doctor,
      doctorMr,
      appointmentDate,
      appointmentSlot,
      message: message || '',
      status: status || 'Pending'
    });

    await newAppointment.save();

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment: newAppointment
    });
  } catch (error) {
    next(error);
  }
};

// Update appointment details (e.g. Confirm, Cancel, or Complete)
const updateAppointment = async (req, res, next) => {
  try {
    const { status, doctor, department, appointmentDate, appointmentSlot, message } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Double booking protection if rescheduling slot, doctor or date
    const checkDoctor = doctor || appointment.doctor;
    const checkDate = appointmentDate ? new Date(appointmentDate) : appointment.appointmentDate;
    const checkSlot = appointmentSlot || appointment.appointmentSlot;

    if (appointmentDate || appointmentSlot || doctor) {
      const start = new Date(checkDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(checkDate);
      end.setHours(23, 59, 59, 999);

      const doubleBooked = await Appointment.findOne({
        _id: { $ne: appointment._id },
        doctor: checkDoctor,
        appointmentDate: { $gte: start, $lte: end },
        appointmentSlot: checkSlot,
        status: { $ne: 'Cancelled' }
      });

      if (doubleBooked) {
        return res.status(400).json({
          success: false,
          message: 'This slot is already booked for this doctor on this day. Rescheduling failed.'
        });
      }
    }

    if (status) appointment.status = status;
    if (doctor) appointment.doctor = doctor;
    if (department) appointment.department = department;
    if (appointmentDate) appointment.appointmentDate = appointmentDate;
    if (appointmentSlot) appointment.appointmentSlot = appointmentSlot;
    if (message !== undefined) appointment.message = message;

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      appointment
    });
  } catch (error) {
    next(error);
  }
};

// Delete an appointment
const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get appointment status by appointment number (Public endpoint)
const getAppointmentStatus = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await Appointment.findOne({ appointmentId: appointmentId.trim().toUpperCase() });
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found with this ID' });
    }
    return res.status(200).json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
};

// Get available slots for a doctor on a specific date
const getAvailableSlots = async (req, res, next) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) {
      return res.status(400).json({ success: false, message: 'Doctor ID and Date are required.' });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date format.' });
    }

    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      doctor: doctor.doctorName.en,
      appointmentDate: { $gte: start, $lte: end },
      status: { $ne: 'Cancelled' }
    });

    const bookedSlots = appointments.map(app => app.appointmentSlot);

    const allSlots = [
      '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
      '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
      '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
      '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
      '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
    ];

    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    return res.status(200).json({
      success: true,
      doctorId,
      date,
      slots: availableSlots
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentStatus,
  getAvailableSlots
};
