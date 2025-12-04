/**
 * SymbolAnimations.js
 * Animations for X and O symbols
 */

class SymbolAnimations {
    constructor(animationEngine) {
        this.animationEngine = animationEngine;
    }

    /**
     * Draw X symbol with animation
     * @param {HTMLElement} cell - Cell element
     * @param {Function} onComplete - Callback when complete
     */
    drawX(cell, onComplete) {
        cell.classList.add('drawing');
        
        // Simple text animation for now
        // In a full implementation, this would use SVG or Canvas
        setTimeout(() => {
            cell.textContent = 'X';
            cell.classList.remove('drawing');
            cell.classList.add('pop-in');
            
            setTimeout(() => {
                cell.classList.remove('pop-in');
                if (onComplete) onComplete();
            }, 300);
        }, 100);
    }

    /**
     * Draw O symbol with animation
     * @param {HTMLElement} cell - Cell element
     * @param {Function} onComplete - Callback when complete
     */
    drawO(cell, onComplete) {
        cell.classList.add('drawing');
        
        // Simple text animation for now
        setTimeout(() => {
            cell.textContent = 'O';
            cell.classList.remove('drawing');
            cell.classList.add('pop-in');
            
            setTimeout(() => {
                cell.classList.remove('pop-in');
                if (onComplete) onComplete();
            }, 300);
        }, 100);
    }

    /**
     * Pulse animation for winning symbol
     * @param {HTMLElement} cell - Cell element
     */
    pulseWinning(cell) {
        cell.classList.add('animate-pulse');
    }

    /**
     * Fade out symbol
     * @param {HTMLElement} cell - Cell element
     */
    fadeOut(cell) {
        if (this.animationEngine) {
            this.animationEngine.fadeOut(cell, 200);
        } else {
            cell.style.opacity = '0';
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SymbolAnimations;
}
