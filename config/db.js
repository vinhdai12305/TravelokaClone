const mongoose = require('mongoose');

module.exports = async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/traveloka_clone';

  mongoose.set('strictQuery', false);

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log('MongoDB đã kết nối');
  } catch (error) {
    console.error('Lỗi kết nối MongoDB:', error.message);
    throw error;
  }
};