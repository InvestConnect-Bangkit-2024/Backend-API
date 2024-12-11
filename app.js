// app.js
const express = require('express');
const body_parser = require('body-parser');
const { connectDB } = require('./config/database');
const investor_routes = require('./controllers/InvestorsController');
const auth_routes = require('./controllers/AuthenticationsController');
const users_routes = require('./controllers/UsersController');
const umkm_routes = require('./controllers/UMKMController');
require('dotenv').config();

const errorHandler = require('./middleware/ErrorHandler');

const app = express();

connectDB();

app.use(body_parser.json());
app.use(express.urlencoded({ extended: true }));
app.use(auth_routes);
app.use(users_routes);
app.use(investor_routes);
app.use(umkm_routes);

app.use(errorHandler);
module.exports = app;
