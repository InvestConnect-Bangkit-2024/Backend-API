const Sequelize = require('sequelize');
const { sequelize } = require('../config/database');

// Import models
const Users = require('./UsersModel');
const UMKM = require('./UMKMModel');
const InvestmentOfferings = require('./InvestmentOfferingsModel');
const InvestmentRequests = require('./InvestmentRequestsModel');
const Investors = require('./InvestorsModel');

const models = {
  UMKM,
  InvestmentOfferings,
  InvestmentRequests,
  Users,
  Investors,
  sequelize,
};

Users.associate = (models) => {
  Users.hasMany(models.UMKM, { foreignKey: 'user_id', as: 'umkms' });
  Users.hasMany(models.InvestmentOfferings, {
    foreignKey: 'user_id',
    as: 'investmentOffers',
  });
  Users.hasMany(models.Investors, { foreignKey: 'user_id', as: 'investors' });
  Users.hasMany(models.InvestmentRequests, {
    foreignKey: 'user_id',
    as: 'investmentRequests',
  });
};

UMKM.associate = (models) => {
  UMKM.belongsTo(models.Users, { foreignKey: 'user_id', as: 'owner' });
  UMKM.hasMany(models.InvestmentOfferings, {
    foreignKey: 'umkm_id',
    as: 'investmentOffers',
  });
};

Investors.associate = (models) => {
  Investors.hasMany(models.InvestmentRequests, {
    foreignKey: 'investor_id',
    as: 'requests',
  });
  Investors.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
};

InvestmentOfferings.associate = (models) => {
  InvestmentOfferings.belongsTo(models.UMKM, {
    foreignKey: 'umkm_id',
    as: 'umkm',
  });
  InvestmentOfferings.belongsTo(models.Users, {
    foreignKey: 'user_id',
    as: 'user',
  });
};

InvestmentRequests.associate = (models) => {
  InvestmentRequests.belongsTo(models.Investors, {
    foreignKey: 'investor_id',
    as: 'investor',
  });
  InvestmentRequests.belongsTo(models.Users, {
    foreignKey: 'user_id',
    as: 'user',
  });
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
