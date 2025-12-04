/**
 * MainMenu.js
 * Main menu component
 */

class MainMenu {
    constructor(gameState, userState) {
        this.gameState = gameState;
        this.userState = userState;
        this.container = document.getElementById('main-menu');
        this.newGameBtn = document.getElementById('new-game-btn');
        this.continueBtn = document.getElementById('continue-btn');
        this.settingsBtn = document.getElementById('settings-btn');
        this.leaderboardBtn = document.getElementById('leaderboard-btn');
        this.tutorialBtn = document.getElementById('tutorial-btn');
        
        this.onNewGame = null;
        this.onContinue = null;
        this.onSettings = null;
        this.onLeaderboard = null;
        this.onTutorial = null;
    }

    /**
     * Initialize main menu
     */
    init() {
        this.attachEventListeners();
        this.checkContinueButton();
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        if (this.newGameBtn) {
            this.newGameBtn.addEventListener('click', () => {
                if (this.onNewGame) {
                    this.onNewGame();
                }
            });
        }

        if (this.continueBtn) {
            this.continueBtn.addEventListener('click', () => {
                if (this.onContinue) {
                    this.onContinue();
                }
            });
        }

        if (this.settingsBtn) {
            this.settingsBtn.addEventListener('click', () => {
                if (this.onSettings) {
                    this.onSettings();
                }
            });
        }

        if (this.leaderboardBtn) {
            this.leaderboardBtn.addEventListener('click', () => {
                if (this.onLeaderboard) {
                    this.onLeaderboard();
                }
            });
        }

        if (this.tutorialBtn) {
            this.tutorialBtn.addEventListener('click', () => {
                if (this.onTutorial) {
                    this.onTutorial();
                }
            });
        }
    }

    /**
     * Check if continue button should be enabled
     */
    checkContinueButton() {
        if (!this.continueBtn) return;

        const hasSavedGame = localStorage.getItem('tictactoe_game_state') !== null;
        this.continueBtn.disabled = !hasSavedGame;
    }

    /**
     * Show main menu
     */
    show() {
        if (this.container) {
            this.container.classList.remove('hidden');
            this.container.classList.add('animate-fadeIn');
            this.checkContinueButton();
        }
    }

    /**
     * Hide main menu
     */
    hide() {
        if (this.container) {
            this.container.classList.add('animate-fadeOut');
            setTimeout(() => {
                this.container.classList.add('hidden');
                this.container.classList.remove('animate-fadeOut', 'animate-fadeIn');
            }, 300);
        }
    }

    /**
     * Enable all buttons
     */
    enable() {
        const buttons = [
            this.newGameBtn,
            this.settingsBtn,
            this.leaderboardBtn,
            this.tutorialBtn
        ];

        buttons.forEach(btn => {
            if (btn) btn.disabled = false;
        });

        this.checkContinueButton();
    }

    /**
     * Disable all buttons
     */
    disable() {
        const buttons = [
            this.newGameBtn,
            this.continueBtn,
            this.settingsBtn,
            this.leaderboardBtn,
            this.tutorialBtn
        ];

        buttons.forEach(btn => {
            if (btn) btn.disabled = true;
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MainMenu;
}
