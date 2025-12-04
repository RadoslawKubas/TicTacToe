/**
 * AlphaBetaAI - AI z Alpha-Beta pruning (poziom ekspert)
 * Optymalizowana wersja Minimax
 */
const Evaluator = require('../Evaluator');

class AlphaBetaAI {
  constructor() {
    this.maxDepth = 6; // Większa głębokość dzięki optymalizacji
    this.evaluator = new Evaluator();
    this.transpositionTable = new Map();
  }

  /**
   * Wybiera ruch używając Alpha-Beta pruning
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

    // Optymalizacja dla pierwszego ruchu
    if (validMoves.length === board.length * board.length) {
      const size = board.length;
      const center = Math.floor(size / 2);
      return { row: center, col: center, evaluation: 0 };
    }

    // Sortuj ruchy według heurystyki (Move Ordering)
    const sortedMoves = this._orderMoves(board, validMoves, currentPlayer);

    let bestMove = sortedMoves[0];
    let bestScore = -Infinity;
    const alpha = -Infinity;
    const beta = Infinity;

    for (const [row, col] of sortedMoves) {
      board[row][col] = currentPlayer;
      
      const score = this._alphaBeta(
        board,
        this.maxDepth - 1,
        alpha,
        beta,
        false,
        currentPlayer
      );
      
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
   * Algorytm Alpha-Beta pruning
   * @private
   */
  _alphaBeta(board, depth, alpha, beta, isMaximizing, aiPlayer) {
    // Sprawdź cache (Transposition Table)
    const boardKey = this._getBoardKey(board);
    if (this.transpositionTable.has(boardKey)) {
      const cached = this.transpositionTable.get(boardKey);
      if (cached.depth >= depth) {
        return cached.score;
      }
    }

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
      return 0;
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      
      for (const [row, col] of validMoves) {
        board[row][col] = currentPlayer;
        const evalScore = this._alphaBeta(board, depth - 1, alpha, beta, false, aiPlayer);
        board[row][col] = null;
        
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        
        if (beta <= alpha) {
          break; // Beta cut-off
        }
      }
      
      // Zapisz do cache
      this.transpositionTable.set(boardKey, { score: maxEval, depth });
      
      return maxEval;
    } else {
      let minEval = Infinity;
      
      for (const [row, col] of validMoves) {
        board[row][col] = currentPlayer;
        const evalScore = this._alphaBeta(board, depth - 1, alpha, beta, true, aiPlayer);
        board[row][col] = null;
        
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        
        if (beta <= alpha) {
          break; // Alpha cut-off
        }
      }
      
      // Zapisz do cache
      this.transpositionTable.set(boardKey, { score: minEval, depth });
      
      return minEval;
    }
  }

  /**
   * Analizuje pozycję
   */
  analyzePosition(gameState) {
    const { board, currentPlayer } = gameState;
    const evaluation = this.evaluator.evaluate(board, currentPlayer);
    
    return {
      evaluation,
      advantage: evaluation > 0 ? currentPlayer : (evaluation < 0 ? (currentPlayer === 'X' ? 'O' : 'X') : 'equal'),
      details: this.evaluator.getDetailedEvaluation(board, currentPlayer)
    };
  }

  /**
   * Sortuje ruchy według heurystyki (Move Ordering)
   * @private
   */
  _orderMoves(board, moves, player) {
    return moves.sort((a, b) => {
      const scoreA = this._evaluateMove(board, a[0], a[1], player);
      const scoreB = this._evaluateMove(board, b[0], b[1], player);
      return scoreB - scoreA;
    });
  }

  /**
   * Ocenia pojedynczy ruch
   * @private
   */
  _evaluateMove(board, row, col, player) {
    let score = 0;
    const size = board.length;

    // Priorytetyzuj centrum
    const centerDist = Math.abs(row - size / 2) + Math.abs(col - size / 2);
    score += (size - centerDist) * 2;

    // Priorytetyzuj rogi
    if ((row === 0 || row === size - 1) && (col === 0 || col === size - 1)) {
      score += 5;
    }

    return score;
  }

  /**
   * Generuje klucz dla planszy (do cache)
   * @private
   */
  _getBoardKey(board) {
    return JSON.stringify(board);
  }

  /**
   * Sprawdza czy gra się skończyła
   * @private
   */
  _checkGameOver(board, aiPlayer) {
    const opponent = aiPlayer === 'X' ? 'O' : 'X';
    
    if (this._checkWin(board, aiPlayer)) {
      return 100;
    }
    if (this._checkWin(board, opponent)) {
      return -100;
    }
    if (this._isBoardFull(board)) {
      return 0;
    }
    
    return null;
  }

  /**
   * Sprawdza wygraną
   * @private
   */
  _checkWin(board, player, winCondition = 3) {
    const size = board.length;

    // Wiersze i kolumny
    for (let i = 0; i < size; i++) {
      for (let j = 0; j <= size - winCondition; j++) {
        let rowCount = 0, colCount = 0;
        for (let k = 0; k < winCondition; k++) {
          if (board[i][j + k] === player) rowCount++;
          if (board[j + k][i] === player) colCount++;
        }
        if (rowCount === winCondition || colCount === winCondition) return true;
      }
    }

    // Przekątne
    for (let row = 0; row <= size - winCondition; row++) {
      for (let col = 0; col <= size - winCondition; col++) {
        let diag1 = 0, diag2 = 0;
        for (let i = 0; i < winCondition; i++) {
          if (board[row + i][col + i] === player) diag1++;
          if (board[row + i][col + winCondition - 1 - i] === player) diag2++;
        }
        if (diag1 === winCondition || diag2 === winCondition) return true;
      }
    }

    return false;
  }

  _isBoardFull(board) {
    return board.every(row => row.every(cell => cell !== null));
  }

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
   * Czyści transposition table
   */
  clearCache() {
    this.transpositionTable.clear();
  }
}

module.exports = AlphaBetaAI;
