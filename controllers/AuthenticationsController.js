const express = require('express');
const { nanoid } = require('nanoid');
const bcrypt = require('bcryptjs');
const router = express.Router();
const user = require('../models/UsersModel');
const { generate_access_token } = require('../token/TokenManager');
const user_validator = require('../validator/UserValidator');
const authentication_validator = require('../validator/AuthenticationValidator');
const { Sequelize } = require('sequelize');

const AuthenticationError = require('../exceptions/AuthenticationError');
const NotFoundError = require('../exceptions/NotFoundError');
const InvariantError = require('../exceptions/InvariantError');
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password, fullname } = req.body;

    await user_validator.validate_user_payload({
      username,
      email,
      password,
      fullname,
    });

    const existingUser = await user.findOne({
      where: {
        [Sequelize.Op.or]: [{ email: email }, { username: username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new InvariantError('Email already taken');
      } else if (existingUser.username === username) {
        throw new InvariantError('Username already taken');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let user_id = `user-${nanoid(16)}`;

    let new_user = await user.build({
      user_id,
      username,
      email,
      password: hashedPassword,
      fullname,
    });

    new_user.save();
    const token = generate_access_token(new_user.user_id);
    res.status(201).json({
      message: 'user registered successfully',
      data: { user_id, token },
    });
  } catch (error) {
    next(error);
  }
});

// Login route (POST /auth/login)
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    await authentication_validator.validate_login_payload({
      username,
      password,
    });
    const user_data = await user.findOne({ where: { username } });

    if (!user_data) {
      throw new NotFoundError(`User ${username} does not exist`);
    }

    const isMatch = await bcrypt.compare(password, user_data.password);
    if (!isMatch) {
      throw new AuthenticationError('Your password is incorrect');
    }

    const token = generate_access_token(user_data.user_id);

    res.json({
      message: 'Authentication successful',
      data: { user_id: user_data.user_id, token },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
