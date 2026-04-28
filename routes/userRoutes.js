const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// ================= AUTH =================

// Register
router.post('/register', userController.register);

// Login
router.post('/login', userController.login);

// Logout
router.get('/logout', userController.logout);

// ================= USER PAGES =================

// Flight History
router.get('/flight-history', userController.getFlightHistory);

// Booking History
router.get('/booking-history', userController.getBookingHistory);

// Settings
router.get('/settings', userController.getSettings);

module.exports = router;