const jwt = require("jsonwebtoken");
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: "7d",
  });
};
module.exports = { generateAccessToken, generateRefreshToken };
