const mongoose = require("mongoose");

const eventRatingSchema = new mongoose.Schema(
    {
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
        },
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },
        userEmail: { type: String, required: true },
        userName: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String },
        approved: { type: Boolean, default: false }, // Moderation required
    },
    { timestamps: true }
);

// Prevent duplicate ratings for the same booking AND same user email
eventRatingSchema.index({ booking: 1, userEmail: 1 }, { unique: true });

module.exports = mongoose.model("EventRating", eventRatingSchema);
