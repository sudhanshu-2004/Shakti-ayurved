const app = require('./app');
const env = require('./config/env');
const logger = require('./utils/logger');

const server = app.listen(env.port, () => {
  logger.info(`🚀 SHAKTI AYURVED CRM backend running on port ${env.port} [${env.env}]`);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection', { reason: reason && reason.stack ? reason.stack : reason });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { stack: err.stack });
  // Give the logger a moment to flush before exiting
  setTimeout(() => process.exit(1), 500);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => process.exit(0));
});
