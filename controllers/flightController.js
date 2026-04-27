const Airport = require('../models/Airport');
const Flight = require('../models/Flights');

// --- GIỮ NGUYÊN CÁI CŨ CỦA NÍ ---
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

// --- PHẦN THÊM MỚI ĐỂ TÌM CHUYẾN BAY ---
exports.searchFlights = async (req, res) => {
  try {
    const { from, to } = req.query;

    // Phân tách lấy mã code trong ngoặc, ví dụ: "Da Nang (DAD)" -> lấy "DAD"
    // Dùng Regex để tách cho chuẩn
    const fromMatch = from.match(/\(([^)]+)\)/);
    const toMatch = to.match(/\(([^)]+)\)/);

    if (!fromMatch || !toMatch) {
      return res.status(400).json({ success: false, message: "Định dạng điểm đi/đến không đúng (Thiếu mã sân bay)" });
    }

    const fromCode = fromMatch[1];
    const toCode = toMatch[1];

    // Tìm trong MongoDB theo mã sân bay
    const flights = await Flight.find({ 
      fromCode: fromCode, 
      toCode: toCode 
    });

    res.json({ success: true, flights });
  } catch (err) {
    console.error("Lỗi tìm kiếm chuyến bay:", err);
    res.status(500).json({ success: false, message: 'Lỗi server khi tìm chuyến bay' });
  }
};