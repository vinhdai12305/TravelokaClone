const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const formData = { name, email };

    // 1. Kiểm tra mật khẩu xác nhận có khớp không
    if (password !== confirmPassword) {
      return res.render('index', {
        activeForm: 'register',
        passwordError: 'Mật khẩu xác nhận không khớp!', // Biến mới thêm vào
        registerError: null,
        loginError: null,
        formData,
        loginData: null
      });
    }

    // 2. Kiểm tra email đã tồn tại chưa
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

    // 3. Mã hóa mật khẩu và tạo user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword 
    });

    // 4. Lưu session và chuyển hướng
    req.session.user = { id: user._id, name: user.name, email: user.email };
    res.redirect('/dashboard');

  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).send('Lỗi hệ thống khi đăng ký');
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const loginData = { email };

    // 1. Tìm user theo email
    const user = await User.findOne({ email });
    
    // 2. Kiểm tra user và so sánh mật khẩu bằng bcrypt
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render('index', {
        activeForm: 'login',
        loginError: 'Email hoặc mật khẩu không đúng',
        loginData,
        formData: null,
        registerError: null,
        passwordError: null // Đảm bảo luôn truyền biến này để EJS không lỗi
      });
    }

    // 3. Đăng nhập thành công, lưu session
    req.session.user = { id: user._id, name: user.name, email: user.email };
    res.redirect('/dashboard');

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).send('Lỗi hệ thống khi đăng nhập');
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log('Logout Error:', err);
    res.redirect('/');
  });
};