const express = require('express');
const router = express.Router();
const { isAdminAuthenticated } = require('../middleware/authMiddleware');
const { createContact, getAllContacts, deleteContact } = require('../controllers/contactController');

// Public route to submit messages
router.post('/', createContact);

// Protected Admin route to list messages
router.get('/', isAdminAuthenticated, getAllContacts);

// Protected Admin route to delete a message
router.delete('/:id', isAdminAuthenticated, deleteContact);

module.exports = router;
