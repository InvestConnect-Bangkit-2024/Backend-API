const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Investments = sequelize.define(
  'Investments',
  {
    investment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    umkm_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    investor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    investment_amount: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Confirmed'),
      allowNull: false,
    },
    confirmed_date: {
      type: DataTypes.DATE,
    },
    request_type: {
      type: DataTypes.ENUM('UMKM Request', 'Invetor Offer'),
      allowNull: false,
    },
  },
  {
    tableName: 'investments',
    timestamps: false,
  }
);

module.exports = Investments;
