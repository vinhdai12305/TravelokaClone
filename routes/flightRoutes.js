const express = require('express');
const router = express.Router();
const flightCtrl = require('../controllers/flightController');
const Airport = require('../models/Airport'); 

// 👉 Render trang flight
router.get('/', (req, res) => {
  res.render('flight');
});

// 👉 API search airport (Giữ nguyên cũ)
router.get('/search-airport', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.json([]); // Tránh lỗi nếu q trống

  const airports = await Airport.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { code: { $regex: q, $options: 'i' } },
      { city: { $regex: q, $options: 'i' } }
    ]
  }).limit(5);

  res.json(airports);
});

// 👉 THÊM MỚI: API tìm kiếm chuyến bay từ MongoDB
// Route này sẽ gọi đến hàm searchFlights mà mình vừa viết ở Controller
router.get('/search-flights', flightCtrl.searchFlights);

module.exports = router;