const express = require("express");
const router = express.Router();
const controller = require("./ReaderThoughts.controller");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", controller.getReaderThoughts);

router.post("/", upload.single("file"), controller.createOrUpdateReaderThoughts);

router.delete("/thought/:thoughtId", controller.deleteThoughtById);

router.patch("/thought/:thoughtId", controller.updateThoughtById);

module.exports = router;