const winston = require('winston');
require('winston-daily-rotate-file');

const path = require('path');
const fs = require('fs');

// local transport (daily rotating file)
const logDir = path.join(__dirname, '..', '..', 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

// rotate daily, keep 28 days
const rotateTransport = new winston.transports.DailyRotateFile({
  dirname: logDir,
  filename: 'access-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxFiles: '28d',
  level: 'info'
});

const logger = winston.createLogger({
  format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
  ),
  transports: [
    rotateTransport
  ],
  exitOnError: false
});

// Express middleware
module.exports = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const entry = {
      timestamp: new Date().toISOString(),
      ip: req.ip,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration_ms: duration,
      user_agent: req.get('User-Agent') || 'N/A',
      jwt: req.headers['authorization'] || req.headers['token'] || 'None'
    };
    logger.info(entry);
  });

  next();
};
