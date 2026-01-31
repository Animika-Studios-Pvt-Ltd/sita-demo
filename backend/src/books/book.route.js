const express = require('express');
const router = express.Router();


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

router.get('/', getAllBooks);

router.get('/user', getAllBooksForUsers);

router.get('/:slug', getSingleBook);

router.delete('/:slug', deleteABook);

router.put('/suspend/:slug', suspendBook);

router.put('/unsuspend/:slug', unsuspendBook);

module.exports = router;
