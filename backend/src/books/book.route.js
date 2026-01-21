const express = require('express');
const router = express.Router();
const { cache } = require('../utils/cache');

const { 
  postABook, 
  getAllBooks, 
  getSingleBook, 
  updateBook, 
  deleteABook, 
  suspendBook, 
  unsuspendBook, 
  getAllBooksForUsers 
} = require('./book.controller');
const upload = require('../middlewares/upload.middleware');

router.post('/create-book', 
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'backImage', maxCount: 1 }
  ]), 
  postABook
);

router.put('/edit/:slug', 
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'backImage', maxCount: 1 }
  ]), 
  updateBook
);

router.get('/', cache(30), getAllBooks);

router.get('/user', cache(300), getAllBooksForUsers);

router.get('/:slug', cache(60), getSingleBook);

router.delete('/:slug', deleteABook);

router.put('/suspend/:slug', suspendBook);

router.put('/unsuspend/:slug', unsuspendBook);

module.exports = router;
