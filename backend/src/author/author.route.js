const express = require('express');
const router = express.Router();
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  getAuthorContent,
  upsertAuthorContent,
  uploadWorkingCreedImage,
  deleteWorkingCreedImage
} = require('./author.controller');

// GET: Fetch author content (cache for 10 minutes)
router.get('/', getAuthorContent);

// POST: Update author content (no cache, clear in controller)
router.post('/',
  upload.fields([
    { name: 'motifImage', maxCount: 1 },
    { name: 'rightImage', maxCount: 1 },
    { name: 'leftImage', maxCount: 1 },
    { name: 'middleImage', maxCount: 1 }
  ]),
  upsertAuthorContent
);

// NEW: Upload Working Creed Image
router.post('/working-creed/upload', upload.single('image'), uploadWorkingCreedImage);

// NEW: Delete Working Creed Image
router.delete('/working-creed/delete', deleteWorkingCreedImage);

module.exports = router;
