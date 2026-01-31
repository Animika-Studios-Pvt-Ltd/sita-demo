const express = require('express');
const router = express.Router();
const multer = require('multer');


const {
  postABlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  suspendBlog
} = require('./blog.controller');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/create-blog', upload.single('image'), postABlog);
router.get('/', getAllBlogs);
router.get('/:slug', getSingleBlog);
router.put('/edit/:slug', upload.single('image'), updateBlog);
router.delete('/:slug', deleteBlog);
router.put('/suspend/:slug', suspendBlog);

module.exports = router;
