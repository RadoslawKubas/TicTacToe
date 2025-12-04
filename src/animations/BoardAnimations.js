/**
 * BoardAnimations.js
 * Animations for the game board
 */

class BoardAnimations {
    constructor(animationEngine) {
        this.animationEngine = animationEngine;
    }

    /**
     * Animate board entrance
     * @param {HTMLElement} board - Board element
     */
    entrance(board) {
        const cells = board.querySelectorAll('.game-cell');
        cells.forEach((cell, index) => {
            cell.style.opacity = '0';
            cell.style.transform = 'scale(0)';
            
            setTimeout(() => {
                if (this.animationEngine) {
                    this.animationEngine.add({
                        duration: 300,
                        easing: 'elasticOut',
                        onUpdate: (progress) => {
                            cell.style.opacity = progress;
                            cell.style.transform = `scale(${progress})`;
                        },
                        onComplete: () => {
                            cell.style.opacity = '';
                            cell.style.transform = '';
                        }
                    });
                } else {
                    cell.style.opacity = '1';
                    cell.style.transform = 'scale(1)';
                }
            }, index * 30);
        });
    }

    /**
     * Highlight winning line
     * @param {Array} winningLine - Array of [row, col] coordinates
     * @param {HTMLElement} board - Board element
     */
    highlightWinningLine(winningLine, board) {
        if (!winningLine) return;

        winningLine.forEach(([row, col], index) => {
            const cell = board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cell) {
                setTimeout(() => {
                    cell.classList.add('winning', 'animate-pulse');
                }, index * 100);
            }
        });
    }

    /**
     * Shake board for error
     * @param {HTMLElement} board - Board element
     */
    shake(board) {
        board.classList.add('animate-shake');
        setTimeout(() => {
            board.classList.remove('animate-shake');
        }, 500);
    }

    /**
     * Reset board animation
     * @param {HTMLElement} board - Board element
     */
    reset(board) {
        const cells = board.querySelectorAll('.game-cell');
        cells.forEach((cell, index) => {
            setTimeout(() => {
                cell.classList.add('animate-scaleOut');
                setTimeout(() => {
                    cell.textContent = '';
                    cell.className = 'game-cell';
                    cell.classList.add('animate-scaleIn');
                }, 150);
            }, index * 20);
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BoardAnimations;
}
