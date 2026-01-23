const Event = require("../events/event.model");
const Booking = require("./booking.model");

/**
 * POST /api/bookings
 * User books a therapy session
 */
const createBooking = async (req, res) => {
  try {
    const { eventId, userName, userEmail, userPhone } = req.body;

    if (!eventId || !userName || !userEmail) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🔒 Atomically reduce availability
    const event = await Event.findOneAndUpdate(
      { _id: eventId, availability: { $gt: 0 } },
      { $inc: { availability: -1 } },
      { new: true }
    );

    if (!event) {
      return res.status(409).json({ message: "Booking Closed" });
    }

    const booking = await Booking.create({
      event: event._id,
      userName,
      userEmail,
      userPhone,
    });

    res.status(201).json({
      message: "Booking confirmed",
      booking,
      remainingAvailability: event.availability,
    });
  } catch (err) {
    console.error("❌ Booking error:", err);
    res.status(500).json({ message: "Booking failed" });
  }
};


module.exports = { createBooking };
