const express = require('express');
const { nanoid } = require('nanoid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const user = require('../models/UsersModel');
const investor = require('../models/InvestorsModel');
const umkm = require('../models/UMKMModel');
const {
  generate_access_token,
  generate_refresh_token,
} = require('../token/TokenManager');
const authenticate_token = require('../middleware/AuthenticateToken');
const user_validator = require('../validator/UserValidator');
const investor_validator = require('../validator/InvestorValidator');
const umkm_validator = require('../validator/UMKMValidator');
const storage = require('../config/storage');
const bucketName = 'investconnect-bucket';
const upload_image = require('../middleware/UploadImage');
const AuthenticationError = require('../exceptions/AuthenticationError');

router.post(
  '/register',
  upload_image.single('img_file'),
  async (req, res, next) => {
    try {
      const { username, email, password, fullname, phone_number, type } =
        req.body;

      await user_validator.validate_user_payload({
        username,
        email,
        password,
        fullname,
        phone_number,
        type,
      });

      const existingUser = await user.findOne({
        where: { email },
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ status: 'fail', message: 'Email already taken' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      let user_id;
      if (type == 'UMKM') user_id = `umkm-${nanoid(16)}`;
      else if (type == 'Investor') user_id = `investor-${nanoid(16)}`;

      let newUser = await user.build({
        user_id,
        username,
        email,
        password: hashedPassword,
        fullname,
        phone_number,
        type,
      });

      const img_file = req.file;
      if (!img_file) {
        return res
          .status(400)
          .json({ status: 'fail', message: 'Image file is required' });
      }

      const blob = storage
        .bucket(bucketName)
        .file(`images/${user_id}-image.jpg`);
      const blobStream = blob.createWriteStream();

      blobStream.on('error', (err) => {
        next(err);
      });

      blobStream.on('finish', async () => {
        const img_url = `https://storage.googleapis.com/${bucketName}/${blob.name}`;

        if (type === 'UMKM') {
          const {
            company_name,
            founding_date,
            location,
            sector,
            stage,
            description,
            founder_name,
            amount_seeking,
            preferred_investment_type,
            intended_use_of_funds,
          } = req.body;

          await umkm_validator.validate_umkm_payload({
            company_name,
            founding_date,
            location,
            sector,
            stage,
            description,
            founder_name,
            amount_seeking,
            preferred_investment_type,
            intended_use_of_funds,
          });

          const newUMKM = await umkm.build({
            umkm_id: newUser.user_id,
            company_name,
            founding_date,
            location,
            sector,
            stage,
            description,
            founder_name,
            amount_seeking,
            preferred_investment_type,
            intended_use_of_funds,
            img_url,
          });

          await newUser.save();
          await newUMKM.save();
        } else if (type === 'Investor') {
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
          });

          const newInvestor = await investor.build({
            investor_id: newUser.user_id,
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
            img_url,
          });

          await newUser.save();
          await newInvestor.save();
        }

        const access_token = generate_access_token(newUser.user_id);
        const refresh_token = generate_refresh_token(newUser.user_id);

        res.status(201).json({
          message: 'user registered successfully',
          data: { user_id, access_token, refresh_token },
        });
      });

      blobStream.end(img_file.buffer);
    } catch (error) {
      next(error);
    }
  }
);

// Login route (POST /auth/login)
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user_data = await user.findOne({ where: { username } });

    if (!user_data) {
      throw new AuthenticationError('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user_data.password);
    if (!isMatch) {
      throw new AuthenticationError('Invalid credentials');
    }

    const access_token = generate_access_token(user_data.user_id);
    const refresh_token = generate_refresh_token(user_data.user_id);

    res.json({
      message: 'Authentication successful',
      data: { user_id: user_data.user_id, access_token, refresh_token },
    });
  } catch (error) {
    next(error);
  }
});

// Refresh token route (POST /auth/refresh-token)
router.post('/refresh-token', (req, res, next) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return next(new InvariantError('Refresh token required'));
  }

  jwt.verify(refresh_token, process.env.REFRESH_TOKEN_KEY, (err, decoded) => {
    if (err) {
      return next(new InvariantError('Invalid refresh token'));
    }

    const access_token = generate_access_token(decoded.userId);
    res.json({
      message: 'Access token refreshed',
      data: { access_token },
    });
  });
});

// Example of a protected route (GET /auth/protected)
router.get('/protected', authenticate_token, (req, res) => {
  res.json({
    message: 'You have access to this protected route!',
  });
});

module.exports = router;
