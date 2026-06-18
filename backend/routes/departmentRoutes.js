const express = require('express');
const router = express.Router();
const multer = require('multer');
const { departmentStorage } = require('../cloudConfig/cloudinary');
const upload = multer({ storage: departmentStorage });
const { isAdminAuthenticated } = require('../middleware/authMiddleware');
const {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');

// Public and admin retrieval route
router.get('/', getAllDepartments);

// Protected Admin routes for Department Management
router.post('/', isAdminAuthenticated, upload.single('image'), createDepartment);
router.put('/:id', isAdminAuthenticated, upload.single('image'), updateDepartment);
router.delete('/:id', isAdminAuthenticated, deleteDepartment);

module.exports = router;
