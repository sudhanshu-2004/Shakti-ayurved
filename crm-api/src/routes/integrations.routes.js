const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/integrations.controller');

// WhatsApp webhook (Meta calls this directly — no JWT)
router.get('/whatsapp/webhook', ctrl.verifyWebhook);
router.post('/whatsapp/webhook', ctrl.receiveWebhook);

router.use(authenticate);
router.get('/status', ctrl.status);
router.post('/whatsapp/send', ctrl.sendWhatsApp);
router.get('/delhivery/track/:awb', ctrl.trackShipment);

module.exports = router;
