const asyncHandler = require('../utils/asyncHandler');
const { ok, created } = require('../utils/apiResponse');
const usersService = require('../services/users.service');
const { genPassword } = require('../utils/idGen');

const list = asyncHandler(async (req, res) => {
  const agents = await usersService.listAgents();
  return ok(res, agents);
});

const getOne = asyncHandler(async (req, res) => {
  const agent = await usersService.findById(req.params.id);
  return ok(res, usersService.mapUserRow(agent));
});

const create = asyncHandler(async (req, res) => {
  const { name, mobile, email, username, password } = req.body;
  const finalUsername = username || (await usersService.genLoginId(name));
  const finalPassword = password || genPassword();
  const agent = await usersService.createUser({
    name,
    username: finalUsername,
    password: finalPassword,
    role: 'agent',
    mobile,
    email,
  });
  return created(res, { ...agent, generatedPassword: password ? undefined : finalPassword }, 'Agent created');
});

const update = asyncHandler(async (req, res) => {
  const agent = await usersService.updateUser(req.params.id, req.body);
  return ok(res, agent, 'Agent updated');
});

const remove = asyncHandler(async (req, res) => {
  await usersService.deleteUser(req.params.id);
  return ok(res, null, 'Agent deleted');
});

const toggleActive = asyncHandler(async (req, res) => {
  const agent = await usersService.findById(req.params.id);
  const updated = await usersService.updateUser(req.params.id, { active: agent.status !== 'active' });
  return ok(res, updated, 'Agent status toggled');
});

const resetPassword = asyncHandler(async (req, res) => {
  const newPassword = genPassword();
  await usersService.resetPassword(req.params.id, newPassword);
  return ok(res, { newPassword }, 'Password reset');
});

module.exports = { list, getOne, create, update, remove, toggleActive, resetPassword };
