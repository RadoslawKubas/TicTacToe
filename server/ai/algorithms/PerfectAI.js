/**
 * PerfectAI - Perfekcyjny AI (poziom niemożliwy)
 * Nigdy nie przegrywa - zawsze gra optymalnie
 */
const AlphaBetaAI = require('./AlphaBetaAI');

class PerfectAI {
  constructor() {
    this.alphaBeta = new AlphaBetaAI();
    // Prekalkulowane optymalne ruchy dla 3x3 (otwierające ruchy)
    this.openingBook = this._buildOpeningBook();
  }

  /**
   * Wybiera perfekcyjny ruch
   * @param {Object} gameState - Stan gry
   * @param {number} maxTime - Maksymalny czas
   * @returns {Object} { row, col, evaluation }
   */
  async selectMove(gameState, maxTime = 5000) {
    const { board } = gameState;
    const moveCount = this._countMoves(board);

    // Użyj opening book dla pierwszych ruchów (3x3)
    if (board.length === 3 && moveCount <= 2) {
      const openingMove = this._getOpeningMove(board);
      if (openingMove) {
        return { ...openingMove, evaluation: 0 };
      }
    }

    // Dla innych sytuacji użyj Alpha-Beta z pełną głębokością
    this.alphaBeta.maxDepth = 10; // Bardzo głęboka analiza
    return await this.alphaBeta.selectMove(gameState, maxTime);
  }

  /**
   * Buduje książkę otwarć dla 3x3
   * @private
   */
  _buildOpeningBook() {
    return {
      // Pierwszy ruch - zawsze centrum lub róg
      first: { row: 1, col: 1 },
      
      // Odpowiedzi na najpopularniejsze otwarcia
      responses: {
        // Jeśli przeciwnik zagrał centrum
        'center': [
          { row: 0, col: 0 }, // Róg
          { row: 0, col: 2 },
          { row: 2, col: 0 },
          { row: 2, col: 2 }
        ],
        // Jeśli przeciwnik zagrał róg
        'corner': { row: 1, col: 1 } // Centrum
      }
    };
  }

  /**
   * Pobiera ruch z opening book
   * @private
   */
  _getOpeningMove(board) {
    const moveCount = this._countMoves(board);
    const size = board.length;
    const center = Math.floor(size / 2);

    // Pierwszy ruch - zawsze centrum
    if (moveCount === 0) {
      return { row: center, col: center };
    }

    // Drugi ruch (odpowiedź) - tylko dla planszy 3x3
    if (moveCount === 1 && size === 3) {
      // Sprawdź czy przeciwnik zagrał centrum
      if (board[center][center] !== null && board[center][center] !== '' && board[center][center] !== undefined) {
        const corners = this.openingBook.responses.center;
        return corners[Math.floor(Math.random() * corners.length)];
      }
      // Przeciwnik zagrał róg - zagraj centrum
      return this.openingBook.responses.corner;
    }

    return null;
  }

  /**
   * Liczy wykonane ruchy
   * @private
   */
  _countMoves(board) {
    let count = 0;
    for (let row of board) {
      for (let cell of row) {
        if (cell !== null && cell !== '' && cell !== undefined) count++;
      }
    }
    return count;
  }
}

module.exports = PerfectAI;
