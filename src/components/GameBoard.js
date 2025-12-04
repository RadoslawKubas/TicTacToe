/**
 * GameBoard.js
 * Main game board component
 */

class GameBoard {
    constructor(gameState, audioManager, animationEngine) {
        this.gameState = gameState;
        this.audioManager = audioManager;
        this.animationEngine = animationEngine;
        this.container = document.getElementById('game-board');
        this.cells = [];
        this.onCellClick = null;
    }

    /**
     * Initialize the game board
     */
    init() {
        this.render();
        this.attachEventListeners();
    }

    /**
     * Render the game board
     */
    render() {
        if (!this.container) return;

        const size = this.gameState.boardSize;
        this.container.innerHTML = '';
        this.container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        this.cells = [];

        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const cell = this.createCell(row, col);
                this.cells.push(cell);
                this.container.appendChild(cell);
            }
        }
    }

    /**
     * Create a single cell
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @returns {HTMLElement} Cell element
     */
    createCell(row, col) {
        const cell = document.createElement('div');
        cell.className = 'game-cell';
        cell.dataset.row = row;
        cell.dataset.col = col;
        
        const value = this.gameState.board[row][col];
        if (value) {
            cell.textContent = value;
            cell.classList.add('filled', value.toLowerCase());
        }

        return cell;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('game-cell')) {
                this.handleCellClick(e.target);
            }
        });

        // Keyboard support (1-9 for 3x3 board)
        document.addEventListener('keydown', (e) => {
            if (this.gameState.status !== 'playing') return;

            const key = parseInt(e.key);
            if (key >= 1 && key <= 9) {
                const size = this.gameState.boardSize;
                if (size === 3) {
                    const index = key - 1;
                    const row = Math.floor(index / 3);
                    const col = index % 3;
                    const cell = this.getCellElement(row, col);
                    if (cell) {
                        this.handleCellClick(cell);
                    }
                }
            }
        });
    }

    /**
     * Handle cell click
     * @param {HTMLElement} cell - Cell element
     */
    handleCellClick(cell) {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        // Check if cell is already filled
        if (cell.classList.contains('filled')) {
            this.shakeCell(cell);
            if (this.audioManager) {
                this.audioManager.play('error');
            }
            return;
        }

        // Notify parent component
        if (this.onCellClick) {
            this.onCellClick(row, col);
        }
    }

    /**
     * Update a cell with a symbol
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @param {string} symbol - 'X' or 'O'
     */
    updateCell(row, col, symbol) {
        const cell = this.getCellElement(row, col);
        if (!cell) return;

        cell.textContent = symbol;
        cell.classList.add('filled', symbol.toLowerCase(), 'pop-in');
        
        if (this.audioManager) {
            this.audioManager.play('click');
        }

        // Remove animation class after animation completes
        setTimeout(() => {
            cell.classList.remove('pop-in');
        }, 300);
    }

    /**
     * Get cell element by row and col
     * @param {number} row - Row index
     * @param {number} col - Column index
     * @returns {HTMLElement|null} Cell element
     */
    getCellElement(row, col) {
        return this.container.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    }

    /**
     * Highlight winning cells
     * @param {Array} winningLine - Array of [row, col] coordinates
     */
    highlightWinningCells(winningLine) {
        if (!winningLine) return;

        winningLine.forEach(([row, col]) => {
            const cell = this.getCellElement(row, col);
            if (cell) {
                cell.classList.add('winning');
            }
        });
    }

    /**
     * Shake a cell (for invalid move)
     * @param {HTMLElement} cell - Cell element
     */
    shakeCell(cell) {
        cell.classList.add('animate-shake');
        setTimeout(() => {
            cell.classList.remove('animate-shake');
        }, 500);
    }

    /**
     * Reset the board
     */
    reset() {
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'game-cell';
        });
    }

    /**
     * Show hint
     * @param {Array} hint - [row, col] coordinates
     */
    showHint(hint) {
        if (!hint) return;

        const [row, col] = hint;
        const cell = this.getCellElement(row, col);
        if (cell) {
            cell.classList.add('animate-pulse');
            setTimeout(() => {
                cell.classList.remove('animate-pulse');
            }, 2000);
        }
    }

    /**
     * Disable all cells
     */
    disable() {
        this.cells.forEach(cell => {
            cell.style.pointerEvents = 'none';
        });
    }

    /**
     * Enable all cells
     */
    enable() {
        this.cells.forEach(cell => {
            if (!cell.classList.contains('filled')) {
                cell.style.pointerEvents = 'auto';
            }
        });
    }

    /**
     * Animate board entrance
     */
    animateEntrance() {
        this.cells.forEach((cell, index) => {
            cell.style.opacity = '0';
            setTimeout(() => {
                cell.classList.add('animate-scaleIn');
                cell.style.opacity = '1';
                setTimeout(() => {
                    cell.classList.remove('animate-scaleIn');
                }, 300);
            }, index * 30);
        });
    }

    /**
     * Animate board reset
     */
    animateReset() {
        this.cells.forEach((cell, index) => {
            setTimeout(() => {
                cell.classList.add('animate-scaleOut');
                setTimeout(() => {
                    cell.textContent = '';
                    cell.className = 'game-cell';
                    cell.classList.add('animate-scaleIn');
                    setTimeout(() => {
                        cell.classList.remove('animate-scaleIn');
                    }, 300);
                }, 150);
            }, index * 20);
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameBoard;
}
