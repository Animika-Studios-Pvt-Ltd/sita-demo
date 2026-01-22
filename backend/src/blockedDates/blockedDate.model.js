const mongoose = require("mongoose");

const blockedDateSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },        // YYYY-MM-DD
    startTime: { type: String, required: true },   // HH:mm
    endTime: { type: String, required: true },     // HH:mm
    reason: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlockedDate", blockedDateSchema);
