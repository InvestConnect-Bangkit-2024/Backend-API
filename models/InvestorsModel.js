// models/InvestorsModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Investors = sequelize.define("Investors", {
  Code: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
  },
  Name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  ListingDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  Shares: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  ListingBoard: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  Sector: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  LastPrice: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: true,
  },
  MarketCap: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: true,
  },
  MinutesFirstAdded: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  MinutesLastUpdated: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  HourlyFirstAdded: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  HourlyLastUpdated: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  DailyFirstAdded: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  DailyLastUpdated: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = Investors;
