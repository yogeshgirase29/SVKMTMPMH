const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  appointmentId: {
    type: String,
    unique: true
  },
  patientName: {
    type: String,
    required: true,
    trim: true
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
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

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

AppointmentSchema.pre('save', async function () {
  if (!this.appointmentId) {
    const dateStr = getISTDateParts();
    const prefix = `AP${dateStr}`;

    // Initialize counter sequence if not exists by counting pre-existing daily records
    let counter = await Counter.findById(prefix);
    if (!counter) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      const count = await mongoose.model('Appointment').countDocuments({
        createdAt: { $gte: todayStart, $lte: todayEnd }
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

