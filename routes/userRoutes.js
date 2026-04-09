const express = require('express');
const router = express.Router();
// Nhớ import Model của fen vào đây (nếu có dùng DB)
// const User = require('../models/User'); 

// 1. XỬ LÝ ĐĂNG KÝ (POST)
router.post('/register', async (req, res) => {
  try {
    // Lấy đúng tên các trường từ file header.ejs của fen
    const { username, email, password } = req.body;

    // --- LOGIC LƯU DATABASE CỦA FEN Ở ĐÂY ---
    // Ví dụ: 
    // const newUser = new User({ username, email, password });
    // await newUser.save();
    // ----------------------------------------

    // Đăng ký thành công thì tự động lưu vào phiên (session) luôn
    req.session.user = {
      username: username, // BẮT BUỘC có trường này để in ra chữ Xin chào, ...!
      email: email
    };

    // Chuyển hướng về trang chủ sau khi đăng ký thành công
    res.redirect('/');
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    // Render lại trang chủ kèm mảng products rỗng để tránh lỗi trắng màn hình
    res.render('index', { 
      products: [], 
      user: req.session ? req.session.user : null
    });
  }
});

// 2. XỬ LÝ ĐĂNG NHẬP (POST)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // --- LOGIC TÌM USER TRONG DATABASE Ở ĐÂY ---
    // Ví dụ:
    // const existingUser = await User.findOne({ username: username, password: password });
    // if (!existingUser) throw new Error("Sai thông tin");
    // -------------------------------------------

    // Đăng nhập thành công -> Lưu thông tin vào session
    req.session.user = {
      // Giả lập lấy đúng username người dùng vừa nhập gán vào session
      // (Nếu có DB thì thay bằng: username: existingUser.username)
      username: username 
    };

    // Chuyển hướng về trang chủ
    res.redirect('/');
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    // Render lại kèm biến products để ko bị lỗi trang trắng
    res.render('index', { 
      products: [], 
      user: req.session ? req.session.user : null
    });
  }
});

// 3. ĐĂNG XUẤT (GET)
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log("Lỗi khi đăng xuất:", err);
    res.clearCookie('connect.sid'); // Xoá cookie session
    res.redirect('/'); // Trở về trang chủ
  });
});

module.exports = router;