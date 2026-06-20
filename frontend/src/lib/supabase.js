import { createClient } from '@supabase/supabase-js';

// Use environment variables when available. If keys are malformed or missing,
// the app will still run and pages will fallback to SAMPLE data.
const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL ||
  'https://ksjgsvtrfbhlgrvxrahu.supabase.com';

const supabaseAnonKey =
  process.env.REACT_APP_SUPABASE_ANON_KEY || '';

export const supabase =
  supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;