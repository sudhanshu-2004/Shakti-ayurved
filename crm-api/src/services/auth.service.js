const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('../config/env');
const usersService = require('./users.service');
const supabase = require('../config/supabase');
const { ApiError } = require('../utils/apiResponse');

function signAccessToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role, name: user.name },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );
}

function signRefreshToken(user) {
  return jwt.sign({ id: user.id }, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn });
}

/**
 * Supports legacy plaintext passwords that were seeded directly in Supabase
 * by the original frontend. On first successful legacy login, the password
 * is transparently re-hashed with bcrypt for future security.
 */
async function verifyPassword(plain, stored) {
  if (!stored) return false;
  const looksHashed = stored.startsWith('$2a$') || stored.startsWith('$2b$') || stored.startsWith('$2y$');
  if (looksHashed) {
    return bcrypt.compare(plain, stored);
  }
  // legacy plaintext comparison
  return plain === stored;
}

async function login(username, password) {
  const row = await usersService.findByUsername(username);
  if (!row) throw new ApiError(401, 'Invalid username or password');

  if (row.status === 'inactive') {
    throw new ApiError(403, 'Your account has been deactivated. Contact admin.');
  }

  const valid = await verifyPassword(password, row.password);
  if (!valid) throw new ApiError(401, 'Invalid username or password');

  // Transparent rehash for legacy plaintext passwords
  const looksHashed = row.password.startsWith('$2a$') || row.password.startsWith('$2b$') || row.password.startsWith('$2y$');
  if (!looksHashed) {
    const hash = await bcrypt.hash(password, 10);
    await supabase.from('users').update({ password: hash }).eq('id', row.id);
  }

  const user = usersService.mapUserRow(row);
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  return { user, accessToken, refreshToken };
}

async function refresh(refreshToken) {
  let payload;
  try {
    payload = jwt.verify(refreshToken, env.jwt.refreshSecret);
  } catch (e) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
  const row = await usersService.findById(payload.id);
  if (!row || row.status === 'inactive') throw new ApiError(401, 'Account not found or inactive');
  const user = usersService.mapUserRow(row);
  const accessToken = signAccessToken(user);
  return { user, accessToken };
}

module.exports = { login, refresh, signAccessToken, signRefreshToken, verifyPassword };
