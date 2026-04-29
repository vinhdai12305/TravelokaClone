const express = require('express');
const router = express.Router();

const FlightBooking = require('../models/FlightBooking');

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
router.get('/flight-history', async (req,res)=>{

    try{

        const bookings = await FlightBooking
            .find()
            .sort({ createdAt:-1 });

        res.render('users/flight-history',{

            bookings,
            user:req.session?.user || null

        });

    }catch(error){

        console.log(error);

        res.send('Lỗi server');

    }

});

// Hotel Booking History
router.get('/booking-history', userController.getBookingHistory);

// Settings
router.get('/settings', userController.getSettings);

module.exports = router;