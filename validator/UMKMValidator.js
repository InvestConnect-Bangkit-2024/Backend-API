const Joi = require('joi');
const InvariantError = require('../exceptions/InvariantError');

const umkm_payload_schema = Joi.object({
  company_name: Joi.string().max(255).required().messages({
    'string.base': 'Company name must be a string',
    'any.required': 'Company name is required',
    'string.max': 'Company name must be less than or equal to 255 characters',
  }),
  founding_date: Joi.date().required().messages({
    'date.base': 'Founding date must be a valid date',
    'any.required': 'Founding date is required',
  }),
  founder_name: Joi.string().max(255).required().messages({
    'string.base': 'Founder name must be a string',
    'any.required': 'Founder name is required',
    'string.max': 'Founder name must be less than or equal to 255 characters',
  }),
  location: Joi.string().max(255).required().messages({
    'string.base': 'Location must be a string',
    'any.required': 'Location is required',
    'string.max': 'Location must be less than or equal to 255 characters',
  }),
  sector: Joi.string().max(255).required().messages({
    'string.base': 'Sector must be a string',
    'any.required': 'Sector is required',
    'string.max': 'Sector must be less than or equal to 255 characters',
  }),
  stage: Joi.string().max(255).required().messages({
    'string.base': 'Stage must be a string',
    'any.required': 'Stage is required',
    'string.max': 'Stage must be less than or equal to 255 characters',
  }),
  description: Joi.string().required().messages({
    'string.base': 'Description must be a string',
    'any.required': 'Description is required',
  }),
  team_members: Joi.number().integer().positive().required().messages({
    'number.base': 'Team members must be a positive integer',
    'any.required': 'Team members are required',
    'number.integer': 'Team members must be an integer',
    'number.positive': 'Team members must be a positive number',
  }),
  business_model: Joi.string().max(255).optional().messages({
    'string.base': 'Business model must be a string',
    'string.max': 'Business model must be less than or equal to 255 characters',
  }),
  loyal_customers: Joi.number().integer().optional().messages({
    'number.base': 'Loyal customers must be an integer',
    'number.integer': 'Loyal customers must be an integer',
  }),
  market_size: Joi.number().integer().optional().messages({
    'number.base': 'Market size must be an integer',
    'number.integer': 'Market size must be an integer',
  }),
  market_target: Joi.string().max(255).optional().messages({
    'string.base': 'Market target must be a string',
    'string.max': 'Market target must be less than or equal to 255 characters',
  }),
  amount_seeking: Joi.number().positive().required().messages({
    'number.base': 'Amount seeking must be a number',
    'any.required': 'Amount seeking is required',
    'number.positive': 'Amount seeking must be a positive number',
  }),
  funding_raised: Joi.number().integer().optional().messages({
    'number.base': 'Funding raised must be an integer',
    'number.integer': 'Funding raised must be an integer',
  }),
  revenue: Joi.number().integer().optional().messages({
    'number.base': 'Revenue must be an integer',
    'number.integer': 'Revenue must be an integer',
  }),
  profitability: Joi.number().precision(2).optional().messages({
    'number.base': 'Profitability must be a number',
    'number.precision': 'Profitability must be up to 2 decimal places',
  }),
  growth_rate: Joi.number().integer().optional().messages({
    'number.base': 'Growth rate must be an integer',
    'number.integer': 'Growth rate must be an integer',
  }),
  preferred_investment_type: Joi.string().max(255).required().messages({
    'string.base': 'Preferred investment type must be a string',
    'any.required': 'Preferred investment type is required',
    'string.max':
      'Preferred investment type must be less than or equal to 255 characters',
  }),
  intended_use_of_funds: Joi.string().required().messages({
    'string.base': 'Intended use of funds must be a string',
    'any.required': 'Intended use of funds is required',
  }),
  phone_number: Joi.string().max(255).optional().messages({
    'string.base': 'Phone number must be a string',
    'string.max': 'Phone number must be less than or equal to 255 characters',
  }),
});

const umkm_validator = {
  validate_umkm_payload: (payload) => {
    const validation_result = umkm_payload_schema.validate(payload);
    if (validation_result.error) {
      throw new InvariantError(validation_result.error.message);
    }
  },
};

module.exports = umkm_validator;
