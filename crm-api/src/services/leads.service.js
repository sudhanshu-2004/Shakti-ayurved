const supabase = require('../config/supabase');
const { ApiError } = require('../utils/apiResponse');
const { genId } = require('../utils/idGen');
const usersService = require('./users.service');

const TABLE = 'leads';
const HISTORY_TABLE = 'lead_history';

function mapLeadRow(r) {
  if (!r) return null;
  return {
    id: r.id,
    name: r.customer_name,
    mobile: r.mobile,
    email: r.email || '',
    product: r.product || 'kidney',
    stage: r.stage || 'Fresh',
    status: r.status || 'New',
    agent: r.assigned_agent_id,
    agentName: r.assigned_agent_name,
    assignedBy: r.assigned_by,
    assignedDate: r.updated_at || r.created_at,
    followUp: r.followup_date,
    interest: r.interest_level || r.interest || null,
    trackingId: r.tracking_id || r.awb_number || '',
    leadType: r.lead_type || 'Fresh',
    rate: r.rate || 0,
    quantity: r.quantity || 0,
    value: r.value || 0,
    cnpReason: r.cnp_reason,
    orderStatus: r.order_status,
    deliveryAddress: r.delivery_address,
    advanceAmount: r.advance_amount || 0,
    converted: r.stage === 'Converted' || r.status === 'Converted',
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

async function addHistory(leadId, action, oldStatus, newStatus, who) {
  try {
    await supabase.from(HISTORY_TABLE).insert({
      lead_id: leadId,
      action,
      old_status: oldStatus,
      new_status: newStatus,
      agent_name: who,
    });
  } catch (e) {
    // history failures should never break the main flow
  }
}

async function list(filters = {}) {
  let q = supabase.from(TABLE).select('*').order('created_at', { ascending: false });
  if (filters.agent) q = q.eq('assigned_agent_id', filters.agent);
  if (filters.product) q = q.eq('product', filters.product);
  if (filters.stage) q = q.eq('stage', filters.stage);
  if (filters.status) q = q.eq('status', filters.status);
  const { data, error } = await q;
  if (error) throw new ApiError(500, `DB error (list leads): ${error.message}`);
  return (data || []).map(mapLeadRow);
}

async function getById(id) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).maybeSingle();
  if (error) throw new ApiError(500, `DB error (getById lead): ${error.message}`);
  if (!data) throw new ApiError(404, 'Lead not found');
  return mapLeadRow(data);
}

async function create(payload, who) {
  const row = {
    id: genId('ld'),
    customer_name: payload.name,
    mobile: payload.mobile,
    email: payload.email || null,
    product: payload.product || 'kidney',
    status: payload.status || 'New',
    stage: payload.stage || 'Fresh',
    assigned_agent_id: payload.agent || null,
    assigned_agent_name: payload.agentName || null,
    assigned_by: payload.assignedBy || who || 'Admin',
    lead_type: payload.leadType || 'Fresh',
    followup_date: payload.followUp || null,
    rate: payload.rate || 0,
    quantity: payload.quantity || 0,
    value: payload.value || 0,
    cnp_reason: payload.cnpReason || null,
    order_status: payload.orderStatus || null,
    delivery_address: payload.deliveryAddress || null,
    advance_amount: payload.advanceAmount || 0,
  };
  const { data, error } = await supabase.from(TABLE).insert(row).select().single();
  if (error) throw new ApiError(500, `DB error (create lead): ${error.message}`);
  await addHistory(data.id, 'created', null, row.status, who || 'System');
  return mapLeadRow(data);
}

async function bulkCreate(items, who) {
  const rows = items.map((payload) => ({
    id: genId('ld'),
    customer_name: payload.name,
    mobile: payload.mobile,
    email: payload.email || null,
    product: payload.product || 'kidney',
    status: payload.status || 'New',
    stage: payload.stage || 'Fresh',
    assigned_agent_id: payload.agent || null,
    assigned_agent_name: payload.agentName || null,
    assigned_by: payload.assignedBy || who || 'Admin',
    lead_type: payload.leadType || 'Fresh',
    followup_date: payload.followUp || null,
    rate: payload.rate || 0,
    quantity: payload.quantity || 0,
    value: payload.value || 0,
  }));

  const created = [];
  for (let i = 0; i < rows.length; i += 500) {
    const chunk = rows.slice(i, i + 500);
    const { data, error } = await supabase.from(TABLE).insert(chunk).select();
    if (error) throw new ApiError(500, `DB error (bulkCreate leads): ${error.message}`);
    created.push(...(data || []).map(mapLeadRow));
  }
  return created;
}

async function update(id, patch, who) {
  const existing = await getById(id);
  const d = { updated_at: new Date().toISOString() };
  if (patch.name !== undefined) d.customer_name = patch.name;
  if (patch.mobile !== undefined) d.mobile = patch.mobile;
  if (patch.email !== undefined) d.email = patch.email;
  if (patch.product !== undefined) d.product = patch.product;
  if (patch.status !== undefined) d.status = patch.status;
  if (patch.stage !== undefined) d.stage = patch.stage;
  if (patch.agent !== undefined) d.assigned_agent_id = patch.agent;
  if (patch.agentName !== undefined) d.assigned_agent_name = patch.agentName;
  if (patch.assignedBy !== undefined) d.assigned_by = patch.assignedBy;
  if (patch.followUp !== undefined) d.followup_date = patch.followUp;
  if (patch.interest !== undefined) d.interest_level = patch.interest;
  if (patch.trackingId !== undefined) d.tracking_id = patch.trackingId;
  if (patch.rate !== undefined) d.rate = patch.rate;
  if (patch.quantity !== undefined) d.quantity = patch.quantity;
  if (patch.value !== undefined) d.value = patch.value;
  if (patch.cnpReason !== undefined) d.cnp_reason = patch.cnpReason;
  if (patch.orderStatus !== undefined) d.order_status = patch.orderStatus;
  if (patch.deliveryAddress !== undefined) d.delivery_address = patch.deliveryAddress;
  if (patch.advanceAmount !== undefined) d.advance_amount = patch.advanceAmount;
  if (patch.leadType !== undefined) d.lead_type = patch.leadType;

  const { data, error } = await supabase.from(TABLE).update(d).eq('id', id).select().single();
  if (error) throw new ApiError(500, `DB error (update lead): ${error.message}`);
  if (patch.status && patch.status !== existing.status) {
    await addHistory(id, 'update', existing.status, patch.status, who || 'System');
  }
  return mapLeadRow(data);
}

async function remove(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw new ApiError(500, `DB error (delete lead): ${error.message}`);
  return true;
}

async function setCNP(id, reason, who) {
  const lead = await getById(id);
  const updated = await update(id, { status: 'CNP', cnpReason: reason, stage: 'Working' }, who);
  await addHistory(id, 'cnp', lead.status, 'CNP', who);
  return updated;
}

async function completeLead(id, rate, qty, who) {
  const amount = Number(rate) * Number(qty);
  const lead = await getById(id);
  const updated = await update(
    id,
    {
      stage: 'Converted',
      status: 'Converted',
      followUp: null,
      rate,
      quantity: qty,
      value: amount,
      orderStatus: 'Address Pending',
    },
    who
  );
  await addHistory(id, 'completed', lead.status, 'Converted', who);

  // create an order record
  const orderRow = {
    id: genId('ord'),
    lead_id: id,
    customer_name: lead.name,
    agent_id: lead.agent,
    product: lead.product,
    amount,
    mode: 'Sale',
  };
  const { error } = await supabase.from('orders').insert(orderRow);
  if (error) {
    // orders table might not exist yet; don't fail the lead completion
  }
  return updated;
}

async function setOrderStatus(id, orderStatus, extra = {}, who) {
  const lead = await getById(id);
  const patch = { orderStatus };
  if (orderStatus === 'Rejected') {
    patch.stage = 'Lost';
    patch.status = 'Rejected';
    patch.followUp = null;
  }
  if (extra.address) patch.deliveryAddress = extra.address;
  if (extra.advanceAmount) patch.advanceAmount = extra.advanceAmount;
  const updated = await update(id, patch, who);
  await addHistory(id, 'orderstatus', lead.orderStatus, orderStatus, who);
  return updated;
}

async function rejectLead(id, who) {
  const lead = await getById(id);
  const updated = await update(
    id,
    { stage: 'Lost', status: 'Rejected', followUp: null, leadType: 'Rejected' },
    who
  );
  await addHistory(id, 'rejected', lead.status, 'Rejected', who);
  return updated;
}

async function assignToAgent(agentId, count, product, leadType, by) {
  const agent = await usersService.findById(agentId);
  if (!agent) throw new ApiError(404, 'Agent not found');
  const agentName = agent.name;

  let q = supabase.from(TABLE).select('*').is('assigned_agent_id', null);
  if (product && product !== 'all') q = q.eq('product', product);
  const { data, error } = await q;
  if (error) throw new ApiError(500, `DB error (assignToAgent): ${error.message}`);

  let pool = data || [];
  if (leadType && leadType !== 'all') {
    pool = pool.filter((l) => {
      if (l.lead_type === leadType) return true;
      if (leadType === 'Working' && (l.stage === 'Working' || l.stage === 'Follow-up')) return true;
      if (leadType === 'Fresh' && l.stage === 'Fresh') return true;
      return false;
    });
  }
  if (count !== 'all') pool = pool.slice(0, parseInt(count, 10) || 5);

  const now = new Date().toISOString();
  for (const row of pool) {
    const patch = {
      assigned_agent_id: agentId,
      assigned_agent_name: agentName,
      assigned_by: by || 'Admin',
      updated_at: now,
    };
    if (leadType && leadType !== 'all') {
      patch.lead_type = leadType;
      if (leadType === 'Working' && row.stage === 'Fresh') {
        patch.stage = 'Working';
        patch.status = 'Contacted';
      }
    }
    await supabase.from(TABLE).update(patch).eq('id', row.id);
    await addHistory(row.id, 'assign', null, `Assigned to ${agentName}`, by || 'Admin');
  }
  return pool.length;
}

async function distributeLeads(count, product, leadType, by) {
  const agents = (await usersService.listAgents()).filter((a) => a.active);
  if (!agents.length) return 0;

  let q = supabase.from(TABLE).select('*').is('assigned_agent_id', null);
  if (product && product !== 'all') q = q.eq('product', product);
  const { data, error } = await q;
  if (error) throw new ApiError(500, `DB error (distributeLeads): ${error.message}`);

  let pool = data || [];
  if (leadType && leadType !== 'all') {
    pool = pool.filter((l) => {
      if (l.lead_type === leadType) return true;
      if (leadType === 'Working' && (l.stage === 'Working' || l.stage === 'Follow-up')) return true;
      if (leadType === 'Fresh' && l.stage === 'Fresh') return true;
      return false;
    });
  }

  const per = count === 'all' ? Math.ceil(pool.length / agents.length) : parseInt(count, 10) || 5;
  const now = new Date().toISOString();
  let total = 0;

  for (let i = 0; i < agents.length; i++) {
    const agent = agents[i];
    const slice = pool.slice(i * per, (i + 1) * per);
    for (const row of slice) {
      const patch = {
        assigned_agent_id: agent.id,
        assigned_agent_name: agent.name,
        assigned_by: by || 'Admin',
        updated_at: now,
      };
      if (leadType && leadType !== 'all') {
        patch.lead_type = leadType;
        if (leadType === 'Working' && row.stage === 'Fresh') {
          patch.stage = 'Working';
          patch.status = 'Contacted';
        }
      }
      await supabase.from(TABLE).update(patch).eq('id', row.id);
      await addHistory(row.id, 'assign', null, `Assigned to ${agent.name}`, by || 'Admin');
      total++;
    }
  }
  return total;
}

async function getHistory(leadId) {
  const { data, error } = await supabase
    .from(HISTORY_TABLE)
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });
  if (error) throw new ApiError(500, `DB error (getHistory): ${error.message}`);
  return data || [];
}

module.exports = {
  mapLeadRow,
  list,
  getById,
  create,
  bulkCreate,
  update,
  remove,
  setCNP,
  completeLead,
  setOrderStatus,
  rejectLead,
  assignToAgent,
  distributeLeads,
  getHistory,
  addHistory,
};
