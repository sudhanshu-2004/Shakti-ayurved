const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/assignment.controller');

router.use(authenticate, authorize('admin'));

router.post('/assign', [body('agentId').notEmpty(), body('count').notEmpty()], validate, ctrl.assignToAgent);
router.post('/distribute', [body('count').notEmpty()], validate, ctrl.distribute);

module.exports = router;
