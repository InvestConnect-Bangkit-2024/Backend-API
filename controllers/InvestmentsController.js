const { nanoid } = require('nanoid');
const authenticate_token = require('../middleware/AuthenticateToken');
const express = require('express');
const router = express.Router();
const {
  InvestmentOfferings,
  InvestmentRequests,
  UMKM,
  Investors,
} = require('../models/index');
const investment_offering_validator = require('../validator/InvestmentOfferingValidator');
const investment_request_validator = require('../validator/InvestmentRequestValidator');
const NotFoundError = require('../exceptions/NotFoundError');
const { Sequelize } = require('sequelize');

router.get(
  '/investments/offerings/sent',
  authenticate_token,
  async (req, res, next) => {
    try {
      const investment_offerings = await InvestmentOfferings.findAll({
        where: {
          user_id: req.user_id,
        },
      });
      res.status(200).json({
        message: `Successfully get list of investment offerings for ${req.user_id}`,
        data: investment_offerings,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/investments/offerings/received',
  authenticate_token,
  async (req, res, next) => {
    try {
      const umkm_list = await UMKM.findAll({
        where: { user_id: req.user_id },
        attributes: ['umkm_id'],
      });

      const umkm_ids = umkm_list.map((umkm) => umkm.umkm_id);

      const investment_offerings = await InvestmentOfferings.findAll({
        where: {
          umkm_id: {
            [Sequelize.Op.in]: umkm_ids,
          },
        },
      });

      res.status(200).json({
        message: 'Successfully fetched list of received investment offerings',
        data: investment_offerings,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/investments/offerings',
  authenticate_token,
  async (req, res, next) => {
    try {
      const { umkm_id, amount } = req.body;

      await investment_offering_validator.validate_investment_offering_payload({
        umkm_id,
        amount,
      });

      const umkmExist = await UMKM.findOne({ where: { umkm_id } });

      if (!umkmExist) {
        throw new NotFoundError(`UMKM ${umkm_id} does not exist`);
      }

      const investment_offering_id = `investment-${nanoid(16)}`;
      const new_investment_offering = await InvestmentOfferings.build({
        investment_offering_id,
        user_id: req.user_id,
        umkm_id,
        amount,
        created_at: new Date(),
        status: 'Pending',
        confirmed_date: null,
      });
      await new_investment_offering.save();
      return res.status(200).json({
        message: 'Successfully create investment offering',
        data: { investment_offering_id },
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/investments/requests/sent',
  authenticate_token,
  async (req, res, next) => {
    try {
      const investment_requests = await InvestmentRequests.findAll({
        where: { user_id: req.user_id },
      });
      res.status(200).json({
        message: `Successfully get list of investment requests for ${req.user_id}`,
        data: investment_requests,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/investments/requests/received',
  authenticate_token,
  async (req, res, next) => {
    try {
      const investor_list = await Investors.findAll({
        where: { user_id: req.user_id },
        attributes: ['investor_id'],
      });

      const investor_ids = investor_list.map(
        (investor) => investor.investor_id
      );

      const investment_requests = await InvestmentRequests.findAll({
        where: {
          investor_id: {
            [Sequelize.Op.in]: investor_ids,
          },
        },
      });

      res.status(200).json({
        message: `Successfully get list of investment requests for ${req.user_id}`,
        data: investment_requests,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/investments/requests',
  authenticate_token,
  async (req, res, next) => {
    try {
      const { investor_id, amount } = req.body;
      await investment_request_validator.validate_investment_request_payload({
        investor_id,
        amount,
      });
      const investorExist = await Investors.findOne({ where: { investor_id } });
      if (!investorExist) {
        throw new NotFoundError(`Investor ${investor_id} does not exist`);
      }

      const investment_request_id = `investment-${nanoid(16)}`;

      await InvestmentRequests.create({
        investment_request_id,
        user_id: req.user_id,
        investor_id,
        amount,
        created_at: new Date(),
        status: 'Pending',
        confirmed_date: null,
      });

      return res.status(200).json({
        message: 'Successfully create investment request',
        data: { investment_request_id },
      });
    } catch (err) {
      next(err);
    }
  }
);
module.exports = router;
