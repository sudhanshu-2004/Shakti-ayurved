const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/apiResponse');
const authService = require('../services/auth.service');

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.login(username, password);
  res.cookie && res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax' });
  return ok(res, { user, accessToken, refreshToken }, 'Login successful');
});

const refresh = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken || (req.cookies && req.cookies.refreshToken);
  const { user, accessToken } = await authService.refresh(token);
  return ok(res, { user, accessToken }, 'Token refreshed');
});

const me = asyncHandler(async (req, res) => {
  return ok(res, { user: req.user }, 'Current user');
});

const logout = asyncHandler(async (req, res) => {
  return ok(res, null, 'Logged out');
});

module.exports = { login, refresh, me, logout };
