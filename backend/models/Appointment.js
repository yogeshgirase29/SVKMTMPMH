const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  appointmentId: {
    type: String,
    unique: true
  },
  title: {
    type: String,
    required: true,
    enum: ['Mr.', 'Mrs.', 'Miss', 'Ms.', 'Master', 'Dr.', 'Prof.', 'Baby', 'Other'],
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  middleName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  patientName: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  departmentMr: {
    type: String,
    required: true,
    trim: true
  },
  doctor: {
    type: String,
    required: true,
    trim: true
  },
  doctorMr: {
    type: String,
    required: true,
    trim: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentSlot: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

// Compound unique index for active slots
AppointmentSchema.index(
  { doctor: 1, appointmentDate: 1, appointmentSlot: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: 'Cancelled' } } }
);

// Virtual for fullName
AppointmentSchema.virtual('fullName').get(function () {
  const parts = [this.title, this.firstName, this.middleName, this.lastName].filter(p => p && p.trim() !== '');
  return parts.join(' ');
});

// Configure schema to include virtuals in JSON and Object outputs
AppointmentSchema.set('toJSON', { virtuals: true });
AppointmentSchema.set('toObject', { virtuals: true });

const Counter = require('./Counter');

const getISTDateParts = () => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const parts = formatter.formatToParts(now);
  const mm = parts.find(p => p.type === 'month').value;
  const dd = parts.find(p => p.type === 'day').value;
  const yyyy = parts.find(p => p.type === 'year').value;
  const yy = yyyy.slice(-2);
  return `${yy}${mm}${dd}`;
};

const getISTDayBoundaries = (dateInput = new Date()) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const parts = formatter.formatToParts(dateInput);
  const mm = Number(parts.find(p => p.type === 'month').value);
  const dd = Number(parts.find(p => p.type === 'day').value);
  const yyyy = Number(parts.find(p => p.type === 'year').value);

  const startOfISTDay = new Date(Date.UTC(yyyy, mm - 1, dd, 0, 0, 0) - (5.5 * 60 * 60 * 1000));
  const endOfISTDay = new Date(Date.UTC(yyyy, mm - 1, dd, 23, 59, 59, 999) - (5.5 * 60 * 60 * 1000));
  return { startOfISTDay, endOfISTDay };
};

AppointmentSchema.pre('save', async function () {
  // Populate patientName for backwards compatibility
  const nameParts = [this.firstName, this.middleName, this.lastName].filter(p => p && p.trim() !== '');
  this.patientName = nameParts.join(' ');

  // Normalize appointmentDate and dateOfBirth to midnight (00:00:00.000 UTC) in Asia/Kolkata timezone
  if (this.appointmentDate) {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const parts = formatter.formatToParts(this.appointmentDate);
    const mm = parts.find(p => p.type === 'month').value;
    const dd = parts.find(p => p.type === 'day').value;
    const yyyy = parts.find(p => p.type === 'year').value;
    this.appointmentDate = new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd)));
  }

  if (this.dateOfBirth) {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const parts = formatter.formatToParts(this.dateOfBirth);
    const mm = parts.find(p => p.type === 'month').value;
    const dd = parts.find(p => p.type === 'day').value;
    const yyyy = parts.find(p => p.type === 'year').value;
    this.dateOfBirth = new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd)));
  }

  if (!this.appointmentId) {
    const dateStr = getISTDateParts();
    const prefix = `AP${dateStr}`;

    // Initialize counter sequence if not exists by counting pre-existing daily records
    let counter = await Counter.findById(prefix);
    if (!counter) {
      const { startOfISTDay, endOfISTDay } = getISTDayBoundaries();
      const count = await mongoose.model('Appointment').countDocuments({
        createdAt: { $gte: startOfISTDay, $lte: endOfISTDay }
      });

      await Counter.findByIdAndUpdate(
        prefix,
        { $setOnInsert: { seq: count } },
        { returnDocument: 'after', upsert: true }
      );
    }

    counter = await Counter.findByIdAndUpdate(
      prefix,
      { $inc: { seq: 1 } },
      { returnDocument: 'after', upsert: true }
    );

    const sequence = String(counter.seq).padStart(4, '0');
    this.appointmentId = `${prefix}${sequence}`;
  }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);


