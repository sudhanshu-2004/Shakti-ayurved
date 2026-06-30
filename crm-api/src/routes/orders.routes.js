const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/orders.controller');

router.use(authenticate);

router.get('/', ctrl.list);
router.get('/revenue', ctrl.revenue);

router.post('/:leadId/shipment', authorize('admin', 'agent'), ctrl.createShipment);
router.get('/shipment/track/:awb', ctrl.trackShipment);
router.get('/shipment/serviceability/:pincode', ctrl.checkServiceability);
router.post('/:leadId/whatsapp-confirm', ctrl.sendOrderWhatsApp);

module.exports = router;
