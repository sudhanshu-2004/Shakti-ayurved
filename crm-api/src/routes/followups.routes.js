const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/followups.controller');

router.use(authenticate);
router.get('/', ctrl.list);
router.put('/:id', [body('date').notEmpty()], validate, ctrl.setFollowUp);

module.exports = router;
