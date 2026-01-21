const mongoose = require("mongoose");

const preceptSchema = new mongoose.Schema({
  imageUrl: String,
  cloudinaryId: String,
  title: { type: String, default: "" }, // <-- Add this line
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Precept", preceptSchema);
