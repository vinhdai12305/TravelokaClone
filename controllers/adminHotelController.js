const Hotel = require('../models/Hotel');

exports.index = async (req, res) => {

    const hotels = await Hotel.find();

    res.render('admin/hotels', {
        hotels
    });

};

exports.create = (req, res) => {

    res.render('admin/createHotel');

};

exports.store = async (req, res) => {

    const newHotel = new Hotel({
        name: req.body.name,
        location: req.body.location,
        price: req.body.price,
        image: req.body.image
    });

    await newHotel.save();

    res.redirect('/admin/hotels');

};