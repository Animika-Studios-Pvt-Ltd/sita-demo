const express = require("express");
const router = express.Router();
const multer = require("multer");
const { getFoundation, updateFoundation } = require("./foundation.controller");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', getFoundation);
router.put(
  "/:id?",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  updateFoundation
);

module.exports = router;
