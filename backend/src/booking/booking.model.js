const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userPhone: { type: String },

    status: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED", "PENDING"],
      default: "PENDING",
    },

    seats: { type: Number, default: 1 },
    totalAmount: { type: Number, required: true },

    paymentId: { type: String },
    razorpayOrderId: { type: String },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },

    bookedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
