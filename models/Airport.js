const mongoose = require('mongoose');

const airportSchema = new mongoose.Schema({
  code: String,      
  name: String,      
  city: String,      
  country: String    
});

const flightSchema = new mongoose.Schema({
    airlineName: String,
    airlineLogo: String,
    fromCode: String,
    toCode: String,
    departureTime: String,
    arrivalTime: String,
    price: Number
});

module.exports = {
  Airport: mongoose.model('Airport', airportSchema),
  Flight: mongoose.model('Flight', flightSchema)
};

module.exports = mongoose.model('Airport', airportSchema);