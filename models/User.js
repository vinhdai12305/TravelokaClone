const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // 👇 THÊM TRƯỜNG ROLE NÀY VÀO:
  role: { 
    type: String, 
    default: 'user', // Mặc định đăng ký mới sẽ là user thường
    enum: ['user', 'admin'] // Giới hạn chỉ nhận 1 trong 2 giá trị này cho an toàn
  }
}, { timestamps: true }); // timestamps để tự động có createdAt và updatedAt

module.exports = mongoose.model('User', userSchema);