const axios = require("axios");
const { getAllInvestors } = require("../services/InvestorsServices");

const getInvestors = async (req, res, next) => {
  try {
    const investors = await getAllInvestors();

    const predictResponse = await axios.post("http://localhost:7000/predict", {
      investors,
    });

    res.status(200).json(predictResponse.data);
  } catch (error) {
    console.error("Error in getInvestors:", error);
    next(error);
  }
};

module.exports = { getInvestors };
