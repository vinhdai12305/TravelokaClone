const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true },
    description: String,
    
    // ✅ PHẢI CÓ CÁC FIELD NÀY
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    stars: { type: Number, default: 0 },
    
    // Giá
    price: { type: Number, default: 0 },
    discountPrice: { type: Number, default: 0 },
    
    // Loại
    type: { type: String, enum: ['hotel', 'activity'], default: 'hotel' },
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hotel', hotelSchema);