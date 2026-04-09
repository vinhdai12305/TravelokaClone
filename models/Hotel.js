// models/Hotel.js
const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true }, // Tạm thời dùng link ảnh (URL) cho dễ nhé
    price: { type: String, required: true },
    oldPrice: { type: String }
});

module.exports = mongoose.model('Hotel', hotelSchema);