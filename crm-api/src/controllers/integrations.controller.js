const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/apiResponse');
const env = require('../config/env');
const delhivery = require('../services/delhivery.service');
const whatsapp = require('../services/whatsapp.service');
const logger = require('../utils/logger');

const status = asyncHandler(async (req, res) => {
  return ok(res, {
    delhivery: delhivery.isConfigured(),
    whatsapp: whatsapp.isConfigured(),
  });
});

const sendWhatsApp = asyncHandler(async (req, res) => {
  const { to, text, templateName, templateParams } = req.body;
  const result = templateName
    ? await whatsapp.sendMessage({ to, type: 'template', templateName, templateParams })
    : await whatsapp.sendMessage({ to, type: 'text', text });
  return ok(res, result, 'WhatsApp message sent');
});

// Meta webhook verification (GET) — required for WhatsApp Cloud API setup
const verifyWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === env.whatsapp.verifyToken) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
};

// Incoming WhatsApp messages/status updates (POST)
const receiveWebhook = (req, res) => {
  logger.info('WhatsApp webhook event', { body: req.body });
  res.sendStatus(200);
};

const trackShipment = asyncHandler(async (req, res) => {
  const result = await delhivery.trackShipment(req.params.awb);
  return ok(res, result);
});

module.exports = { status, sendWhatsApp, verifyWebhook, receiveWebhook, trackShipment };
