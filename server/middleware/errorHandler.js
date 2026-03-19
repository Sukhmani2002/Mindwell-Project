const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (err.name === 'CastError') {
    error = { message: 'Resource not found', statusCode: 404 };
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = { message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`, statusCode: 400 };
  }
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
