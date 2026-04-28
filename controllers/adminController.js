const Hotel = require('../models/Hotel');
const User = require('../models/User');
const Airport = require('../models/Airport');
const Flight = require('../models/Flights');


exports.dashboard = async (req, res) => {

    const totalHotels = await Hotel.countDocuments();

    const totalUsers = await User.countDocuments();

    const totalAirports = await Airport.countDocuments();

    const totalFlights = await Flight.countDocuments();

    res.render('admin/dashboard', {
        totalHotels,
        totalUsers,
        totalAirports,
        totalFlights
        });

};