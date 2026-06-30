// Wraps an async controller so thrown/rejected errors go to Express error handler
module.exports = function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
