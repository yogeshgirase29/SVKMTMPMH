const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const isAdminAuthenticated = async (req, res, next) => {
  // Session authentication fallback
  if (req.isAuthenticated()) {
    return next();
  }

  // JWT authentication
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hospitalSessionSecret123!');
      
      const admin = await Admin.findById(decoded.id);
      if (admin) {
        req.user = admin;
        return next();
      }
    }
  } catch (error) {
    console.error('JWT authentication error:', error);
  }

  return res.status(401).json({
    success: false,
    message: 'Access denied. Unauthorized. Please log in as Admin.'
  });
};

module.exports = {
  isAdminAuthenticated
};
