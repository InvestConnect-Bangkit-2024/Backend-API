const axios = require('axios');
require('dotenv').config();
const express = require('express');
const router = express.Router();
const { investors, investments } = require('../models/index');
const InvariantError = require('../exceptions/InvariantError');
const authenticate_token = require('../middleware/AuthenticateToken');
const investment_validator = require('../validator/InvestmentValidator');
const { nanoid } = require('nanoid');
// Routes
router.get('/investors', async (req, res, next) => {
  try {
    // const investor_list = await investor.findAll({
    //   attributes: [
    //     'investor_id',
    //     'investor_name',
    //     'img_url',
    //     'investment_focus',
    //   ],
    // });
    const investor_list = await investors.findAll();
    res
      .status(200)
      .json({ message: 'Successfully get investor list', data: investor_list });
  } catch (error) {
    console.error('Error in /investors route:', error);
    next(error);
  }
});

router.get('/investors/recommendation', async (req, res, next) => {
  try {
    const investor_list = await investor.findAll({
      attributes: ['investor_id', 'investor_name', 'investment_focus'],
    });

    const predict_response = await axios.post(`${process.env.ML_URL}/predict`, {
      investor_list,
    });

    res.status(200).json({
      message: 'Successfully get investor recommendations',
      data: predict_response,
    });
  } catch (error) {
    console.error('Error in /investors route:', error);
    next(error);
  }
});

router.get('/investors/:id', async (req, res, next) => {
  try {
    const investor_id = req.params.id;
    const investor_detail = await investors.findOne({
      where: { investor_id },
    });
    res.status(200).json({
      message: 'Successfully get investor detail',
      data: investor_detail,
    });
  } catch (error) {
    console.error('Error in /investors/:id route:', error);
    next(error);
  }
});

router.get('/investors/:id/investments', async (req, res, next) => {
  try {
    const investor_id = req.params.id;
    const result = await investors.findOne({
      where: { investor_id },
      include: [{ model: investments, as: 'investments' }],
    });
    res.status(200).json({
      message: 'Successfully get investments list associated with investor',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/investors/:id/investments', async (req, res, next) => {
  try {
    const investor_id = req.params.id;
    const { umkm_id, investment_amount } = req.body;

    await investment_validator.validate_investment_payload({
      umkm_id,
      investor_id,
      investment_amount,
    });

    await investments.create({
      investment_id: `investment-${nanoid(16)}`,
      umkm_id,
      investor_id,
      investment_amount,
      created_at: new Date(),
      status: 'Pending',
      confirmed_date: null,
      request_type: 'Investor Offer',
      investor_status: 'Review',
      umkm_status: 'Review',
    });

    return res
      .status(200)
      .json({ message: 'Successfully create investment offer' });
  } catch (error) {
    next(error);
  }
});

router.put(
  '/investors/:id/investments/:investment_id',
  authenticate_token,
  async (req, res, next) => {
    try {
      const investor_id = req.params.id;
      const investment_id = req.params.investment_id;
      const { investor_status } = req.body;

      if (investor_status !== 'Rejected' && investor_status !== 'Approved') {
        throw new InvariantError(
          'Investor status must be either "Rejected" or "Approved"'
        );
      }

      const investment = await investments.findOne({
        where: { investment_id, investor_id },
      });

      if (!investment) {
        return res.status(404).json({ message: 'Investment not found' });
      }

      await investments.update(
        { investor_status },
        { where: { investment_id, investor_id } }
      );

      if (
        investment.umkm_status === 'Approved' &&
        investor_status === 'Approved'
      ) {
        await investments.update(
          { status: 'Confirmed' },
          { where: { investment_id } }
        );
      }

      res.status(200).json({ message: 'Investor status updated successfully' });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
