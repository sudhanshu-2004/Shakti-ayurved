const router = require('express').Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/leads.controller');

router.use(authenticate);

router.get('/', ctrl.list);
router.get('/:id', param('id').notEmpty(), validate, ctrl.getOne);

router.post(
  '/',
  authorize('admin', 'agent'),
  [body('name').trim().notEmpty().withMessage('Customer name required'), body('mobile').trim().notEmpty().withMessage('Mobile required')],
  validate,
  ctrl.create
);

router.post('/bulk', authorize('admin'), ctrl.bulkCreate);

router.put('/:id', ctrl.update);
router.delete('/:id', authorize('admin'), ctrl.remove);

router.post('/:id/cnp', [body('reason').notEmpty()], validate, ctrl.setCNP);
router.post('/:id/complete', [body('rate').isNumeric(), body('quantity').isNumeric()], validate, ctrl.complete);
router.post('/:id/order-status', [body('orderStatus').notEmpty()], validate, ctrl.setOrderStatus);
router.post('/:id/reject', ctrl.reject);
router.get('/:id/history', ctrl.history);

module.exports = router;
