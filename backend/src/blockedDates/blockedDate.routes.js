const express = require("express");
const router = express.Router();

const {
  getBlockedDates,
  createBlockedDate,
  deleteBlockedDate,
  updateBlockedDate,
} = require("./blockedDate.controller");

router.get("/", getBlockedDates);
router.post("/", createBlockedDate);
router.delete("/:id", deleteBlockedDate);
router.put("/:id", updateBlockedDate);

module.exports = router;
