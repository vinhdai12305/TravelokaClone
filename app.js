require('dotenv').config();
const express = require('express');
const session = require('express-session');
const connectDB = require('./config/db');
const Product = require('./models/Product');

const app = express();

// Cấu hình View Engine và Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Cấu hình Session (Sử dụng MemoryStore mặc định)
app.use(session({
  secret: process.env.SESSION_SECRET || 'traveloka_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 ngày
}));

// Middleware toàn cục: Đảm bảo header và index luôn có đủ biến, tránh lỗi "is not defined"
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.activeForm = null;
  res.locals.loginData = null;
  res.locals.formData = null;
  res.locals.loginError = null;
  res.locals.registerError = null;
  res.locals.passwordError = null;
  next();
});

// Import Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

// Route Trang chủ: Lấy dữ liệu sản phẩm từ MongoDB và hiển thị
app.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.render('index', { products: products });
  } catch (err) {
    console.error("Lỗi tải trang chủ:", err);
    res.status(500).send("Lỗi Server khi tải sản phẩm");
  }
});

// Route Dashboard: Hiển thị thông tin người dùng
app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/'); // Chưa login thì về trang chủ
  }
  res.render('dashboard', { user: req.session.user });
});

// Sử dụng các Route con
app.use('/users', userRoutes);
app.use('/products', productRoutes);

// Khởi động Server và Kết nối DB
const PORT = process.env.PORT || 3000;
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.error('Lỗi kết nối DB:', error);
  });

// Xử lý lỗi 404
app.use((req, res) => {
  res.status(404).send('Không tìm thấy trang');
});