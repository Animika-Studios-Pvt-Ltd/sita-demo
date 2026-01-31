const express = require('express');

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
router.get('/', getAllOrders);
router.get('/user/:userId', getOrderByUserId);
router.get('/return-requests', getPendingReturnRequests);
router.post('/', async (req, res, next) => {
  try {
    await createAOrder(req, res);

  } catch (error) {
    next(error);
  }
});
router.patch('/:id', async (req, res, next) => {
  try {
    await updateOrderById(req, res);

  } catch (error) {
    next(error);
  }
});

router.post('/request-return/:orderId', async (req, res, next) => {
  try {
    await requestReturn(req, res);

  } catch (error) {
    next(error);
  }
});
router.post('/approve-return/:orderId', async (req, res, next) => {
  try {
    await approveReturn(req, res);

  } catch (error) {
    next(error);
  }
});

router.post('/reject-return/:orderId', async (req, res, next) => {
  try {
    await rejectReturn(req, res);

  } catch (error) {
    next(error);
  }
});

module.exports = router;
