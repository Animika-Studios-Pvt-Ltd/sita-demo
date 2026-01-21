const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  cache: true,
  rateLimit: true,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

const verifyAuth0Token = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    jwt.verify(
      token,
      getKey,
      {
        // ✅ REMOVED audience - ID tokens don't have it
        issuer: `https://${process.env.AUTH0_DOMAIN}/`,
        algorithms: ['RS256']
      },
      (err, decoded) => {
        if (err) {
          console.error('❌ Auth0 token verification failed:', err.message);
          return res.status(403).json({ message: 'Invalid token.' });
        }
        req.user = decoded;
        console.log('✅ Token verified for user:', decoded.sub);
        next();
      }
    );
  } catch (err) {
    console.error('❌ Token verification error:', err.message);
    res.status(403).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyAuth0Token;
