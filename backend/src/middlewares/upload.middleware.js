// middlewares/upload.middleware.js
const multer = require("multer");

// Use memory storage so files are stored in buffer for processing (like uploading to Cloudinary)
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
