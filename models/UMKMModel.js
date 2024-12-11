const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UMKM = sequelize.define(
  'umkm',
  {
    umkm_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'Users',
        key: 'user_id',
      },
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    founding_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    founder_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    team_members: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    business_model: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount_seeking: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    preferred_investment_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    intended_use_of_funds: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    loyal_customers: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    market_size: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    market_target: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    funding_raised: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    revenue: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    profitability: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    growth_rate: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'umkm',
    timestamps: false,
  }
);
module.exports = UMKM;
