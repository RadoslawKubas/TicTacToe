/**
 * AIEngine - Główny silnik AI dla gry TicTacToe
 * Zarządza różnymi algorytmami AI i poziomami trudności
 */
const RandomAI = require('./algorithms/RandomAI');
const HeuristicAI = require('./algorithms/HeuristicAI');
const MinimaxAI = require('./algorithms/MinimaxAI');
const AlphaBetaAI = require('./algorithms/AlphaBetaAI');
const PerfectAI = require('./algorithms/PerfectAI');

class AIEngine {
  constructor() {
    this.algorithms = {
      easy: new RandomAI(),
      medium: new HeuristicAI(),
      hard: new MinimaxAI(),
      expert: new AlphaBetaAI(),
      impossible: new PerfectAI()
    };

    this.cache = new Map();
    this.cacheEnabled = true;
  }

  /**
   * Wybiera optymalny ruch dla danego poziomu trudności
   * @param {Object} gameState - Stan gry
   * @param {string} difficulty - Poziom trudności
   * @param {number} maxThinkingTime - Maksymalny czas myślenia (ms)
   * @returns {Object} { row, col, thinkingTime, evaluation }
   */
  async selectMove(gameState, difficulty = 'medium', maxThinkingTime = 2000) {
    const startTime = Date.now();
    
    const algorithm = this.algorithms[difficulty];
    if (!algorithm) {
      throw new Error(`Unknown difficulty: ${difficulty}`);
    }

    // Sprawdź cache jeśli włączony
    const cacheKey = this._getCacheKey(gameState, difficulty);
    if (this.cacheEnabled && this.cache.has(cacheKey)) {
      const cachedMove = this.cache.get(cacheKey);
      return {
        ...cachedMove,
        thinkingTime: Date.now() - startTime,
        fromCache: true
      };
    }

    // Oblicz ruch
    const move = await algorithm.selectMove(gameState, maxThinkingTime);
    const thinkingTime = Date.now() - startTime;

    const result = {
      row: move.row,
      col: move.col,
      evaluation: move.evaluation || 0,
      thinkingTime,
      fromCache: false
    };

    // Zapisz do cache
    if (this.cacheEnabled) {
      this.cache.set(cacheKey, result);
    }

    return result;
  }

  /**
   * Analizuje pozycję i zwraca ocenę
   * @param {Object} gameState - Stan gry
   * @returns {Object} Analiza pozycji
   */
  analyzePosition(gameState) {
    const algorithm = this.algorithms.expert;
    return algorithm.analyzePosition(gameState);
  }

  /**
   * Zwraca podpowiedź dla gracza
   * @param {Object} gameState - Stan gry
   * @returns {Object} Najlepszy ruch z wyjaśnieniem
   */
  async getHint(gameState) {
    const algorithm = this.algorithms.expert;
    const move = await algorithm.selectMove(gameState, 5000);
    
    return {
      row: move.row,
      col: move.col,
      reason: move.reason || 'Best move according to AI',
      evaluation: move.evaluation
    };
  }

  /**
   * Czyści cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Włącza/wyłącza cache
   */
  setCacheEnabled(enabled) {
    this.cacheEnabled = enabled;
  }

  /**
   * Generuje klucz cache dla stanu gry
   * @private
   */
  _getCacheKey(gameState, difficulty) {
    const boardStr = JSON.stringify(gameState.board);
    return `${difficulty}:${boardStr}:${gameState.currentPlayer}`;
  }
}

module.exports = AIEngine;
