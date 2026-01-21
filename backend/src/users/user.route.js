const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, addAddress, updateAddress, deleteAddress } = require('./user.controller');
// COMMENT OUT TEMPORARILY
// const verifyAuth0Token = require('../middlewares/verifyAuth0Token');

// Remove verifyAuth0Token temporarily
router.get('/:uid', getUserProfile);
router.put('/:uid', updateUserProfile);
router.post('/:uid/addresses', addAddress);
router.put('/:uid/addresses/:addressId', updateAddress);
router.delete('/:uid/addresses/:addressId', deleteAddress);

module.exports = router;
