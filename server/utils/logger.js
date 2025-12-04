/**
 * Logger - Prosty system logowania
 */
class Logger {
  constructor() {
    this.levels = {
      ERROR: 'ERROR',
      WARN: 'WARN',
      INFO: 'INFO',
      DEBUG: 'DEBUG'
    };
  }

  _log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...meta
    };

    const formattedMessage = `[${timestamp}] [${level}] ${message}`;

    if (level === this.levels.ERROR) {
      console.error(formattedMessage, meta);
    } else if (level === this.levels.WARN) {
      console.warn(formattedMessage, meta);
    } else {
      console.log(formattedMessage, meta);
    }
  }

  error(message, meta = {}) {
    this._log(this.levels.ERROR, message, meta);
  }

  warn(message, meta = {}) {
    this._log(this.levels.WARN, message, meta);
  }

  info(message, meta = {}) {
    this._log(this.levels.INFO, message, meta);
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      this._log(this.levels.DEBUG, message, meta);
    }
  }
}

module.exports = new Logger();
