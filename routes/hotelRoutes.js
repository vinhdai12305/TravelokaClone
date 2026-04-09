const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');

// CHỈ GIỮ LẠI ROUTE NÀY
router.get('/', hotelController.getHomePage);

module.exports = router;