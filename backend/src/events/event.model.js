const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: String, required: true },
    fees: { type: String },
    capacity: { type: Number },
    ageGroup: { type: String },
    description: { type: String },

    // Optional poster/banner
    imageUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
