const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  title: String,
  description: String,
  quote: String,
  starsCount: Number,
  logoUrl: String,
  imageUrl: String,
}, { timestamps: true });

module.exports = mongoose.model("Banner", bannerSchema);
