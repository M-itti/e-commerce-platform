const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windlwMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again later.',
  headers: true, 
});

module.exports = { rateLimiter };

