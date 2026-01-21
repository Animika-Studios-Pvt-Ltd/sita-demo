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

// Public
router.get("/", getEvents);

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
