const Joi = require('joi');
const InvariantError = require('../exceptions/InvariantError');

const investment_offering_payload_schema = Joi.object({
  umkm_id: Joi.string().required().messages({
    'number.base': 'UMKM ID must be a number',
    'any.required': 'UMKM ID is required',
  }),
  amount: Joi.number().integer().positive().required().messages({
    'number.base': 'Investment amount must be a number',
    'number.positive': 'Investment amount must be a positive number',
    'any.required': 'Investment amount is required',
  }),
});

const investment_offering_validator = {
  validate_investment_offering_payload: (payload) => {
    const validation_result =
      investment_offering_payload_schema.validate(payload);
    if (validation_result.error) {
      throw new InvariantError(validation_result.error.message);
    }
  },
};

module.exports = investment_offering_validator;
