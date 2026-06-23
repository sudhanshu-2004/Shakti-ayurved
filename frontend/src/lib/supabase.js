import { createClient } from '@supabase/supabase-js';

// Use environment variables when available. If keys are malformed or missing,
// the app will still run and pages will fallback to SAMPLE data.
const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL ||
  'https://ksjgsvtrfbhlgrvxrahu.supabase.co';

const supabaseAnonKey =
  process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Wrap in try-catch: a malformed key will return null so the app still loads.
let _supabaseClient = null;
try {
  if (supabaseAnonKey && supabaseUrl) {
    _supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (e) {
  console.warn('Supabase client could not be initialised — running in offline mode.', e);
}

export const supabase = _supabaseClient;