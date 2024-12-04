const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Users = sequelize.define(
  'user',
  {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('UMKM', 'Investor'),
      allowNull: false,
      validate: {
        isIn: {
          args: [['UMKM', 'Investor']],
          msg: 'Type must be UMKM or Investor',
        },
      },
    },
  },
  {
    tableName: 'users',
    timestamps: false,
  }
);

module.exports = Users;
