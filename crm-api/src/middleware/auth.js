const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { ApiError } = require('../utils/apiResponse');

function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new ApiError(401, 'Authentication token missing');

    const payload = jwt.verify(token, env.jwt.secret);
    req.user = payload; // { id, username, role, name }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Session expired, please log in again'));
    }
    if (err.isApiError) return next(err);
    next(new ApiError(401, 'Invalid authentication token'));
  }
}

// Usage: authorize('admin') or authorize('admin', 'agent')
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(new ApiError(401, 'Not authenticated'));
    if (roles.length && !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action'));
    }
    next();
  };
}

module.exports = { authenticate, authorize };
