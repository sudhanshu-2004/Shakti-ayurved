const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/settings.controller');

router.use(authenticate);
router.get('/', ctrl.get);
router.put('/', authorize('admin'), ctrl.update);

module.exports = router;
