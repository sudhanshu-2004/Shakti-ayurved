const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/products.controller');

router.use(authenticate);
router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);

module.exports = router;
