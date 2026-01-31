const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { uploadLetter, getAllLetters, toggleSuspendLetter } = require('./letter.controller');
const Letter = require('./letter.model');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${timestamp}-${safeName}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

router.post('/upload', upload.single('pdf'), uploadLetter);

router.get('/', getAllLetters);
router.put('/:id', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const updated = await Letter.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Letter not found' });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating letter:", error);
    res.status(500).json({ message: 'Update failed' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const letter = await Letter.findById(req.params.id);
    if (!letter) return res.status(404).json({ message: 'Letter not found' });

    await Letter.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Letter deleted successfully' });
  } catch (error) {
    console.error("Error deleting letter:", error);
    res.status(500).json({ message: 'Delete failed' });
  }
});

// ⬅️ Suspend/Unsuspend route
router.patch('/:id/suspend', toggleSuspendLetter);

module.exports = router;
