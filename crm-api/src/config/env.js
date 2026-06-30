require('dotenv').config();

function req(name, fallback) {
  const v = process.env[name];
  if (v === undefined || v === '') return fallback;
  return v;
}

module.exports = {
  env: req('NODE_ENV', 'development'),
  port: parseInt(req('PORT', '5000'), 10),
  clientOrigin: req('CLIENT_ORIGIN', '*'),
  webhookSecret: req('WEBHOOK_SECRET', 'change_this_webhook_secret'),

  supabaseUrl: req('SUPABASE_URL'),
  supabaseAnonKey: req('SUPABASE_ANON_KEY'),
  supabaseServiceKey: req('SUPABASE_SERVICE_ROLE_KEY'),

  jwt: {
    secret: req('JWT_SECRET', 'dev_secret_change_me'),
    expiresIn: req('JWT_EXPIRES_IN', '8h'),
    refreshSecret: req('JWT_REFRESH_SECRET', 'dev_refresh_secret_change_me'),
    refreshExpiresIn: req('JWT_REFRESH_EXPIRES_IN', '7d'),
  },

  rateLimit: {
    windowMs: parseInt(req('RATE_LIMIT_WINDOW_MS', '900000'), 10),
    max: parseInt(req('RATE_LIMIT_MAX', '300'), 10),
  },

  upload: {
    maxMb: parseInt(req('MAX_UPLOAD_MB', '10'), 10),
    dir: req('UPLOAD_DIR', 'uploads'),
  },

  delhivery: {
    baseUrl: req('DELHIVERY_API_BASE_URL', 'https://track.delhivery.com'),
    token: req('DELHIVERY_API_TOKEN', ''),
    clientName: req('DELHIVERY_CLIENT_NAME', ''),
  },

  whatsapp: {
    baseUrl: req('WHATSAPP_API_BASE_URL', 'https://graph.facebook.com/v19.0'),
    phoneNumberId: req('WHATSAPP_PHONE_NUMBER_ID', ''),
    accessToken: req('WHATSAPP_ACCESS_TOKEN', ''),
    verifyToken: req('WHATSAPP_VERIFY_TOKEN', ''),
  },

  adminBootstrap: {
    username: req('ADMIN_DEFAULT_USERNAME', 'shaktiayurved'),
    password: req('ADMIN_DEFAULT_PASSWORD', 'ChangeMe@123'),
  },
};
