/**
 * GameCell.js
 * Individual cell component (used by GameBoard)
 */

class GameCell {
    constructor(row, col, value = '') {
        this.row = row;
        this.col = col;
        this.value = value;
        this.element = null;
    }

    /**
     * Create the cell element
     * @returns {HTMLElement} Cell element
     */
    createElement() {
        const cell = document.createElement('div');
        cell.className = 'game-cell';
        cell.dataset.row = this.row;
        cell.dataset.col = this.col;
        
        if (this.value) {
            cell.textContent = this.value;
            cell.classList.add('filled', this.value.toLowerCase());
        }

        this.element = cell;
        return cell;
    }

    /**
     * Set cell value
     * @param {string} value - 'X' or 'O'
     * @param {boolean} animate - Whether to animate
     */
    setValue(value, animate = true) {
        if (!this.element) return;

        this.value = value;
        this.element.textContent = value;
        this.element.classList.add('filled', value.toLowerCase());
        
        if (animate) {
            this.element.classList.add('pop-in');
            setTimeout(() => {
                this.element.classList.remove('pop-in');
            }, 300);
        }
    }

    /**
     * Clear cell value
     */
    clear() {
        if (!this.element) return;

        this.value = '';
        this.element.textContent = '';
        this.element.className = 'game-cell';
    }

    /**
     * Highlight as winning cell
     */
    highlight() {
        if (!this.element) return;
        this.element.classList.add('winning');
    }

    /**
     * Remove highlight
     */
    removeHighlight() {
        if (!this.element) return;
        this.element.classList.remove('winning');
    }

    /**
     * Animate shake (for invalid move)
     */
    shake() {
        if (!this.element) return;

        this.element.classList.add('animate-shake');
        setTimeout(() => {
            this.element.classList.remove('animate-shake');
        }, 500);
    }

    /**
     * Show as hint
     */
    showAsHint() {
        if (!this.element) return;

        this.element.classList.add('animate-pulse');
        setTimeout(() => {
            this.element.classList.remove('animate-pulse');
        }, 2000);
    }

    /**
     * Check if cell is empty
     * @returns {boolean}
     */
    isEmpty() {
        return this.value === '';
    }

    /**
     * Check if cell is filled
     * @returns {boolean}
     */
    isFilled() {
        return this.value !== '';
    }

    /**
     * Disable cell
     */
    disable() {
        if (!this.element) return;
        this.element.style.pointerEvents = 'none';
    }

    /**
     * Enable cell
     */
    enable() {
        if (!this.element) return;
        if (!this.isFilled()) {
            this.element.style.pointerEvents = 'auto';
        }
    }

    /**
     * Get cell position
     * @returns {Object} {row, col}
     */
    getPosition() {
        return {
            row: this.row,
            col: this.col
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameCell;
}
