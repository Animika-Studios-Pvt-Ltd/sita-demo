const jwt = require('jsonwebtoken');
const User = require('./user.model');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// ==================== LOGIN ====================
exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const adminUser = await User.findOne({ username, role: 'admin' });
    if (!adminUser) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await adminUser.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check if MFA is enabled
    if (adminUser.mfaEnabled) {
      const tempToken = jwt.sign(
        { id: adminUser._id, role: adminUser.role, mfaRequired: true },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '5m' }
      );
      return res.status(200).json({
        message: 'MFA required',
        tempToken,
        mfaRequired: true,
      });
    }

    // If MFA not enabled, issue normal token
    const token = jwt.sign(
      { id: adminUser._id, role: adminUser.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    console.log('✅ Admin login successful:', adminUser.username);

    // Set cookie
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      domain: process.env.COOKIE_DOMAIN || undefined,
      maxAge: 3600000 // 1 hour
    });

    res.status(200).json({
      message: 'Authentication successful',
      token,
      user: { username: adminUser.username, role: adminUser.role },
      mfaEnabled: false,
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== VERIFY TOKEN ====================
exports.verifyToken = async (req, res) => {
  try {
    let token;

    if (req.cookies && req.cookies.adminToken) {
      token = req.cookies.adminToken;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        valid: false,
        message: 'No token provided'
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        valid: false,
        message: 'User not found'
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        valid: false,
        message: 'Not authorized'
      });
    }

    console.log('✅ Token verified for user:', user.username);
    res.status(200).json({
      valid: true,
      userId: decoded.id,
      username: user.username,
      role: user.role
    });

  } catch (error) {
    console.error('❌ Token verification error:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        valid: false,
        message: 'Token expired'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        valid: false,
        message: 'Invalid token'
      });
    }

    res.status(500).json({
      valid: false,
      message: 'Server error during token verification'
    });
  }
};

// ==================== SETUP MFA ====================
exports.setupMFA = async (req, res) => {
  try {
    console.log('📝 SetupMFA called with body:', req.body);
    const { userId } = req.body;
    if (!userId) {
      console.log('❌ No userId provided');
      return res.status(400).json({ message: 'User ID is required' });
    }

    console.log('🔍 Looking for admin user with ID:', userId);
    const adminUser = await User.findById(userId);
    if (!adminUser) {
      console.log('❌ User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    if (adminUser.role !== 'admin') {
      console.log('❌ User is not admin');
      return res.status(403).json({ message: 'Only admins can enable MFA' });
    }

    console.log('✅ Admin user found:', adminUser.username);

    // If secret already exists, reuse it
    if (adminUser.mfaSecret) {
      console.log('⚠️ MFA secret already exists, reusing existing secret');
      const otpauth_url = speakeasy.otpauthURL({
        secret: adminUser.mfaSecret,
        label: `BookStore Admin (${adminUser.username})`,
        issuer: 'BookStore',
        encoding: 'base32'
      });
      const qrCodeUrl = await QRCode.toDataURL(otpauth_url);
      return res.status(200).json({
        message: adminUser.mfaEnabled ? 'MFA already enabled' : 'MFA setup in progress',
        qrCode: qrCodeUrl,
        secret: adminUser.mfaSecret,
        alreadySetup: true,
        mfaEnabled: adminUser.mfaEnabled
      });
    }

    console.log('✅ Generating new MFA secret (first time setup)');
    const secret = speakeasy.generateSecret({
      name: `BookStore Admin (${adminUser.username})`,
      issuer: 'BookStore',
      length: 32,
    });
    console.log('✅ Secret generated');

    // ✅ FIX: Use findByIdAndUpdate to skip validation on other fields
    await User.findByIdAndUpdate(
      userId,
      { mfaSecret: secret.base32 },
      { runValidators: false }
    );
    console.log('✅ Secret saved to database (PERMANENT)');

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
    console.log('✅ QR code generated successfully');

    res.status(200).json({
      message: 'MFA setup initiated',
      qrCode: qrCodeUrl,
      secret: secret.base32,
      alreadySetup: false,
      mfaEnabled: false
    });
  } catch (error) {
    console.error('❌ MFA setup error:', error.message);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// ==================== VERIFY AND ENABLE MFA ====================
exports.verifyAndEnableMFA = async (req, res) => {
  try {
    const { userId, token } = req.body;
    console.log('🔍 Verify MFA attempt:', { userId, token, tokenLength: token?.length });

    if (!userId || !token) {
      return res.status(400).json({ message: 'User ID and token are required' });
    }

    // Validate token format (should be 6 digits)
    if (!/^\d{6}$/.test(token)) {
      console.log('❌ Invalid token format:', token);
      return res.status(400).json({ message: 'Token must be 6 digits' });
    }

    const adminUser = await User.findById(userId);
    if (!adminUser || !adminUser.mfaSecret) {
      console.log('❌ User not found or no MFA secret');
      return res.status(404).json({ message: 'MFA setup not found. Please setup MFA first.' });
    }

    console.log('✅ User found:', adminUser.username);
    console.log('🔑 Using secret:', adminUser.mfaSecret.substring(0, 4) + '****');

    // Try verification with a larger window for time drift
    const verified = speakeasy.totp.verify({
      secret: adminUser.mfaSecret,
      encoding: 'base32',
      token: token,
      window: 6, // ✅ Allows ±3 minutes drift
    });

    console.log('🔐 Verification result:', verified);

    if (!verified) {
      const currentToken = speakeasy.totp({
        secret: adminUser.mfaSecret,
        encoding: 'base32'
      });
      console.log('❌ Verification failed. Server expects:', currentToken);
      console.log('❌ User provided:', token);

      return res.status(400).json({
        message: 'Invalid verification code. Please make sure your phone time is set to automatic and try again.',
        debug: process.env.NODE_ENV === 'development' ? {
          serverToken: currentToken,
          providedToken: token
        } : undefined
      });
    }

    // ✅ FIX: Use findByIdAndUpdate to skip validation on other fields
    await User.findByIdAndUpdate(
      userId,
      { mfaEnabled: true },
      { runValidators: false }
    );
    console.log('✅ MFA enabled for user:', adminUser.username);

    res.status(200).json({
      message: 'MFA enabled successfully',
      mfaEnabled: true,
    });
  } catch (error) {
    console.error('❌ MFA verification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== VERIFY MFA LOGIN ====================
exports.verifyMFALogin = async (req, res) => {
  try {
    const { tempToken, mfaCode } = req.body;
    console.log('🔍 MFA Login verification attempt');

    if (!tempToken || !mfaCode) {
      return res.status(400).json({ message: 'Token and MFA code are required' });
    }

    // Validate MFA code format
    if (!/^\d{6}$/.test(mfaCode)) {
      return res.status(400).json({ message: 'MFA code must be 6 digits' });
    }

    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET_KEY);
    if (!decoded.mfaRequired) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    const adminUser = await User.findById(decoded.id);
    if (!adminUser || !adminUser.mfaEnabled) {
      return res.status(404).json({ message: 'User not found or MFA not enabled' });
    }

    const verified = speakeasy.totp.verify({
      secret: adminUser.mfaSecret,
      encoding: 'base32',
      token: mfaCode,
      window: 6, // ✅ Larger window for clock drift
    });

    if (!verified) {
      const currentToken = speakeasy.totp({
        secret: adminUser.mfaSecret,
        encoding: 'base32'
      });
      console.log('❌ Login MFA failed. Expected:', currentToken, 'Got:', mfaCode);
      return res.status(400).json({ message: 'Invalid MFA code' });
    }

    const token = jwt.sign(
      { id: adminUser._id, role: adminUser.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    console.log('✅ MFA login successful for:', adminUser.username);

    // Set cookie
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      domain: process.env.COOKIE_DOMAIN || undefined,
      maxAge: 3600000 // 1 hour
    });

    res.status(200).json({
      message: 'Authentication successful',
      token,
      user: { username: adminUser.username, role: adminUser.role },
    });
  } catch (error) {
    console.error('❌ MFA login verification error:', error);
    res.status(500).json({ message: 'Invalid or expired token', error: error.message });
  }
};

// ==================== GET MFA STATUS ====================
exports.getMFAStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminUser = await User.findById(userId);
    if (!adminUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      mfaEnabled: adminUser.mfaEnabled || false,
      mfaSetup: !!adminUser.mfaSecret,
      username: adminUser.username
    });
  } catch (error) {
    console.error('❌ Get MFA status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ==================== DISABLE MFA ====================
exports.disableMFA = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // ✅ FIX: Use findByIdAndUpdate to skip validation on other fields
    const result = await User.findByIdAndUpdate(
      userId,
      {
        mfaEnabled: false,
        mfaSecret: null
      },
      { runValidators: false, new: true }
    );

    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ MFA disabled for user:', result.username);
    res.status(200).json({ message: 'MFA disabled successfully' });
  } catch (error) {
    console.error('❌ MFA disable error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== LOGOUT ====================
exports.logout = async (req, res) => {
  try {
    res.clearCookie('adminToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      domain: process.env.COOKIE_DOMAIN || undefined
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('❌ Logout error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
