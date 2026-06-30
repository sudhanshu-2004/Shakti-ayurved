const env = require('../config/env');
const logger = require('../utils/logger');
const { ApiError } = require('../utils/apiResponse');

function isConfigured() {
  return !!env.delhivery.token && !env.delhivery.token.startsWith('PASTE_');
}

async function call(path, options = {}) {
  if (!isConfigured()) {
    throw new ApiError(503, 'Delhivery integration is not configured. Add DELHIVERY_API_TOKEN in .env');
  }
  const url = `${env.delhivery.baseUrl}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Token ${env.delhivery.token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    json = { raw: text };
  }
  if (!res.ok) {
    logger.error('Delhivery API error', { status: res.status, body: json });
    throw new ApiError(502, 'Delhivery API request failed', json);
  }
  return json;
}

// Track shipment by waybill/AWB number
async function trackShipment(awb) {
  return call(`/api/v1/packages/json/?waybill=${encodeURIComponent(awb)}`, { method: 'GET' });
}

// Create a shipment (forward) for a converted lead/order
async function createShipment(shipmentPayload) {
  return call('/api/cmu/create.json', {
    method: 'POST',
    body: JSON.stringify({
      format: 'json',
      data: JSON.stringify({
        shipments: [shipmentPayload],
        pickup_location: { name: env.delhivery.clientName },
      }),
    }),
  });
}

// Check pincode serviceability
async function checkServiceability(pincode) {
  return call(`/c/api/pin-codes/json/?filter_codes=${encodeURIComponent(pincode)}`, { method: 'GET' });
}

module.exports = { isConfigured, trackShipment, createShipment, checkServiceability };
