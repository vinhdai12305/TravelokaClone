const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// 👉 Trang chủ
router.get('/', homeController.index);

module.exports = router;