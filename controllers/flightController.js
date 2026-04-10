const Airport = require('../models/Airport');

exports.searchAirport = async (req, res) => {
  const keyword = req.query.q;

  try {
    const airports = await Airport.find({
      $or: [
        { code: { $regex: keyword, $options: 'i' } },
        { name: { $regex: keyword, $options: 'i' } },
        { city: { $regex: keyword, $options: 'i' } }
      ]
    }).limit(10);

    res.json(airports);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};