const mongoose = require('mongoose');
const ParagraphSchema = new mongoose.Schema({
  text: { type: String, required: true },
  style: { type: String, default: '' },
}, { _id: false });

const foundationSchema = new mongoose.Schema({
  title: String,
  description: String,
  paragraphs: { type: [ParagraphSchema], default: [] },
  quote: String,
  starsCount: Number,
  logoUrl: String,
  imageUrl: String,
}, { timestamps: true });

module.exports = mongoose.model("Foundation", foundationSchema);
