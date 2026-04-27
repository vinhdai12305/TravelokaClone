// controllers/hotelController.js (hoặc file controller của bạn)
const Hotel = require('../models/Hotel');

exports.detail = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const hotelFromDB = await Hotel.findById(hotelId);

        if (!hotelFromDB) {
            return res.status(404).send('Không tìm thấy khách sạn!');
        }

        // Tạo dữ liệu mẫu thực tế hơn dựa trên dữ liệu từ MongoDB
        // (Đây là dữ liệu giả để làm mẫu layout, khi có dữ liệu thực tế hơn bạn sẽ thay thế nó)
        const detailedHotel = {
            _id: hotelFromDB._id,
            name: hotelFromDB.name,
            location_breadcrumb: `Hotel / Đà Nẵng / ${hotelFromDB.location}`,
            address: `${hotelFromDB.location}, Việt Nam`,
            type: "Khách sạn",
            stars: 5, // Giả lập 5 sao
            rating: 9.0, // Giả lập xếp hạng 9.0
            rating_text: "Exceptional",
            review_count: 521, // Giả lập số review
            images: {
                // Ảnh lớn lấy từ DB
                large: hotelFromDB.image,
                // Giả lập lưới ảnh nhỏ
                small: [
                    "/images/intercontinental2.jpg",
                    "/images/furama5.jpg",
                    "/images/intercontinental3.jpg",
                    "/images/intercontinental4.jpg",
                    "/images/intercontinental5.jpg"
                ]
            },
            price: hotelFromDB.price,
            alert_text: "Don't miss out! Only 3 room(s) left...",
            nearby: [ // Giả lập địa điểm lân cận
              { name: "Cảng Tiên Sa", distance: "2.1 km" },
              { name: "Núi Sơn Trà", distance: "3.5 km" },
              { name: "Chùa Linh Ứng", distance: "5.8 km" }
            ],
            facilities: [ // Giả lập tiện ích
              { name: "Swimming Pool", icon: "pool" },
              { name: "Spa", icon: "spa" },
              { name: "Free WiFi", icon: "wifi" },
              { name: "Restaurant", icon: "restaurant" },
              { name: "Gym", icon: "fitness_center" }
            ]
        };

        // Truyền dữ liệu chi tiết sang trang detail.ejs
        res.render('hotels/detail', { hotel: detailedHotel });

    } catch (error) {
        console.error("Lỗi khi xem chi tiết:", error);
        res.status(500).send('Lỗi server');
    }
};

// ✅ Trang danh sách hotels
exports.getHotelList = async (req, res) => {
    try {
        const hotels = await Hotel.find({ 
            type: { $ne: 'activity' } 
        }).limit(20);

        const activities = await Hotel.find({ 
            type: 'activity' 
        }).limit(10);

        console.log('📋 Hotel List - Hotels:', hotels.length);

        res.render('hotels/list', {
            hotels: hotels,
            activities: activities
        });

    } catch (error) {
        console.error('❌ Lỗi getHotelList:', error);
        res.status(500).send('Lỗi Server');
    }
};