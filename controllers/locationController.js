const Location = require('../models/Location');

exports.search = async (req, res) => {
  const q = req.query.q || '';

  const locations = await Location.find({
    name: { $regex: q, $options: 'i' }
  }).limit(5);

  res.json(locations);
};