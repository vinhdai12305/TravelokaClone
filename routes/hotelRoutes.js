const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');

// ✅ 1. Trang danh sách hotels
router.get('/', async (req, res) => {
    try {
        const hotels = await Hotel.find();

        res.render('hotels/list', { 
            hotels 
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi server');
    }
});

// ✅ 2. Trang chi tiết hotel
router.get('/:id', async (req, res) => {
    try {
        const hotelId = req.params.id;
        const foundHotel = await Hotel.findById(hotelId);

        if (!foundHotel) {
            return res.status(404).send('Không tìm thấy khách sạn!');
        }

        // ✅ FIX: thêm đầy đủ dữ liệu để tránh lỗi EJS
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
                large: "/images/intercontinental1.jpg",
                small: [
                    "/images/intercontinental2.jpg",
                    "/images/intercontinental3.jpg",
                    "/images/intercontinental4.jpg",
                    "/images/intercontinental5.jpg"
                ]
            },
            price: foundHotel.price || "5.000.000",

            // ✅ QUAN TRỌNG: thêm để fix lỗi forEach
            nearby: [
                { name: "My Dinh Bus Station", distance: "1.56 km" },
                { name: "Lang Pagoda", distance: "1.58 km" },
                { name: "Big C Thăng Long", distance: "2.69 km" },
                { name: "Chùa Hà", distance: "524 m" }
            ],

            // (bonus nếu bạn có dùng)
            facilities: [
                { name: "WiFi" },
                { name: "Hồ bơi" },
                { name: "Nhà hàng" }
            ]
        };

        res.render('hotels/detail', { 
            hotel: detailedHotel
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi server');
    }
});

module.exports = router;