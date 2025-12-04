/**
 * ScoreBoard.js
 * Score display and statistics component
 */

class ScoreBoard {
    constructor(gameState) {
        this.gameState = gameState;
        this.container = document.getElementById('score-board');
        this.winsXElement = document.getElementById('wins-x');
        this.winsOElement = document.getElementById('wins-o');
        this.drawsElement = document.getElementById('draws');
    }

    /**
     * Initialize the score board
     */
    init() {
        this.update();
    }

    /**
     * Update the score display
     */
    update() {
        if (!this.winsXElement || !this.winsOElement || !this.drawsElement) return;

        this.animateScoreChange(this.winsXElement, this.gameState.score.x);
        this.animateScoreChange(this.winsOElement, this.gameState.score.o);
        this.animateScoreChange(this.drawsElement, this.gameState.score.draws);
    }

    /**
     * Animate score change
     * @param {HTMLElement} element - Score element
     * @param {number} newValue - New score value
     */
    animateScoreChange(element, newValue) {
        const currentValue = parseInt(element.textContent) || 0;
        
        if (currentValue !== newValue) {
            element.classList.add('animate-pulse');
            
            // Animate number counting up
            const duration = 500;
            const steps = 20;
            const increment = (newValue - currentValue) / steps;
            let current = currentValue;
            let step = 0;

            const timer = setInterval(() => {
                step++;
                current += increment;
                element.textContent = Math.round(current);

                if (step >= steps) {
                    clearInterval(timer);
                    element.textContent = newValue;
                    setTimeout(() => {
                        element.classList.remove('animate-pulse');
                    }, 300);
                }
            }, duration / steps);
        } else {
            element.textContent = newValue;
        }
    }

    /**
     * Reset scores
     */
    reset() {
        this.gameState.score = { x: 0, o: 0, draws: 0 };
        this.update();
    }

    /**
     * Highlight winner score
     * @param {string} winner - 'X' or 'O'
     */
    highlightWinner(winner) {
        const element = winner === 'X' ? this.winsXElement : this.winsOElement;
        if (element) {
            element.classList.add('animate-bounce');
            setTimeout(() => {
                element.classList.remove('animate-bounce');
            }, 1000);
        }
    }

    /**
     * Highlight draw
     */
    highlightDraw() {
        if (this.drawsElement) {
            this.drawsElement.classList.add('animate-bounce');
            setTimeout(() => {
                this.drawsElement.classList.remove('animate-bounce');
            }, 1000);
        }
    }

    /**
     * Get score summary
     * @returns {Object} Score summary
     */
    getScoreSummary() {
        return {
            x: this.gameState.score.x,
            o: this.gameState.score.o,
            draws: this.gameState.score.draws,
            total: this.gameState.score.x + this.gameState.score.o + this.gameState.score.draws
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScoreBoard;
}
