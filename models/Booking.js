const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({

    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel'
    },

    hotelName: String,

    guestName: String,

    email: String,

    phone: String,

    checkIn: String,

    checkOut: String,

    guests: Number,

    nights: Number,

    roomPrice: Number,

    totalPrice: Number,

    bookingId: String,

    status: {
        type: String,
        default: 'Đã thanh toán'
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Booking', bookingSchema);