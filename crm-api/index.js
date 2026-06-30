// Vercel Serverless Entry Point for Shakti Ayurved CRM API
// This file wraps the Express app for Vercel's serverless runtime.
// Vercel calls this as a Node.js function for all /crm-api/* requests.

const app = require('./src/app');

module.exports = app;
