const jwt = require("jsonwebtoken");
const User = require("../models/UsersModel"); // Adjust path to your User model
const { generateAccessToken } = require("../token/TokenManager"); // Make sure you have this utility function

function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get the access token from the Authorization header
  const refreshToken = req.body.refreshToken || req.headers["x-refresh-token"]; // Get refresh token from body or custom header

  if (!token) {
    return res.status(403).json({ message: "Access token required" });
  }

  // Step 1: Try to verify the access token
  jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
    if (err && err.name === "TokenExpiredError") {
      // If the access token is expired, check the refresh token
      if (!refreshToken) {
        return res.status(403).json({ message: "Refresh token required" });
      }

      // Step 2: Try to verify the refresh token
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY,
        async (err, decoded) => {
          if (err) {
            return res.status(403).json({ message: "Invalid refresh token" });
          }

          // Step 3: If refresh token is valid, issue a new access token
          const newAccessToken = generateAccessToken(decoded.userId);

          // Send the new access token to the client
          res.setHeader("x-new-access-token", newAccessToken); // Optionally set the new token in header
          req.userId = decoded.userId; // Attach the user ID to the request object
          return next(); // Proceed to the next middleware or route handler
        }
      );
    } else if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    } else {
      // If the access token is valid, attach the user ID to the request object
      req.userId = decoded.userId;
      return next(); // Proceed to the next middleware or route handler
    }
  });
}

module.exports = authenticateToken;
