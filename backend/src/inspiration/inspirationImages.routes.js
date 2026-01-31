const express = require('express');
const router = express.Router();
const multer = require('multer');


const {
  getImages,
  uploadImage,
  deleteImage
} = require('./inspirationImages.controller');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/', getImages);

router.post('/upload', upload.single('image'), async (req, res, next) => {
  try {
    await uploadImage(req, res);

  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await deleteImage(req, res);

  } catch (error) {
    next(error);
  }
});

module.exports = router;
