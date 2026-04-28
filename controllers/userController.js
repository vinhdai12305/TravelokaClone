const bcrypt = require('bcrypt');
const User = require('../models/User');
const Booking = require('../models/Booking');

exports.register = async (req, res) => {
  try {

    const { username, email, password, confirmPassword } = req.body;

    console.log("BODY:", req.body);

    const formData = { username, email };

    console.log("👉 Đang xử lý đăng ký cho:", email);

    // Kiểm tra xác nhận mật khẩu
    if (password !== confirmPassword) {
      return res.render('index', {
        activeForm: 'register',
        passwordError: 'Mật khẩu xác nhận không khớp!',
        registerError: null,
        loginError: null,
        formData,
        loginData: null
      });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.render('index', {
        activeForm: 'register',
        registerError: 'Email này đã được sử dụng!',
        passwordError: null,
        formData,
        loginData: null,
        loginError: null
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user
    const user = await User.create({
      name: username,
      email: email,
      password: hashedPassword,
      role: 'user'
    });

    // ===== DEBUG =====
    console.log("✅ USER CREATED:", user);
    console.log("📁 COLLECTION:", User.collection.name);
    console.log("🗄️ DATABASE:", User.db.name);

    // Lưu session
    req.session.user = {
      id: user._id,
      username: user.name,
      email: user.email,
      role: user.role
    };

    res.redirect('/');

  } catch (error) {

    console.error("❌ REGISTER ERROR:", error);

    res.status(500).send('Lỗi hệ thống khi đăng ký');
  }
};

exports.login = async (req, res) => {
  try {

    const { username, password } = req.body;

    const loginData = { username };

    const user = await User.findOne({
      $or: [
        { email: username },
        { name: username }
      ]
    });

    // Sai tài khoản
    if (!user || !(await bcrypt.compare(password, user.password))) {

      return res.render('index', {
        activeForm: 'login',
        loginError: 'Tên đăng nhập/Email hoặc mật khẩu không đúng',
        loginData,
        formData: null,
        registerError: null,
        passwordError: null
      });
    }

    // Session
    req.session.user = {
      id: user._id,
      username: user.name,
      email: user.email,
      role: user.role
    };

    res.redirect('/');

  } catch (error) {

    console.error('❌ Login Error:', error);

    res.status(500).send('Lỗi hệ thống khi đăng nhập');
  }
};

exports.logout = (req, res) => {

  req.session.destroy((err) => {

    if (err) {
      console.log('❌ Logout Error:', err);
    }

    res.clearCookie('connect.sid');

    res.redirect('/');
  });
};

// ================= MORE MENU =================

// Flight History
exports.getFlightHistory = (req, res) => {

  if (!req.session.user) {
    return res.redirect('/');
  }

  res.render('users/flight-history', {
    user: req.session.user
  });
};

exports.getBookingHistory = async (req, res) => {

    try {

        const bookings = await Booking.find()
            .sort({ createdAt: -1 });

        res.render('users/booking-history', {
            bookings,
            user: req.session?.user || null
        });

    } catch (error) {

        console.log(error);

        res.status(500).send('Lỗi server');
    }
};

// Settings
exports.getSettings = (req, res) => {

  if (!req.session.user) {
    return res.redirect('/');
  }

  res.render('users/settings', {
    user: req.session.user
  });
};

