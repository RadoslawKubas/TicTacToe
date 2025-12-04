/**
 * MatchmakingService - System matchmakingu dla gry online
 */
const { v4: uuidv4 } = require('uuid');
const GameRoom = require('./GameRoom');
const logger = require('../utils/logger');

class MatchmakingService {
  constructor() {
    this.waitingQueue = new Map(); // clientId -> { playerName, rating, preferences }
    this.activeMatches = new Map(); // matchId -> GameRoom
  }

  /**
   * Dodaje gracza do kolejki matchmakingu
   */
  addToQueue(clientId, playerName, preferences = {}) {
    const playerData = {
      clientId,
      playerName,
      rating: preferences.rating || 1000,
      preferences: {
        boardSize: preferences.boardSize || 3,
        winCondition: preferences.winCondition || 3,
        ratingRange: preferences.ratingRange || 200
      },
      joinedAt: Date.now()
    };

    this.waitingQueue.set(clientId, playerData);
    logger.info(`Player ${playerName} added to matchmaking queue`);

    // Spróbuj znaleźć mecz
    return this._tryMatch(clientId);
  }

  /**
   * Usuwa gracza z kolejki
   */
  removeFromQueue(clientId) {
    const player = this.waitingQueue.get(clientId);
    if (player) {
      this.waitingQueue.delete(clientId);
      logger.info(`Player ${player.playerName} removed from queue`);
    }
  }

  /**
   * Próbuje znaleźć mecz dla gracza
   * @private
   */
  _tryMatch(clientId) {
    const player = this.waitingQueue.get(clientId);
    if (!player) return null;

    // Szukaj przeciwnika
    for (const [opponentId, opponent] of this.waitingQueue) {
      if (opponentId === clientId) continue;

      // Sprawdź kompatybilność
      if (this._arePlayersCompatible(player, opponent)) {
        return this._createMatch(player, opponent);
      }
    }

    return null;
  }

  /**
   * Sprawdza czy gracze są kompatybilni
   * @private
   */
  _arePlayersCompatible(player1, player2) {
    // Sprawdź różnicę ratingu
    const ratingDiff = Math.abs(player1.rating - player2.rating);
    const maxRatingDiff = Math.min(
      player1.preferences.ratingRange,
      player2.preferences.ratingRange
    );

    if (ratingDiff > maxRatingDiff) {
      return false;
    }

    // Sprawdź preferencje planszy
    if (player1.preferences.boardSize !== player2.preferences.boardSize) {
      return false;
    }

    if (player1.preferences.winCondition !== player2.preferences.winCondition) {
      return false;
    }

    return true;
  }

  /**
   * Tworzy mecz dla dwóch graczy
   * @private
   */
  _createMatch(player1, player2) {
    const matchId = uuidv4();
    
    const room = new GameRoom(matchId, {
      boardSize: player1.preferences.boardSize,
      winCondition: player1.preferences.winCondition
    });

    // Losowo przypisz X i O
    const [playerX, playerO] = Math.random() < 0.5 
      ? [player1, player2] 
      : [player2, player1];

    room.addPlayer(playerX.clientId, playerX.playerName);
    room.addPlayer(playerO.clientId, playerO.playerName);

    this.activeMatches.set(matchId, room);

    // Usuń graczy z kolejki
    this.waitingQueue.delete(player1.clientId);
    this.waitingQueue.delete(player2.clientId);

    logger.info(`Match created: ${matchId} between ${player1.playerName} and ${player2.playerName}`);

    return {
      matchId,
      room,
      players: [
        { clientId: playerX.clientId, name: playerX.playerName, symbol: 'X' },
        { clientId: playerO.clientId, name: playerO.playerName, symbol: 'O' }
      ]
    };
  }

  /**
   * Pobiera pokój meczu
   */
  getMatch(matchId) {
    return this.activeMatches.get(matchId);
  }

  /**
   * Usuwa mecz
   */
  removeMatch(matchId) {
    this.activeMatches.delete(matchId);
    logger.info(`Match ${matchId} removed`);
  }

  /**
   * Pobiera statystyki kolejki
   */
  getQueueStats() {
    return {
      waitingPlayers: this.waitingQueue.size,
      activeMatches: this.activeMatches.size,
      averageWaitTime: this._calculateAverageWaitTime()
    };
  }

  /**
   * Oblicza średni czas oczekiwania
   * @private
   */
  _calculateAverageWaitTime() {
    if (this.waitingQueue.size === 0) return 0;

    const now = Date.now();
    let totalWaitTime = 0;

    for (const player of this.waitingQueue.values()) {
      totalWaitTime += now - player.joinedAt;
    }

    return Math.floor(totalWaitTime / this.waitingQueue.size);
  }

  /**
   * Czyści nieaktywne mecze
   */
  cleanupInactiveMatches(maxInactiveTime = 10 * 60 * 1000) {
    const now = Date.now();
    let cleaned = 0;

    for (const [matchId, room] of this.activeMatches) {
      if (room.isInactive(maxInactiveTime)) {
        this.activeMatches.delete(matchId);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.info(`Cleaned up ${cleaned} inactive matches`);
    }
  }

  /**
   * Rozszerza zakres ratingu dla graczy czekających długo
   */
  expandRatingRanges() {
    const now = Date.now();
    const expandAfter = 30 * 1000; // 30 sekund
    const expandStep = 100;

    for (const [clientId, player] of this.waitingQueue) {
      const waitTime = now - player.joinedAt;
      
      if (waitTime > expandAfter) {
        const expansions = Math.floor(waitTime / expandAfter);
        player.preferences.ratingRange += expansions * expandStep;
        
        // Spróbuj ponownie dopasować
        const match = this._tryMatch(clientId);
        if (match) {
          return match;
        }
      }
    }

    return null;
  }
}

module.exports = MatchmakingService;
