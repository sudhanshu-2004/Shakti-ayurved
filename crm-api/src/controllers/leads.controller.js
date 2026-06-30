const asyncHandler = require('../utils/asyncHandler');
const { ok, created } = require('../utils/apiResponse');
const leadsService = require('../services/leads.service');

const list = asyncHandler(async (req, res) => {
  const { agent, product, stage, status } = req.query;
  // Agents can only see their own leads
  const filters = { product, stage, status };
  if (req.user.role === 'agent') filters.agent = req.user.id;
  else if (agent) filters.agent = agent;
  const leads = await leadsService.list(filters);
  return ok(res, leads);
});

const getOne = asyncHandler(async (req, res) => {
  const lead = await leadsService.getById(req.params.id);
  return ok(res, lead);
});

const create = asyncHandler(async (req, res) => {
  const lead = await leadsService.create(req.body, req.user.name);
  return created(res, lead, 'Lead created');
});

const bulkCreate = asyncHandler(async (req, res) => {
  const items = req.body.leads || [];
  const result = await leadsService.bulkCreate(items, req.user.name);
  return created(res, result, `${result.length} leads created`);
});

const update = asyncHandler(async (req, res) => {
  const lead = await leadsService.update(req.params.id, req.body, req.user.name);
  return ok(res, lead, 'Lead updated');
});

const remove = asyncHandler(async (req, res) => {
  await leadsService.remove(req.params.id);
  return ok(res, null, 'Lead deleted');
});

const setCNP = asyncHandler(async (req, res) => {
  const lead = await leadsService.setCNP(req.params.id, req.body.reason, req.user.name);
  return ok(res, lead, 'Lead marked CNP');
});

const complete = asyncHandler(async (req, res) => {
  const { rate, quantity } = req.body;
  const lead = await leadsService.completeLead(req.params.id, rate, quantity, req.user.name);
  return ok(res, lead, 'Lead converted to order');
});

const setOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, address, advanceAmount } = req.body;
  const lead = await leadsService.setOrderStatus(req.params.id, orderStatus, { address, advanceAmount }, req.user.name);
  return ok(res, lead, 'Order status updated');
});

const reject = asyncHandler(async (req, res) => {
  const lead = await leadsService.rejectLead(req.params.id, req.user.name);
  return ok(res, lead, 'Lead rejected');
});

const history = asyncHandler(async (req, res) => {
  const rows = await leadsService.getHistory(req.params.id);
  return ok(res, rows);
});

module.exports = { list, getOne, create, bulkCreate, update, remove, setCNP, complete, setOrderStatus, reject, history };
