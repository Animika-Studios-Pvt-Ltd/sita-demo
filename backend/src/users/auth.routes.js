const express = require('express');
const router = express.Router();
const {
  login,
  setupMFA,
  verifyAndEnableMFA,
  verifyMFALogin,
  disableMFA,
  getMFAStatus,
  verifyToken,
  logout,
  getLoginHistory,
  protect
} = require('./auth.controller');

// Admin login route
router.post('/admin', login);
router.post('/logout', logout);

// ✅ ADD THIS ROUTE - This is what's missing!
router.get('/verify', verifyToken);

// Login History Route
router.get('/login-history', protect, getLoginHistory);

// MFA routes
router.post('/setup-mfa', setupMFA);
router.post('/verify-mfa-setup', verifyAndEnableMFA);
router.post('/verify-mfa-login', verifyMFALogin);
router.post('/disable-mfa', disableMFA);
router.get('/mfa-status/:userId', getMFAStatus);

module.exports = router;
