const express = require("express");
const authenticateToken = require("../middleware/authenticateToken"); // Adjust path to your middleware
const router = express.Router();
const User = require("../models/UsersModel"); // Adjust path to your User model

// Route to get user profile details by user ID (with authentication)
router.get("/account/:id", authenticateToken, async (req, res) => {
  const userId = req.params.id;

  // Check if the authenticated user is trying to access their own profile
  if (req.userId !== userId) {
    return res
      .status(403)
      .json({ message: "Forbidden: You cannot access another user's profile" });
  }

  try {
    // Fetch the user by ID from the database
    const user = await User.findOne({
      where: { id: userId },
      attributes: ["id", "username", "fullname"],
    });

    // If no user found, send a 404 error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user data
    res.status(200).json({
      status: "success",
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
