const Sequelize = require('sequelize');
const { sequelize } = require('../config/database');

// Import models
const umkm = require('./UMKMModel');
const investments = require('./InvestmentsModel');
const investors = require('./InvestorsModel');
// Add associations after all models are initialized
umkm.associate = (models) => {
  umkm.hasMany(models.investments, {
    foreignKey: 'umkm_id',
    as: 'investments',
  });
};

investments.associate = (models) => {
  investments.belongsTo(models.umkm, {
    foreignKey: 'umkm_id',
    targetKey: 'umkm_id',
    as: 'umkm',
  });
};

investors.associate = (models) => {
  investors.hasMany(models.investments, {
    foreignKey: 'investor_id',
    as: 'investments',
  });
};

investments.associate = (models) => {
  investments.belongsTo(models.investors, {
    foreignKey: 'investor_id',
    targetKey: 'investor_id',
    as: 'investors',
  });
};

// Pass models to the associate functions
const models = {
  umkm,
  investments,
  investors,
  sequelize,
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
