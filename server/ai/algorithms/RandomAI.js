/**
 * RandomAI - AI losowy (poziom łatwy)
 * Wybiera losowe dostępne pole
 */
class RandomAI {
  /**
   * Wybiera losowy ruch z dostępnych pól
   * @param {Object} gameState - Stan gry
   * @param {number} maxTime - Maksymalny czas (nieużywany)
   * @returns {Object} { row, col, evaluation }
   */
  async selectMove(gameState, maxTime = 2000) {
    const validMoves = this._getValidMoves(gameState.board);
    
    if (validMoves.length === 0) {
      throw new Error('No valid moves available');
    }

    // Symuluj "myślenie" - krótkie opóźnienie dla realizmu
    await this._simulateThinking(100, 300);

    // Wybierz losowy ruch
    const randomIndex = Math.floor(Math.random() * validMoves.length);
    const [row, col] = validMoves[randomIndex];

    return {
      row,
      col,
      evaluation: 0
    };
  }

  /**
   * Pobiera listę dostępnych ruchów
   * @private
   */
  _getValidMoves(board) {
    const moves = [];
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === null) {
          moves.push([row, col]);
        }
      }
    }
    return moves;
  }

  /**
   * Symuluje myślenie AI
   * @private
   */
  async _simulateThinking(minMs, maxMs) {
    const delay = minMs + Math.random() * (maxMs - minMs);
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}

module.exports = RandomAI;
