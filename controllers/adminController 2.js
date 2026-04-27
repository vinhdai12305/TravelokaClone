const Hotel = require('../models/Hotel');
const User = require('../models/User');

exports.dashboard = async (req, res) => {

    const totalHotels = await Hotel.countDocuments();

    const totalUsers = await User.countDocuments();

    res.render('admin/dashboard', {
        totalHotels,
        totalUsers
    });

};