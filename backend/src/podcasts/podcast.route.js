const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
    createPodcast,
    getAllPodcasts,
    getSinglePodcast,
    updatePodcast,
    deletePodcast,
    suspendPodcast
} = require('./podcast.controller');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/create-podcast', upload.single('thumbnail'), createPodcast);
router.get('/', getAllPodcasts);
router.get('/:slug', getSinglePodcast);
router.put('/edit/:slug', upload.single('thumbnail'), updatePodcast);
router.delete('/:slug', deletePodcast);
router.put('/suspend/:slug', suspendPodcast);

module.exports = router;
