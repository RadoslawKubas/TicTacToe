/**
 * GameEngine - Główny silnik gry TicTacToe
 * Zarządza stanem planszy, walidacją ruchów, i sprawdzaniem warunków wygranej
 */
class GameEngine {
  /**
   * @param {number} size - Rozmiar planszy NxN (domyślnie 3)
   * @param {number} winCondition - Ile symboli w rzędzie potrzeba do wygranej (domyślnie 3)
   */
  constructor(size = 3, winCondition = 3) {
    this.size = size;
    this.winCondition = winCondition;
    this.board = this.initBoard();
    this.currentPlayer = 'X';
    this.moveHistory = [];
    this.gameStatus = 'playing'; // 'playing', 'won', 'draw'
    this.winner = null;
    this.winningLine = null;
  }

  /**
   * Inicjalizuje pustą planszę
   * @returns {Array<Array<string|null>>} Plansza NxN wypełniona null
   */
  initBoard() {
    return Array(this.size).fill(null).map(() => Array(this.size).fill(null));
  }

  /**
   * Wykonuje ruch na planszy
   * @param {number} row - Wiersz (0 do size-1)
   * @param {number} col - Kolumna (0 do size-1)
   * @param {string} player - Symbol gracza ('X' lub 'O')
   * @returns {Object} { success: boolean, error?: string, gameState?: Object }
   */
  makeMove(row, col, player) {
    // Walidacja parametrów
    if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
      return { success: false, error: 'Invalid position' };
    }

    if (this.board[row][col] !== null) {
      return { success: false, error: 'Cell already occupied' };
    }

    if (player !== this.currentPlayer) {
      return { success: false, error: 'Not your turn' };
    }

    if (this.gameStatus !== 'playing') {
      return { success: false, error: 'Game is already finished' };
    }

    // Wykonaj ruch
    this.board[row][col] = player;
    this.moveHistory.push({ player, row, col, timestamp: Date.now() });

    // Sprawdź wygraną
    const winResult = this.checkWin();
    if (winResult.winner) {
      this.gameStatus = 'won';
      this.winner = winResult.winner;
      this.winningLine = winResult.line;
      return { success: true, gameState: this.getGameState() };
    }

    // Sprawdź remis
    if (this.checkDraw()) {
      this.gameStatus = 'draw';
      return { success: true, gameState: this.getGameState() };
    }

    // Zmień gracza
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';

    return { success: true, gameState: this.getGameState() };
  }

  /**
   * Sprawdza czy jest zwycięzca
   * @returns {Object} { winner: 'X'|'O'|null, line: Array<[row,col]> | null }
   */
  checkWin() {
    const lines = this._getAllLines();
    
    for (const line of lines) {
      const result = this._checkLine(line);
      if (result.winner) {
        return result;
      }
    }

    return { winner: null, line: null };
  }

  /**
   * Sprawdza pojedynczą linię
   * @private
   */
  _checkLine(line) {
    if (line.length < this.winCondition) {
      return { winner: null, line: null };
    }

    for (let i = 0; i <= line.length - this.winCondition; i++) {
      const segment = line.slice(i, i + this.winCondition);
      const firstCell = this.board[segment[0][0]][segment[0][1]];
      
      if (firstCell === null) continue;

      const allSame = segment.every(([r, c]) => this.board[r][c] === firstCell);
      
      if (allSame) {
        return { winner: firstCell, line: segment };
      }
    }

    return { winner: null, line: null };
  }

  /**
   * Pobiera wszystkie możliwe linie do sprawdzenia
   * @private
   */
  _getAllLines() {
    const lines = [];

    // Wiersze
    for (let row = 0; row < this.size; row++) {
      const line = [];
      for (let col = 0; col < this.size; col++) {
        line.push([row, col]);
      }
      lines.push(line);
    }

    // Kolumny
    for (let col = 0; col < this.size; col++) {
      const line = [];
      for (let row = 0; row < this.size; row++) {
        line.push([row, col]);
      }
      lines.push(line);
    }

    // Przekątne (od lewego górnego do prawego dolnego)
    for (let startRow = 0; startRow <= this.size - this.winCondition; startRow++) {
      for (let startCol = 0; startCol <= this.size - this.winCondition; startCol++) {
        const line = [];
        for (let i = 0; i < this.size - Math.max(startRow, startCol); i++) {
          line.push([startRow + i, startCol + i]);
        }
        if (line.length >= this.winCondition) {
          lines.push(line);
        }
      }
    }

    // Przekątne (od prawego górnego do lewego dolnego)
    for (let startRow = 0; startRow <= this.size - this.winCondition; startRow++) {
      for (let startCol = this.winCondition - 1; startCol < this.size; startCol++) {
        const line = [];
        for (let i = 0; i < Math.min(this.size - startRow, startCol + 1); i++) {
          line.push([startRow + i, startCol - i]);
        }
        if (line.length >= this.winCondition) {
          lines.push(line);
        }
      }
    }

    return lines;
  }

  /**
   * Sprawdza czy jest remis
   * @returns {boolean}
   */
  checkDraw() {
    // Remis gdy plansza pełna i brak wygranego
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === null) {
          return false;
        }
      }
    }
    return this.winner === null;
  }

  /**
   * Zwraca listę dostępnych ruchów
   * @returns {Array<[number, number]>} Lista dostępnych pozycji
   */
  getValidMoves() {
    const moves = [];
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === null) {
          moves.push([row, col]);
        }
      }
    }
    return moves;
  }

  /**
   * Cofa ostatni ruch
   * @returns {Object|null} Cofnięty ruch lub null
   */
  undoMove() {
    if (this.moveHistory.length === 0) {
      return null;
    }

    const lastMove = this.moveHistory.pop();
    this.board[lastMove.row][lastMove.col] = null;
    
    // Resetuj stan gry
    this.gameStatus = 'playing';
    this.winner = null;
    this.winningLine = null;
    
    // Zmień gracza z powrotem
    this.currentPlayer = lastMove.player;

    return lastMove;
  }

  /**
   * Zwraca pełny stan gry
   * @returns {Object} Stan gry
   */
  getGameState() {
    return {
      board: this.board.map(row => [...row]), // Deep copy
      currentPlayer: this.currentPlayer,
      status: this.gameStatus,
      winner: this.winner,
      winningLine: this.winningLine,
      moves: [...this.moveHistory],
      settings: {
        boardSize: this.size,
        winCondition: this.winCondition
      }
    };
  }

  /**
   * Resetuje grę do stanu początkowego
   */
  reset() {
    this.board = this.initBoard();
    this.currentPlayer = 'X';
    this.moveHistory = [];
    this.gameStatus = 'playing';
    this.winner = null;
    this.winningLine = null;
  }
}

module.exports = GameEngine;
