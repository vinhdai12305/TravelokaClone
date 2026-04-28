const Hotel = require('../models/Hotel');
const Flight = require('../models/Flights');

exports.index = async (req, res) => {
    try {
        // 1. Lấy danh sách khách sạn
        const hotels = await Hotel.find({
            $or: [
                { type: 'hotel' },
                { type: { $exists: false } }
            ]
        }).limit(10).lean();

        // 2. Lấy danh sách chuyến bay (Dữ liệu máy bay thật)
        const flights = await Flight.find().limit(10).lean();

        // 3. Render trang chủ kèm theo đầy đủ các biến mà EJS đang chờ đợi
        res.render('homeList', {
            hotels: hotels,
            flights: flights,

            // Các biến điều khiển Modal Đăng nhập/Đăng ký (Tránh lỗi undefined)
            formDisplayStyle: 'none', // Mặc định ẩn form khi vào trang chủ
            isFormActive: false,      // Trạng thái modal
            activeForm: 'login',      // Tab mặc định là đăng nhập
            
            // Các biến thông báo lỗi (Nếu fen có dùng trong partials/header hoặc modal)
            loginError: null,
            registerError: null,
            
            // Dữ liệu người dùng từ session
            user: req.session.user || null 
        });

    } catch (error) {
        console.error("❌ Lỗi lấy dữ liệu trang chủ:", error);
        // Thay vì chỉ gửi text, ta có thể render một trang lỗi đẹp hơn hoặc thông báo
        res.status(500).render('error', { 
            message: 'Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau!',
            error: error 
        });
    }
};
console.log("Flights:", flights.length);