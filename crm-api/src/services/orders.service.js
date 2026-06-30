const supabase = require('../config/supabase');
const { ApiError } = require('../utils/apiResponse');

const TABLE = 'orders';

async function list(filters = {}) {
  let q = supabase.from(TABLE).select('*').order('created_at', { ascending: false });
  if (filters.agent) q = q.eq('agent_id', filters.agent);
  if (filters.product) q = q.eq('product', filters.product);
  const { data, error } = await q;
  if (error) throw new ApiError(500, `DB error (list orders): ${error.message}`);
  return data || [];
}

async function totalRevenue(filters = {}) {
  const orders = await list(filters);
  return orders.reduce((sum, o) => sum + Number(o.amount || 0), 0);
}

async function getById(id) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).maybeSingle();
  if (error) throw new ApiError(500, `DB error (getById order): ${error.message}`);
  if (!data) throw new ApiError(404, 'Order not found');
  return data;
}

async function update(id, patch) {
  const { data, error } = await supabase.from(TABLE).update(patch).eq('id', id).select().single();
  if (error) throw new ApiError(500, `DB error (update order): ${error.message}`);
  return data;
}

module.exports = { list, totalRevenue, getById, update };
