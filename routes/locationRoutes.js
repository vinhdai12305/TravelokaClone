const express = require('express');
const router = express.Router();
const locationCtrl = require('../controllers/locationController');

router.get('/search', locationCtrl.search);

module.exports = router;