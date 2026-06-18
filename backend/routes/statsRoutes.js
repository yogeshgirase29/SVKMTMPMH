const express = require('express');
const router = express.Router();
const { isAdminAuthenticated } = require('../middleware/authMiddleware');
const { getStats, updateStats } = require('../controllers/statsController');

// Public route to view stats
router.get('/', getStats);

// Protected Admin route to update stats
router.put('/', isAdminAuthenticated, updateStats);

module.exports = router;
