const Hotel = require('../models/Hotel');

exports.getHomePage = async (req, res) => {
    try {
        // 1. Lấy khách sạn (type: hotel hoặc không có type)
        const hotels = await Hotel.find({
            $or: [ { type: 'hotel' }, { type: { $exists: false } } ]
        });

        // 2. Lấy hoạt động (type: activity)
        const activities = await Hotel.find({ type: 'activity' });

        // Render list.ejs với cả 2 loại dữ liệu
        res.render('hotels/list', {
            hotels: hotels,
            activities: activities
        });
    } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
        res.status(500).send('Lỗi Server');
    }
};