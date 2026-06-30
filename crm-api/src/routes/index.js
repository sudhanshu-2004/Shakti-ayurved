const router = require('express').Router();

// ── Public webhook routes (no JWT — uses X-Webhook-Secret instead) ──
router.use('/webhook', require('./webhook.routes'));

router.use('/auth', require('./auth.routes'));
router.use('/leads', require('./leads.routes'));
router.use('/agents', require('./agents.routes'));
router.use('/products', require('./products.routes'));
router.use('/followups', require('./followups.routes'));
router.use('/orders', require('./orders.routes'));
router.use('/reports', require('./reports.routes'));
router.use('/dashboard', require('./dashboard.routes'));
router.use('/data', require('./importExport.routes')); // import/export
router.use('/assignment', require('./assignment.routes')); // quick lead assignment
router.use('/settings', require('./settings.routes'));
router.use('/integrations', require('./integrations.routes'));

module.exports = router;
