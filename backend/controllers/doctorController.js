const Doctor = require('../models/Doctor');
const { doctorJoiSchema } = require('../validations/schemas');
const cloudinary = require('cloudinary').v2;

// Get all doctors.
// Public users get only available doctors (?available=true).
const getAllDoctors = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.available === 'true') {
      filter.available = true;
    }
    const doctors = await Doctor.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: doctors.length,
      doctors
    });
  } catch (error) {
    next(error);
  }
};

// Get a single doctor details
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    return res.status(200).json({ success: true, doctor });
  } catch (error) {
    next(error);
  }
};

// Add a new doctor
const createDoctor = async (req, res, next) => {
  try {
    // Parse nested objects from string if sent as FormData
    ['doctorName', 'specialization', 'qualification', 'experience'].forEach(field => {
      if (typeof req.body[field] === 'string') {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (e) {
          // Keep as string and let Joi validation catch issues
        }
      }
    });

    // Validate Joi schema (exclude image from Joi validation if it is sent as file)
    const { error } = doctorJoiSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    // Verify image file upload
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Doctor image is required' });
    }

    const { doctorName, specialization, qualification, experience, department, available } = req.body;

    const newDoctor = new Doctor({
      doctorName,
      specialization,
      qualification,
      experience,
      department,
      image: req.file.path, // Cloudinary secure URL
      available: available === undefined ? true : available === 'true' || available === true
    });

    await newDoctor.save();

    return res.status(201).json({
      success: true,
      message: 'Doctor added successfully',
      doctor: newDoctor
    });
  } catch (error) {
    next(error);
  }
};

// Update existing doctor
const updateDoctor = async (req, res, next) => {
  try {
    // Parse nested objects from string if sent as FormData
    ['doctorName', 'specialization', 'qualification', 'experience'].forEach(field => {
      if (typeof req.body[field] === 'string') {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (e) {
          // Keep as string and let Joi validation catch issues
        }
      }
    });

    const { error } = doctorJoiSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const { doctorName, specialization, qualification, experience, department, available } = req.body;

    doctor.doctorName = doctorName;
    doctor.specialization = specialization;
    doctor.qualification = qualification;
    doctor.experience = experience;
    doctor.department = department;
    
    if (available !== undefined) {
      doctor.available = available === 'true' || available === true;
    }

    // If new image is uploaded, update URL and optionally delete old image from Cloudinary
    if (req.file) {
      // Old image URL path parsing for deletion (optional but clean)
      if (doctor.image) {
        try {
          const publicId = doctor.image.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`hospital-doctors/${publicId}`);
        } catch (err) {
          console.error('Failed to delete old image from Cloudinary:', err);
        }
      }
      doctor.image = req.file.path;
    }

    await doctor.save();

    return res.status(200).json({
      success: true,
      message: 'Doctor updated successfully',
      doctor
    });
  } catch (error) {
    next(error);
  }
};

// Delete a doctor
const deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Delete image from Cloudinary
    if (doctor.image) {
      try {
        const publicId = doctor.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`hospital-doctors/${publicId}`);
      } catch (err) {
        console.error('Failed to delete image from Cloudinary:', err);
      }
    }

    await Doctor.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Toggle availability status (PATCH /api/doctors/:id/status)
const toggleDoctorStatus = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    doctor.available = !doctor.available;
    await doctor.save();

    return res.status(200).json({
      success: true,
      message: `Doctor status updated to ${doctor.available ? 'Available' : 'Unavailable'}`,
      available: doctor.available,
      doctor
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  toggleDoctorStatus
};
