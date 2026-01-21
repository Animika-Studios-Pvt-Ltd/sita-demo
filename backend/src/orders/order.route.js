const express = require('express');
const { cache, clearCache } = require('../utils/cache'); 
const {
  createAOrder,
  getOrderByUserId,
  getAllOrders,
  updateOrderById,
  requestReturn,
  getPendingReturnRequests,
  approveReturn,
  rejectReturn,
} = require('./order.controller');

const router = express.Router();
router.get('/', cache(30), getAllOrders);
router.get('/user/:userId', cache(60), getOrderByUserId);
router.get('/return-requests', cache(30), getPendingReturnRequests);
router.post('/', async (req, res, next) => {
  try {
    await createAOrder(req, res);
    await clearCache('/api/orders*');
  } catch (error) {
    next(error);
  }
});
router.patch('/:id', async (req, res, next) => {
  try {
    await updateOrderById(req, res);
    await clearCache('/api/orders*');
  } catch (error) {
    next(error);
  }
});

router.post('/request-return/:orderId', async (req, res, next) => {
  try {
    await requestReturn(req, res);
    await clearCache('/api/orders*');
  } catch (error) {
    next(error);
  }
});
router.post('/approve-return/:orderId', async (req, res, next) => {
  try {
    await approveReturn(req, res);
    await clearCache('/api/orders*');
  } catch (error) {
    next(error);
  }
});

router.post('/reject-return/:orderId', async (req, res, next) => {
  try {
    await rejectReturn(req, res);
    await clearCache('/api/orders*');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
