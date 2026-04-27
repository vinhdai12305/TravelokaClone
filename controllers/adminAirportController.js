const Airport = require('../models/Airport');

exports.index = async (req, res) => {

    const airports = await Airport.find();

    res.render('admin/airports', {
        airports
    });

};

exports.create = (req, res) => {

    res.render('admin/createAirport');

};

exports.store = async (req, res) => {

    const newAirport = new Airport({

        code: req.body.code,

        name: req.body.name,

        city: req.body.city,

        country: req.body.country

    });

    await newAirport.save();

    res.redirect('/admin/airports');

};