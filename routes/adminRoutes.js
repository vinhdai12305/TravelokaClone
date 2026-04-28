const express = require('express');
const router = express.Router();

const adminHotelCtrl = require('../controllers/adminHotelController');
const adminAirportCtrl = require('../controllers/adminAirportController');
const adminCtrl = require('../controllers/adminController');
const adminFlightCtrl = require('../controllers/adminFlightController');

const { isAdmin } = require('../middlewares/adminAuth');

const upload = require('../config/multer');


// ================= DASHBOARD =================

router.get('/', isAdmin, adminCtrl.dashboard);


// ================= HOTELS =================

router.get('/hotels', isAdmin, adminHotelCtrl.index);

router.get('/hotels/create', isAdmin, adminHotelCtrl.create);

router.post(
    '/hotels/create',
    isAdmin,
    upload.single('image'),
    adminHotelCtrl.store
);


// ================= FLIGHTS =================

router.get('/flights', isAdmin, adminFlightCtrl.index);

router.get('/flights/create', isAdmin, adminFlightCtrl.create);

router.post(
    '/flights/create',
    isAdmin,
    adminFlightCtrl.store
);


// ================= AIRPORTS =================

router.get('/airports', isAdmin, adminAirportCtrl.index);

router.get('/airports/create', isAdmin, adminAirportCtrl.create);

router.post(
    '/airports/create',
    isAdmin,
    adminAirportCtrl.store
);

module.exports = router;