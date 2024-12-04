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
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    company_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    founding_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    sector: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    stage: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    founder_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    amount_seeking: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    preferred_investment_type: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    intended_use_of_funds: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'umkm',
    timestamps: false,
  }
);

module.exports = UMKM;
