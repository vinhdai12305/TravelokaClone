require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const connectDB = require('./config/db');

// Import Models
const Product = require('./models/Product');
const Hotel = require('./models/Hotel'); 

const app = express();

// 1. Cấu hình View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Middleware cơ bản
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// 3. Cấu hình Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'traveloka_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 ngày
}));

// 4. Middleware toàn cục (Global Variables cho EJS)
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

// 5. Định nghĩa Routes chính
const userRoutes = require('./routes/userRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const productRoutes = require('./routes/productRoutes');
const flightRoutes = require('./routes/flightRoutes');
const locationRoutes = require('./routes/locationRoutes');
const homeRoutes = require('./routes/homeRoutes');

// 👉 THÊM DÒNG NÀY: Import Route của Admin
const adminRoutes = require('./routes/adminRoutes'); 

// (Đã xóa đoạn app.get('/dashboard' cũ ở đây để chuyển quyền quản lý cho adminRoutes)

// 6. Sử dụng Routes con
app.use('/', homeRoutes);        // Trang chủ
app.use('/hotels', hotelRoutes); // Trang hotels
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/flight', flightRoutes);    
app.use('/locations', locationRoutes);
app.use('/api/flight', flightRoutes);    

// 👉 THÊM DÒNG NÀY: Khai báo tiền tố /admin cho tất cả các route của Admin
app.use('/admin', adminRoutes);

// 7. Xử lý lỗi 404
app.use((req, res) => {
    res.status(404).send('Không tìm thấy trang');
});

// 8. Kết nối Database và Khởi động Server
const PORT = process.env.PORT || 3000;
connectDB()
    .then(() => {
        app.listen(PORT, () => {
           console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Lỗi kết nối DB:', error);
    });