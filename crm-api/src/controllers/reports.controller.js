const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/apiResponse');
const leadsService = require('../services/leads.service');
const ordersService = require('../services/orders.service');
const usersService = require('../services/users.service');

const agentPerformance = asyncHandler(async (req, res) => {
  const [leads, agents] = await Promise.all([leadsService.list({}), usersService.listAgents()]);
  const report = agents.map((agent) => {
    const agentLeads = leads.filter((l) => l.agent === agent.id);
    const converted = agentLeads.filter((l) => l.converted);
    const rejected = agentLeads.filter((l) => l.status === 'Rejected');
    const revenue = converted.reduce((s, l) => s + (l.value || 0), 0);
    return {
      agentId: agent.id,
      agentName: agent.name,
      totalLeads: agentLeads.length,
      converted: converted.length,
      rejected: rejected.length,
      conversionRate: agentLeads.length ? Number(((converted.length / agentLeads.length) * 100).toFixed(1)) : 0,
      revenue,
    };
  });
  return ok(res, report);
});

const productPerformance = asyncHandler(async (req, res) => {
  const leads = await leadsService.list({});
  const byProduct = {};
  leads.forEach((l) => {
    if (!byProduct[l.product]) byProduct[l.product] = { product: l.product, totalLeads: 0, converted: 0, revenue: 0 };
    byProduct[l.product].totalLeads++;
    if (l.converted) {
      byProduct[l.product].converted++;
      byProduct[l.product].revenue += l.value || 0;
    }
  });
  return ok(res, Object.values(byProduct));
});

const funnel = asyncHandler(async (req, res) => {
  const filters = req.user.role === 'agent' ? { agent: req.user.id } : {};
  const leads = await leadsService.list(filters);
  const stages = ['Fresh', 'Working', 'Follow-up', 'Converted', 'Lost'];
  const result = stages.map((stage) => ({ stage, count: leads.filter((l) => l.stage === stage).length }));
  return ok(res, result);
});

const revenueOverTime = asyncHandler(async (req, res) => {
  const orders = await ordersService.list(req.user.role === 'agent' ? { agent: req.user.id } : {});
  const byDate = {};
  orders.forEach((o) => {
    const day = (o.created_at || '').slice(0, 10);
    byDate[day] = (byDate[day] || 0) + Number(o.amount || 0);
  });
  const series = Object.entries(byDate)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date));
  return ok(res, series);
});

module.exports = { agentPerformance, productPerformance, funnel, revenueOverTime };
