const ClientError = require('../exceptions/ClientError');

const errorHandler = (err, req, res, next) => {
  console.error(err);
  console.log(err instanceof ClientError);
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  res.status(500).json({ message: 'An unexpected error occurred' });
};

module.exports = errorHandler;
