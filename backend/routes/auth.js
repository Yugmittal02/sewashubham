const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateCustomer, validateAdminLogin } = require('../middleware/validation');

// Customer registration (session-based)
router.post('/customer', validateCustomer, authController.registerCustomer);

// Admin login
router.post('/admin/login', validateAdminLogin, authController.adminLogin);

module.exports = router;
