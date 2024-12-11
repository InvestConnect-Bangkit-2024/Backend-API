const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const InvestmentRequests = sequelize.define(
  'InvestmentRequests',
  {
    investment_request_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    investor_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'investors',
        key: 'investor_id',
      },
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected'),
      allowNull: false,
    },
    confirmed_date: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: 'investment_requests',
    timestamps: false,
  }
);

module.exports = InvestmentRequests;
