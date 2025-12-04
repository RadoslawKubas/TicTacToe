/**
 * Konfiguracja serwera
 */
require('dotenv').config();

const config = {
  // Port serwera
  port: process.env.PORT || 3000,
  
  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  },
  
  // Połączenie z bazą danych (opcjonalne - może być SQLite lub PostgreSQL)
  database: {
    type: process.env.DB_TYPE || 'memory', // 'memory', 'sqlite', 'postgres'
    sqlite: {
      filename: process.env.DB_SQLITE_FILE || './database/tictactoe.db'
    },
    postgres: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'tictactoe',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || ''
    }
  },
  
  // Ustawienia sesji
  session: {
    secret: process.env.SESSION_SECRET || 'tictactoe-secret-key-change-in-production',
    maxAge: 24 * 60 * 60 * 1000 // 24 godziny
  },
  
  // Ustawienia WebSocket
  websocket: {
    port: process.env.WS_PORT || 3001,
    pingInterval: 30000,
    pingTimeout: 5000
  },
  
  // Limity API
  rateLimits: {
    windowMs: 15 * 60 * 1000, // 15 minut
    max: 100 // max 100 requestów na okno
  },
  
  // Ustawienia gry
  game: {
    maxBoardSize: 10,
    minBoardSize: 3,
    defaultBoardSize: 3,
    defaultWinCondition: 3,
    aiMaxThinkingTime: 2000 // ms
  }
};

module.exports = config;
