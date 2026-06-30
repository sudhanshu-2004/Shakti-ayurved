const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/apiResponse');
const leadsService = require('../services/leads.service');

const list = asyncHandler(async (req, res) => {
  const filters = {};
  if (req.user.role === 'agent') filters.agent = req.user.id;
  else if (req.query.agent) filters.agent = req.query.agent;

  const leads = await leadsService.list(filters);
  const now = new Date();

  const dueToday = [];
  const overdue = [];
  const upcoming = [];

  leads.forEach((l) => {
    if (!l.followUp || l.converted) return;
    const d = new Date(l.followUp);
    const sameDay = d.toDateString() === now.toDateString();
    if (sameDay) dueToday.push(l);
    else if (d < now) overdue.push(l);
    else upcoming.push(l);
  });

  return ok(res, { dueToday, overdue, upcoming, total: dueToday.length + overdue.length + upcoming.length });
});

const setFollowUp = asyncHandler(async (req, res) => {
  const { date } = req.body;
  const lead = await leadsService.update(req.params.id, { followUp: date }, req.user.name);
  return ok(res, lead, 'Follow-up date updated');
});

module.exports = { list, setFollowUp };
