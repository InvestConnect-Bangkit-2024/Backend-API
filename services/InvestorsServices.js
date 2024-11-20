// services/InvestorsService.js
const { sequelize } = require("../config/database");

const getAllInvestors = async () => {
  try {
    const query = "SELECT * FROM investors LIMIT 5";
    const [stocks] = await sequelize.query(query);
    return stocks;
  } catch (error) {
    console.error("Error fetching stocks with custom query:", error);
    throw error;
  }
};

module.exports = { getAllInvestors };
