const express = require('express');
const router = express.Router();
const flightCtrl = require('../controllers/flightController');
const Airport = require('../models/Airport'); // ✅ thêm dòng này

// 👉 Render trang flight
router.get('/', (req, res) => {
  res.render('flight');
});

// 👉 API search airport
router.get('/search-airport', async (req, res) => {
  const q = req.query.q;

  const airports = await Airport.find({
    name: { $regex: q, $options: 'i' }
  }).limit(5);

  res.json(airports);
});

module.exports = router;