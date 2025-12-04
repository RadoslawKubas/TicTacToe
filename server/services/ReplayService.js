/**
 * ReplayService - Serwis do zapisywania i odtwarzania gier
 */
class ReplayService {
  constructor() {
    this.replays = new Map(); // gameId -> replay data
  }

  /**
   * Zapisuje grę do replay
   */
  saveReplay(gameId, gameEngine) {
    const state = gameEngine.getGameState();
    
    const replay = {
      gameId,
      boardSize: state.settings.boardSize,
      winCondition: state.settings.winCondition,
      moves: state.moves,
      winner: state.winner,
      status: state.status,
      winningLine: state.winningLine,
      timestamp: Date.now()
    };

    this.replays.set(gameId, replay);
    return replay;
  }

  /**
   * Pobiera replay gry
   */
  getReplay(gameId) {
    return this.replays.get(gameId);
  }

  /**
   * Odtwarza grę krok po kroku
   */
  replayGame(gameId, stepCallback) {
    const replay = this.replays.get(gameId);
    if (!replay) {
      throw new Error('Replay not found');
    }

    const GameEngine = require('../game/GameEngine');
    const game = new GameEngine(replay.boardSize, replay.winCondition);

    const steps = [];
    steps.push(game.getGameState());

    for (const move of replay.moves) {
      game.makeMove(move.row, move.col, move.player);
      const state = game.getGameState();
      steps.push(state);
      
      if (stepCallback) {
        stepCallback(state, move);
      }
    }

    return steps;
  }

  /**
   * Eksportuje replay do JSON
   */
  exportToJSON(gameId) {
    const replay = this.replays.get(gameId);
    if (!replay) {
      throw new Error('Replay not found');
    }

    return JSON.stringify(replay, null, 2);
  }

  /**
   * Importuje replay z JSON
   */
  importFromJSON(jsonString) {
    const replay = JSON.parse(jsonString);
    this.replays.set(replay.gameId, replay);
    return replay;
  }

  /**
   * Usuwa replay
   */
  deleteReplay(gameId) {
    return this.replays.delete(gameId);
  }

  /**
   * Pobiera wszystkie replay
   */
  getAllReplays() {
    return Array.from(this.replays.values());
  }

  /**
   * Czyści stare replay
   */
  cleanupOldReplays(maxAge = 30 * 24 * 60 * 60 * 1000) { // 30 dni
    const now = Date.now();
    let cleaned = 0;

    for (const [gameId, replay] of this.replays) {
      if (now - replay.timestamp > maxAge) {
        this.replays.delete(gameId);
        cleaned++;
      }
    }

    return cleaned;
  }
}

module.exports = ReplayService;
