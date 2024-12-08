const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Investors = sequelize.define(
  'investors',
  {
    investor_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    investor_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    img_url: {
      type: DataTypes.STRING(255),
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    investment_focus: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    stages: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    thesis: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    total_deals: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_investments: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    deal_type: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    geographic_focus: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    criteria: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { tableName: 'investors', timestamps: false }
);

module.exports = Investors;
