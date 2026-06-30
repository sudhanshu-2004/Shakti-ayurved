const { createClient } = require('@supabase/supabase-js');
const env = require('./env');
const logger = require('../utils/logger');

if (!env.supabaseUrl) {
  logger.error('SUPABASE_URL is not set. Backend cannot start without it.');
}

// Prefer service role key on the backend (bypasses RLS safely server-side).
// Falls back to anon key so the project still boots if service key isn't pasted yet,
// but admin-level operations (user management) will fail until it is provided.
const keyToUse =
  env.supabaseServiceKey && !env.supabaseServiceKey.startsWith('PASTE_')
    ? env.supabaseServiceKey
    : env.supabaseAnonKey;

if (keyToUse === env.supabaseAnonKey) {
  logger.warn(
    'SUPABASE_SERVICE_ROLE_KEY not configured — falling back to anon key. ' +
      'Some admin operations may be blocked by Row Level Security. ' +
      'Add the service_role key to .env for full functionality.'
  );
}

const supabase = createClient(env.supabaseUrl, keyToUse, {
  auth: { persistSession: false, autoRefreshToken: false },
});

module.exports = supabase;
