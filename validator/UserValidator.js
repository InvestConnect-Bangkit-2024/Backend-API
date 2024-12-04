const Joi = require('joi');
const InvariantError = require('../exceptions/InvariantError');

const user_payload_schema = Joi.object({
  username: Joi.string().required().messages({
    'string.base': 'Username must be a string',
    'any.required': 'Username is required',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': 'Password must be a string',
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required',
  }),
  fullname: Joi.string().required().messages({
    'string.base': 'Fullname must be a string',
    'any.required': 'Fullname is required',
  }),
  phone_number: Joi.string().required().messages({
    'string.base': 'Phone number must be a string',
    'any.required': 'Phone number is required',
  }),
  type: Joi.string().valid('UMKM', 'Investor').required().messages({
    'string.base': 'Type must be a string',
    'any.required': 'Type is required',
    'any.only': 'Type must be either UMKM or Investor',
  }),
});

const user_validator = {
  validate_user_payload: (payload) => {
    const validation_result = user_payload_schema.validate(payload);
    if (validation_result.error) {
      throw new InvariantError(validation_result.error.message);
    }
  },
};

// Export the validator
module.exports = user_validator;
