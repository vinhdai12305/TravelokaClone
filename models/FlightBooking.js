const mongoose = require('mongoose');

const flightBookingSchema = new mongoose.Schema({

    flightId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight'
    },

    airline: String,

    from: String,

    to: String,

    departureTime: String,

    arrivalTime: String,

    guestName: String,

    email: String,

    phone: String,

    passengers: Number,

    seatClass: String,

    totalPrice: Number,

    bookingCode: String,

    status: {
        type: String,
        default: 'Đã thanh toán'
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model(
    'FlightBooking',
    flightBookingSchema
);