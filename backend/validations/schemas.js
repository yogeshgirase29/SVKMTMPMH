const Joi = require('joi');

// Helper to get Indian Standard Time (IST) midnight date
const getISTMidnight = (dateInput) => {
  const d = new Date(dateInput);
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const parts = formatter.formatToParts(d);
  const mm = parts.find(p => p.type === 'month').value;
  const dd = parts.find(p => p.type === 'day').value;
  const yyyy = parts.find(p => p.type === 'year').value;
  return new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd)));
};

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
  image: Joi.string().optional()
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
  title: Joi.string().valid('Mr.', 'Mrs.', 'Miss', 'Ms.', 'Master', 'Dr.', 'Prof.', 'Baby', 'Other').required().messages({
    'any.only': 'Please select a valid title',
    'any.required': 'Patient title is required'
  }),
  firstName: Joi.string().min(2).max(50).pattern(/^[a-zA-Z\s]+$/).required().messages({
    'string.empty': 'First name is required',
    'string.pattern.base': 'First name must contain only alphabets and spaces',
    'string.min': 'First name must be at least 2 characters long',
    'string.max': 'First name cannot exceed 50 characters'
  }),
  middleName: Joi.string().max(50).pattern(/^[a-zA-Z\s]*$/).allow('').optional().messages({
    'string.pattern.base': 'Middle name must contain only alphabets and spaces',
    'string.max': 'Middle name cannot exceed 50 characters'
  }),
  lastName: Joi.string().min(2).max(50).pattern(/^[a-zA-Z\s]+$/).required().messages({
    'string.empty': 'Last name is required',
    'string.pattern.base': 'Last name must contain only alphabets and spaces',
    'string.min': 'Last name must be at least 2 characters long',
    'string.max': 'Last name cannot exceed 50 characters'
  }),
  dateOfBirth: Joi.date().max('now').custom((value, helpers) => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    // Formatting today in Asia/Kolkata
    const partsToday = formatter.formatToParts(new Date());
    const mmToday = partsToday.find(p => p.type === 'month').value;
    const ddToday = partsToday.find(p => p.type === 'day').value;
    const yyyyToday = partsToday.find(p => p.type === 'year').value;
    
    // Formatting birth date in Asia/Kolkata
    const partsBirth = formatter.formatToParts(value);
    const mmBirth = partsBirth.find(p => p.type === 'month').value;
    const ddBirth = partsBirth.find(p => p.type === 'day').value;
    const yyyyBirth = partsBirth.find(p => p.type === 'year').value;
    
    let age = Number(yyyyToday) - Number(yyyyBirth);
    const m = Number(mmToday) - Number(mmBirth);
    if (m < 0 || (m === 0 && Number(ddToday) < Number(ddBirth))) {
      age--;
    }
    
    if (age < 0 || age > 120) {
      return helpers.message('Patient age must be between 0 and 120 years.');
    }
    return value;
  }).required().messages({
    'any.required': 'Date of birth is required',
    'date.max': 'Date of birth cannot be in the future',
    'date.base': 'Please enter a valid date of birth'
  }),
  age: Joi.number().min(0).max(120).required().messages({
    'any.required': 'Age is required',
    'number.min': 'Age must be between 0 and 120',
    'number.max': 'Age must be between 0 and 120'
  }),
  mobile: Joi.string().pattern(/^[6-9]\d{9}$/).required().messages({
    'string.empty': 'Mobile number is required',
    'string.pattern.base': 'Please enter a valid 10-digit Indian mobile number starting with 6-9'
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
  appointmentDate: Joi.date().custom((value, helpers) => {
    const todayIST = getISTMidnight(new Date());
    const bookingDateIST = getISTMidnight(value);

    const diffTime = bookingDateIST.getTime() - todayIST.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return helpers.message('Past dates are not allowed.');
    }
    if (diffDays > 90) {
      return helpers.message('Booking is only allowed for the next 90 days.');
    }
    return value;
  }).required().messages({
    'any.required': 'Appointment date is required',
    'date.base': 'Please enter a valid date'
  }),
  appointmentSlot: Joi.string().required().messages({
    'string.empty': 'Appointment slot is required'
  }),
  message: Joi.string().max(500).allow('').optional().messages({
    'string.max': 'Special instructions cannot exceed 500 characters'
  }),
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
