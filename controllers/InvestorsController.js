const axios = require("axios");
require("dotenv").config();
const express = require("express");
const router = express.Router();
const { sequelize } = require("../models/InvestorsModel");

// Services
const getAllInvestors = async () => {
  try {
    const query = "SELECT * FROM investors LIMIT 5";
    const [investors] = await sequelize.query(query);
    return investors;
  } catch (error) {
    console.error("Error fetching investors with custom query:", error);
    throw error;
  }
};

// Routes

router.get("/investors", async (req, res) => {
  try {
    const investors = await getAllInvestors();

    const predictResponse = await axios.post(`${process.env.ML_URL}/predict`, {
      investors,
    });

    res.status(200).json(predictResponse.data);
  } catch (error) {
    console.error("Error in /investors route:", error);
    next(error);
  }
});

module.exports = router;
