/**
 * WinChecker - Sprawdzanie warunków wygranej
 * Zoptymalizowany dla dużych plansz
 */
class WinChecker {
  /**
   * Sprawdza wszystkie możliwe linie wygranej
   * @param {Array} board - Plansza gry
   * @param {number} winCondition - Ile symboli w rzędzie do wygranej
   * @returns {Object} { winner: string|null, line: Array|null }
   */
  static checkWin(board, winCondition) {
    const size = board.length;

    // Sprawdź wiersze
    const rowResult = this.checkRows(board, winCondition);
    if (rowResult.winner) return rowResult;

    // Sprawdź kolumny
    const colResult = this.checkColumns(board, winCondition);
    if (colResult.winner) return colResult;

    // Sprawdź przekątne
    const diagResult = this.checkDiagonals(board, winCondition);
    if (diagResult.winner) return diagResult;

    return { winner: null, line: null };
  }

  /**
   * Sprawdza wiersze
   * @private
   */
  static checkRows(board, winCondition) {
    const size = board.length;

    for (let row = 0; row < size; row++) {
      for (let col = 0; col <= size - winCondition; col++) {
        const firstSymbol = board[row][col];
        if (firstSymbol === null) continue;

        let isWinning = true;
        const line = [[row, col]];

        for (let i = 1; i < winCondition; i++) {
          if (board[row][col + i] !== firstSymbol) {
            isWinning = false;
            break;
          }
          line.push([row, col + i]);
        }

        if (isWinning) {
          return { winner: firstSymbol, line };
        }
      }
    }

    return { winner: null, line: null };
  }

  /**
   * Sprawdza kolumny
   * @private
   */
  static checkColumns(board, winCondition) {
    const size = board.length;

    for (let col = 0; col < size; col++) {
      for (let row = 0; row <= size - winCondition; row++) {
        const firstSymbol = board[row][col];
        if (firstSymbol === null) continue;

        let isWinning = true;
        const line = [[row, col]];

        for (let i = 1; i < winCondition; i++) {
          if (board[row + i][col] !== firstSymbol) {
            isWinning = false;
            break;
          }
          line.push([row + i, col]);
        }

        if (isWinning) {
          return { winner: firstSymbol, line };
        }
      }
    }

    return { winner: null, line: null };
  }

  /**
   * Sprawdza przekątne
   * @private
   */
  static checkDiagonals(board, winCondition) {
    const size = board.length;

    // Przekątne \ (lewo-góra do prawo-dół)
    for (let row = 0; row <= size - winCondition; row++) {
      for (let col = 0; col <= size - winCondition; col++) {
        const firstSymbol = board[row][col];
        if (firstSymbol === null) continue;

        let isWinning = true;
        const line = [[row, col]];

        for (let i = 1; i < winCondition; i++) {
          if (board[row + i][col + i] !== firstSymbol) {
            isWinning = false;
            break;
          }
          line.push([row + i, col + i]);
        }

        if (isWinning) {
          return { winner: firstSymbol, line };
        }
      }
    }

    // Przekątne / (prawo-góra do lewo-dół)
    for (let row = 0; row <= size - winCondition; row++) {
      for (let col = winCondition - 1; col < size; col++) {
        const firstSymbol = board[row][col];
        if (firstSymbol === null) continue;

        let isWinning = true;
        const line = [[row, col]];

        for (let i = 1; i < winCondition; i++) {
          if (board[row + i][col - i] !== firstSymbol) {
            isWinning = false;
            break;
          }
          line.push([row + i, col - i]);
        }

        if (isWinning) {
          return { winner: firstSymbol, line };
        }
      }
    }

    return { winner: null, line: null };
  }

  /**
   * Szybkie sprawdzenie wygranej tylko wokół ostatniego ruchu
   * Optymalizacja dla dużych plansz
   * @param {Array} board - Plansza
   * @param {number} row - Wiersz ostatniego ruchu
   * @param {number} col - Kolumna ostatniego ruchu
   * @param {number} winCondition - Warunek wygranej
   * @returns {Object} { winner: string|null, line: Array|null }
   */
  static checkWinFromMove(board, row, col, winCondition) {
    const player = board[row][col];
    if (!player) return { winner: null, line: null };

    const size = board.length;

    // Sprawdź wiersz
    const rowLine = this._checkLineFromPoint(board, row, col, 0, 1, winCondition);
    if (rowLine) return { winner: player, line: rowLine };

    // Sprawdź kolumnę
    const colLine = this._checkLineFromPoint(board, row, col, 1, 0, winCondition);
    if (colLine) return { winner: player, line: colLine };

    // Sprawdź przekątną \
    const diag1Line = this._checkLineFromPoint(board, row, col, 1, 1, winCondition);
    if (diag1Line) return { winner: player, line: diag1Line };

    // Sprawdź przekątną /
    const diag2Line = this._checkLineFromPoint(board, row, col, 1, -1, winCondition);
    if (diag2Line) return { winner: player, line: diag2Line };

    return { winner: null, line: null };
  }

  /**
   * Sprawdza linię w określonym kierunku od punktu
   * @private
   */
  static _checkLineFromPoint(board, row, col, dRow, dCol, winCondition) {
    const player = board[row][col];
    const size = board.length;
    const line = [[row, col]];

    // Sprawdź w jednym kierunku
    let r = row + dRow;
    let c = col + dCol;
    while (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === player) {
      line.push([r, c]);
      r += dRow;
      c += dCol;
    }

    // Sprawdź w przeciwnym kierunku
    r = row - dRow;
    c = col - dCol;
    while (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === player) {
      line.unshift([r, c]);
      r -= dRow;
      c -= dCol;
    }

    return line.length >= winCondition ? line : null;
  }
}

module.exports = WinChecker;
