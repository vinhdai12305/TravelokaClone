const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: String,
  country: String,
  description: String,
  hotelsCount: Number
});

module.exports = mongoose.model('Location', locationSchema);