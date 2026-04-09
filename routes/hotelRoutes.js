const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');

// ✅ Trang danh sách hotels
router.get('/', hotelController.getHotelList);

module.exports = router;