const Joi = require('joi');
const InvariantError = require('../exceptions/InvariantError');

const investment_request_payload_schema = Joi.object({
  investor_id: Joi.string().required().messages({
    'number.base': 'Investor ID must be a number',
    'any.required': 'Investor ID is required',
  }),
  amount: Joi.number().integer().positive().required().messages({
    'number.base': 'Investment amount must be a number',
    'number.positive': 'Investment amount must be a positive number',
    'any.required': 'Investment amount is required',
  }),
});

const investment_request_validator = {
  validate_investment_request_payload: (payload) => {
    const validation_result =
      investment_request_payload_schema.validate(payload);
    if (validation_result.error) {
      throw new InvariantError(validation_result.error.message);
    }
  },
};

module.exports = investment_request_validator;
