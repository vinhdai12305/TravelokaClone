const Hotel = require('../models/Hotel');

exports.getHomePage = async (req, res) => {
    try {
        const hotels = await Hotel.find({
            $or: [
                { type: 'hotel' },
                { type: { $exists: false } }
            ]
        });

        const activities = await Hotel.find({ type: 'activity' });

        res.render('hotels/list', {
            hotels,
            activities
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi Server');
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