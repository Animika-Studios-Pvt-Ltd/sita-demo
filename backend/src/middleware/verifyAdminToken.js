const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied. No token provided or malformed header' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      const msg = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid credentials';
      return res.status(403).json({ message: msg });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: 'Access Denied. Admins only.' });
    }

    req.user = user;
    next();
  });
};
module.exports = verifyAdminToken;
