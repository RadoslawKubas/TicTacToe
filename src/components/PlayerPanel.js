/**
 * PlayerPanel.js
 * Player information and status component
 */

class PlayerPanel {
    constructor(gameState) {
        this.gameState = gameState;
        this.player1Panel = document.getElementById('player1-panel');
        this.player2Panel = document.getElementById('player2-panel');
        this.player1Name = this.player1Panel?.querySelector('.player-name');
        this.player2Name = this.player2Panel?.querySelector('.player-name');
    }

    /**
     * Initialize player panels
     */
    init() {
        this.attachEventListeners();
        this.update();
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Update player names
        if (this.player1Name) {
            this.player1Name.addEventListener('change', (e) => {
                this.gameState.players.x.name = e.target.value;
                this.gameState.save();
            });
        }

        if (this.player2Name) {
            this.player2Name.addEventListener('change', (e) => {
                this.gameState.players.o.name = e.target.value;
                this.gameState.save();
            });
        }
    }

    /**
     * Update player panels
     */
    update() {
        this.updateActivePlayer();
        this.updatePlayerNames();
    }

    /**
     * Update active player indicator
     */
    updateActivePlayer() {
        if (!this.player1Panel || !this.player2Panel) return;

        // Remove active class from both panels
        this.player1Panel.classList.remove('active');
        this.player2Panel.classList.remove('active');

        // Add active class to current player
        if (this.gameState.currentPlayer === 'X') {
            this.player1Panel.classList.add('active');
        } else {
            this.player2Panel.classList.add('active');
        }

        // Update turn indicators
        const p1Turn = document.getElementById('p1-turn');
        const p2Turn = document.getElementById('p2-turn');

        if (p1Turn && p2Turn) {
            if (this.gameState.currentPlayer === 'X') {
                p1Turn.textContent = 'Twoja tura!';
                p2Turn.textContent = 'Czekaj...';
            } else {
                p1Turn.textContent = 'Czekaj...';
                p2Turn.textContent = 'Twoja tura!';
            }
        }
    }

    /**
     * Update player names
     */
    updatePlayerNames() {
        if (this.player1Name && this.gameState.players.x) {
            this.player1Name.value = this.gameState.players.x.name;
        }

        if (this.player2Name && this.gameState.players.o) {
            this.player2Name.value = this.gameState.players.o.name;
        }
    }

    /**
     * Show winner
     * @param {string} winner - 'X' or 'O'
     */
    showWinner(winner) {
        const panel = winner === 'X' ? this.player1Panel : this.player2Panel;
        if (panel) {
            panel.classList.add('animate-pulse');
            setTimeout(() => {
                panel.classList.remove('animate-pulse');
            }, 2000);
        }
    }

    /**
     * Reset panels
     */
    reset() {
        if (this.player1Panel) {
            this.player1Panel.classList.remove('active', 'animate-pulse');
        }
        if (this.player2Panel) {
            this.player2Panel.classList.remove('active', 'animate-pulse');
        }
        this.update();
    }

    /**
     * Set player names
     * @param {string} player1Name - Player 1 name
     * @param {string} player2Name - Player 2 name
     */
    setPlayerNames(player1Name, player2Name) {
        this.gameState.players.x.name = player1Name;
        this.gameState.players.o.name = player2Name;
        this.updatePlayerNames();
        this.gameState.save();
    }

    /**
     * Set player 2 as AI
     * @param {boolean} isAI - Whether player 2 is AI
     */
    setPlayer2AI(isAI) {
        this.gameState.players.o.isAI = isAI;
        if (isAI) {
            this.gameState.players.o.name = 'Komputer';
        } else {
            this.gameState.players.o.name = 'Gracz 2';
        }
        this.updatePlayerNames();
        this.gameState.save();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlayerPanel;
}
