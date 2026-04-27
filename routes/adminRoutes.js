const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const { isAdmin } = require('../middlewares/adminAuth');

router.get('/dashboard', isAdmin, (req, res) => {
    // Sửa chữ 'dashboard' thành 'admin/dashboard'
    res.render('admin/dashboard', { 
        user: req.session.user
    }); 
});
=======

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


>>>>>>> eb09cd2 (update admin page (Airpod/Hotel))

module.exports = router;