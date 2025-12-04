/**
 * BoardValidator - Walidator planszy i ruchów
 */
class BoardValidator {
  /**
   * Sprawdza poprawność ruchu
   * @param {Array} board - Aktualna plansza
   * @param {number} row - Wiersz
   * @param {number} col - Kolumna
   * @param {string} player - Symbol gracza
   * @returns {Object} { valid: boolean, error?: string }
   */
  static validateMove(board, row, col, player) {
    const size = board.length;

    // Sprawdź granice planszy
    if (row < 0 || row >= size || col < 0 || col >= size) {
      return { valid: false, error: 'Position out of bounds' };
    }

    // Sprawdź czy komórka jest wolna
    if (board[row][col] !== null) {
      return { valid: false, error: 'Cell already occupied' };
    }

    // Sprawdź poprawność symbolu gracza
    if (player !== 'X' && player !== 'O') {
      return { valid: false, error: 'Invalid player symbol' };
    }

    return { valid: true };
  }

  /**
   * Sprawdza czy stan planszy jest poprawny
   * @param {Array} board - Plansza do walidacji
   * @returns {Object} { valid: boolean, error?: string }
   */
  static validateBoardState(board) {
    if (!Array.isArray(board)) {
      return { valid: false, error: 'Board must be an array' };
    }

    const size = board.length;
    if (size < 3) {
      return { valid: false, error: 'Board size must be at least 3x3' };
    }

    // Sprawdź czy każdy wiersz ma odpowiednią długość
    for (let row of board) {
      if (!Array.isArray(row) || row.length !== size) {
        return { valid: false, error: 'Board must be square (NxN)' };
      }
    }

    // Zlicz X i O
    let countX = 0;
    let countO = 0;

    for (let row of board) {
      for (let cell of row) {
        if (cell === 'X') countX++;
        else if (cell === 'O') countO++;
        else if (cell !== null) {
          return { valid: false, error: 'Board contains invalid symbols' };
        }
      }
    }

    // X zawsze zaczyna, więc może być max o 1 więcej
    if (countX < countO || countX > countO + 1) {
      return { valid: false, error: 'Invalid number of moves for each player' };
    }

    return { valid: true };
  }

  /**
   * Waliduje konfigurację gry
   * @param {number} size - Rozmiar planszy
   * @param {number} winCondition - Warunek wygranej
   * @returns {Object} { valid: boolean, error?: string }
   */
  static validateGameConfig(size, winCondition) {
    if (!Number.isInteger(size) || size < 3 || size > 10) {
      return { valid: false, error: 'Board size must be between 3 and 10' };
    }

    if (!Number.isInteger(winCondition) || winCondition < 3 || winCondition > size) {
      return { valid: false, error: 'Win condition must be between 3 and board size' };
    }

    return { valid: true };
  }

  /**
   * Sprawdza czy gra może być kontynuowana
   * @param {string} status - Status gry
   * @returns {boolean}
   */
  static canContinueGame(status) {
    return status === 'playing';
  }
}

module.exports = BoardValidator;
