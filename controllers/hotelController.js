const Hotel = require('../models/Hotel');
// Giả sử bạn có model Booking để lưu lịch sử đặt phòng
// const Booking = require('../models/Booking'); 

// 1. Trang chi tiết khách sạn (Giữ nguyên của bạn)
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
            location_breadcrumb: `Hotel / Đà Nẵng / ${hotelFromDB.location}`,
            address: `${hotelFromDB.location}, Việt Nam`,
            type: "Khách sạn",
            stars: 5,
            rating: 9.0,
            rating_text: "Exceptional",
            review_count: 521,
            images: {
                large: hotelFromDB.image,
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
            nearby: [
              { name: "Cảng Tiên Sa", distance: "2.1 km" },
              { name: "Núi Sơn Trà", distance: "3.5 km" },
              { name: "Chùa Linh Ứng", distance: "5.8 km" }
            ],
            facilities: [
              { name: "Swimming Pool", icon: "pool" },
              { name: "Spa", icon: "spa" },
              { name: "Free WiFi", icon: "wifi" },
              { name: "Restaurant", icon: "restaurant" },
              { name: "Gym", icon: "fitness_center" }
            ]
        };

        res.render('hotels/detail', { hotel: detailedHotel });
    } catch (error) {
        console.error("Lỗi khi xem chi tiết:", error);
        res.status(500).send('Lỗi server');
    }
};

// 2. ✅ BƯỚC MỚI: Hiển thị Form điền thông tin đặt chỗ (Booking Form)
// Khi người dùng bấm "Chọn phòng", họ sẽ sang trang này trước
exports.getBookingForm = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.redirect('/hotels');

        // Render ra trang điền thông tin khách hàng
        res.render('hotels/booking-form', { 
            hotel: hotel,
            user: req.session.user || req.user // Lấy thông tin user đã đăng nhập
        });
    } catch (error) {
        res.status(500).send('Lỗi server');
    }
};

// 3. ✅ BƯỚC MỚI: Xử lý đặt phòng và hiển thị trang Thành công
exports.bookRoom = async (req, res) => {
    try {
        const hotelId = req.params.id;
        const { guestName, email, phone } = req.body; // Dữ liệu từ form booking-form
        const hotel = await Hotel.findById(hotelId);

        if (!hotel) return res.status(404).send('Khách sạn không tồn tại');

        /* LOGIC LƯU DATABASE:
           Tại đây bạn nên tạo một bản ghi mới trong model Booking.
           Ví dụ: await Booking.create({ hotelId, userId: req.user._id, guestName, ... });
        */

        // Sau khi lưu xong, render trang thành công giống Traveloka
        res.render('hotels/booking-success', {
            hotelName: hotel.name,
            guestName: guestName,
            bookingId: "BK" + Math.floor(Math.random() * 1000000), // Mã đặt chỗ ngẫu nhiên
            price: hotel.price,
            user: req.session.user || req.user
        });

    } catch (error) {
        console.error("Lỗi khi đặt phòng:", error);
        res.status(500).send('Đã xảy ra lỗi khi xử lý đặt phòng');
    }
};

// ✅ Trang danh sách hotels (Giữ nguyên của bạn)
exports.getHotelList = async (req, res) => {
    try {
        const hotels = await Hotel.find({ 
            type: { $ne: 'activity' } 
        }).limit(20);

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