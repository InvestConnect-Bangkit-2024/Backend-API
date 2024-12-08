const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const investments = sequelize.define(
  'investments',
  {
    investment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    umkm_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    investor_id: {
      type: DataTypes.STRING(50),
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
      type: DataTypes.ENUM('UMKM Request', 'Investor Offer'),
      allowNull: false,
    },
    investor_status: {
      type: DataTypes.ENUM('Review', 'Rejected', 'Approved'),
      defaultValue: 'Review',
    },
    umkm_status: {
      type: DataTypes.ENUM('Review', 'Rejected', 'Approved'),
      defaultValue: 'Review',
    },
  },
  {
    tableName: 'investments',
    timestamps: false,
  }
);

module.exports = investments;
