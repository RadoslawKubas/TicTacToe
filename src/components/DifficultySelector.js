/**
 * DifficultySelector.js
 * AI difficulty selection component
 */

class DifficultySelector {
    constructor(gameState) {
        this.gameState = gameState;
        this.container = document.getElementById('difficulty-selector');
        this.difficultyCards = this.container?.querySelectorAll('.difficulty-card');
        this.backBtn = document.getElementById('back-to-modes');
        
        this.onDifficultySelect = null;
        this.onBack = null;
    }

    /**
     * Initialize difficulty selector
     */
    init() {
        this.attachEventListeners();
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        if (this.difficultyCards) {
            this.difficultyCards.forEach(card => {
                card.addEventListener('click', () => {
                    const difficulty = card.dataset.difficulty;
                    this.selectDifficulty(difficulty);
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
     * Select difficulty level
     * @param {string} difficulty - Difficulty level
     */
    selectDifficulty(difficulty) {
        this.gameState.settings.difficulty = difficulty;
        this.gameState.save();
        
        if (this.onDifficultySelect) {
            this.onDifficultySelect(difficulty);
        }
    }

    /**
     * Show difficulty selector
     */
    show() {
        if (this.container) {
            this.container.classList.remove('hidden');
            this.container.classList.add('animate-fadeIn');
            
            // Stagger animation for difficulty cards
            if (this.difficultyCards) {
                this.difficultyCards.forEach((card, index) => {
                    card.style.animationDelay = `${index * 0.1}s`;
                    card.classList.add('stagger-item');
                });
            }
        }
    }

    /**
     * Hide difficulty selector
     */
    hide() {
        if (this.container) {
            this.container.classList.add('animate-fadeOut');
            setTimeout(() => {
                this.container.classList.add('hidden');
                this.container.classList.remove('animate-fadeOut', 'animate-fadeIn');
                
                // Remove stagger animation
                if (this.difficultyCards) {
                    this.difficultyCards.forEach(card => {
                        card.classList.remove('stagger-item');
                        card.style.animationDelay = '';
                    });
                }
            }, 300);
        }
    }

    /**
     * Get selected difficulty
     * @returns {string} Selected difficulty
     */
    getSelectedDifficulty() {
        return this.gameState.settings.difficulty;
    }

    /**
     * Get difficulty description
     * @param {string} difficulty - Difficulty level
     * @returns {string} Description
     */
    getDifficultyDescription(difficulty) {
        const descriptions = {
            easy: 'AI wykonuje losowe ruchy',
            medium: 'AI wykorzystuje podstawową strategię',
            hard: 'AI używa algorytmu Minimax',
            expert: 'AI używa Minimax z optymalizacją Alpha-Beta',
            impossible: 'AI gra perfekcyjnie i nigdy nie przegrywa'
        };
        
        return descriptions[difficulty] || 'Nieznany poziom trudności';
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DifficultySelector;
}
