/**
 * Główny plik serwera TicTacToe
 */
const express = require('express');
const cors = require('cors');
const config = require('./config/config');

// Import routerów
const gameRoutes = require('./routes/gameRoutes');
const aiRoutes = require('./routes/aiRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Inicjalizacja aplikacji
const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logowanie requestów
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: Date.now() });
});

// API Routes
app.use('/api/game', gameRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler (musi być ostatni)
app.use(errorHandler);

// Uruchomienie serwera
const server = app.listen(config.port, () => {
  logger.info(`TicTacToe Server running on port ${config.port}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, closing server...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

module.exports = app;
