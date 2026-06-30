const env = require('../config/env');

/**
 * Middleware: verify X-Webhook-Secret header matches WEBHOOK_SECRET in .env
 * Used for the /api/webhook/* routes instead of JWT auth.
 */
function verifyWebhookSecret(req, res, next) {
  const secret = env.webhookSecret;

  // If no secret configured, block all webhook calls in production
  if (!secret || secret === 'change_this_webhook_secret') {
    if (env.env === 'production') {
      return res.status(503).json({
        success: false,
        message: 'Webhook endpoint not configured. Set WEBHOOK_SECRET in .env',
      });
    }
    // In development allow without header (for easy local testing)
    return next();
  }

  const provided = req.headers['x-webhook-secret'];
  if (!provided || provided !== secret) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: invalid or missing X-Webhook-Secret header',
    });
  }

  next();
}

module.exports = { verifyWebhookSecret };
