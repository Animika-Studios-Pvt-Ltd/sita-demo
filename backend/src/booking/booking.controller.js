const Event = require("../events/event.model");
const Booking = require("./booking.model");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_YourKeyHere",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "YourSecretHere",
});

/**
 * Initiate Booking (Create Razorpay Order)
 */
const initiateBooking = async (req, res) => {
  try {
    const { eventId, seats = 1, userName, userEmail, userPhone } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check availability
    if (event.availability < seats) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    const pricePerSeat = event.price || 0;
    const totalAmount = pricePerSeat * seats;

    let orderData = null;

    if (totalAmount > 0) {
      // Create Razorpay Order
      const options = {
        amount: totalAmount * 100, // in paise
        currency: "INR",
        receipt: `booking_${Date.now()}`,
      };
      orderData = await razorpay.orders.create(options);
    }

    // Create Pending Booking
    const booking = await Booking.create({
      event: event._id,
      userName,
      userEmail,
      userPhone,
      seats,
      totalAmount,
      paymentStatus: totalAmount > 0 ? "pending" : "paid",
      status: totalAmount > 0 ? "PENDING" : "CONFIRMED",
      razorpayOrderId: orderData ? orderData.id : null,
    });

    // If free, deduct availability immediately
    if (totalAmount === 0) {
      event.availability -= seats;
      await event.save();
    }

    res.json({
      success: true,
      bookingId: booking._id,
      razorpayOrderId: orderData ? orderData.id : null,
      amount: totalAmount,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {
    console.error("Initiate booking error:", err);
    res.status(500).json({ message: "Failed to initiate booking" });
  }
};

/**
 * Verify Payment & Confirm Booking
 */
const verifyBooking = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate("event");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.totalAmount > 0) {
      const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (generated_signature !== razorpay_signature) {
        booking.paymentStatus = "failed";
        await booking.save();
        return res.status(400).json({ success: false, message: "Payment verification failed" });
      }
    }

    // Success
    booking.paymentStatus = "paid";
    booking.status = "CONFIRMED";
    booking.paymentId = razorpay_payment_id;
    await booking.save();

    // Deduct seats
    const event = await Event.findById(booking.event._id);
    if (event) {
      event.availability -= booking.seats;
      await event.save();
    }

    res.json({ success: true, message: "Booking confirmed!" });

  } catch (err) {
    console.error("Verify booking error:", err);
    res.status(500).json({ message: "Verification failed" });
  }
};

/**
 * Get Bookings (Admin)
 */
const getBookings = async (req, res) => {
  try {
    const { eventId } = req.params;
    const query = eventId ? { event: eventId } : {};

    // Default to show confirmed or paid bookings, or all?
    // Let's show all for now so admin can see pending/failures too

    const bookings = await Booking.find(query)
      .populate("event", "title date")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("Get bookings error:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

module.exports = {
  initiateBooking,
  verifyBooking,
  getBookings
};
