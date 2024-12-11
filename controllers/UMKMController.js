const axios = require('axios');
require('dotenv').config();
const express = require('express');
const router = express.Router();
const { UMKM } = require('../models/index');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const authenticate_token = require('../middleware/AuthenticateToken');
const umkm_validator = require('../validator/UMKMValidator');
const storage = require('../config/storage');
const bucket_name = 'investconnect-bucket';
const upload_image = require('../middleware/UploadImage');
// Routes
router.get('/umkm', authenticate_token, async (req, res, next) => {
  try {
    // const umkm_list = await umkm.findAll({
    //   attributes: ['umkm_id', 'company_name', 'img_url', 'sector'],
    // });
    const umkm_list = await UMKM.findAll();
    res
      .status(200)
      .json({ message: 'Successfully get umkm lists', data: umkm_list });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/umkm',
  authenticate_token,
  upload_image.single('img_file'),
  async (req, res, next) => {
    try {
      const {
        company_name,
        founding_date,
        founder_name,
        location,
        sector,
        stage,
        description,
        team_members,
        business_model,
        loyal_customers,
        market_size,
        market_target,
        amount_seeking,
        funding_raised,
        revenue,
        profitability,
        growth_rate,
        preferred_investment_type,
        intended_use_of_funds,
        phone_number,
      } = req.body;

      await umkm_validator.validate_umkm_payload({
        company_name,
        founding_date,
        founder_name,
        location,
        sector,
        stage,
        description,
        team_members,
        business_model,
        loyal_customers,
        market_size,
        market_target,
        amount_seeking,
        funding_raised,
        revenue,
        profitability,
        growth_rate,
        preferred_investment_type,
        intended_use_of_funds,
        phone_number,
      });

      console.log('here 1');
      const user_id = req.user_id;
      const umkm_id = `umkm-${nanoid(16)}`;
      const img_file = req.file;
      console.log('here 2');

      if (!img_file) {
        throw new InvariantError('Image file is required');
      }
      console.log('here 3');

      const blob = storage
        .bucket(bucket_name)
        .file(`images/${umkm_id}-image.jpg`);
      const blobStream = blob.createWriteStream();

      blobStream.on('error', (err) => {
        next(err);
      });

      blobStream.on('finish', async () => {
        console.log('here 5');
        const img_url = `https://storage.googleapis.com/${bucket_name}/${blob.name}`;
        await UMKM.create({
          umkm_id,
          user_id,
          company_name,
          img_url,
          founding_date,
          founder_name,
          location,
          sector,
          stage,
          description,
          team_members,
          business_model,
          amount_seeking,
          preferred_investment_type,
          intended_use_of_funds,
          loyal_customers,
          market_size,
          market_target,
          funding_raised,
          revenue,
          profitability,
          growth_rate,
          phone_number,
        });
        console.log('here 6');
      });

      console.log('here 7');
      res
        .status(200)
        .json({ message: 'Successfully created new UMKM', data: umkm_id });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/umkm/:id', async (req, res, next) => {
  try {
    const umkm_id = req.params.id;
    const umkm_detail = await UMKM.findOne({
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
