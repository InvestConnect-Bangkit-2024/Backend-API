const express = require("express");
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/UsersModel");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../token/TokenManager");
const InvariantError = require("../exceptions/InvariantError");
const AuthenticationError = require("../exceptions/AuthenticationError");

// Register route (POST /auth/register)
router.post("/register", async (req, res, next) => {
  const { username, password, fullname } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw new InvariantError("Username already taken");
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const id = `user-${nanoid(16)}`;
    const newUser = await User.create({
      id,
      username,
      password: hashedPassword,
      fullname,
    });

    // Generate tokens for the new user
    const accessToken = generateAccessToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);

    // Respond with tokens
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    next(error); // Pass errors to the central error handler
  }
});

// Login route (POST /auth/login)
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      throw new AuthenticationError("Invalid credentials");
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AuthenticationError("Invalid credentials");
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Respond with tokens
    res.json({
      status: "success",
      message: "Authentication successful",
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    next(error); // Pass errors to the central error handler
  }
});

// Refresh token route (POST /auth/refresh-token)
router.post("/refresh-token", (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new InvariantError("Refresh token required"));
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, decoded) => {
    if (err) {
      return next(new InvariantError("Invalid refresh token"));
    }

    const accessToken = generateAccessToken(decoded.userId);
    res.json({
      status: "success",
      message: "Access token refreshed",
      data: { accessToken },
    });
  });
});

// Example of a protected route (GET /auth/protected)
router.get("/protected", authenticateToken, (req, res) => {
  res.json({
    status: "success",
    message: "You have access to this protected route!",
  });
});

// Middleware for authenticating JWT tokens
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return next(new InvariantError("Token required"));
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
    if (err) {
      return next(new InvariantError("Invalid or expired token"));
    }
    req.userId = decoded.userId;
    next();
  });
}

module.exports = router;
