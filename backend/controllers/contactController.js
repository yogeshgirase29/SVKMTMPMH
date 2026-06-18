const Contact = require('../models/Contact');
const { contactJoiSchema } = require('../validations/schemas');

// Submit a contact message (Public)
const createContact = async (req, res, next) => {
  try {
    const { error } = contactJoiSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { name, mobile, email, message } = req.body;
    const newContact = new Contact({
      name,
      mobile,
      email: email || undefined,
      message
    });

    await newContact.save();
    return res.status(201).json({
      success: true,
      message: 'Message submitted successfully',
      contact: newContact
    });
  } catch (error) {
    next(error);
  }
};

// Get all messages (Admin)
const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: contacts.length,
      contacts
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContact,
  getAllContacts
};
