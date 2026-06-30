const { createClient } = require('@supabase/supabase-js');
const env = require('./env');
const logger = require('../utils/logger');

let supabase;

if (!env.supabaseUrl || !env.supabaseAnonKey) {
  logger.error('SUPABASE_URL or SUPABASE_ANON_KEY is not set. Database connections will fail.');
  // Create a dummy client to prevent synchronous crash on boot
  supabase = createClient('https://dummy.supabase.co', 'dummy_key', {
    auth: { persistSession: false, autoRefreshToken: false },
  });
} else {
  const keyToUse =
    env.supabaseServiceKey && !env.supabaseServiceKey.startsWith('PASTE_')
      ? env.supabaseServiceKey
      : env.supabaseAnonKey;

  if (keyToUse === env.supabaseAnonKey) {
    logger.warn('SUPABASE_SERVICE_ROLE_KEY not configured — falling back to anon key.');
  }

  supabase = createClient(env.supabaseUrl, keyToUse, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

module.exports = supabase;
