const express = require('express');
const router = express.Router();
// const User = require('../models/User'); // Import model User của bạn (nếu có)

// ==============================
// 1. HIỂN THỊ TRANG ĐĂNG KÝ
// ==============================
router.get('/register', (req, res) => {
  res.render('users/register'); // Đảm bảo đường dẫn file view này đúng
});

// ==============================
// 2. XỬ LÝ ĐĂNG KÝ (POST)
// ==============================
router.post('/register', async (req, res) => {
  try {
    // VIẾT LOGIC LƯU VÀO DATABASE CỦA BẠN Ở ĐÂY
    // Ví dụ: const newUser = await User.create(req.body);
    
    // Sau khi đăng ký thành công thì chuyển qua trang đăng nhập
    res.redirect('/users/login');
  } catch (error) {
    console.error("Lỗi đăng ký:", error);
    res.redirect('/users/register');
  }
});

// ==============================
// 3. HIỂN THỊ TRANG ĐĂNG NHẬP
// ==============================
router.get('/login', (req, res) => {
  res.render('users/login'); // Đảm bảo đường dẫn file view này đúng
});

// ==============================
// 4. XỬ LÝ ĐĂNG NHẬP (POST)
// ==============================
router.post('/login', async (req, res) => {
  try {
    // VIẾT LOGIC KIỂM TRA MẬT KHẨU TỪ DATABASE CỦA BẠN Ở ĐÂY
    // Ví dụ: const user = await User.findOne({ username: req.body.username });
    // Nếu pass đúng thì lưu thông tin vào session như sau:
    
    // LƯU SESSION (Giả lập user đăng nhập thành công)
    req.session.user = {
      username: req.body.username // Lấy từ form hoặc database
    };

    // Đăng nhập xong đẩy về Trang chủ
    res.redirect('/');
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.redirect('/users/login');
  }
});

// ==============================
// 5. XỬ LÝ ĐĂNG XUẤT (GET)
// ==============================
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Lỗi khi đăng xuất:", err);
      return res.redirect('/');
    }
    // Xóa cookie lưu session trên trình duyệt
    res.clearCookie('connect.sid'); 
    
    // Đá về trang chủ, tự động cập nhật lại header
    res.redirect('/'); 
  });
});

module.exports = router;