const axios = require('axios');
require('dotenv').config();
const express = require('express');
const router = express.Router();
const investor = require('../models/InvestorsModel');
// Routes
router.get('/investors', async (req, res, next) => {
  try {
    const investor_list = await investor.findAll({
      attributes: ['investor_id', 'investor_name', 'investment_focus'],
    });
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
    const investor_detail = await investor.findOne({
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

module.exports = router;
