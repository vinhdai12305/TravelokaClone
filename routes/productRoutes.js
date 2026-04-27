const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        
        // Khắc phục lỗi "user is not defined" bằng cách truyền user từ session
        res.render('index', { 
            products: products, 
            user: req.session.user || null, // Nếu không có session, user sẽ là null
            activeForm: null,
            loginError: null,
            registerError: null,
            formData: {},
            loginData: {}
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Lỗi Server");
    }
});

module.exports = router;