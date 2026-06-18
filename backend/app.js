const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStoreObj = require('connect-mongo');
const MongoStore = MongoStoreObj.default || MongoStoreObj.MongoStore;
const passport = require('passport');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const contactRoutes = require('./routes/contactRoutes');
const newsRoutes = require('./routes/newsRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const statsRoutes = require('./routes/statsRoutes');
const galleryRoutes = require('./routes/galleryRoutes');

// Import models for passport
const Admin = require('./models/Admin');

const app = express();

// Enable CORS
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
if (process.env.FRONTEND_URL && !allowedOrigins.includes(process.env.FRONTEND_URL)) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Flash messages (often used for server-side views, but initialized as requested)
app.use(flash());

// Express Session configuration with MongoDB storage
app.use(session({
  secret: process.env.SESSION_SECRET || 'hospitalSessionSecret123!',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hospitalDB',
    ttl: 14 * 24 * 60 * 60 // 14 days
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    httpOnly: true,
    secure: false // Set to true if using HTTPS in production
  }
}));

// Initialize Passport and Session
app.use(passport.initialize());
app.use(passport.session());

// Passport Strategy Configuration using passport-local-mongoose
passport.use(Admin.createStrategy());
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

// Mount API Routes
app.use('/admin', adminRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/gallery', galleryRoutes);

// Custom 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
