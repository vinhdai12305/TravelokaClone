const mongoose = require('mongoose');
const Product = require('./models/Product');
const Hotel = require('./models/Hotel'); // 1. NHỚ THÊM DÒNG NÀY
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/traveloka_clone')
  .then(async () => {
    console.log("Đã kết nối để nạp data...");

    // Dữ liệu Sản phẩm (Activities/Experiences)
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

    // Dữ liệu Khách sạn (Dùng ảnh local của fen)
    const sampleHotels = [
      {
        name: "InterContinental Danang Sun Peninsula Resort",
        location: "Bán đảo Sơn Trà, Đà Nẵng",
        image: "/images/intercontinental1.jpg", 
        price: "5.000.000 VND"
      },
      {
        name: "Khách sạn Furama Resort",
        location: "Bãi biển Bắc Mỹ An, Đà Nẵng",
        image: "/images/furama5.jpg",           
        price: "4.500.000 VND"
      }
    ];

    // 2. Lệnh xóa và nạp dữ liệu cho cả 2 collection
    await Product.deleteMany({}); 
    await Product.insertMany(sampleProducts);
    console.log("✅ Đã nạp dữ liệu Products thành công!");

    await Hotel.deleteMany({}); // Xóa hotel cũ
    await Hotel.insertMany(sampleHotels); // Nạp hotel mới
    console.log("✅ Đã nạp dữ liệu Hotels thành công!");
    
    process.exit();
  })
  .catch(err => {
    console.error("❌ Lỗi: ", err);
    process.exit(1);
  });