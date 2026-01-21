const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String }, // ✅ NEW: Store user email for notifications
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
