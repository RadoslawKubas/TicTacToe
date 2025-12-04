/**
 * ApiService.js
 * API communication service
 */

class ApiService {
    constructor() {
        this.baseURL = window.location.origin + '/api';
        this.timeout = 10000;
    }

    /**
     * Make API request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Fetch options
     * @returns {Promise} Response data
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    /**
     * Create new game
     * @param {Object} settings - Game settings
     * @returns {Promise} Game data
     */
    async createGame(settings) {
        return this.request('/game/new', {
            method: 'POST',
            body: JSON.stringify(settings)
        });
    }

    /**
     * Make a move
     * @param {string} gameId - Game ID
     * @param {Object} move - Move data (row, col, player)
     * @returns {Promise} Updated game state
     */
    async makeMove(gameId, move) {
        return this.request(`/game/${gameId}/move`, {
            method: 'POST',
            body: JSON.stringify(move)
        });
    }

    /**
     * Get game state
     * @param {string} gameId - Game ID
     * @returns {Promise} Game state
     */
    async getGameState(gameId) {
        return this.request(`/game/${gameId}`, {
            method: 'GET'
        });
    }

    /**
     * Get AI move
     * @param {Object} gameState - Current game state
     * @param {string} difficulty - AI difficulty
     * @returns {Promise} AI move
     */
    async getAIMove(gameState, difficulty) {
        return this.request('/ai/move', {
            method: 'POST',
            body: JSON.stringify({
                board: gameState.board,
                currentPlayer: gameState.currentPlayer,
                difficulty,
                boardSize: gameState.settings?.boardSize || 3,
                winCondition: gameState.settings?.winCondition || 3
            })
        });
    }

    /**
     * Analyze position
     * @param {Object} gameState - Current game state
     * @returns {Promise} Analysis result
     */
    async analyzePosition(gameState) {
        return this.request('/ai/analyze', {
            method: 'POST',
            body: JSON.stringify({
                board: gameState.board,
                currentPlayer: gameState.currentPlayer,
                boardSize: gameState.settings?.boardSize || 3,
                winCondition: gameState.settings?.winCondition || 3
            })
        });
    }

    /**
     * Get hint for current position
     * @param {Object} gameState - Current game state
     * @returns {Promise} Hint move
     */
    async getHint(gameState) {
        return this.request('/ai/hint', {
            method: 'POST',
            body: JSON.stringify({
                board: gameState.board,
                currentPlayer: gameState.currentPlayer,
                boardSize: gameState.settings?.boardSize || 3,
                winCondition: gameState.settings?.winCondition || 3
            })
        });
    }

    /**
     * Undo last move
     * @param {string} gameId - Game ID
     * @returns {Promise} Updated game state
     */
    async undoMove(gameId) {
        return this.request(`/game/${gameId}/undo`, {
            method: 'POST'
        });
    }

    /**
     * Submit score to leaderboard
     * @param {Object} scoreData - Score data
     * @returns {Promise} Submission result
     */
    async submitScore(scoreData) {
        return this.request('/leaderboard/submit', {
            method: 'POST',
            body: JSON.stringify(scoreData)
        });
    }

    /**
     * Get leaderboard
     * @param {number} limit - Number of entries
     * @returns {Promise} Leaderboard data
     */
    async getLeaderboard(limit = 10) {
        return this.request(`/leaderboard?limit=${limit}`, {
            method: 'GET'
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiService;
}
