/**
 * Evaluator - Funkcje oceny stanu gry
 * Używane przez algorytmy AI do oceny pozycji
 */
class Evaluator {
  /**
   * Ocenia stan planszy dla danego gracza
   * @param {Array} board - Plansza
   * @param {string} player - Gracz do oceny
   * @returns {number} Ocena pozycji (-100 do 100)
   */
  evaluate(board, player) {
    const opponent = player === 'X' ? 'O' : 'X';
    
    let score = 0;
    
    // Ocena linii (wiersze, kolumny, przekątne)
    score += this._evaluateLines(board, player);
    score -= this._evaluateLines(board, opponent);
    
    // Ocena pozycji symboli
    score += this._evaluatePositions(board, player) * 0.5;
    score -= this._evaluatePositions(board, opponent) * 0.5;
    
    // Ocena mobilności (ile możliwych ruchów)
    score += this._evaluateMobility(board, player) * 0.2;
    
    return score;
  }

  /**
   * Zwraca szczegółową ocenę
   * @param {Array} board - Plansza
   * @param {string} player - Gracz
   * @returns {Object} Szczegółowa analiza
   */
  getDetailedEvaluation(board, player) {
    const opponent = player === 'X' ? 'O' : 'X';
    
    return {
      lineScore: this._evaluateLines(board, player),
      opponentLineScore: this._evaluateLines(board, opponent),
      positionScore: this._evaluatePositions(board, player),
      mobilityScore: this._evaluateMobility(board, player),
      threats: this._detectThreats(board, player),
      opportunities: this._detectThreats(board, opponent)
    };
  }

  /**
   * Ocenia linie (wiersze, kolumny, przekątne)
   * @private
   */
  _evaluateLines(board, player, winCondition = 3) {
    const size = board.length;
    let score = 0;

    // Wszystkie możliwe linie
    const lines = this._getAllLines(board);

    for (const line of lines) {
      const lineScore = this._evaluateLine(line, player, winCondition);
      score += lineScore;
    }

    return score;
  }

  /**
   * Ocenia pojedynczą linię
   * @private
   */
  _evaluateLine(line, player, winCondition) {
    let playerCount = 0;
    let opponentCount = 0;
    let emptyCount = 0;
    const opponent = player === 'X' ? 'O' : 'X';

    for (const cell of line) {
      if (cell === player) playerCount++;
      else if (cell === opponent) opponentCount++;
      else emptyCount++;
    }

    // Jeśli linia ma symbole obu graczy, nie ma wartości
    if (playerCount > 0 && opponentCount > 0) {
      return 0;
    }

    // Ocena w zależności od liczby symboli gracza
    if (playerCount === winCondition) {
      return 100; // Wygrana
    } else if (playerCount === winCondition - 1 && emptyCount > 0) {
      return 10; // Zagrożenie/szansa
    } else if (playerCount === winCondition - 2 && emptyCount > 1) {
      return 3; // Potencjał
    } else if (playerCount > 0) {
      return 1; // Obecność
    }

    return 0;
  }

  /**
   * Pobiera wszystkie linie z planszy
   * @private
   */
  _getAllLines(board) {
    const size = board.length;
    const lines = [];

    // Wiersze
    for (let row = 0; row < size; row++) {
      lines.push(board[row]);
    }

    // Kolumny
    for (let col = 0; col < size; col++) {
      const column = [];
      for (let row = 0; row < size; row++) {
        column.push(board[row][col]);
      }
      lines.push(column);
    }

    // Przekątne główne (\)
    for (let startRow = 0; startRow < size; startRow++) {
      for (let startCol = 0; startCol < size; startCol++) {
        const diag = [];
        let r = startRow, c = startCol;
        while (r < size && c < size) {
          diag.push(board[r][c]);
          r++;
          c++;
        }
        if (diag.length >= 3) {
          lines.push(diag);
        }
      }
    }

    // Przekątne poboczne (/)
    for (let startRow = 0; startRow < size; startRow++) {
      for (let startCol = size - 1; startCol >= 0; startCol--) {
        const diag = [];
        let r = startRow, c = startCol;
        while (r < size && c >= 0) {
          diag.push(board[r][c]);
          r++;
          c--;
        }
        if (diag.length >= 3) {
          lines.push(diag);
        }
      }
    }

    return lines;
  }

  /**
   * Ocenia pozycje symboli na planszy
   * @private
   */
  _evaluatePositions(board, player) {
    const size = board.length;
    let score = 0;

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (board[row][col] === player) {
          // Centrum ma najwyższą wartość
          const centerDist = Math.abs(row - size / 2) + Math.abs(col - size / 2);
          score += size - centerDist;

          // Rogi też są wartościowe
          if ((row === 0 || row === size - 1) && (col === 0 || col === size - 1)) {
            score += 2;
          }
        }
      }
    }

    return score;
  }

  /**
   * Ocenia mobilność (liczbę dostępnych ruchów i ich jakość)
   * @private
   */
  _evaluateMobility(board, player) {
    const validMoves = this._getValidMoves(board);
    return validMoves.length;
  }

  /**
   * Wykrywa zagrożenia dla gracza
   * @private
   */
  _detectThreats(board, player) {
    const opponent = player === 'X' ? 'O' : 'X';
    const threats = [];
    const lines = this._getAllLines(board);

    for (const line of lines) {
      let opponentCount = 0;
      let emptyCount = 0;

      for (const cell of line) {
        if (cell === opponent) opponentCount++;
        else if (cell === null) emptyCount++;
      }

      // Zagrożenie: przeciwnik ma 2 w linii i jest puste pole
      if (opponentCount === 2 && emptyCount === 1) {
        threats.push({
          type: 'immediate',
          line: line
        });
      }
    }

    return threats;
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

module.exports = Evaluator;
