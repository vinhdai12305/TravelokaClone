const express = require('express');
const router = express.Router();

const Hotel = require('../models/Hotel');
const Flight = require('../models/Flights'); // nhớ đúng tên file

router.get('/', async (req, res) => {
    try {
        // Hotels
        const hotels = await Hotel.find({ 
            $or: [
                { type: 'hotel' },
                { type: { $exists: false } }
            ]
        }).limit(10);

        // Flights (THAY cho activities)
        const flights = await Flight.find().limit(10);

        console.log('🏨 Hotels:', hotels.length);
        console.log('✈️ Flights:', flights.length);

        res.render('homeList', {
            hotels: hotels,
            flights: flights   // 🔥 QUAN TRỌNG
        });

    } catch (error) {
        console.error('❌ Lỗi lấy dữ liệu:', error);
        res.status(500).send('Lỗi Server');
    }
});

module.exports = router;