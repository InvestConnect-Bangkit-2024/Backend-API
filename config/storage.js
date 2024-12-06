const { Storage } = require('@google-cloud/storage');
const service_account = require('../owner-sa-key.json');

const storage = new Storage({ credentials: service_account });

module.exports = storage;
