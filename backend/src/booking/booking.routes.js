const express = require("express");
const router = express.Router();
const { initiateBooking, verifyBooking, getBookings } = require("./booking.controller");

router.post("/initiate", initiateBooking);
router.post("/verify", verifyBooking);
router.get("/:eventId", getBookings); // Get bookings for a specific event
router.get("/", getBookings); // Get all bookings

module.exports = router;
