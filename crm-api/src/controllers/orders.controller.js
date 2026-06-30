const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/apiResponse');
const ordersService = require('../services/orders.service');
const delhivery = require('../services/delhivery.service');
const whatsapp = require('../services/whatsapp.service');
const leadsService = require('../services/leads.service');

const list = asyncHandler(async (req, res) => {
  const filters = {};
  if (req.user.role === 'agent') filters.agent = req.user.id;
  else if (req.query.agent) filters.agent = req.query.agent;
  if (req.query.product) filters.product = req.query.product;
  const orders = await ordersService.list(filters);
  return ok(res, orders);
});

const revenue = asyncHandler(async (req, res) => {
  const total = await ordersService.totalRevenue(req.user.role === 'agent' ? { agent: req.user.id } : {});
  return ok(res, { revenue: total });
});

const createShipment = asyncHandler(async (req, res) => {
  const lead = await leadsService.getById(req.params.leadId);
  const payload = {
    name: lead.name,
    add: lead.deliveryAddress || '',
    pin: req.body.pincode,
    phone: lead.mobile,
    order: req.params.leadId,
    payment_mode: req.body.paymentMode || 'COD',
    products_desc: lead.product,
    cod_amount: req.body.paymentMode === 'COD' ? lead.value : 0,
    total_amount: lead.value,
  };
  const result = await delhivery.createShipment(payload);
  return ok(res, result, 'Shipment created with Delhivery');
});

const trackShipment = asyncHandler(async (req, res) => {
  const result = await delhivery.trackShipment(req.params.awb);
  return ok(res, result);
});

const checkServiceability = asyncHandler(async (req, res) => {
  const result = await delhivery.checkServiceability(req.params.pincode);
  return ok(res, result);
});

const sendOrderWhatsApp = asyncHandler(async (req, res) => {
  const lead = await leadsService.getById(req.params.leadId);
  const result = await whatsapp.sendOrderConfirmation(lead.mobile, lead.name, lead.product, lead.trackingId);
  return ok(res, result, 'WhatsApp confirmation sent');
});

module.exports = { list, revenue, createShipment, trackShipment, checkServiceability, sendOrderWhatsApp };
