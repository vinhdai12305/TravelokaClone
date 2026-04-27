const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');

// Trang chủ
router.get('/', async (req, res) => {
    try {
        // Lấy hotels (không phải activity)
        const hotels = await Hotel.find({ 
            $or: [
                { type: 'hotel' },
                { type: { $exists: false } }
            ]
        }).limit(10);

        // Lấy activities
        const activities = await Hotel.find({ type: 'activity' }).limit(10);

        console.log('🏨 Hotels:', hotels.length);
        console.log('🎡 Activities:', activities.length);

        res.render('homeList', {
            hotels: hotels,
            activities: activities
        });

    } catch (error) {
        console.error('❌ Lỗi lấy dữ liệu:', error);
        res.status(500).send('Lỗi Server');
    }
});

module.exports = router;