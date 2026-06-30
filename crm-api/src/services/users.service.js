const supabase = require('../config/supabase');
const { ApiError } = require('../utils/apiResponse');
const { genId } = require('../utils/idGen');
const bcrypt = require('bcryptjs');

const TABLE = 'users';

function mapUserRow(r) {
  if (!r) return null;
  return {
    id: r.id,
    name: r.name,
    username: r.username,
    role: r.role,
    status: r.status,
    active: r.status === 'active',
    mobile: r.mobile || '',
    email: r.email || '',
    joined: r.created_at,
  };
}

async function findByUsername(username) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('username', username).maybeSingle();
  if (error) throw new ApiError(500, `DB error (findByUsername): ${error.message}`);
  return data;
}

async function findById(id) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).maybeSingle();
  if (error) throw new ApiError(500, `DB error (findById): ${error.message}`);
  return data;
}

async function listAll() {
  const { data, error } = await supabase.from(TABLE).select('*').order('created_at', { ascending: true });
  if (error) throw new ApiError(500, `DB error (listAll users): ${error.message}`);
  return (data || []).map(mapUserRow);
}

async function listAgents() {
  const all = await listAll();
  return all.filter((u) => u.role === 'agent');
}

async function createUser({ name, username, password, role, mobile, email }) {
  const existing = await findByUsername(username);
  if (existing) throw new ApiError(409, 'Username already exists');

  const hash = await bcrypt.hash(password, 10);
  const row = {
    id: genId('u'),
    name,
    username,
    password: hash,
    role: role || 'agent',
    status: 'active',
    mobile: mobile || null,
    email: email || null,
  };
  const { data, error } = await supabase.from(TABLE).insert(row).select().single();
  if (error) throw new ApiError(500, `DB error (createUser): ${error.message}`);
  return mapUserRow(data);
}

async function updateUser(id, patch) {
  const d = {};
  if (patch.name !== undefined) d.name = patch.name;
  if (patch.username !== undefined) d.username = patch.username;
  if (patch.role !== undefined) d.role = patch.role;
  if (patch.mobile !== undefined) d.mobile = patch.mobile;
  if (patch.email !== undefined) d.email = patch.email;
  if (patch.active !== undefined) d.status = patch.active ? 'active' : 'inactive';
  if (patch.password) d.password = await bcrypt.hash(patch.password, 10);

  const { data, error } = await supabase.from(TABLE).update(d).eq('id', id).select().single();
  if (error) throw new ApiError(500, `DB error (updateUser): ${error.message}`);
  return mapUserRow(data);
}

async function deleteUser(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw new ApiError(500, `DB error (deleteUser): ${error.message}`);
  return true;
}

async function resetPassword(id, newPassword = '123456') {
  const hash = await bcrypt.hash(newPassword, 10);
  const { error } = await supabase.from(TABLE).update({ password: hash }).eq('id', id);
  if (error) throw new ApiError(500, `DB error (resetPassword): ${error.message}`);
  return newPassword;
}

async function genLoginId(name) {
  const base = (name || 'agent').toLowerCase().replace(/[^a-z]/g, '').slice(0, 8) || 'agent';
  const all = await listAll();
  const taken = new Set(all.map((u) => u.username));
  let n = base;
  let i = 1;
  while (taken.has(n)) {
    n = base + i;
    i++;
  }
  return n;
}

module.exports = {
  mapUserRow,
  findByUsername,
  findById,
  listAll,
  listAgents,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
  genLoginId,
};
