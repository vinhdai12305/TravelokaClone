const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
    name: String,
    location: String,
    image: String,
    stars: Number,
    rating: Number,
    reviewCount: String,
    discountPrice: Number,
    tag: String,
    type: String // Trường type này rất quan trọng để fen filter 'hotel' hay 'activity' ở controller nhé
});

// Đổi 'Hotel' thành 'Home'
module.exports = mongoose.model('Home', homeSchema);