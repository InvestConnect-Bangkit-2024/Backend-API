const axios = require('axios');
require('dotenv').config();
const express = require('express');
const router = express.Router();
const { models, umkm, investments } = require('../models/index');
const investment_validator = require('../validator/InvestmentValidator');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const { response } = require('../app');
const NotFoundError = require('../exceptions/NotFoundError');

// Routes
router.get('/umkm', async (req, res, next) => {
  try {
    // const umkm_list = await umkm.findAll({
    //   attributes: ['umkm_id', 'company_name', 'img_url', 'sector'],
    // });
    const umkm_list = await umkm.findAll();
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

router.get('/umkm/:id/investments', async (req, res, next) => {
  try {
    const umkm_id = req.params.id;
    const result = await umkm.findOne({
      where: { umkm_id },
      include: [{ model: investments, as: 'investments' }],
    });
    res.status(200).json({
      message: 'Successfully get list of invesment on umkm',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/umkm/:id/investments/:investment_id', async (req, res, next) => {
  try {
    const umkm_id = req.params.id;
    const invesment_id = req.params.investment_id;

    const { umkm_status } = rqe.body;

    if (umkm_status !== 'Rejected' && umkm_status !== 'Approved') {
      throw new InvariantError(
        'UMKM status must be either "rejected" or "approved"'
      );
    }

    const investment = await investments.findOne({
      where: { investment_id, umkm_id },
    });

    if (!investment) {
      throw new NotFoundError('Investment not found');
    }

    await investments.update(
      { umkm_status },
      { where: { investment_id, umkm_id } }
    );

    if (
      investment.investor_status === 'Approved' &&
      umkm_status === 'Approved'
    ) {
      await investments.update(
        { status: 'Confirmed' },
        { where: { investment_id } }
      );
    }

    res.status(200).json({ message: 'UMKM status updated successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
