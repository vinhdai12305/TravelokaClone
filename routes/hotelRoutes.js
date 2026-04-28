const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');

/**
 * Helper: Đảm bảo dữ liệu khách sạn luôn an toàn khi render
 * Tránh lỗi .toLocaleString() của undefined
 */
const getSafeHotelData = (hotel) => {
    return {
        _id: hotel._id,
        name: hotel.name || 'Khách sạn Traveloka Clone',
        image: hotel.image || '/images/default-hotel.jpg',
        price: hotel.price || 0,
        address: hotel.address || 'Đà Nẵng, Việt Nam'
    };
};

// ✅ 1. TRANG DANH SÁCH
router.get('/', async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.render('hotels/list', { 
            hotels,
            user: req.session?.user || null 
        });
    } catch (error) {
        console.error("Lỗi lấy danh sách:", error);
        res.status(500).send('Lỗi server');
    }
});

// ✅ 2. TRANG ĐIỀN THÔNG TIN (Booking Form)
// Quan trọng: Phải đặt trước route /:id
router.get('/booking-form/:id', async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.redirect('/hotels');

        const safeHotel = getSafeHotelData(hotel);

        res.render('hotels/booking-form', { 
            hotel: safeHotel, 
            user: req.session?.user || null 
        });
    } catch (error) {
        console.error("Lỗi trang form:", error);
        res.redirect('/hotels');
    }
});

// ✅ 3. XỬ LÝ LOGIC ĐẶT PHÒNG (POST)
router.post('/book-room/:id', async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).send('Khách sạn không tồn tại');

        // Lấy dữ liệu từ form (bao gồm các trường ngày tháng mới thêm)
        const { guestName, email, phone, checkIn, checkOut, guests } = req.body;

        // Render file hotels/booking-success.ejs
        // Đảm bảo file này tồn tại trong thư mục views/hotels/
        res.render('hotels/booking-success', { 
            hotelName: hotel.name,
            guestName: guestName || "Quý khách",
            checkIn: checkIn || "Chưa chọn",
            checkOut: checkOut || "Chưa chọn",
            guests: guests || 1,
            bookingId: "TVL" + Math.floor(Math.random() * 900000 + 100000),
            user: req.session?.user || null 
        });

    } catch (error) {
        console.error("Lỗi khi xử lý đặt phòng:", error);
        res.status(500).send('Đã có lỗi xảy ra khi đặt phòng!');
    }
});

// ✅ 4. TRANG CHI TIẾT (Detail) - Luôn để cuối cùng
router.get('/:id', async (req, res) => {
    try {
        const foundHotel = await Hotel.findById(req.params.id);
        if (!foundHotel) return res.status(404).render('404');

        const detailedHotel = {
            ...getSafeHotelData(foundHotel),
            location_breadcrumb: `Hotel / Đà Nẵng / ${foundHotel.name}`,
            type: "Khách sạn",
            stars: 5,
            rating: 9.0,
            rating_text: "Exceptional",
            images: {
                large: foundHotel.image || "/images/default-hotel.jpg",
                small: ["/images/h2.jpg", "/images/h3.jpg", "/images/h4.jpg", "/images/h5.jpg"]
            },
            nearby: [
                { name: "Biển Mỹ Khê", distance: "500m" },
                { name: "Cầu Rồng", distance: "2km" }
            ],
            facilities: [
                { name: "WiFi", icon: "wifi" },
                { name: "Hồ bơi", icon: "swimming-pool" },
                { name: "Nhà hàng", icon: "utensils" }
            ]
        };

        res.render('hotels/detail', { 
            hotel: detailedHotel,
            user: req.session?.user || null
        });
    } catch (error) {
        res.status(500).send('Lỗi server');
    }
});

module.exports = router;