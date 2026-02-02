const express = require('express');
const router = express.Router();

const {
    getUserProfile,
    updateUserProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    syncAuth0User
} = require('./user.controller');

router.post('/sync', syncAuth0User);
router.get('/:uid', getUserProfile);
router.put('/:uid', updateUserProfile);
router.post('/:uid/addresses', addAddress);
router.put('/:uid/addresses/:addressId', updateAddress);
router.delete('/:uid/addresses/:addressId', deleteAddress);

module.exports = router;
