/**
 * GameState.js
 * Manages the current state of the game
 */

class GameState {
    constructor() {
        this.gameId = null;
        this.board = this.createEmptyBoard(3);
        this.boardSize = 3;
        this.currentPlayer = 'X';
        this.status = 'waiting'; // waiting, playing, won, draw
        this.winner = null;
        this.winningLine = null;
        this.moves = [];
        this.settings = {
            mode: 'local', // local, ai, online, tournament, training
            difficulty: 'medium', // easy, medium, hard, expert, impossible
            boardSize: 3,
            soundEnabled: true,
            volume: 70,
            animationsEnabled: true,
            theme: 'light',
            language: 'pl'
        };
        this.score = {
            x: 0,
            o: 0,
            draws: 0
        };
        this.players = {
            x: { name: 'Gracz 1', symbol: 'X', isAI: false },
            o: { name: 'Gracz 2', symbol: 'O', isAI: false }
        };
    }

    /**
     * Create an empty board
     * @param {number} size - Board size (3, 4, or 5)
     * @returns {Array} Empty board
     */
    createEmptyBoard(size) {
        return Array(size).fill(null).map(() => Array(size).fill(''));
    }

    /**
     * Reset the game state
     */
    reset() {
        this.board = this.createEmptyBoard(this.boardSize);
        this.currentPlayer = 'X';
        this.status = 'waiting';
        this.winner = null;
        this.winningLine = null;
        this.moves = [];
    }

    /**
     * Make a move
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @returns {boolean} True if move was successful
     */
    makeMove(row, col) {
        if (this.board[row][col] !== '' || this.status !== 'playing') {
            return false;
        }

        this.board[row][col] = this.currentPlayer;
        this.moves.push({
            player: this.currentPlayer,
            row: row,
            col: col,
            timestamp: Date.now()
        });

        // Check for win or draw
        if (this.checkWin()) {
            this.status = 'won';
            this.winner = this.currentPlayer;
            this.score[this.currentPlayer.toLowerCase()]++;
        } else if (this.checkDraw()) {
            this.status = 'draw';
            this.score.draws++;
        } else {
            // Switch player
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        }

        return true;
    }

    /**
     * Undo the last move
     * @returns {boolean} True if undo was successful
     */
    undoMove() {
        if (this.moves.length === 0) {
            return false;
        }

        const lastMove = this.moves.pop();
        this.board[lastMove.row][lastMove.col] = '';
        this.currentPlayer = lastMove.player;
        this.status = 'playing';
        this.winner = null;
        this.winningLine = null;

        return true;
    }

    /**
     * Check if current player has won
     * @returns {boolean} True if current player won
     */
    checkWin() {
        const size = this.boardSize;
        const player = this.currentPlayer;

        // Check rows
        for (let row = 0; row < size; row++) {
            if (this.board[row].every(cell => cell === player)) {
                this.winningLine = Array(size).fill(null).map((_, col) => [row, col]);
                return true;
            }
        }

        // Check columns
        for (let col = 0; col < size; col++) {
            if (this.board.every(row => row[col] === player)) {
                this.winningLine = Array(size).fill(null).map((_, row) => [row, col]);
                return true;
            }
        }

        // Check diagonal (top-left to bottom-right)
        if (this.board.every((row, i) => row[i] === player)) {
            this.winningLine = Array(size).fill(null).map((_, i) => [i, i]);
            return true;
        }

        // Check diagonal (top-right to bottom-left)
        if (this.board.every((row, i) => row[size - 1 - i] === player)) {
            this.winningLine = Array(size).fill(null).map((_, i) => [i, size - 1 - i]);
            return true;
        }

        return false;
    }

    /**
     * Check if game is a draw
     * @returns {boolean} True if game is a draw
     */
    checkDraw() {
        return this.board.every(row => row.every(cell => cell !== ''));
    }

    /**
     * Get valid moves
     * @returns {Array} Array of [row, col] valid moves
     */
    getValidMoves() {
        const moves = [];
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === '') {
                    moves.push([row, col]);
                }
            }
        }
        return moves;
    }

    /**
     * Get a hint for the current player
     * @returns {Array|null} [row, col] or null
     */
    getHint() {
        const validMoves = this.getValidMoves();
        if (validMoves.length === 0) {
            return null;
        }

        // Simple hint: return a random valid move
        // In a more advanced version, this could use minimax
        return validMoves[Math.floor(Math.random() * validMoves.length)];
    }

    /**
     * Export game state
     * @returns {Object} Game state
     */
    export() {
        return {
            gameId: this.gameId,
            board: this.board,
            currentPlayer: this.currentPlayer,
            status: this.status,
            winner: this.winner,
            winningLine: this.winningLine,
            moves: this.moves,
            settings: this.settings,
            score: this.score,
            players: this.players
        };
    }

    /**
     * Import game state
     * @param {Object} state - Game state
     */
    import(state) {
        this.gameId = state.gameId;
        this.board = state.board;
        this.boardSize = state.board.length;
        this.currentPlayer = state.currentPlayer;
        this.status = state.status;
        this.winner = state.winner;
        this.winningLine = state.winningLine;
        this.moves = state.moves;
        this.settings = state.settings;
        this.score = state.score;
        this.players = state.players;
    }

    /**
     * Save game state to localStorage
     */
    save() {
        try {
            localStorage.setItem('tictactoe_game_state', JSON.stringify(this.export()));
        } catch (e) {
            console.error('Failed to save game state:', e);
        }
    }

    /**
     * Load game state from localStorage
     * @returns {boolean} True if loaded successfully
     */
    load() {
        try {
            const saved = localStorage.getItem('tictactoe_game_state');
            if (saved) {
                this.import(JSON.parse(saved));
                return true;
            }
        } catch (e) {
            console.error('Failed to load game state:', e);
        }
        return false;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameState;
}
