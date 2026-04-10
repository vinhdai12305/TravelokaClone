const mongoose = require('mongoose');

const airportSchema = new mongoose.Schema({
  code: String,      
  name: String,      
  city: String,      
  country: String    
});

module.exports = mongoose.model('Airport', airportSchema);