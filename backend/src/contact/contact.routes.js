const express = require('express');
const router = express.Router();
const { submitContactForm } = require('./contact.controller');

router.post('/', submitContactForm);

module.exports = router;
