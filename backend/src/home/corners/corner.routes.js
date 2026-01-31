const express = require("express");
const multer = require("multer");
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const { getCorners, upsertCorners } = require("./corner.controller");

router.get('/', getCorners);

router.post("/", upload.any(), upsertCorners);

module.exports = router;