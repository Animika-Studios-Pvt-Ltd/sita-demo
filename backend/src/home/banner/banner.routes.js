const express = require("express");
const router = express.Router();
const multer = require("multer");
const { getBanner, updateBanner } = require("./banner.controller");
const { cache } = require('../../utils/cache');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', cache(60), getBanner);

router.put(
  "/:id?",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  updateBanner
);

module.exports = router;
