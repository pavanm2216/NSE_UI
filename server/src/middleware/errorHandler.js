/**
 * Global error handler middleware
 * Catches any error passed via next(err)
 */
const errorHandler = (err, req, res, _next) => {
  console.error('[ErrorHandler]', err.message || err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
};

module.exports = errorHandler;
