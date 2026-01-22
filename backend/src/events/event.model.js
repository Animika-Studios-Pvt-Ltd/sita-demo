const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: { type: String, required: true },

    date: { type: String, required: true },       // YYYY-MM-DD
    startTime: { type: String, required: true },  // HH:mm
    endTime: { type: String, required: true },    // HH:mm

    location: { type: String },
    mode: { type: String },
    availability: {
      type: Number,
      default: 0,
      min: 0,
    },

    fees: { type: String },
    capacity: { type: String },
    ageGroup: { type: String },
    description: { type: String },

    bookingUrl: {
      type: String,
      default: null,
    },

    imageUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
