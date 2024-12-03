// app.js
const express = require("express");
const bodyParser = require("body-parser");
const { connectDB } = require("./config/database");
const InvestorsRoutes = require("./controllers/InvestorsController");
const AuthRoutes = require("./controllers/AuthenticationsController");
const ProfileRoutes = require("./controllers/ProfilesController");
require("dotenv").config();

const errorHandler = require("./middleware/ErrorHandler");

const app = express();

app.use(bodyParser.json());

connectDB();

app.use(InvestorsRoutes);
app.use(AuthRoutes);
app.use(ProfileRoutes);

app.use(errorHandler);
module.exports = app;
