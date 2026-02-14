const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  getEvents,
  upsertEvent,
  deleteEvent,
} = require("./event.controller");
const {
  submitRating,
  getEventRatings,
  getAdminRatings,
  approveRating,
  deleteRating,
  triggerRatingEmail,
  getAllApprovedRatings,
} = require("./eventRating.controller");

// Public
router.get("/test", (req, res) => res.json({ message: "Events route working!" }));
router.get("/", getEvents);
router.get("/ratings/approved", getAllApprovedRatings); // New route for testimonials
router.post("/rate", submitRating);
router.post("/test-email/:bookingId", triggerRatingEmail); // Test route

// Admin - Ratings
router.get("/admin/ratings", getAdminRatings);
router.patch("/admin/ratings/:ratingId/approve", approveRating);
router.delete("/admin/ratings/:ratingId/disapprove", deleteRating);

// Generic ID routes (Must come AFTER specific routes)
router.get("/:eventId/ratings", getEventRatings);

// Admin
router.post(
  "/",
  upload.fields([{ name: "image", maxCount: 1 }]),
  upsertEvent
);

router.put(
  "/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  upsertEvent
);

router.delete("/:id", deleteEvent);

module.exports = router;
