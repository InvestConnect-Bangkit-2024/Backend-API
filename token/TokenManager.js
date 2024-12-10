const jwt = require('jsonwebtoken');
const generate_access_token = (user_id) => {
  return jwt.sign({ user_id }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });
};

module.exports = { generate_access_token };
