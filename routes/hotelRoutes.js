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
// ==========================================
// ✅ 1. TRANG DANH SÁCH HOTELS
// ==========================================
router.get('/', async (req, res) => {
    try {        // Lấy danh sách mặc định (loại trừ activity nếu có)
        const hotels = await Hotel.find({ type: { $ne: 'activity' } }).limit(20);

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
// ==========================================
// ✅ 2. API LỌC KHÁCH SẠN 
// ==========================================
router.get('/api/filter', async (req, res) => {
    try {
        let { maxPrice, stars, amenities, sort } = req.query;
        
        // Theo yêu cầu của ní: Bỏ { $ne: 'activity' } để Sun World hiện ra
        let query = {}; 

        // 1. Xử lý giá: Tìm theo discountPrice HOẶC price gốc
        if (maxPrice) {
            const cleanPrice = String(maxPrice).replace(/\D/g, '');
            const priceNum = parseInt(cleanPrice, 10);
            
            if (!isNaN(priceNum) && priceNum > 0) {
                // Dùng $or: Lấy nếu giá KM <= maxPrice, HOẶC giá gốc <= maxPrice
                query.$or = [
                    { discountPrice: { $lte: priceNum } },
                    { price: { $lte: priceNum } }
                ];
            }
        }

        // 2. Lọc theo hạng sao ($in)
        if (stars && stars.length > 0) {
            const starArray = stars.split(',').map(Number).filter(n => !isNaN(n));
            if (starArray.length > 0) {
                query.stars = { $in: starArray };
            }
        }

        // 3. Lọc theo tiện ích ($all - Phải có ĐỦ các tiện ích đã tick)
        if (amenities && amenities.length > 0) {
            const amenityArray = amenities.split(',').map(a => a.trim()).filter(a => a !== '');
            if (amenityArray.length > 0) {
                query.amenities = { $all: amenityArray };
            }
        }

        // 4. Sắp xếp
        let sortQuery = {};
        if (sort === 'priceAsc') {
            sortQuery = { price: 1 }; // Giá thấp nhất
        } else if (sort === 'ratingDesc') {
            sortQuery = { rating: -1 }; // Điểm đánh giá cao nhất
        } else {
            // Mặc định 'popular': Phổ biến nhất (nhiều review, rating cao)
            sortQuery = { rating: -1, stars: -1 }; 
        }

        // Debug để xem Terminal nhận được gì
        console.log("🔍 Điều kiện lọc gửi lên MongoDB:", JSON.stringify(query, null, 2)); 

        const hotels = await Hotel.find(query).sort(sortQuery).limit(20);

        res.json({
            success: true,
            count: hotels.length,
            hotels: hotels
        });

    } catch (error) {
        console.error('❌ Lỗi API Filter:', error);
        res.status(500).json({ success: false, message: 'Lỗi Server' });
    }
});

// ==========================================
// ✅ 3. TRANG CHI TIẾT HOTEL 
// ==========================================
router.get('/:id', async (req, res) => {
    try {
        const foundHotel = await Hotel.findById(req.params.id);
        if (!foundHotel) return res.status(404).render('404');

        const hotelId = req.params.id;
        if (!foundHotel) {
            return res.status(404).send('Không tìm thấy khách sạn!');
        }

        // Dữ liệu mix giữa DB thật và Giả lập để không lỗi EJS
        const detailedHotel = {
    ...getSafeHotelData(foundHotel),
    _id: foundHotel._id,
    name: foundHotel.name,
    location_breadcrumb: `Hotel / Đà Nẵng / Bán đảo Sơn Trà / ${foundHotel.name}`,
    address: foundHotel.location || `Bán đảo Sơn Trà, Đà Nẵng, Việt Nam`,
    type: "Khách sạn",
    stars: foundHotel.stars || 5,
    rating: foundHotel.rating || 9.0,
    rating_text: "Exceptional",
            images: {
                large: foundHotel.image || "/images/intercontinental1.jpg",
                small: [
                    "/images/intercontinental2.jpg",
                    "/images/intercontinental3.jpg",
                    "/images/intercontinental4.jpg",
                    "/images/intercontinental5.jpg"
                ]
            },
            price: foundHotel.price || 5000000,
            discountPrice: foundHotel.discountPrice,
            
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
        console.error("Lỗi xem chi tiết:", error);
        res.status(500).send('Lỗi server');
    }
});

module.exports = router;