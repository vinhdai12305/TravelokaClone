const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middlewares/adminAuth');

router.get('/dashboard', isAdmin, (req, res) => {
    // Sửa chữ 'dashboard' thành 'admin/dashboard'
    res.render('admin/dashboard', { 
        user: req.session.user
    }); 
});

module.exports = router;