const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database"); // Adjust the path to your actual sequelize instance

// Define the User model for the 'users' table
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: true, // Set to false if you want to enforce non-null values
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: true, // Set to false if you want to enforce non-null values
    },
    fullname: {
      type: DataTypes.TEXT,
      allowNull: true, // Set to false if you want to enforce non-null values
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

module.exports = User;
