const passport = require('passport');

// Admin Login is typically handled directly in the route via passport.authenticate,
// but we will expose a controller method to check auth and handle logout.
const loginAdmin = (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Admin logged in successfully',
    admin: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email
    }
  });
};

const logoutAdmin = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie('connect.sid'); // Clear session cookie
      return res.status(200).json({
        success: true,
        message: 'Admin logged out successfully'
      });
    });
  });
};

const checkAuth = (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({
      success: true,
      authenticated: true,
      admin: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email
      }
    });
  }
  return res.status(200).json({
    success: false,
    authenticated: false,
    message: 'Not authenticated'
  });
};

module.exports = {
  loginAdmin,
  logoutAdmin,
  checkAuth
};
