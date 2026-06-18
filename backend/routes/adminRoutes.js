const express = require('express');
const router = express.Router();
const passport = require('passport');
const { loginAdmin, logoutAdmin, checkAuth } = require('../controllers/adminController');

// Admin Login route using Passport Local Strategy
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({
        success: false,
        message: info ? info.message : 'Invalid username or password'
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return loginAdmin(req, res);
    });
  })(req, res, next);
});

// Admin Logout route
router.post('/logout', logoutAdmin);

// Fetch current admin authentication status
router.get('/current-admin', checkAuth);

module.exports = router;
