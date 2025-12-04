/**
 * GameModeSelector.js
 * Game mode selection component
 */

class GameModeSelector {
    constructor(gameState) {
        this.gameState = gameState;
        this.container = document.getElementById('game-mode-selector');
        this.modeCards = this.container?.querySelectorAll('.mode-card');
        this.backBtn = document.getElementById('back-to-menu');
        
        this.onModeSelect = null;
        this.onBack = null;
    }

    /**
     * Initialize game mode selector
     */
    init() {
        this.attachEventListeners();
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        if (this.modeCards) {
            this.modeCards.forEach(card => {
                card.addEventListener('click', () => {
                    const mode = card.dataset.mode;
                    this.selectMode(mode);
                });
            });
        }

        if (this.backBtn) {
            this.backBtn.addEventListener('click', () => {
                this.hide();
                if (this.onBack) {
                    this.onBack();
                }
            });
        }
    }

    /**
     * Select a game mode
     * @param {string} mode - Game mode
     */
    selectMode(mode) {
        this.gameState.settings.mode = mode;
        this.gameState.save();
        
        if (this.onModeSelect) {
            this.onModeSelect(mode);
        }
    }

    /**
     * Show mode selector
     */
    show() {
        if (this.container) {
            this.container.classList.remove('hidden');
            this.container.classList.add('animate-fadeIn');
            
            // Stagger animation for mode cards
            if (this.modeCards) {
                this.modeCards.forEach((card, index) => {
                    card.style.animationDelay = `${index * 0.1}s`;
                    card.classList.add('stagger-item');
                });
            }
        }
    }

    /**
     * Hide mode selector
     */
    hide() {
        if (this.container) {
            this.container.classList.add('animate-fadeOut');
            setTimeout(() => {
                this.container.classList.add('hidden');
                this.container.classList.remove('animate-fadeOut', 'animate-fadeIn');
                
                // Remove stagger animation
                if (this.modeCards) {
                    this.modeCards.forEach(card => {
                        card.classList.remove('stagger-item');
                        card.style.animationDelay = '';
                    });
                }
            }, 300);
        }
    }

    /**
     * Get selected mode
     * @returns {string} Selected mode
     */
    getSelectedMode() {
        return this.gameState.settings.mode;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameModeSelector;
}
