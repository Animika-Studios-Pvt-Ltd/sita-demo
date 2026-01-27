const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:\\OneDrive - ANIMIKA STUDIOS PRIVATE LIMITED\\1.Lohit\\sita-demo\\backend\\.env' });
const Booking = require('./src/booking/booking.model');

async function getBooking() {
    try {
        await mongoose.connect(process.env.DB_URL);
        const booking = await Booking.findOne().sort({ createdAt: -1 });
        if (booking) {
            console.log(booking._id.toString());
        } else {
            console.log("No bookings found.");
        }
        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
}

getBooking();
