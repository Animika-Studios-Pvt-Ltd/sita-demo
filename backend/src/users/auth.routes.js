const express = require('express');
const router = express.Router();
const {
  login,
  setupMFA,
  verifyAndEnableMFA,
  verifyMFALogin,
  disableMFA,
  getMFAStatus,
  verifyToken  // ✅ ADD THIS - This is the missing import!
} = require('./auth.controller');

// Admin login route
router.post('/admin', login);

// ✅ ADD THIS ROUTE - This is what's missing!
router.get('/verify', verifyToken);

// MFA routes
router.post('/setup-mfa', setupMFA);
router.post('/verify-mfa-setup', verifyAndEnableMFA);
router.post('/verify-mfa-login', verifyMFALogin);
router.post('/disable-mfa', disableMFA);
router.get('/mfa-status/:userId', getMFAStatus);

module.exports = router;
