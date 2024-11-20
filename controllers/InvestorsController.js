const axios = require("axios");
const { getAllInvestors } = require("../services/InvestorsServices");
require("dotenv").config();

const getInvestors = async (req, res, next) => {
  try {
    const investors = await getAllInvestors();

    const predictResponse = await axios.post(`${process.env.ML_URL}/predict`, {
      investors,
    });

    res.status(200).json(predictResponse.data);
  } catch (error) {
    console.error("Error in getInvestors:", error);
    next(error);
  }
};

module.exports = { getInvestors };
