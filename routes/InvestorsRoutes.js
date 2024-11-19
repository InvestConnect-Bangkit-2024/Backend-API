const express = require("express");
const { getInvestors } = require("../controllers/InvestorsController");

const router = express.Router();

router.get("/investors", getInvestors);

module.exports = router;
