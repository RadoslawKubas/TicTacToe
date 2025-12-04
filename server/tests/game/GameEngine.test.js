/**
 * Testy GameEngine
 */
const GameEngine = require('../../game/GameEngine');

describe('GameEngine', () => {
  let game;

  beforeEach(() => {
    game = new GameEngine(3, 3);
  });

  describe('Inicjalizacja', () => {
    test('powinien utworzyć pustą planszę 3x3', () => {
      const state = game.getGameState();
      expect(state.board.length).toBe(3);
      expect(state.board[0].length).toBe(3);
      expect(state.board.every(row => row.every(cell => cell === null))).toBe(true);
    });

    test('powinien ustawić gracza X jako pierwszego', () => {
      const state = game.getGameState();
      expect(state.currentPlayer).toBe('X');
    });

    test('powinien ustawić status gry na "playing"', () => {
      const state = game.getGameState();
      expect(state.status).toBe('playing');
    });
  });

  describe('Wykonywanie ruchów', () => {
    test('powinien poprawnie wykonać ruch', () => {
      const result = game.makeMove(0, 0, 'X');
      expect(result.success).toBe(true);
      expect(game.board[0][0]).toBe('X');
    });

    test('powinien zmienić gracza po ruchu', () => {
      game.makeMove(0, 0, 'X');
      expect(game.currentPlayer).toBe('O');
    });

    test('powinien odrzucić ruch na zajętym polu', () => {
      game.makeMove(0, 0, 'X');
      const result = game.makeMove(0, 0, 'O');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Cell already occupied');
    });

    test('powinien odrzucić ruch poza planszą', () => {
      const result = game.makeMove(5, 5, 'X');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid position');
    });

    test('powinien odrzucić ruch nieaktualnego gracza', () => {
      const result = game.makeMove(0, 0, 'O');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Not your turn');
    });
  });

  describe('Wykrywanie wygranej', () => {
    test('powinien wykryć wygraną w wierszu', () => {
      game.makeMove(0, 0, 'X');
      game.makeMove(1, 0, 'O');
      game.makeMove(0, 1, 'X');
      game.makeMove(1, 1, 'O');
      const result = game.makeMove(0, 2, 'X');
      
      expect(result.gameState.status).toBe('won');
      expect(result.gameState.winner).toBe('X');
    });

    test('powinien wykryć wygraną w kolumnie', () => {
      game.makeMove(0, 0, 'X');
      game.makeMove(0, 1, 'O');
      game.makeMove(1, 0, 'X');
      game.makeMove(1, 1, 'O');
      const result = game.makeMove(2, 0, 'X');
      
      expect(result.gameState.status).toBe('won');
      expect(result.gameState.winner).toBe('X');
    });

    test('powinien wykryć wygraną na przekątnej', () => {
      game.makeMove(0, 0, 'X');
      game.makeMove(0, 1, 'O');
      game.makeMove(1, 1, 'X');
      game.makeMove(0, 2, 'O');
      const result = game.makeMove(2, 2, 'X');
      
      expect(result.gameState.status).toBe('won');
      expect(result.gameState.winner).toBe('X');
    });
  });

  describe('Wykrywanie remisu', () => {
    test('powinien wykryć remis gdy plansza pełna', () => {
      // X X O
      // O O X
      // X O X
      game.makeMove(0, 0, 'X'); // X
      game.makeMove(0, 2, 'O'); // O
      game.makeMove(0, 1, 'X'); // X
      game.makeMove(1, 0, 'O'); // O
      game.makeMove(1, 2, 'X'); // X
      game.makeMove(1, 1, 'O'); // O
      game.makeMove(2, 0, 'X'); // X
      game.makeMove(2, 2, 'O'); // O
      const result = game.makeMove(2, 1, 'X'); // X
      
      expect(result.gameState.status).toBe('draw');
      expect(result.gameState.winner).toBe(null);
    });
  });

  describe('Cofanie ruchów', () => {
    test('powinien cofnąć ostatni ruch', () => {
      game.makeMove(0, 0, 'X');
      const undone = game.undoMove();
      
      expect(undone.row).toBe(0);
      expect(undone.col).toBe(0);
      expect(game.board[0][0]).toBe(null);
      expect(game.currentPlayer).toBe('X');
    });

    test('powinien zwrócić null gdy brak ruchów do cofnięcia', () => {
      const undone = game.undoMove();
      expect(undone).toBe(null);
    });
  });

  describe('Dostępne ruchy', () => {
    test('powinien zwrócić wszystkie puste pola', () => {
      const moves = game.getValidMoves();
      expect(moves.length).toBe(9);
    });

    test('powinien zwrócić mniej ruchów po wykonaniu ruchu', () => {
      game.makeMove(0, 0, 'X');
      const moves = game.getValidMoves();
      expect(moves.length).toBe(8);
    });
  });

  describe('Reset gry', () => {
    test('powinien zresetować grę do stanu początkowego', () => {
      game.makeMove(0, 0, 'X');
      game.makeMove(0, 1, 'O');
      game.reset();
      
      const state = game.getGameState();
      expect(state.board.every(row => row.every(cell => cell === null))).toBe(true);
      expect(state.currentPlayer).toBe('X');
      expect(state.status).toBe('playing');
      expect(state.moves.length).toBe(0);
    });
  });
});
