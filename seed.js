const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// Kết nối tới DB của bạn (travelokaclone)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/travelokaclone')
  .then(async () => {
    console.log("Đã kết nối để nạp data...");
    
    // Dữ liệu mẫu giống ảnh bạn mong muốn
    const sampleProducts = [
      {
        name: "4D3N Singapore Cruise on the Disney Adventure",
        location: "Marina Bay",
        price: 11588283,
        image: "https://ik.imagekit.io/tvlk/image/imageResource/2024/09/10/1725941421453-6a9c1e7d8f9b0c2a5d4e3f1g.jpg",
        rating: 9.7,
        discount: 10
      },
      {
        name: "3D2N Genting Dream: Singapore - Melaka",
        location: "Singapore",
        price: 3029100,
        image: "https://ik.imagekit.io/tvlk/image/imageResource/2024/09/10/1725941421453-7b8c9d0e1f2a3b4c5d6e7f8g.jpg",
        rating: 8.8,
        discount: 15
      }
    ];

    await Product.deleteMany({}); // Xóa dữ liệu cũ nếu có
    await Product.insertMany(sampleProducts);
    
    console.log("Đã tạo collection products và nạp dữ liệu thành công!");
    process.exit();
  })
  .catch(err => console.error(err));