const Hotel = require('../models/Hotel');

// 1. API Lọc khách sạn (Dùng cho AJAX fetch)
// ==========================================
exports.filterHotels = async (req, res) => {
    try {
        const { maxPrice, stars, amenities, sort } = req.query;
        let query = {};

        // --- BỘ LỌC GIÁ ---
        if (maxPrice) {
            const cleanPrice = String(maxPrice).replace(/\D/g, '');
            const priceNum = parseInt(cleanPrice, 10);
            
            if (!isNaN(priceNum) && priceNum > 0) {
                query.$or = [
                    { discountPrice: { $lte: priceNum } },
                    { price: { $lte: priceNum } }
                ];
            }
        }

        // --- BỘ LỌC HẠNG SAO ---
        if (stars) {
            const starArray = stars.split(',').map(Number).filter(n => !isNaN(n));
            if (starArray.length > 0) {
                query.stars = { $in: starArray };
            }
        }

        // --- BỘ LỌC TIỆN NGHI ---
        if (amenities) {
            const amenityArray = amenities.split(',').map(a => a.trim()).filter(a => a !== '');
            if (amenityArray.length > 0) {
                query.amenities = { $all: amenityArray };
            }
        }

        // --- SẮP XẾP ---
        let sortQuery = {};
        if (sort === 'priceAsc') {
            sortQuery = { discountPrice: 1 };
        } else if (sort === 'ratingDesc') {
            sortQuery = { rating: -1 };
        } else {
            sortQuery = { rating: -1, stars: -1 };
        }

        console.log("🔍 [Filter Query]:", JSON.stringify(query, null, 2));

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
};

// 2. Trang danh sách hotels & activities (Render lần đầu)
// ==========================================
exports.getHotelList = async (req, res) => {
    try {
        const [hotels, activities] = await Promise.all([
            Hotel.find({ type: { $ne: 'activity' } }).limit(20),
            Hotel.find({ type: 'activity' }).limit(10)
        ]);

        res.render('hotels/list', { hotels, activities });
    } catch (error) {
        console.error('❌ Lỗi getHotelList:', error);
        res.status(500).send('Lỗi Server');
    }
};

// 3. Trang chi tiết khách sạn
// ==========================================
exports.detail = async (req, res) => {
    try {
        const hotelFromDB = await Hotel.findById(req.params.id);

        if (!hotelFromDB) {
            return res.status(404).send('Không tìm thấy khách sạn!');
        }

        // Mapping dữ liệu để hiển thị ra View
        const detailedHotel = {
            _id: hotelFromDB._id,
            name: hotelFromDB.name,
            location_breadcrumb: `Hotel / Đà Nẵng / ${hotelFromDB.location || 'Trung tâm'}`,
            address: `${hotelFromDB.location || 'Đà Nẵng'}, Việt Nam`,
            stars: hotelFromDB.stars || 5,
            rating: hotelFromDB.rating || 9.0,
            rating_text: "Tuyệt vời",
            review_count: 521,
            images: {
                large: hotelFromDB.image || "/images/default-hotel.jpg",
                small: [
                    "/images/intercontinental2.jpg",
                    "/images/furama5.jpg",
                    "/images/intercontinental3.jpg"
                ]
            },
            price: hotelFromDB.price,
            discountPrice: hotelFromDB.discountPrice,
            alert_text: "Đừng bỏ lỡ! Chỉ còn 3 phòng trống...",
            nearby: [
                { name: "Cảng Tiên Sa", distance: "2.1 km" },
                { name: "Núi Sơn Trà", distance: "3.5 km" }
            ],
            facilities: hotelFromDB.amenities && hotelFromDB.amenities.length > 0 
                ? hotelFromDB.amenities.map(a => ({ name: a, icon: 'check_circle' })) 
                : [{ name: "Free WiFi", icon: "wifi" }, { name: "Hồ bơi", icon: "pool" }]
        };

        res.render('hotels/detail', { hotel: detailedHotel });
    } catch (error) {
        console.error("❌ Lỗi khi xem chi tiết:", error);
        res.status(500).send('Lỗi server');
    }
};

// 4. Hiển thị Form đặt phòng
// ==========================================
exports.getBookingForm = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.redirect('/hotels');

        res.render('hotels/booking-form', { 
            hotel: hotel,
            user: req.session.user || req.user 
        });
    } catch (error) {
        res.status(500).send('Lỗi server');
    }
};

// 5. Xử lý lưu booking & Trang thành công
// ==========================================
exports.bookRoom = async (req, res) => {
    try {
        const { guestName, email, phone } = req.body;
        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) return res.status(404).send('Khách sạn không tồn tại');

        // Render trang thành công
        res.render('hotels/booking-success', {
            hotelName: hotel.name,
            guestName: guestName,
            bookingId: "BK" + Math.floor(Math.random() * 1000000),
            price: hotel.discountPrice || hotel.price,
            user: req.session.user || req.user
        });

    } catch (error) {
        console.error("❌ Lỗi khi đặt phòng:", error);
        res.status(500).send('Đã xảy ra lỗi khi xử lý đặt phòng');
    }
};