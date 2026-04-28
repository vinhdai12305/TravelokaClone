const Flight = require('../models/Flights');

exports.index = async (req, res) => {

    const flights = await Flight.find();

    res.render('admin/flights', {
        flights
    });

};

exports.create = (req, res) => {

    res.render('admin/createFlight');

};

exports.store = async (req, res) => {

    const newFlight = new Flight({

        airlineName: req.body.airlineName,
        airlineLogo: req.body.airlineLogo,
        stops: req.body.stops,
        price: req.body.price,
        departureTime: req.body.departureTime,
        arrivalTime: req.body.arrivalTime,
        fromCode: req.body.fromCode,
        toCode: req.body.toCode,
        class: req.body.class,
        duration: req.body.duration

    });

    await newFlight.save();

    res.redirect('/admin/flights');

};