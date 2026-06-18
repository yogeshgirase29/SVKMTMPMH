const Joi = require('joi');

const localizedStringSchema = Joi.object({
  en: Joi.string().required().messages({
    'any.required': 'English version is required',
    'string.empty': 'English version is required'
  }),
  mr: Joi.string().required().messages({
    'any.required': 'Marathi version is required',
    'string.empty': 'Marathi version is required'
  })
});

const doctorJoiSchema = Joi.object({
  doctorName: localizedStringSchema,
  specialization: localizedStringSchema,
  qualification: localizedStringSchema,
  experience: localizedStringSchema,
  department: Joi.string().required().messages({
    'string.empty': 'Department is required'
  }),
  available: Joi.boolean().default(true),
  image: Joi.string().optional() // Can be optional if handled via Multer upload
});

const departmentJoiSchema = Joi.object({
  departmentName: localizedStringSchema,
  description: Joi.object({
    en: Joi.string().allow('').optional(),
    mr: Joi.string().allow('').optional()
  }).optional(),
  icon: Joi.string().allow('').default('Activity'),
  image: Joi.string().optional()
});

const appointmentJoiSchema = Joi.object({
  patientName: Joi.string().required().messages({
    'string.empty': 'Patient name is required'
  }),
  mobile: Joi.string().pattern(/^[0-9+\s-]{10,15}$/).required().messages({
    'string.empty': 'Mobile number is required',
    'string.pattern.base': 'Please enter a valid mobile number'
  }),
  email: Joi.string().email().allow('').optional().messages({
    'string.email': 'Please enter a valid email address'
  }),
  department: Joi.string().required().messages({
    'string.empty': 'Department is required'
  }),
  departmentMr: Joi.string().required().messages({
    'string.empty': 'Marathi department name is required'
  }),
  doctor: Joi.string().required().messages({
    'string.empty': 'Doctor is required'
  }),
  doctorMr: Joi.string().required().messages({
    'string.empty': 'Marathi doctor name is required'
  }),
  appointmentDate: Joi.date().iso().required().messages({
    'any.required': 'Appointment date is required',
    'date.base': 'Please enter a valid date'
  }),
  appointmentSlot: Joi.string().required().messages({
    'string.empty': 'Appointment slot is required'
  }),
  message: Joi.string().allow('').optional(),
  status: Joi.string().valid('Pending', 'Confirmed', 'Completed', 'Cancelled').default('Pending')
});

const contactJoiSchema = Joi.object({
  name: Joi.string().required().messages({ 'string.empty': 'Name is required' }),
  mobile: Joi.string().pattern(/^[0-9+\s-]{10,15}$/).required().messages({
    'string.empty': 'Mobile number is required',
    'string.pattern.base': 'Please enter a valid mobile number'
  }),
  email: Joi.string().email().allow('').optional(),
  message: Joi.string().required().messages({ 'string.empty': 'Message is required' })
});

const newsJoiSchema = Joi.object({
  title: localizedStringSchema,
  description: localizedStringSchema,
  image: Joi.string().optional(),
  date: Joi.date().iso().optional()
});

const testimonialJoiSchema = Joi.object({
  patientName: Joi.string().required().messages({ 'string.empty': 'Patient name is required' }),
  feedback: Joi.string().required().messages({ 'string.empty': 'Feedback is required' }),
  rating: Joi.number().min(1).max(5).required(),
  image: Joi.string().optional()
});

const galleryJoiSchema = Joi.object({
  title: Joi.string().required().messages({ 'string.empty': 'Title is required' }),
  image: Joi.string().optional(),
  category: Joi.string().valid('Hospital', 'Events', 'Equipment', 'Facilities').required()
});

const statsJoiSchema = Joi.object({
  beds: Joi.number().required(),
  doctors: Joi.number().required(),
  campusArea: Joi.string().required(),
  emergencyStatus: Joi.string().required()
});

module.exports = {
  doctorJoiSchema,
  departmentJoiSchema,
  appointmentJoiSchema,
  contactJoiSchema,
  newsJoiSchema,
  testimonialJoiSchema,
  galleryJoiSchema,
  statsJoiSchema
};
