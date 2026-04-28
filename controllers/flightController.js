const Airport = require('../models/Airport');
const Flight = require('../models/Flights');

// --- Tìm sân bay cho thanh Auto-complete ---
const searchAirport = async (req, res) => {
  const keyword = req.query.q;
  if (!keyword) return res.json([]);
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

// --- Tìm chuyến bay dựa trên điểm đi/đến + Bộ lọc (Stops, Airlines) ---
const searchFlights = async (req, res) => {
  try {
    const { from, to, stops, airlines } = req.query;

    // 1. Kiểm tra đầu vào cơ bản
    if (!from || !to) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin điểm đi/đến" });
    }

    // 2. Tách mã Code từ chuỗi định dạng "Da Nang (DAD)"
    const fromMatch = from.match(/\(([^)]+)\)/);
    const toMatch = to.match(/\(([^)]+)\)/);

    if (!fromMatch || !toMatch) {
      return res.status(400).json({ success: false, message: "Định dạng điểm đi/đến không đúng (Ví dụ: City (ABC))" });
    }

    const fromCode = fromMatch[1];
    const toCode = toMatch[1];

    // 3. Xây dựng Object Query động cho MongoDB
    let query = { fromCode, toCode };

    // Lọc theo số điểm dừng (Ví dụ: stops=0,1)
    if (stops) {
      const stopsArray = stops.split(',').map(Number); // Chuyển chuỗi thành mảng số [0, 1]
      query.stops = { $in: stopsArray };
    }

    // Lọc theo Hãng hàng không (Ví dụ: airlines=VietJet Air,Bamboo Airways)
    if (airlines) {
      const airlineArray = airlines.split(',');
      query.airlineName = { $in: airlineArray };
    }

    // 4. Thực hiện truy vấn
    const flights = await Flight.find(query).sort({ price: 1 }); // Sắp xếp giá tăng dần

    res.json({ 
      success: true, 
      count: flights.length,
      flights 
    });

  } catch (err) {
    console.error("Lỗi tìm kiếm chuyến bay:", err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = {
  searchAirport,
  searchFlights
};