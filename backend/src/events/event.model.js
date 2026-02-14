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

    date: { type: String, required: true }, // YYYY-MM-DD
    startTime: { type: String, required: true }, // HH:mm
    endTime: { type: String, required: true }, // HH:mm

    location: { type: String },
    mode: { type: String },

    capacity: {
      type: Number,
      required: true,
      min: 0,
    },

    availability: {
      type: Number,
      min: 0,
    },

    category: {
      type: String,
      enum: [
        "Yoga Therapy",
        "Ayurveda – Nutrition & Integration",
        "Kosha Counselling",
        "Soul Curriculum",
        "Release Karmic Patterns",
        "Others",
      ],
      required: true,
    },

    fees: { type: String },
    price: { type: Number, default: 0 },
    ageGroup: { type: String },
    description: { type: String },

    bookingUrl: {
      type: String,
      default: null,
    },

    imageUrl: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", eventSchema);
