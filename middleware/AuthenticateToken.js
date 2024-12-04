const jwt = require('jsonwebtoken');
const { generate_access_token } = require('../token/TokenManager');

function authenticate_token(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  const refresh_token =
    req.body.refresh_token || req.headers['x-refresh-token'];

  if (!token) {
    return res.status(403).json({ message: 'Access token required' });
  }

  // Step 1: Try to verify the access token
  jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
    if (err && err.name === 'TokenExpiredError') {
      if (!refresh_token) {
        return res.status(403).json({ message: 'Refresh token required' });
      }

      // Step 2: Try to verify the refresh token
      jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN_KEY,
        async (err, decoded) => {
          if (err) {
            return res.status(403).json({ message: 'Invalid refresh token' });
          }

          // Step 3: If refresh token is valid, issue a new access token
          const newAccessToken = generate_access_token(decoded.userId);

          res.setHeader('x-new-access-token', newAccessToken);
          req.userId = decoded.userId;
          return next();
        }
      );
    } else if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    } else {
      req.userId = decoded.userId;
      return next();
    }
  });
}

module.exports = authenticate_token;
