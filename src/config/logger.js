const winston = require('winston');
require('dotenv').config();  

const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

// Define the log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
  })
);

// Create the logger instance
const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      ),
    }),
    // Additional transports can be added here (e.g., file transport)
  ],
});

module.exports = logger;
