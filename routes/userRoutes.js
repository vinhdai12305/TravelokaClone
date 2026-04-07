const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Trang login
router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/products');

  res.render('index', {
    activeForm: 'login',
    loginData: null,
    formData: null,
    loginError: null,
    registerError: null
  });
});

// Xử lý đăng ký
router.post('/register', userController.register);

// Xử lý đăng nhập
router.post('/login', userController.login);

// Đăng xuất
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router; // Đừng quên dòng này để app.js có thể require được