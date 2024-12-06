const axios = require('axios');
require('dotenv').config();
const express = require('express');
const router = express.Router();
const umkm = require('../models/UMKMModel');
const investments = require('../models/InvestmentsModel');
const investment_validator = require('../validator/InvestmentValidator');
const { nanoid } = require('nanoid');

// Routes
router.get('/umkm', async (req, res, next) => {
  try {
    const umkm_list = await umkm.findAll({
      attributes: ['umkm_id', 'company_name', 'img_url', 'sector'],
    });
    res
      .status(200)
      .json({ message: 'Successfully get umkm lists', data: umkm_list });
  } catch (error) {
    next(error);
  }
});

router.get('/umkm/:id', async (req, res, next) => {
  try {
    const umkm_id = req.params.id;
    const umkm_detail = await umkm.findOne({
      where: { umkm_id },
    });
    res
      .status(200)
      .json({ message: 'Successfully get umkm detail', data: umkm_detail });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
