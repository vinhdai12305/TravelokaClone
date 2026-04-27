// File: middlewares/adminAuth.js

const isAdmin = (req, res, next) => {
    // Kiểm tra xem session có tồn tại, có user đang đăng nhập, và role là 'admin' không
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next(); // Thỏa mãn thì cho đi tiếp vào trang admin
    }
    
    // Nếu không phải admin, đá về trang chủ 
    console.log("Truy cập trái phép vào trang Admin!");
    res.redirect('/');
};

module.exports = { isAdmin };