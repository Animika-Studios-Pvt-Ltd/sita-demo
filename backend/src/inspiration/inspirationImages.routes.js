const express = require('express');
const router = express.Router();
const multer = require('multer');
const { cache, clearCache } = require('../utils/cache');

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

router.get('/', cache(600), getImages);

router.post('/upload', upload.single('image'), async (req, res, next) => {
  try {
    await uploadImage(req, res);
    await clearCache('/api/inspiration-images');
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await deleteImage(req, res);
    await clearCache('/api/inspiration-images');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
