const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const ctrl = require('../controllers/auth.controller');

router.post(
  '/login',
  authLimiter,
  [body('username').trim().notEmpty().withMessage('Username required'), body('password').notEmpty().withMessage('Password required')],
  validate,
  ctrl.login
);

router.post('/refresh', ctrl.refresh);
router.get('/me', authenticate, ctrl.me);
router.post('/logout', authenticate, ctrl.logout);

module.exports = router;
