const Joi = require('joi');
const InvariantError = require('../exceptions/InvariantError');

const login_payload_schema = Joi.object({
  username: Joi.string().required().messages({
    'string.base': 'Username must be a string',
    'any.required': 'Username is required',
  }),
  password: Joi.string().required().messages({
    'string.base': 'Password must be a string',
    'any.required': 'Password is required',
  }),
});

const authentication_validator = {
  validate_login_payload: (payload) => {
    const validation_result = login_payload_schema.validate(payload);
    if (validation_result.error) {
      throw new InvariantError(validation_result.error.message);
    }
  },
};

module.exports = authentication_validator;
