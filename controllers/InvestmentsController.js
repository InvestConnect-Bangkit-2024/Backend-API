require('dotenv').config();
const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const investment_validator = require('../validator/InvestmentValidator');
const authenticate_token = require('../middleware/AuthenticateToken');
const { investments } = require('../models');

router.post('/investments', authenticate_token, async (req, res, next) => {
  try {
    const { umkm_id, investor_id, investment_amount, investment_type } =
      req.body;

    await investment_validator.validate_investment_payload({
      umkm_id,
      investor_id,
      investment_amount,
      investment_type,
    });

    if (investment_type === 'UMKM Request') {
    }
    const investment_id = `investment-${nanoid(16)}`;
    const confirmed_date = null;
    const status = 'Pending';

    await investment.create({
      investment_id,
      umkm_id,
      investor_id,
      investment_amount,
      created_at,
      status,
      confirmed_date,
    });

    res.status(200).json({
      message: 'Successfully added investment request',
      data: {
        investment_id: investment_id,
      },
    });
  } catch (error) {
    console.error('Error in /investments route:', error);
    next(error);
  }
});

module.exports = router;
