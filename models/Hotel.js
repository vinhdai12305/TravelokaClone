const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: String,
    location: String,
    image: String,
    stars: Number,
    rating: Number,
    reviewCount: String,
    discountPrice: Number,
    tag: String,
    type: String
});

// THIẾU DÒNG NÀY LÀ TRẮNG TRANG:
module.exports = mongoose.model('Hotel', hotelSchema);