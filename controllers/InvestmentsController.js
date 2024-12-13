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
const { Sequelize } = require('sequelize');
const NotFoundError = require('../exceptions/NotFoundError');
const InvariantError = require('../exceptions/InvariantError');
const AuthorizationError = require('../exceptions/AuthorizationError');

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

router.put(
  '/investments/offerings/:id',
  authenticate_token,
  async (req, res, next) => {
    try {
      const investment_offering_id = req.params.id;

      const { status } = req.body;

      const investment_offering_exist = await InvestmentOfferings.findOne({
        where: { investment_offering_id },
        attributes: ['umkm_id'],
      });

      if (!investment_offering_exist)
        throw new NotFoundError(
          `Investment offering ${investment_offering_id} not found`
        );

      const umkm_owned_by_user = await UMKM.findOne({
        where: {
          umkm_id: investment_offering_exist.umkm_id,
          user_id: req.user_id,
        },
      });

      if (!umkm_owned_by_user) {
        throw new AuthorizationError(
          `User ${req.user_id} is not allowed to change investment offerings status sent to umkm ${investment_offering_exist.umkm_id}`
        );
      }
      if (status !== 'Accepted' && status !== 'Rejected') {
        throw new InvariantError(
          'The status must be either Accepted or Rejected'
        );
      }

      await InvestmentOfferings.update(
        { status, confirmed_date: new Date() },
        { where: { investment_offering_id } }
      );

      return res
        .status(200)
        .json({ message: 'Successfully updated investment offering status' });
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
      console.log(investor_id, amount);
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

router.put(
  '/investments/requests/:id',
  authenticate_token,
  async (req, res, next) => {
    try {
      const investment_request_id = req.params.id;
      const { status } = req.body;

      const investment_request_exist = await InvestmentRequests.findOne({
        where: { investment_request_id },
        attributes: ['investor_id'],
      });

      if (!investment_request_exist) {
        throw new NotFoundError(
          `Investment request ${investment_request_id} not found`
        );
      }

      const investor_owned_by_user = await Investors.findOne({
        where: {
          investor_id: investment_request_exist.investor_id,
          user_id: req.user_id,
        },
      });

      if (!investor_owned_by_user) {
        throw new AuthorizationError(
          `User ${req.user_id} is not allowed to change investment request status sent to investor ${investment_request_exist.investor_id}`
        );
      }

      if (status !== 'Accepted' && status !== 'Rejected') {
        throw new InvariantError(
          'The status must be either Accepted or Rejected'
        );
      }

      if (status === 'Accepted') {
        const new_amount =
          investment_request_exist.amount +
          investor_owned_by_user.total_investments;
        const new_total_deals = investor_owned_by_user.total_investments + 1;

        await Investors.update(
          {
            investment_amount: new_amount,
            total_deals: new_total_deals,
          },
          {
            where: { investor_id: investment_request_exist.investor_id },
          }
        );
      }

      await InvestmentRequests.update(
        { status, confirmed_date: new Date() },
        { where: { investment_request_id } }
      );

      return res
        .status(200)
        .json({ message: 'Successfully updated investment request status' });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
