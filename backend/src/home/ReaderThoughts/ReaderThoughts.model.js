const mongoose = require("mongoose");

const thoughtSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  author: { type: String, required: true },
});

const readerThoughtsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: {
      url: { type: String, required: false },
      mimeType: { type: String, required: false },
    },
    thoughts: [thoughtSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReaderThoughts", readerThoughtsSchema);
