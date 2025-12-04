/**
 * HeuristicAI - AI heurystyczny (poziom średni)
 * Używa podstawowej heurystyki do oceny pozycji
 */
class HeuristicAI {
  /**
   * Wybiera ruch używając heurystyki
   * @param {Object} gameState - Stan gry
   * @param {number} maxTime - Maksymalny czas
   * @returns {Object} { row, col, evaluation }
   */
  async selectMove(gameState, maxTime = 2000) {
    const { board, currentPlayer } = gameState;
    const size = board.length;
    const opponent = currentPlayer === 'X' ? 'O' : 'X';

    // 1. Sprawdź czy można wygrać w jednym ruchu
    const winningMove = this._findWinningMove(board, currentPlayer);
    if (winningMove) {
      return { ...winningMove, evaluation: 1.0, reason: 'Winning move' };
    }

    // 2. Zablokuj wygraną przeciwnika
    const blockingMove = this._findWinningMove(board, opponent);
    if (blockingMove) {
      return { ...blockingMove, evaluation: 0.8, reason: 'Blocking opponent' };
    }

    // 3. Priorytetyzuj centrum (dla planszy 3x3)
    if (size === 3 && board[1][1] === null) {
      return { row: 1, col: 1, evaluation: 0.7, reason: 'Center position' };
    }

    // 4. Wybierz najlepsze pole według heurystyki
    const bestMove = this._selectBestHeuristicMove(board, currentPlayer);
    return { ...bestMove, evaluation: 0.5 };
  }

  /**
   * Znajduje ruch wygrywający
   * @private
   */
  _findWinningMove(board, player) {
    const validMoves = this._getValidMoves(board);
    
    for (const [row, col] of validMoves) {
      // Symuluj ruch
      board[row][col] = player;
      
      // Sprawdź czy wygrywa
      const isWin = this._checkWin(board, player);
      
      // Cofnij ruch
      board[row][col] = null;
      
      if (isWin) {
        return { row, col };
      }
    }
    
    return null;
  }

  /**
   * Wybiera najlepszy ruch według heurystyki
   * @private
   */
  _selectBestHeuristicMove(board, player) {
    const validMoves = this._getValidMoves(board);
    const size = board.length;
    
    let bestMove = validMoves[0];
    let bestScore = -Infinity;

    for (const [row, col] of validMoves) {
      let score = 0;

      // Punkty za pozycję
      // Rogi
      if ((row === 0 || row === size - 1) && (col === 0 || col === size - 1)) {
        score += 3;
      }
      // Krawędzie
      else if (row === 0 || row === size - 1 || col === 0 || col === size - 1) {
        score += 1;
      }
      // Środek (dla większych plansz)
      else if (Math.abs(row - size / 2) < 1 && Math.abs(col - size / 2) < 1) {
        score += 4;
      }

      // Punkty za bliskość do innych symboli
      score += this._evaluateNeighborhood(board, row, col, player);

      if (score > bestScore) {
        bestScore = score;
        bestMove = [row, col];
      }
    }

    return { row: bestMove[0], col: bestMove[1] };
  }

  /**
   * Ocenia sąsiedztwo pola
   * @private
   */
  _evaluateNeighborhood(board, row, col, player) {
    const size = board.length;
    let score = 0;
    const opponent = player === 'X' ? 'O' : 'X';

    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dr, dc] of directions) {
      const r = row + dr;
      const c = col + dc;
      
      if (r >= 0 && r < size && c >= 0 && c < size) {
        if (board[r][c] === player) {
          score += 2;
        } else if (board[r][c] === opponent) {
          score += 1;
        }
      }
    }

    return score;
  }

  /**
   * Sprawdza wygraną
   * @private
   */
  _checkWin(board, player, winCondition = 3) {
    const size = board.length;

    // Sprawdź wiersze
    for (let row = 0; row < size; row++) {
      let count = 0;
      for (let col = 0; col < size; col++) {
        count = board[row][col] === player ? count + 1 : 0;
        if (count >= winCondition) return true;
      }
    }

    // Sprawdź kolumny
    for (let col = 0; col < size; col++) {
      let count = 0;
      for (let row = 0; row < size; row++) {
        count = board[row][col] === player ? count + 1 : 0;
        if (count >= winCondition) return true;
      }
    }

    // Sprawdź przekątne
    for (let row = 0; row <= size - winCondition; row++) {
      for (let col = 0; col <= size - winCondition; col++) {
        // Przekątna \
        let count1 = 0;
        for (let i = 0; i < winCondition; i++) {
          if (board[row + i][col + i] === player) count1++;
        }
        if (count1 >= winCondition) return true;

        // Przekątna /
        if (col + winCondition - 1 < size) {
          let count2 = 0;
          for (let i = 0; i < winCondition; i++) {
            if (board[row + i][col + winCondition - 1 - i] === player) count2++;
          }
          if (count2 >= winCondition) return true;
        }
      }
    }

    return false;
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

module.exports = HeuristicAI;
