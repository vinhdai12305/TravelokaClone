const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    const formData = { username, email };

    console.log("👉 Đang xử lý đăng ký cho:", email); // Log để kiểm tra có nhận được data không

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

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Tạo user và lưu vào DB
    const user = await User.create({ 
      name: username,  
      email: email, 
      password: hashedPassword,
      role: 'user' // Ghi chú rõ ràng role khi tạo mới
    });

    console.log("✅ Đã lưu thành công vào MongoDB:", user.email);

    // 👇 CHỖ NÀY QUAN TRỌNG: Phải kèm theo role: user.role vào session
    req.session.user = { 
        id: user._id, 
        username: user.name, 
        email: user.email,
        role: user.role 
    };
    res.redirect('/dashboard');

  } catch (error) {
    console.error('❌ Register Error:', error); // Sẽ in ra Terminal nếu MongoDB từ chối
    res.status(500).send('Lỗi hệ thống khi đăng ký');
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const loginData = { username };

    const user = await User.findOne({ 
      $or: [ { email: username }, { name: username } ] 
    });
    
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

    // 👇 CẬP NHẬT Ở ĐÂY NỮA: Thêm role vào session lúc đăng nhập
    req.session.user = { 
        id: user._id, 
        username: user.name, 
        email: user.email,
        role: user.role 
    };
    res.redirect('/dashboard');

  } catch (error) {
    console.error('❌ Login Error:', error);
    res.status(500).send('Lỗi hệ thống khi đăng nhập');
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log('Logout Error:', err);
    res.clearCookie('connect.sid'); // Đảm bảo xóa sạch cookie (như fen đã viết ở route trước)
    res.redirect('/');
  });
};
// --- CÁC TRANG MENU MORE ---

exports.getFlightHistory = (req, res) => {
  // Nếu chưa đăng nhập thì đá văng ra trang chủ
  if (!req.session.user) return res.redirect('/'); 
  
  res.render('users/flight-history', { user: req.session.user });
};

exports.getBookingHistory = (req, res) => {
  if (!req.session.user) return res.redirect('/');
  res.render('users/booking-history', { user: req.session.user });
};

exports.getSettings = (req, res) => {
  if (!req.session.user) return res.redirect('/');
  res.render('users/settings', { user: req.session.user });
};