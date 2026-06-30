const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/apiResponse');
const leadsService = require('../services/leads.service');
const ordersService = require('../services/orders.service');
const usersService = require('../services/users.service');

const summary = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const filters = isAdmin ? {} : { agent: req.user.id };

  const [leads, orders, agents] = await Promise.all([
    leadsService.list(filters),
    ordersService.list(isAdmin ? {} : { agent: req.user.id }),
    isAdmin ? usersService.listAgents() : Promise.resolve([]),
  ]);

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.stage === 'Fresh').length;
  const followUps = leads.filter((l) => l.followUp && !l.converted).length;
  const converted = leads.filter((l) => l.converted).length;
  const rejected = leads.filter((l) => l.status === 'Rejected').length;
  const revenue = orders.reduce((s, o) => s + Number(o.amount || 0), 0);
  const conversionRate = totalLeads ? Number(((converted / totalLeads) * 100).toFixed(1)) : 0;

  const today = new Date().toDateString();
  const todaysFollowUps = leads.filter((l) => l.followUp && new Date(l.followUp).toDateString() === today).length;

  return ok(res, {
    totalLeads,
    newLeads,
    followUps,
    converted,
    rejected,
    revenue,
    conversionRate,
    todaysFollowUps,
    activeAgents: isAdmin ? agents.filter((a) => a.active).length : undefined,
    totalAgents: isAdmin ? agents.length : undefined,
  });
});

module.exports = { summary };
