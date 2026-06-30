const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/agents.controller');

router.use(authenticate);

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);

router.post('/', authorize('admin'), [body('name').trim().notEmpty()], validate, ctrl.create);
router.put('/:id', authorize('admin'), ctrl.update);
router.delete('/:id', authorize('admin'), ctrl.remove);
router.post('/:id/toggle-active', authorize('admin'), ctrl.toggleActive);
router.post('/:id/reset-password', authorize('admin'), ctrl.resetPassword);

module.exports = router;
