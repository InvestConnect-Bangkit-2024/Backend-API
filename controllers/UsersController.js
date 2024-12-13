const express = require('express');
const authenticate_token = require('../middleware/AuthenticateToken');
const router = express.Router();
const user = require('../models/UsersModel');
const umkm = require('../models/UMKMModel');
const investor = require('../models/InvestorsModel');
const NotFoundError = require('../exceptions/NotFoundError');
router.get('/account/:id', authenticate_token, async (req, res, next) => {
  try {
    const user_id = req.params.id;
    const user_data = await user.findOne({
      where: { user_id },
    });

    if (!user_data) {
      throw new NotFoundError(`User ${user_id} not found`);
    }

    let additional_data = {};

    res.status(200).json({
      message: 'user profile fetched successfully',
      data: user_data,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/account/:id', authenticate_token, async (req, res, next) => {
  try {
    const updates = req.body;
    const user_id = req.params.id;

    const current_data = await user.findOne({
      where: { user_id },
    });

    if (!current_data) {
      throw new NotFoundError(`User with ID ${user_id} not found`);
    }

    if (updates.new_password) {
      updates.password = await bcrypt.hash(updates.new_password, 10);
      delete updates.new_password;
    }

    for (const [key, value] of Object.entries(updates)) {
      current_data[key] = value;
    }

    await current_data.save();

    return res.status(200).json({
      message: 'User data updated successfully',
      updated_data: current_data,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
