const mongoose = require("mongoose");

const inspirationImageSchema = new mongoose.Schema({
  imageUrl: String,
  cloudinaryId: String,
  title: { type: String, default: "" },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("InspirationImage", inspirationImageSchema);
