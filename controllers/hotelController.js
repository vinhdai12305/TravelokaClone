// controllers/hotelController.js
const Hotel = require('../models/Hotel');

// ==========================================
// 1. API Lọc khách sạn (Dùng cho AJAX fetch)
// ==========================================
exports.filterHotels = async (req, res) => {
    try {
        const { maxPrice, stars, amenities, sort } = req.query;

        // Bỏ { type: { $ne: 'activity' } } thành {} để Sun World (activity) vẫn hiện ra khi người dùng tìm giá
        let query = {};

        // --- BỘ LỌC GIÁ ---
        if (maxPrice) {
            // Gọt sạch mọi thứ không phải là số (VND, dấu chấm, dấu phẩy...)
            const cleanPrice = String(maxPrice).replace(/\D/g, '');
            const priceNum = parseInt(cleanPrice, 10);
            
            if (!isNaN(priceNum) && priceNum > 0) {
                // Dùng $or: Lấy khách sạn có giá KM <= mức giá, HOẶC giá gốc <= mức giá
                query.$or = [
                    { discountPrice: { $lte: priceNum } },
                    { price: { $lte: priceNum } }
                ];
            }
        }

        // --- BỘ LỌC HẠNG SAO ---
        if (stars && stars.length > 0) {
            // Chuyển "5,4" thành [5, 4] và loại bỏ những giá trị lỗi NaN
            const starArray = stars.split(',').map(Number).filter(n => !isNaN(n));
            if (starArray.length > 0) {
                query.stars = { $in: starArray };
            }
        }

        // --- BỘ LỌC TIỆN NGHI ---
        if (amenities && amenities.length > 0) {
            // Tách chuỗi, bỏ khoảng trắng thừa và bỏ các giá trị rỗng
            const amenityArray = amenities.split(',').map(a => a.trim()).filter(a => a !== '');
            if (amenityArray.length > 0) {
                query.amenities = { $all: amenityArray }; // Phải có ĐỦ các tiện ích đã chọn
            }
        }

        // --- SẮP XẾP ---
        let sortQuery = {};
        if (sort === 'priceAsc') {
            // Đã sửa thành discountPrice cho khớp với DB của ní
            sortQuery = { discountPrice: 1 };
        } else if (sort === 'ratingDesc') {
            sortQuery = { rating: -1 };
        } else {
            sortQuery = { rating: -1, stars: -1 }; // Phổ biến nhất (Rating cao, sao cao)
        }

        // Debug để ní dễ kiểm tra trên Terminal
        console.log("🔍 [Controller] Điều kiện lọc:", JSON.stringify(query, null, 2));

        const hotels = await Hotel.find(query).sort(sortQuery).limit(20);

        // Trả về JSON để Frontend render lại
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

// ==========================================
// 2. Trang danh sách hotels (Render lần đầu)
// ==========================================
exports.getHotelList = async (req, res) => {
    try {
        // Lấy 20 hotel đầu tiên (không bao gồm activity để trang chủ sạch sẽ)
        const hotels = await Hotel.find({ 
            type: { $ne: 'activity' } 
        }).limit(20);

        // Lấy danh sách activity riêng
        const activities = await Hotel.find({ 
            type: 'activity' 
        }).limit(10);

        res.render('hotels/list', {
            hotels: hotels,
            activities: activities
        });

    } catch (error) {
        console.error('❌ Lỗi getHotelList:', error);
        res.status(500).send('Lỗi Server');
    }
};

// ==========================================
// 3. Trang chi tiết
// ==========================================
exports.detail = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const hotelFromDB = await Hotel.findById(hotelId);

        if (!hotelFromDB) {
            return res.status(404).send('Không tìm thấy khách sạn!');
        }

        const detailedHotel = {
            _id: hotelFromDB._id,
            name: hotelFromDB.name,
            location_breadcrumb: `Hotel / Đà Nẵng / ${hotelFromDB.location || 'Trung tâm'}`,
            address: `${hotelFromDB.location || 'Đà Nẵng'}, Việt Nam`,
            type: "Khách sạn",
            stars: hotelFromDB.stars || 5, 
            rating: hotelFromDB.rating || 9.0, 
            rating_text: "Tuyệt vời",
            review_count: 521, 
            images: {
                large: hotelFromDB.image || "/images/intercontinental1.jpg",
                small: [
                    "/images/intercontinental2.jpg",
                    "/images/furama5.jpg",
                    "/images/intercontinental3.jpg",
                    "/images/intercontinental4.jpg",
                    "/images/intercontinental5.jpg"
                ]
            },
            price: hotelFromDB.price,
            discountPrice: hotelFromDB.discountPrice, // Thêm dòng này để lỡ có dùng ngoài view thì không bị lỗi
            alert_text: "Đừng bỏ lỡ! Chỉ còn 3 phòng trống...",
            nearby: [
              { name: "Cảng Tiên Sa", distance: "2.1 km" },
              { name: "Núi Sơn Trà", distance: "3.5 km" }
            ],
            facilities: hotelFromDB.amenities && hotelFromDB.amenities.length > 0 ? 
                hotelFromDB.amenities.map(a => ({ name: a, icon: a })) : 
                [{ name: "Free WiFi", icon: "wifi" }, { name: "Hồ bơi", icon: "pool" }]
        };

        res.render('hotels/detail', { hotel: detailedHotel });

    } catch (error) {
        console.error("Lỗi khi xem chi tiết:", error);
        res.status(500).send('Lỗi server');
    }
};