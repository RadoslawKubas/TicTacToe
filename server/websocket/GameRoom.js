/**
 * GameRoom - Pokój gry dla multiplayer
 */
const GameEngine = require('../game/GameEngine');

class GameRoom {
  constructor(roomId, settings = {}) {
    this.roomId = roomId;
    this.settings = {
      boardSize: settings.boardSize || 3,
      winCondition: settings.winCondition || 3,
      timeLimit: settings.timeLimit || null
    };

    this.game = new GameEngine(this.settings.boardSize, this.settings.winCondition);
    this.players = new Map(); // clientId -> { name, symbol }
    this.maxPlayers = 2;
    this.createdAt = Date.now();
    this.lastActivityAt = Date.now();
  }

  /**
   * Dodaje gracza do pokoju
   */
  addPlayer(clientId, playerName) {
    if (this.isFull()) {
      throw new Error('Room is full');
    }

    const symbol = this.players.size === 0 ? 'X' : 'O';
    this.players.set(clientId, {
      id: clientId,
      name: playerName,
      symbol
    });

    this.lastActivityAt = Date.now();
  }

  /**
   * Usuwa gracza z pokoju
   */
  removePlayer(clientId) {
    this.players.delete(clientId);
    this.lastActivityAt = Date.now();
  }

  /**
   * Sprawdza czy pokój jest pełny
   */
  isFull() {
    return this.players.size >= this.maxPlayers;
  }

  /**
   * Sprawdza czy pokój jest pusty
   */
  isEmpty() {
    return this.players.size === 0;
  }

  /**
   * Wykonuje ruch w grze
   */
  makeMove(clientId, row, col) {
    const player = this.players.get(clientId);
    if (!player) {
      return { success: false, error: 'Player not in room' };
    }

    const result = this.game.makeMove(row, col, player.symbol);
    this.lastActivityAt = Date.now();

    if (result.success) {
      return {
        success: true,
        player: player.symbol,
        gameState: result.gameState
      };
    }

    return result;
  }

  /**
   * Resetuje grę (rematch)
   */
  reset() {
    this.game.reset();
    this.lastActivityAt = Date.now();
  }

  /**
   * Pobiera stan gry
   */
  getGameState() {
    return this.game.getGameState();
  }

  /**
   * Pobiera listę graczy
   */
  getPlayers() {
    return Array.from(this.players.values());
  }

  /**
   * Pobiera nazwę gracza
   */
  getPlayerName(clientId) {
    const player = this.players.get(clientId);
    return player ? player.name : null;
  }

  /**
   * Pobiera symbol gracza
   */
  getPlayerSymbol(clientId) {
    const player = this.players.get(clientId);
    return player ? player.symbol : null;
  }

  /**
   * Sprawdza czy pokój jest nieaktywny
   */
  isInactive(maxInactiveTime = 5 * 60 * 1000) { // 5 minut
    return Date.now() - this.lastActivityAt > maxInactiveTime;
  }
}

module.exports = GameRoom;
