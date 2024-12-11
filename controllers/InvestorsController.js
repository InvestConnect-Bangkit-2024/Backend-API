const axios = require('axios');
require('dotenv').config();
const express = require('express');
const router = express.Router();
const { Investors } = require('../models/index');
const InvariantError = require('../exceptions/InvariantError');
const authenticate_token = require('../middleware/AuthenticateToken');
const { nanoid } = require('nanoid');

const storage = require('../config/storage');
const bucket_name = 'investconnect-bucket';
const upload = require('../middleware/UploadImage');

const investor_validator = require('../validator/InvestorValidator');
// Routes
router.get('/investors', authenticate_token, async (req, res, next) => {
  try {
    // const investor_list = await investor.findAll({
    //   attributes: [
    //     'investor_id',
    //     'investor_name',
    //     'img_url',
    //     'investment_focus',
    //   ],
    // });
    const investor_list = await Investors.findAll();
    res
      .status(200)
      .json({ message: 'Successfully get investor list', data: investor_list });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/investors',
  authenticate_token,
  upload.single('img_file'),
  async (req, res, next) => {
    try {
      const {
        investor_name,
        location,
        investment_focus,
        stages,
        thesis,
        total_deals,
        total_investments,
        deal_type,
        geographic_focus,
        criteria,
        phone_number,
      } = req.body;

      await investor_validator.validate_investor_payload({
        investor_name,
        location,
        investment_focus,
        stages,
        thesis,
        total_deals,
        total_investments,
        deal_type,
        geographic_focus,
        criteria,
        phone_number,
      });
      const user_id = req.user_id;
      const investor_id = `investor-${nanoid(16)}`;

      if (!req.file) {
        throw new InvariantError('Image file is required');
      }

      const bucket = storage.bucket(bucket_name);
      const blob = bucket.file(`images/${investor_id}-image.jpg`);
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: req.file.mimetype,
      });

      blobStream.on('error', (err) => {
        next(err);
      });

      blobStream.on('finish', async () => {
        console.log('here');
        const img_url = `https://storage.googleapis.com/${bucket_name}/${blob.name}`;
        const new_investor = await Investors.build({
          investor_id,
          user_id,
          investor_name,
          img_url,
          location,
          investment_focus,
          stages,
          thesis,
          total_deals,
          total_investments,
          deal_type,
          geographic_focus,
          criteria,
          phone_number,
        });

        await new_investor.save();
      });
      blobStream.end(req.file.buffer);
      res.status(200).json({
        message: 'Successfully created new investor',
        data: { investor_id },
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get('/investors/:id', authenticate_token, async (req, res, next) => {
  try {
    const investor_id = req.params.id;
    const investor_detail = await Investors.findOne({
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
