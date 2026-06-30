const env = require('../config/env');
const logger = require('../utils/logger');
const { ApiError } = require('../utils/apiResponse');

function isConfigured() {
  return (
    !!env.whatsapp.accessToken &&
    !env.whatsapp.accessToken.startsWith('PASTE_') &&
    !!env.whatsapp.phoneNumberId &&
    !env.whatsapp.phoneNumberId.startsWith('PASTE_')
  );
}

async function sendMessage({ to, type = 'text', text, templateName, templateParams, languageCode = 'en' }) {
  if (!isConfigured()) {
    throw new ApiError(503, 'WhatsApp integration is not configured. Add WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID in .env');
  }
  const url = `${env.whatsapp.baseUrl}/${env.whatsapp.phoneNumberId}/messages`;

  let body;
  if (type === 'template') {
    body = {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
        components: templateParams
          ? [{ type: 'body', parameters: templateParams.map((p) => ({ type: 'text', text: String(p) })) }]
          : [],
      },
    };
  } else {
    body = { messaging_product: 'whatsapp', to, type: 'text', text: { body: text } };
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.whatsapp.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) {
    logger.error('WhatsApp API error', { status: res.status, body: json });
    throw new ApiError(502, 'WhatsApp API request failed', json);
  }
  return json;
}

// Helper presets used by the CRM (lead follow-up, order confirmation)
async function sendFollowUpReminder(to, customerName) {
  return sendMessage({
    to,
    type: 'text',
    text: `Hi ${customerName}, this is a follow-up from SHAKTI AYURVED regarding your enquiry. Please let us know if you have any questions!`,
  });
}

async function sendOrderConfirmation(to, customerName, productName, trackingId) {
  const trackLine = trackingId ? ` Your tracking ID is ${trackingId}.` : '';
  return sendMessage({
    to,
    type: 'text',
    text: `Hi ${customerName}, your order for ${productName} has been confirmed.${trackLine} Thank you for choosing SHAKTI AYURVED!`,
  });
}

module.exports = { isConfigured, sendMessage, sendFollowUpReminder, sendOrderConfirmation };
