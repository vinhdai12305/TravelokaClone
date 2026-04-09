// routes/hotelRoutes.js
const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel'); // Nhớ check lại đường dẫn model

router.get('/:id', async (req, res) => {
    try {
        const hotelId = req.params.id;
        const foundHotel = await Hotel.findById(hotelId);

        if (!foundHotel) {
            return res.status(404).send('Không tìm thấy khách sạn!');
        }

        // Bơm dữ liệu "Full Giáp" để giao diện render đẹp như Traveloka
        const detailedHotel = {
            _id: foundHotel._id,
            name: foundHotel.name,
            location_breadcrumb: `Hotel / Đà Nẵng / Bán đảo Sơn Trà / ${foundHotel.name}`,
            address: `Bán đảo Sơn Trà, Đà Nẵng, Việt Nam`,
            type: "Khách sạn",
            stars: 5,
            rating: 9.0,
            rating_text: "Exceptional",
            review_count: 173,
            images: {
                // Link ảnh từ thư mục public/images của fen
                large: "/images/intercontinental1.jpg",
                small: [
                    "/images/intercontinental2.jpg",
                    "/images/intercontinental3.jpg",
                    "/images/intercontinental4.jpg",
                    "/images/intercontinental5.jpg"
                ]
            },
            price: foundHotel.price || "5.000.000",
            alert_text: "Don't miss out! Only 1 room(s) left for the lowest price.",
            nearby: [
              { name: "My Dinh Bus Station", distance: "1.56 km" },
              { name: "Lang Pagoda", distance: "1.58 km" },
              { name: "Big C Thăng Long", distance: "2.69 km" },
              { name: "Chùa Hà", distance: "524 m" }
            ],
            facilities: [
              { name: "AC", icon: "snowflake" },
              { name: "Elevator", icon: "arrow-up" },
              { name: "Restaurant", icon: "utensils" },
              { name: "WiFi", icon: "wifi" },
              { name: "24-Hour Front Desk", icon: "clock" },
              { name: "Parking", icon: "square-parking" }
            ]
        };

        // Gửi qua EJS (Truyền thêm user nếu fen có dùng đăng nhập ở header)
        res.render('hotels/detail', { 
            hotel: detailedHotel, 
            user: req.user || null 
        });

    } catch (error) {
        console.error("Lỗi khi xem chi tiết:", error);
        res.status(500).send('Lỗi server');
    }
});

module.exports = router;