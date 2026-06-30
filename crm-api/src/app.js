const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

const env = require('./config/env');
const logger = require('./utils/logger');
const { apiLimiter } = require('./middleware/rateLimiter');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

app.set('trust proxy', 1);

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS - allow the configured frontend origin(s)
const allowedOrigins = env.clientOrigin === '*' ? '*' : env.clientOrigin.split(',').map((o) => o.trim());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// HTTP request logging
app.use(
  morgan('combined', {
    stream: { write: (msg) => logger.info(msg.trim()) },
  })
);

// Rate limiting on all API routes
app.use('/api', apiLimiter);

// Static file serving for uploaded documents/reports
app.use('/uploads', express.static(path.join(__dirname, '..', env.upload.dir)));

// Health check
app.get('/health', (req, res) => res.json({ success: true, status: 'up', timestamp: new Date().toISOString() }));

// API routes
app.use('/api', routes);

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;
