const Joi = require('joi');
const InvariantError = require('../exceptions/InvariantError');

const investor_payload_schema = Joi.object({
  investor_name: Joi.string().required().messages({
    'string.base': 'Investor name must be a string',
    'any.required': 'Investor name is required',
  }),
  location: Joi.string().required().messages({
    'string.base': 'Location must be a string',
    'any.required': 'Location is required',
  }),
  investment_focus: Joi.string().required().messages({
    'string.base': 'Investment focus must be a string',
    'any.required': 'Investment focus is required',
  }),
  stages: Joi.string().required().messages({
    'string.base': 'Stages must be a string',
    'any.required': 'Stages is required',
  }),
  thesis: Joi.string().required().messages({
    'string.base': 'Thesis must be a string',
    'any.required': 'Thesis is required',
  }),
  total_deals: Joi.number().required().messages({
    'number.base': 'Total deals must be a number',
    'any.required': 'Total deals is required',
  }),
  total_investments: Joi.number().required().messages({
    'number.base': 'Total investments must be a number',
    'any.required': 'Total investments is required',
  }),
  deal_type: Joi.string().required().messages({
    'string.base': 'Deal type must be a string',
    'any.required': 'Deal type is required',
  }),
  geographic_focus: Joi.string().required().messages({
    'string.base': 'Geographic focus must be a string',
    'any.required': 'Geographic focus is required',
  }),
  criteria: Joi.string().required().messages({
    'string.base': 'Criteria must be a string',
    'any.required': 'Criteria is required',
  }),
});

const investor_validator = {
  validate_investor_payload: (payload) => {
    const validation_result = investor_payload_schema.validate(payload);
    if (validation_result.error) {
      throw new InvariantError(validation_result.error.message);
    }
  },
};

module.exports = investor_validator;
