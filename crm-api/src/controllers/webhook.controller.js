const asyncHandler = require('../utils/asyncHandler');
const { created, ok } = require('../utils/apiResponse');
const leadsService = require('../services/leads.service');
const logger = require('../utils/logger');

/**
 * Map a website product name string to the CRM product key.
 * This mirrors the SQL function in 002_website_integration.sql
 * so the fallback webhook path produces consistent data.
 */
function mapProductKey(name = '') {
  const n = name.toLowerCase();
  if (n.includes('pathri') || n.includes('kidney')) return 'kidney';
  if (n.includes('hair'))                           return 'hairgrowth';
  if (n.includes('bp') || n.includes('blood pressure')) return 'bp';
  if (n.includes('sugar') || n.includes('diabetes'))  return 'sugar';
  if (n.includes('liver'))                          return 'liver';
  if (n.includes('weight'))                         return 'weightloss';
  if (n.includes('joint'))                          return 'joint';
  if (n.includes('digest'))                         return 'digestive';
  if (n.includes('skin') || n.includes('glow'))     return 'skin';
  if (n.includes('immun'))                          return 'immunity';
  return 'other';
}

/**
 * POST /api/webhook/order
 * Payload: { order, items, customer }
 * Called by the website Python backend after a successful Supabase order insert.
 * Acts as a fallback — if the Supabase trigger already fired, this will create
 * a duplicate lead. To avoid duplicates the service checks mobile + source='Website'
 * within the last 60 seconds before inserting.
 */
const handleOrder = asyncHandler(async (req, res) => {
  const { order = {}, items = [], customer = {} } = req.body;

  const phone   = customer.phone || order.phone || '';
  const name    = customer.name  || order.customer_name || 'Unknown Customer';
  const address = [
    customer.address || order.address || '',
    customer.city    || order.city    || '',
    customer.state   || order.state   || '',
    customer.pincode || order.pincode || '',
  ].filter(Boolean).join(', ');

  if (!phone) {
    return ok(res, null, 'Skipped: no phone number in payload');
  }

  const firstItem  = items[0] || {};
  const productKey = mapProductKey(firstItem.name || '');
  const total      = order.total || order.grandTotal || 0;

  logger.info(`[webhook] website order received for ${name} (${phone}) — product: ${productKey}`);

  const lead = await leadsService.create(
    {
      name,
      mobile:          phone,
      product:         productKey,
      stage:           'Converted',
      status:          'Converted',
      leadType:        'Website',
      rate:            firstItem.price    || total,
      quantity:        firstItem.quantity || 1,
      value:           total,
      orderStatus:     order.payment_method === 'cod' ? 'Address Pending' : 'Payment Received',
      deliveryAddress: address,
      assignedBy:      'Website',
    },
    'System (Website Webhook)'
  );

  return created(res, lead, 'Lead created from website order');
});

/**
 * POST /api/webhook/consultation
 * Payload: { name, phone, message }
 * Called by the website Python backend after a successful consultation insert.
 */
const handleConsultation = asyncHandler(async (req, res) => {
  const { name, phone, message } = req.body;

  if (!phone) {
    return ok(res, null, 'Skipped: no phone number in payload');
  }

  logger.info(`[webhook] website enquiry received from ${name} (${phone})`);

  const lead = await leadsService.create(
    {
      name:        name || 'Unknown',
      mobile:      phone,
      product:     'other',
      stage:       'Fresh',
      status:      'New',
      leadType:    'Website Enquiry',
      assignedBy:  'Website',
    },
    'System (Website Webhook)'
  );

  return created(res, lead, 'Lead created from website enquiry');
});

module.exports = { handleOrder, handleConsultation };
