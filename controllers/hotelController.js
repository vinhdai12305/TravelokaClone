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