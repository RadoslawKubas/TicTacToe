/**
 * Error Handler Middleware
 * Obsługuje wszystkie błędy w aplikacji
 */
const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  // Loguj błąd
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body
  });

  // Domyślny status 500
  const statusCode = err.statusCode || 500;
  
  // Przygotuj odpowiedź
  const response = {
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  res.status(statusCode).json(response);
}

module.exports = errorHandler;
