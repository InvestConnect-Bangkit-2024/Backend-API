const jwt = require('jsonwebtoken');

async function authenticate_token(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'Access token required' });
    }

    // Step 1: Verify the access token
    const decodedAccessToken = await verifyToken(
      token,
      process.env.ACCESS_TOKEN_KEY
    );

    if (!decodedAccessToken) {
      return res
        .status(403)
        .json({ message: 'Invalid or expired access token' });
    }

    req.user_id = decodedAccessToken.user_id;
    return next();
  } catch (error) {
    res.status(403).json({ message: error.message || 'Unauthorized' });
  }
}

function verifyToken(token, secret) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return resolve(null);
        }
        return reject(new Error('Invalid token'));
      }
      resolve(decoded);
    });
  });
}

module.exports = authenticate_token;
