const jwt = require('jsonwebtoken');
const generate_access_token = (user_id) => {
  return jwt.sign({ user_id }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });
};

const generate_refresh_token = (user_id) => {
  return jwt.sign({ user_id }, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: '7d',
  });
};
module.exports = { generate_access_token, generate_refresh_token };
