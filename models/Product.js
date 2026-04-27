const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String }, // Link ảnh sản phẩm
  rating: { type: Number, default: 5 },
  discount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Product', productSchema);