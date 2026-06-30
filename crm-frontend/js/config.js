/* SHAKTI AYURVED CRM — Frontend configuration */
window.API_BASE_URL = window.API_BASE_URL || (
  (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:5000/api'
    : '/crm-api'  // Vercel routes /crm-api/* → CRM Node.js serverless function
);
