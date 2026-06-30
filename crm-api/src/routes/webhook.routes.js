const router = require('express').Router();
const ctrl = require('../controllers/webhook.controller');
const { verifyWebhookSecret } = require('../middleware/webhookAuth');

// Both routes are public (no JWT) but require the shared webhook secret
// in the X-Webhook-Secret header.
router.post('/order', verifyWebhookSecret, ctrl.handleOrder);
router.post('/consultation', verifyWebhookSecret, ctrl.handleConsultation);

module.exports = router;
