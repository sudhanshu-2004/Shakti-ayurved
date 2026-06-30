const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/apiResponse');
const settingsService = require('../services/settings.service');

const get = asyncHandler(async (req, res) => {
  const settings = await settingsService.get();
  return ok(res, settings);
});

const update = asyncHandler(async (req, res) => {
  const settings = await settingsService.update(req.body);
  return ok(res, settings, 'Settings updated');
});

module.exports = { get, update };
