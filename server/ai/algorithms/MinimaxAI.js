/**
 * MinimaxAI - AI używający algorytmu Minimax (poziom trudny)
 */
const Evaluator = require('../Evaluator');

class MinimaxAI {
  constructor() {
    this.maxDepth = 4; // Ograniczenie głębokości dla wydajności
    this.evaluator = new Evaluator();
  }

  /**
   * Wybiera ruch używając algorytmu Minimax
   * @param {Object} gameState - Stan gry
   * @param {number} maxTime - Maksymalny czas
   * @returns {Object} { row, col, evaluation }
   */
  async selectMove(gameState, maxTime = 2000) {
    const { board, currentPlayer } = gameState;
    const validMoves = this._getValidMoves(board);
    
    if (validMoves.length === 0) {
      throw new Error('No valid moves available');
    }

    // Dla pierwszego ruchu w pustej planszy, wybierz centrum lub róg
    if (validMoves.length === board.length * board.length) {
      const size = board.length;
      if (size === 3) {
        return { row: 1, col: 1, evaluation: 0 }; // Centrum
      } else {
        return { row: 0, col: 0, evaluation: 0 }; // Róg
      }
    }

    let bestMove = validMoves[0];
    let bestScore = -Infinity;

    for (const [row, col] of validMoves) {
      // Symuluj ruch
      board[row][col] = currentPlayer;
      
      // Oblicz wynik minimax
      const score = this._minimax(board, this.maxDepth - 1, false, currentPlayer);
      
      // Cofnij ruch
      board[row][col] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = [row, col];
      }
    }

    return {
      row: bestMove[0],
      col: bestMove[1],
      evaluation: bestScore
    };
  }

  /**
   * Algorytm Minimax
   * @private
   * @param {Array} board - Plansza
   * @param {number} depth - Pozostała głębokość
   * @param {boolean} isMaximizing - Czy maksymalizujący gracz
   * @param {string} aiPlayer - Symbol AI
   * @returns {number} Ocena pozycji
   */
  _minimax(board, depth, isMaximizing, aiPlayer) {
    // Sprawdź warunki końcowe
    const gameResult = this._checkGameOver(board, aiPlayer);
    if (gameResult !== null) {
      return gameResult;
    }

    if (depth === 0) {
      return this.evaluator.evaluate(board, aiPlayer);
    }

    const opponent = aiPlayer === 'X' ? 'O' : 'X';
    const currentPlayer = isMaximizing ? aiPlayer : opponent;
    const validMoves = this._getValidMoves(board);

    if (validMoves.length === 0) {
      return 0; // Remis
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      
      for (const [row, col] of validMoves) {
        board[row][col] = currentPlayer;
        const evalScore = this._minimax(board, depth - 1, false, aiPlayer);
        board[row][col] = null;
        
        maxEval = Math.max(maxEval, evalScore);
      }
      
      return maxEval;
    } else {
      let minEval = Infinity;
      
      for (const [row, col] of validMoves) {
        board[row][col] = currentPlayer;
        const evalScore = this._minimax(board, depth - 1, true, aiPlayer);
        board[row][col] = null;
        
        minEval = Math.min(minEval, evalScore);
      }
      
      return minEval;
    }
  }

  /**
   * Sprawdza czy gra się skończyła
   * @private
   * @returns {number|null} Wynik (10, -10, 0) lub null jeśli gra trwa
   */
  _checkGameOver(board, aiPlayer) {
    const opponent = aiPlayer === 'X' ? 'O' : 'X';
    
    if (this._checkWin(board, aiPlayer)) {
      return 10;
    }
    if (this._checkWin(board, opponent)) {
      return -10;
    }
    if (this._isBoardFull(board)) {
      return 0;
    }
    
    return null;
  }

  /**
   * Sprawdza wygraną gracza
   * @private
   */
  _checkWin(board, player, winCondition = 3) {
    const size = board.length;

    // Wiersze
    for (let row = 0; row < size; row++) {
      for (let col = 0; col <= size - winCondition; col++) {
        let count = 0;
        for (let i = 0; i < winCondition; i++) {
          if (board[row][col + i] === player) count++;
        }
        if (count === winCondition) return true;
      }
    }

    // Kolumny
    for (let col = 0; col < size; col++) {
      for (let row = 0; row <= size - winCondition; row++) {
        let count = 0;
        for (let i = 0; i < winCondition; i++) {
          if (board[row + i][col] === player) count++;
        }
        if (count === winCondition) return true;
      }
    }

    // Przekątne
    for (let row = 0; row <= size - winCondition; row++) {
      for (let col = 0; col <= size - winCondition; col++) {
        // \
        let count1 = 0;
        for (let i = 0; i < winCondition; i++) {
          if (board[row + i][col + i] === player) count1++;
        }
        if (count1 === winCondition) return true;

        // /
        if (col + winCondition - 1 < size) {
          let count2 = 0;
          for (let i = 0; i < winCondition; i++) {
            if (board[row + i][col + winCondition - 1 - i] === player) count2++;
          }
          if (count2 === winCondition) return true;
        }
      }
    }

    return false;
  }

  /**
   * Sprawdza czy plansza jest pełna
   * @private
   */
  _isBoardFull(board) {
    for (let row of board) {
      for (let cell of row) {
        if (cell === null) return false;
      }
    }
    return true;
  }

  /**
   * Pobiera dostępne ruchy
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
}

module.exports = MinimaxAI;
