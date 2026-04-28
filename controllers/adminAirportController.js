const Airport = require('../models/Airport');

exports.index = async (req, res) => {

    const airports = await Airport.find();

    res.render('admin/airports', {
        airports,
        user: req.session.user
    });

};

exports.create = (req, res) => {

    res.render('admin/createAirport', {
        user: req.session.user
    });

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

exports.delete = async (req, res) => {

    try {

        const airportId = req.params.id;

        await Airport.findByIdAndDelete(airportId);

        res.redirect('/admin/airports');

    } catch (error) {

        console.log(error);

        res.status(500).send('Delete Error');

    }

};