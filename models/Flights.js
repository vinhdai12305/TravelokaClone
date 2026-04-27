const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  airlineName: String,
  airlineLogo: String,
  price: Number,
  departureTime: String,
  arrivalTime: String,
  fromCode: String,
  toCode: String
});

module.exports = mongoose.models.Flight || mongoose.model('Flight', flightSchema);