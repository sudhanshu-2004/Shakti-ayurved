const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/reports.controller');

router.use(authenticate);

router.get('/agent-performance', authorize('admin'), ctrl.agentPerformance);
router.get('/product-performance', ctrl.productPerformance);
router.get('/funnel', ctrl.funnel);
router.get('/revenue-over-time', ctrl.revenueOverTime);

module.exports = router;
