// app.js
const express = require("express");
const bodyParser = require("body-parser");
const { connectDB } = require("./config/database");
const InvestorsRoutes = require("./routes/InvestorsRoutes"); // Import your routes
require("dotenv").config();

const app = express();

app.use(bodyParser.json());

connectDB();

app.use(InvestorsRoutes);

module.exports = app;
