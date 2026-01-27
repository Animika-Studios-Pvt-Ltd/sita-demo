const EventRating = require("./eventRating.model");
const Booking = require("../booking/booking.model");
const Event = require("./event.model");

// Submit a rating for an event
exports.submitRating = async (req, res) => {
    console.log("👉 HIT: submitRating endpoint", req.body);
    try {
        const { bookingId, rating, comment } = req.body;

        // 1. Verify booking exists
        const booking = await Booking.findById(bookingId).populate("event");

        if (!booking) {
            console.log(`❌ Booking not found in DB for ID: ${bookingId}`);
            return res.status(404).json({ message: `Booking not found (ID: ${bookingId})` });
        }

        console.log(`✅ Booking found:`, booking._id);

        // 2. Check if already rated
        const existingRating = await EventRating.findOne({ booking: bookingId });
        if (existingRating) {
            return res.status(400).json({ message: "You have already rated this event" });
        }

        // 3. Create rating
        const newRating = new EventRating({
            event: booking.event._id,
            booking: bookingId,
            userEmail: booking.userEmail,
            userName: booking.userName,
            rating,
            comment,
        });

        await newRating.save();

        res.status(201).json({ message: "Rating submitted successfully", rating: newRating });
    } catch (error) {
        console.error("Error submitting rating:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get ratings for a specific event
exports.getEventRatings = async (req, res) => {
    try {
        const { eventId } = req.params;

        const ratings = await EventRating.find({ event: eventId, approved: true }).sort({ createdAt: -1 });

        // Calculate average rating
        const totalRatings = ratings.length;
        const sumRatings = ratings.reduce((acc, curr) => acc + curr.rating, 0);
        const averageRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : 0;

        res.status(200).json({ ratings, averageRating, totalRatings });
    } catch (error) {
        console.error("Error fetching ratings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// --- ADMIN FUNCTIONALITY ---

// Get all ratings (for admin dashboard)
exports.getAdminRatings = async (req, res) => {
    try {
        console.log("👉 HIT: getAdminRatings endpoint");
        const ratings = await EventRating.find().populate("event", "title").sort({ createdAt: -1 });
        console.log(`✅ Admin ratings found: ${ratings.length}`);
        res.status(200).json({ ratings }); // Consistent with typical response structure
    } catch (error) {
        console.error("❌ Error fetching admin ratings:", error.message, error); // Log full error
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
};

// Approve a rating
exports.approveRating = async (req, res) => {
    try {
        const { ratingId } = req.params;
        const rating = await EventRating.findByIdAndUpdate(ratingId, { approved: true }, { new: true });

        if (!rating) {
            return res.status(404).json({ message: "Rating not found" });
        }

        res.status(200).json({ message: "Rating approved", rating });
    } catch (error) {
        console.error("Error approving rating:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Disapprove/Delete a rating
exports.deleteRating = async (req, res) => {
    try {
        const { ratingId } = req.params;
        const rating = await EventRating.findByIdAndDelete(ratingId);

        if (!rating) {
            return res.status(404).json({ message: "Rating not found" });
        }

        // Ideally send an email to user explaining why, matching the ManageReviews frontend logic which asks for reason.
        // For now, we just delete. The frontend sends a reason, we can log it or use it if we extend this.

        res.status(200).json({ message: "Rating disapproved and removed" });
    } catch (error) {
        console.error("Error deleting rating:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
