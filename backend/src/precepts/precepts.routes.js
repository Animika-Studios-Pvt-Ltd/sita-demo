const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const preceptsController = require("./precepts.controller");
// Multer config - store files locally before upload to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed!"), false);
  },
});


// Routes
router.get("/", preceptsController.getPrecepts);
router.post("/upload", upload.single("image"), preceptsController.uploadImage);
router.delete("/:id", preceptsController.deletePrecept);

module.exports = router;