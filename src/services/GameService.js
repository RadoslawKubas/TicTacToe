/**
 * GameService.js
 * Game logic and coordination service
 */

class GameService {
    constructor(gameState, apiService) {
        this.gameState = gameState;
        this.apiService = apiService;
    }

    /**
     * Start a new game
     * @param {Object} settings - Game settings
     */
    async startNewGame(settings = {}) {
        this.gameState.reset();
        this.gameState.settings = { ...this.gameState.settings, ...settings };
        this.gameState.status = 'playing';
        this.gameState.save();

        // For online mode, create game on server
        if (settings.mode === 'online') {
            try {
                const gameData = await this.apiService.createGame(settings);
                this.gameState.gameId = gameData.gameId;
            } catch (error) {
                console.error('Failed to create online game:', error);
            }
        }
    }

    /**
     * Make a move
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @returns {boolean} Success
     */
    makeMove(row, col) {
        return this.gameState.makeMove(row, col);
    }

    /**
     * Get AI move from backend or fallback to local
     * @returns {Promise<Array>} [row, col] or null
     */
    async getAIMove() {
        const difficulty = this.gameState.settings.difficulty;
        
        // Try to get AI move from backend
        try {
            const gameStateData = {
                board: this.gameState.board,
                currentPlayer: this.gameState.currentPlayer,
                settings: {
                    boardSize: this.gameState.boardSize,
                    winCondition: this.gameState.settings.winCondition || this.gameState.boardSize
                }
            };
            
            const response = await this.apiService.getAIMove(gameStateData, difficulty);
            
            if (response && typeof response.row === 'number' && typeof response.col === 'number') {
                return [response.row, response.col];
            }
        } catch (error) {
            console.warn('Backend AI unavailable, using local AI:', error.message);
        }
        
        // Fallback to local AI
        return this.getLocalAIMove(difficulty);
    }

    /**
     * Get AI move locally (fallback)
     * @param {string} difficulty - AI difficulty
     * @returns {Array|null} [row, col] or null
     */
    getLocalAIMove(difficulty) {
        const validMoves = this.gameState.getValidMoves();
        if (validMoves.length === 0) return null;

        switch (difficulty) {
            case 'easy':
                // Random move
                return validMoves[Math.floor(Math.random() * validMoves.length)];
            
            case 'medium':
            case 'hard':
            case 'expert':
            case 'impossible':
                // Simple strategy: block opponent or take center/corner
                return this.getStrategicMove(validMoves);
            
            default:
                return validMoves[Math.floor(Math.random() * validMoves.length)];
        }
    }

    /**
     * Get strategic move
     * @param {Array} validMoves - Valid moves
     * @returns {Array} [row, col]
     */
    getStrategicMove(validMoves) {
        // Try to win
        const winMove = this.findWinningMove(this.gameState.currentPlayer);
        if (winMove) return winMove;

        // Block opponent
        const opponent = this.gameState.currentPlayer === 'X' ? 'O' : 'X';
        const blockMove = this.findWinningMove(opponent);
        if (blockMove) return blockMove;

        // Take center if available
        const center = Math.floor(this.gameState.boardSize / 2);
        if (validMoves.some(([r, c]) => r === center && c === center)) {
            return [center, center];
        }

        // Take corner
        const corners = [
            [0, 0],
            [0, this.gameState.boardSize - 1],
            [this.gameState.boardSize - 1, 0],
            [this.gameState.boardSize - 1, this.gameState.boardSize - 1]
        ];
        const availableCorner = corners.find(([r, c]) => 
            validMoves.some(([vr, vc]) => vr === r && vc === c)
        );
        if (availableCorner) return availableCorner;

        // Random valid move
        return validMoves[Math.floor(Math.random() * validMoves.length)];
    }

    /**
     * Find winning move for a player
     * @param {string} player - Player symbol
     * @returns {Array|null} [row, col] or null
     */
    findWinningMove(player) {
        const validMoves = this.gameState.getValidMoves();
        
        for (const [row, col] of validMoves) {
            // Temporarily make the move
            this.gameState.board[row][col] = player;
            const savedPlayer = this.gameState.currentPlayer;
            this.gameState.currentPlayer = player;
            
            // Check if it's a winning move
            const isWin = this.gameState.checkWin();
            
            // Undo the move
            this.gameState.board[row][col] = '';
            this.gameState.currentPlayer = savedPlayer;
            this.gameState.winningLine = null;
            
            if (isWin) {
                return [row, col];
            }
        }
        
        return null;
    }

    /**
     * Undo last move
     * @returns {boolean} Success
     */
    undoMove() {
        return this.gameState.undoMove();
    }

    /**
     * Get hint from backend or local
     * @returns {Promise<Array|null>} [row, col] or null
     */
    async getHint() {
        // Try to get hint from backend
        try {
            const gameStateData = {
                board: this.gameState.board,
                currentPlayer: this.gameState.currentPlayer,
                settings: {
                    boardSize: this.gameState.boardSize,
                    winCondition: this.gameState.settings.winCondition || this.gameState.boardSize
                }
            };
            
            const response = await this.apiService.getHint(gameStateData);
            
            if (response && typeof response.row === 'number' && typeof response.col === 'number') {
                return [response.row, response.col];
            }
        } catch (error) {
            console.warn('Backend hint unavailable, using local hint:', error.message);
        }
        
        // Fallback to local hint
        return this.gameState.getHint();
    }

    /**
     * Analyze current position
     * @returns {Promise<Object>} Analysis result
     */
    async analyzePosition() {
        try {
            const gameStateData = {
                board: this.gameState.board,
                currentPlayer: this.gameState.currentPlayer,
                settings: {
                    boardSize: this.gameState.boardSize,
                    winCondition: this.gameState.settings.winCondition || this.gameState.boardSize
                }
            };
            
            return await this.apiService.analyzePosition(gameStateData);
        } catch (error) {
            console.warn('Position analysis unavailable:', error.message);
            return null;
        }
    }

    /**
     * Submit score to leaderboard
     * @param {string} result - 'win', 'loss', or 'draw'
     * @returns {Promise} Submission result
     */
    async submitScore(result) {
        try {
            const scoreData = {
                playerName: this.gameState.players?.X || 'Player',
                opponent: this.gameState.settings.mode === 'pve' 
                    ? `AI-${this.gameState.settings.difficulty}` 
                    : (this.gameState.players?.O || 'Player 2'),
                result,
                moves: this.gameState.moves.length,
                duration: Date.now() - (this.gameState.startTime || Date.now())
            };
            
            return await this.apiService.submitScore(scoreData);
        } catch (error) {
            console.warn('Failed to submit score:', error.message);
            return null;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameService;
}
