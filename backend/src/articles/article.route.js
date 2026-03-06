const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
    postAnArticle,
    getAllArticles,
    getSingleArticle,
    updateArticle,
    deleteArticle,
    suspendArticle,
    syncSubstackArticles
} = require('./article.controller');

const storage = multer.memoryStorage();
const upload = multer({ storage });
router.post('/create-article', upload.single('image'), postAnArticle);
router.get('/sync-substack', syncSubstackArticles);
router.get('/', getAllArticles);
router.get('/:slug', getSingleArticle);
router.put('/edit/:slug', upload.single('image'), updateArticle);
router.delete('/:slug', deleteArticle);
router.put('/suspend/:slug', suspendArticle);

module.exports = router;