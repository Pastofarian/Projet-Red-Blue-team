const winston = require('winston');
require('winston-daily-rotate-file');
require('winston-syslog');

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

// remote syslog transport (UDP)
// update host/port for your remote syslog or Kali host
const syslogTransport = new winston.transports.Syslog({
  host: process.env.SYSLOG_HOST || '192.168.1.100',
  port: process.env.SYSLOG_PORT || 514,
  protocol: 'udp4',
  app_name: 'site40Bierges',
  localhost: 'api-vm'
});

// create Winston logger
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    // JSON format for easier parsing
    winston.format.json()
  ),
  transports: [
    rotateTransport,
    syslogTransport
  ],
  exitOnError: false
});

// Express middleware
module.exports = (req, res, next) => {
  const start = Date.now();

  // on response finish, log the entry
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
