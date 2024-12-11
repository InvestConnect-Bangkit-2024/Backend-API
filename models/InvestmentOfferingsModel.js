const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const InvestmentOfferings = sequelize.define(
  'InvestmentOfferings',
  {
    investment_offering_id: {
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
    umkm_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'umkm',
        key: 'umkm_id',
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
    tableName: 'investment_offerings',
    timestamps: false,
  }
);

module.exports = InvestmentOfferings;
