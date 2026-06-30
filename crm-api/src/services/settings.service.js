const supabase = require('../config/supabase');
const { ApiError } = require('../utils/apiResponse');

const TABLE = 'settings';
const ROW_ID = 'global';

const DEFAULTS = { sound: true, browserNotify: true, popup: true };

async function get() {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', ROW_ID).maybeSingle();
  if (error) {
    // table may not exist yet — degrade gracefully
    return DEFAULTS;
  }
  return data ? { ...DEFAULTS, ...data.value } : DEFAULTS;
}

async function update(patch) {
  const current = await get();
  const next = { ...current, ...patch };
  const { error } = await supabase.from(TABLE).upsert({ id: ROW_ID, value: next });
  if (error) throw new ApiError(500, `DB error (update settings): ${error.message}`);
  return next;
}

module.exports = { get, update, DEFAULTS };
