/**
 * app.js
 * Main application entry point
 */

class TicTacToeApp {
    constructor() {
        // Initialize state
        this.gameState = new GameState();
        this.userState = new UserState();
        
        // Initialize services
        this.apiService = new ApiService();
        this.gameService = new GameService(this.gameState, this.apiService);
        this.wsService = new WebSocketService();
        
        // Initialize managers
        this.audioManager = new AudioManager();
        this.animationEngine = new AnimationEngine();
        this.deviceDetector = new DeviceDetector();
        this.accessibilityManager = new AccessibilityManager();
        this.languageManager = new LanguageManager();
        
        // Initialize animations
        this.symbolAnimations = new SymbolAnimations(this.animationEngine);
        this.boardAnimations = new BoardAnimations(this.animationEngine);
        this.particleEffects = new ParticleEffects();
        
        // Initialize components
        this.gameBoard = null;
        this.scoreBoard = null;
        this.playerPanel = null;
        this.mainMenu = null;
        this.settingsPanel = null;
        this.gameModeSelector = null;
        this.difficultySelector = null;
        this.tutorial = null;
        this.helpModal = null;
        
        // Current screen
        this.currentScreen = 'loading';
    }

    /**
     * Initialize application
     */
    async init() {
        console.log('Initializing TicTacToe application...');
        
        // Load user state
        this.userState.load();
        
        // Initialize managers
        this.audioManager.init();
        this.accessibilityManager.init();
        this.particleEffects.init();
        await this.languageManager.init();
        
        // Apply user preferences
        this.userState.applyPreferences();
        
        // Initialize components
        this.initializeComponents();
        
        // Hide loading screen
        this.hideLoadingScreen();
        
        // Show main menu
        this.showMainMenu();
        
        console.log('Application initialized');
    }

    /**
     * Initialize all components
     */
    initializeComponents() {
        // Game components
        this.gameBoard = new GameBoard(this.gameState, this.audioManager, this.animationEngine);
        this.scoreBoard = new ScoreBoard(this.gameState);
        this.playerPanel = new PlayerPanel(this.gameState);
        
        // Menu components
        this.mainMenu = new MainMenu(this.gameState, this.userState);
        this.settingsPanel = new SettingsPanel(this.userState, this.audioManager);
        this.gameModeSelector = new GameModeSelector(this.gameState);
        this.difficultySelector = new DifficultySelector(this.gameState);
        this.tutorial = new Tutorial();
        this.helpModal = new HelpModal();
        
        // Initialize components
        this.gameBoard.init();
        this.scoreBoard.init();
        this.playerPanel.init();
        this.mainMenu.init();
        this.settingsPanel.init();
        this.gameModeSelector.init();
        this.difficultySelector.init();
        this.tutorial.init();
        this.helpModal.init();
        
        // Setup event handlers
        this.setupEventHandlers();
    }

    /**
     * Setup event handlers
     */
    setupEventHandlers() {
        // Main menu
        this.mainMenu.onNewGame = () => this.handleNewGame();
        this.mainMenu.onContinue = () => this.handleContinue();
        this.mainMenu.onSettings = () => this.showSettings();
        this.mainMenu.onTutorial = () => this.showTutorial();
        
        // Game mode selector
        this.gameModeSelector.onModeSelect = (mode) => this.handleModeSelect(mode);
        this.gameModeSelector.onBack = () => this.showMainMenu();
        
        // Difficulty selector
        this.difficultySelector.onDifficultySelect = (difficulty) => this.handleDifficultySelect(difficulty);
        this.difficultySelector.onBack = () => this.showGameModeSelector();
        
        // Settings panel
        this.settingsPanel.onClose = () => this.showMainMenu();
        
        // Tutorial
        this.tutorial.onClose = () => this.showMainMenu();
        
        // Game board
        this.gameBoard.onCellClick = (row, col) => this.handleCellClick(row, col);
        
        // Game controls
        const restartBtn = document.getElementById('restart-btn');
        const undoBtn = document.getElementById('undo-btn');
        const hintBtn = document.getElementById('hint-btn');
        const exitBtn = document.getElementById('exit-game-btn');
        
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.handleRestart());
        }
        
        if (undoBtn) {
            undoBtn.addEventListener('click', () => this.handleUndo());
        }
        
        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.handleHint());
        }
        
        if (exitBtn) {
            exitBtn.addEventListener('click', () => this.handleExit());
        }
        
        // Game result modal
        const playAgainBtn = document.getElementById('play-again-btn');
        const backToMenuBtn = document.getElementById('back-to-menu-result');
        
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => this.handlePlayAgain());
        }
        
        if (backToMenuBtn) {
            backToMenuBtn.addEventListener('click', () => this.handleExit());
        }
    }

    /**
     * Hide loading screen
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 500);
        }
    }

    /**
     * Show main menu
     */
    showMainMenu() {
        this.hideAllScreens();
        this.mainMenu.show();
        this.currentScreen = 'main-menu';
    }

    /**
     * Show game mode selector
     */
    showGameModeSelector() {
        this.hideAllScreens();
        this.gameModeSelector.show();
        this.currentScreen = 'game-mode-selector';
    }

    /**
     * Show difficulty selector
     */
    showDifficultySelector() {
        this.hideAllScreens();
        this.difficultySelector.show();
        this.currentScreen = 'difficulty-selector';
    }

    /**
     * Show game screen
     */
    showGameScreen() {
        this.hideAllScreens();
        const gameScreen = document.getElementById('game-screen');
        if (gameScreen) {
            gameScreen.classList.remove('hidden');
            gameScreen.classList.add('animate-fadeIn');
        }
        this.gameBoard.animateEntrance();
        this.currentScreen = 'game-screen';
    }

    /**
     * Show settings
     */
    showSettings() {
        this.hideAllScreens();
        this.settingsPanel.show();
        this.currentScreen = 'settings';
    }

    /**
     * Show tutorial
     */
    showTutorial() {
        this.hideAllScreens();
        this.tutorial.show();
        this.currentScreen = 'tutorial';
    }

    /**
     * Hide all screens
     */
    hideAllScreens() {
        const screens = [
            'main-menu',
            'game-mode-selector',
            'difficulty-selector',
            'game-screen',
            'settings-panel',
            'tutorial'
        ];
        
        screens.forEach(screenId => {
            const screen = document.getElementById(screenId);
            if (screen) {
                screen.classList.add('hidden');
            }
        });
    }

    /**
     * Handle new game
     */
    handleNewGame() {
        this.showGameModeSelector();
    }

    /**
     * Handle continue
     */
    handleContinue() {
        if (this.gameState.load()) {
            this.showGameScreen();
            this.gameBoard.render();
            this.scoreBoard.update();
            this.playerPanel.update();
        }
    }

    /**
     * Handle mode select
     * @param {string} mode - Selected game mode
     */
    handleModeSelect(mode) {
        this.gameState.settings.mode = mode;
        
        if (mode === 'ai') {
            this.showDifficultySelector();
        } else if (mode === 'online') {
            this.startOnlineGame();
        } else {
            this.startGame();
        }
    }

    /**
     * Handle difficulty select
     * @param {string} difficulty - Selected difficulty
     */
    handleDifficultySelect(difficulty) {
        this.gameState.settings.difficulty = difficulty;
        this.playerPanel.setPlayer2AI(true);
        this.startGame();
    }

    /**
     * Start online game
     */
    async startOnlineGame() {
        try {
            // Create game on server
            const gameData = await this.apiService.createGame({
                mode: 'online',
                boardSize: this.gameState.settings.boardSize || 3,
                winCondition: this.gameState.settings.winCondition || 3,
                playerX: this.userState.profile?.name || 'Player 1'
            });
            
            this.gameState.gameId = gameData.gameId;
            
            // Setup WebSocket handlers
            this.setupWebSocketHandlers();
            
            // Connect to WebSocket
            this.wsService.connect(
                gameData.gameId,
                this.userState.profile?.name || 'Player',
                this.userState.id
            );
            
            // Show game screen
            this.showGameScreen();
            this.gameBoard.render();
            this.scoreBoard.update();
            this.playerPanel.update();
            
            // Show waiting for opponent message
            this.showWaitingModal();
            
        } catch (error) {
            console.error('Failed to start online game:', error);
            this.showErrorModal('Nie udało się rozpocząć gry online.');
        }
    }

    /**
     * Setup WebSocket event handlers
     */
    setupWebSocketHandlers() {
        this.wsService.on('onGameState', (data) => {
            this.gameState.board = data.board;
            this.gameState.currentPlayer = data.currentPlayer;
            this.gameBoard.render();
            this.playerPanel.update();
        });
        
        this.wsService.on('onMoveMade', (data) => {
            this.gameState.board[data.row][data.col] = data.player;
            this.gameState.currentPlayer = data.nextPlayer;
            this.gameBoard.updateCell(data.row, data.col, data.player);
            this.playerPanel.update();
            this.audioManager.play('click');
        });
        
        this.wsService.on('onGameOver', (data) => {
            this.gameState.status = data.isDraw ? 'draw' : 'won';
            this.gameState.winner = data.winner;
            this.gameState.winningLine = data.winningLine;
            
            if (data.isDraw) {
                this.handleDraw();
            } else {
                this.handleWin();
            }
        });
        
        this.wsService.on('onPlayerJoined', (data) => {
            this.hideWaitingModal();
            this.playerPanel.setPlayer2Name(data.playerName);
            this.audioManager.play('click');
        });
        
        this.wsService.on('onPlayerLeft', (data) => {
            this.showInfoModal(`${data.playerName} opuścił grę.`);
        });
        
        this.wsService.on('onChatMessage', (data) => {
            this.showChatMessage(data.playerName, data.message);
        });
        
        this.wsService.on('onRematchRequest', () => {
            this.showRematchRequestModal();
        });
        
        this.wsService.on('onRematchAccepted', () => {
            this.handleRestart();
        });
        
        this.wsService.on('onError', (data) => {
            console.error('WebSocket error:', data.message);
        });
        
        this.wsService.on('onDisconnect', () => {
            if (this.gameState.status === 'playing') {
                this.showInfoModal('Połączenie zostało utracone.');
            }
        });
    }

    /**
     * Show waiting for opponent modal
     */
    showWaitingModal() {
        const modal = document.getElementById('waiting-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    /**
     * Hide waiting modal
     */
    hideWaitingModal() {
        const modal = document.getElementById('waiting-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    /**
     * Show error modal
     * @param {string} message - Error message
     */
    showErrorModal(message) {
        const modal = document.getElementById('error-modal');
        const msgEl = document.getElementById('error-message');
        if (modal && msgEl) {
            msgEl.textContent = message;
            modal.classList.remove('hidden');
        }
    }

    /**
     * Show info modal
     * @param {string} message - Info message
     */
    showInfoModal(message) {
        const modal = document.getElementById('info-modal');
        const msgEl = document.getElementById('info-message');
        if (modal && msgEl) {
            msgEl.textContent = message;
            modal.classList.remove('hidden');
        }
    }

    /**
     * Show chat message
     * @param {string} playerName - Player name
     * @param {string} message - Chat message
     */
    showChatMessage(playerName, message) {
        const chatContainer = document.getElementById('chat-messages');
        if (chatContainer) {
            const msgEl = document.createElement('div');
            msgEl.className = 'chat-message';
            msgEl.innerHTML = `<strong>${playerName}:</strong> ${message}`;
            chatContainer.appendChild(msgEl);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }

    /**
     * Show rematch request modal
     */
    showRematchRequestModal() {
        const modal = document.getElementById('rematch-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }
    }

    /**
     * Start game
     */
    async startGame() {
        await this.gameService.startNewGame(this.gameState.settings);
        this.showGameScreen();
        this.gameBoard.render();
        this.scoreBoard.update();
        this.playerPanel.update();
        this.audioManager.play('click');
    }

    /**
     * Handle cell click
     * @param {number} row - Row index
     * @param {number} col - Column index
     */
    async handleCellClick(row, col) {
        if (this.gameState.status !== 'playing') return;
        
        // For online mode, send move through WebSocket
        if (this.gameState.settings.mode === 'online') {
            this.wsService.sendMove(row, col);
            return;
        }
        
        // Make move locally
        const success = this.gameService.makeMove(row, col);
        if (!success) return;
        
        // Update UI
        this.gameBoard.updateCell(row, col, this.gameState.board[row][col]);
        this.playerPanel.update();
        this.audioManager.play('click');
        
        // Check game status
        if (this.gameState.status === 'won') {
            await this.handleWin();
        } else if (this.gameState.status === 'draw') {
            await this.handleDraw();
        } else if (this.gameState.settings.mode === 'ai' && this.gameState.currentPlayer === 'O') {
            // AI's turn
            setTimeout(() => this.handleAIMove(), 500);
        }
        
        this.gameState.save();
    }

    /**
     * Handle AI move
     */
    async handleAIMove() {
        const move = await this.gameService.getAIMove();
        if (move) {
            this.handleCellClick(move[0], move[1]);
        }
    }

    /**
     * Handle win
     */
    async handleWin() {
        this.audioManager.play('win');
        this.gameBoard.highlightWinningCells(this.gameState.winningLine);
        this.scoreBoard.update();
        this.scoreBoard.highlightWinner(this.gameState.winner);
        this.playerPanel.showWinner(this.gameState.winner);
        
        // Show confetti
        if (this.particleEffects && this.gameBoard.container) {
            const rect = this.gameBoard.container.getBoundingClientRect();
            this.particleEffects.createConfetti(rect.width / 2, rect.height / 2);
        }
        
        // Record game
        const isPlayerWin = this.gameState.winner === 'X';
        this.userState.recordGame(isPlayerWin ? 'win' : 'loss', {
            mode: this.gameState.settings.mode,
            difficulty: this.gameState.settings.difficulty
        });
        
        // Submit score to backend
        await this.gameService.submitScore(isPlayerWin ? 'win' : 'loss');
        
        // Show result modal
        setTimeout(() => this.showResultModal('win'), 1000);
    }

    /**
     * Handle draw
     */
    async handleDraw() {
        this.audioManager.play('draw');
        this.scoreBoard.update();
        this.scoreBoard.highlightDraw();
        
        // Record game
        this.userState.recordGame('draw', {
            mode: this.gameState.settings.mode
        });
        
        // Submit score to backend
        await this.gameService.submitScore('draw');
        
        // Show result modal
        setTimeout(() => this.showResultModal('draw'), 1000);
    }

    /**
     * Show result modal
     * @param {string} result - 'win' or 'draw'
     */
    showResultModal(result) {
        const modal = document.getElementById('game-result-modal');
        const title = document.getElementById('result-title');
        const message = document.getElementById('result-message');
        
        if (modal && title && message) {
            if (result === 'win') {
                title.textContent = 'Wygrana!';
                message.textContent = `Gracz ${this.gameState.winner} wygrał!`;
            } else {
                title.textContent = 'Remis!';
                message.textContent = 'Gra zakończona remisem.';
            }
            
            modal.classList.remove('hidden');
            modal.classList.add('show');
        }
    }

    /**
     * Hide result modal
     */
    hideResultModal() {
        const modal = document.getElementById('game-result-modal');
        if (modal) {
            modal.classList.add('hide');
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('show', 'hide');
            }, 300);
        }
    }

    /**
     * Handle restart
     */
    handleRestart() {
        this.hideResultModal();
        this.gameState.reset();
        this.gameState.status = 'playing';
        this.gameBoard.animateReset();
        setTimeout(() => {
            this.gameBoard.render();
            this.playerPanel.update();
        }, 500);
        this.particleEffects.clear();
        this.audioManager.play('click');
    }

    /**
     * Handle undo
     */
    handleUndo() {
        if (this.gameService.undoMove()) {
            this.gameBoard.render();
            this.playerPanel.update();
            this.audioManager.play('click');
        }
    }

    /**
     * Handle hint
     */
    async handleHint() {
        const hint = await this.gameService.getHint();
        if (hint) {
            this.gameBoard.showHint(hint);
            this.audioManager.play('hover');
        }
    }

    /**
     * Handle exit
     */
    handleExit() {
        this.hideResultModal();
        
        // Disconnect WebSocket if online
        if (this.gameState.settings.mode === 'online') {
            this.wsService.disconnect();
        }
        
        this.showMainMenu();
        this.particleEffects.clear();
    }

    /**
     * Handle play again
     */
    handlePlayAgain() {
        if (this.gameState.settings.mode === 'online') {
            // Request rematch through WebSocket
            this.wsService.requestRematch();
        } else {
            this.handleRestart();
        }
    }

    /**
     * Handle rematch accept
     */
    handleRematchAccept() {
        this.wsService.acceptRematch();
        const modal = document.getElementById('rematch-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    /**
     * Handle rematch decline
     */
    handleRematchDecline() {
        this.wsService.declineRematch();
        const modal = document.getElementById('rematch-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.handleExit();
    }

    /**
     * Send chat message
     * @param {string} message - Chat message
     */
    sendChatMessage(message) {
        if (this.gameState.settings.mode === 'online' && message.trim()) {
            this.wsService.sendChat(message);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TicTacToeApp();
    window.app.init();
});

// Make classes available globally
window.GameState = GameState;
window.UserState = UserState;
window.languageManager = null;
window.audioManager = null;

// Service Worker registration (for PWA support)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('Service Worker registration failed:', err);
        });
    });
}
