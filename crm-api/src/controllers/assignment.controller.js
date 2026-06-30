const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/apiResponse');
const leadsService = require('../services/leads.service');

const assignToAgent = asyncHandler(async (req, res) => {
  const { agentId, count, product, leadType } = req.body;
  const total = await leadsService.assignToAgent(agentId, count, product, leadType, req.user.name);
  return ok(res, { assigned: total }, `${total} leads assigned`);
});

const distribute = asyncHandler(async (req, res) => {
  const { count, product, leadType } = req.body;
  const total = await leadsService.distributeLeads(count, product, leadType, req.user.name);
  return ok(res, { assigned: total }, `${total} leads distributed across active agents`);
});

module.exports = { assignToAgent, distribute };
