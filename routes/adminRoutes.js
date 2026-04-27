const express = require('express');
const router = express.Router();

const adminHotelCtrl = require('../controllers/adminHotelController');
const adminAirportCtrl = require('../controllers/adminAirportController');
const adminCtrl = require('../controllers/adminController');

const upload = require('../config/multer');


// ================= DASHBOARD =================

router.get('/', adminCtrl.dashboard);



// ================= HOTELS =================

router.get('/hotels', adminHotelCtrl.index);

router.get('/hotels/create', adminHotelCtrl.create);

router.post(
    '/hotels/create',
    upload.single('image'),
    adminHotelCtrl.store
);



// ================= AIRPORTS =================

router.get('/airports', adminAirportCtrl.index);

router.get('/airports/create', adminAirportCtrl.create);

router.post(
    '/airports/create',
    adminAirportCtrl.store
);

module.exports = router;