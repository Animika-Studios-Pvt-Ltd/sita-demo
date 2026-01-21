const mongoose = require('mongoose');

const SlideSchema = new mongoose.Schema({
  image: { type: String, required: true },
  text: { type: String, default: "" },
  author: { type: String, default: "" },
}, { _id: false });

const CornerSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  bgColor: { type: String, default: "#ffffff" },
  readMoreUrl: { type: String, default: "" },
  slides: { type: [SlideSchema], default: [] },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Corner', CornerSchema);
