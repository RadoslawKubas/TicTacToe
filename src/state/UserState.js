/**
 * UserState.js
 * Manages user profile, preferences, and statistics
 */

class UserState {
    constructor() {
        this.profile = {
            id: this.generateUserId(),
            username: 'Guest',
            avatar: 'default',
            created: Date.now()
        };
        
        this.preferences = {
            theme: 'light',
            language: 'pl',
            soundEnabled: true,
            volume: 70,
            animationsEnabled: true,
            boardSize: 3,
            difficulty: 'medium'
        };
        
        this.statistics = {
            gamesPlayed: 0,
            gamesWon: 0,
            gamesLost: 0,
            gamesDraw: 0,
            totalMoves: 0,
            winStreak: 0,
            bestWinStreak: 0,
            achievements: [],
            history: []
        };
        
        this.session = {
            isLoggedIn: false,
            token: null,
            lastActivity: Date.now()
        };
    }

    /**
     * Generate a unique user ID
     * @returns {string} User ID
     */
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Update user profile
     * @param {Object} updates - Profile updates
     */
    updateProfile(updates) {
        this.profile = { ...this.profile, ...updates };
        this.save();
    }

    /**
     * Update preferences
     * @param {Object} updates - Preference updates
     */
    updatePreferences(updates) {
        this.preferences = { ...this.preferences, ...updates };
        this.save();
        this.applyPreferences();
    }

    /**
     * Apply preferences to the UI
     */
    applyPreferences() {
        // Theme
        const themeLink = document.getElementById('theme-stylesheet');
        if (themeLink) {
            themeLink.href = `styles/themes/${this.preferences.theme}.css`;
        }

        // Language
        if (window.languageManager) {
            window.languageManager.setLanguage(this.preferences.language);
        }

        // Sound
        if (window.audioManager) {
            window.audioManager.setEnabled(this.preferences.soundEnabled);
            window.audioManager.setVolume(this.preferences.volume);
        }
    }

    /**
     * Record game result
     * @param {string} result - 'win', 'loss', or 'draw'
     * @param {Object} gameData - Additional game data
     */
    recordGame(result, gameData = {}) {
        this.statistics.gamesPlayed++;
        
        switch (result) {
            case 'win':
                this.statistics.gamesWon++;
                this.statistics.winStreak++;
                if (this.statistics.winStreak > this.statistics.bestWinStreak) {
                    this.statistics.bestWinStreak = this.statistics.winStreak;
                }
                break;
            case 'loss':
                this.statistics.gamesLost++;
                this.statistics.winStreak = 0;
                break;
            case 'draw':
                this.statistics.gamesDraw++;
                this.statistics.winStreak = 0;
                break;
        }

        // Add to history
        this.statistics.history.push({
            result: result,
            timestamp: Date.now(),
            ...gameData
        });

        // Keep only last 100 games in history
        if (this.statistics.history.length > 100) {
            this.statistics.history = this.statistics.history.slice(-100);
        }

        this.checkAchievements();
        this.save();
    }

    /**
     * Record moves
     * @param {number} moves - Number of moves
     */
    recordMoves(moves) {
        this.statistics.totalMoves += moves;
        this.save();
    }

    /**
     * Check and unlock achievements
     */
    checkAchievements() {
        const achievements = [
            {
                id: 'first_win',
                name: 'Pierwsza Wygrana',
                description: 'Wygraj swoją pierwszą grę',
                condition: () => this.statistics.gamesWon >= 1
            },
            {
                id: 'win_10',
                name: 'Zwycięzca',
                description: 'Wygraj 10 gier',
                condition: () => this.statistics.gamesWon >= 10
            },
            {
                id: 'win_50',
                name: 'Mistrz',
                description: 'Wygraj 50 gier',
                condition: () => this.statistics.gamesWon >= 50
            },
            {
                id: 'win_100',
                name: 'Legenda',
                description: 'Wygraj 100 gier',
                condition: () => this.statistics.gamesWon >= 100
            },
            {
                id: 'streak_5',
                name: 'Seria 5',
                description: 'Wygraj 5 gier z rzędu',
                condition: () => this.statistics.bestWinStreak >= 5
            },
            {
                id: 'streak_10',
                name: 'Nie do zatrzymania',
                description: 'Wygraj 10 gier z rzędu',
                condition: () => this.statistics.bestWinStreak >= 10
            },
            {
                id: 'play_100',
                name: 'Weteran',
                description: 'Zagraj 100 gier',
                condition: () => this.statistics.gamesPlayed >= 100
            }
        ];

        achievements.forEach(achievement => {
            if (achievement.condition() && !this.hasAchievement(achievement.id)) {
                this.unlockAchievement(achievement);
            }
        });
    }

    /**
     * Check if user has an achievement
     * @param {string} achievementId - Achievement ID
     * @returns {boolean}
     */
    hasAchievement(achievementId) {
        return this.statistics.achievements.some(a => a.id === achievementId);
    }

    /**
     * Unlock an achievement
     * @param {Object} achievement - Achievement data
     */
    unlockAchievement(achievement) {
        this.statistics.achievements.push({
            ...achievement,
            unlockedAt: Date.now()
        });
        
        // Show achievement notification
        if (window.showNotification) {
            window.showNotification('Osiągnięcie odblokowane!', achievement.name);
        }
    }

    /**
     * Get win rate percentage
     * @returns {number} Win rate (0-100)
     */
    getWinRate() {
        if (this.statistics.gamesPlayed === 0) {
            return 0;
        }
        return Math.round((this.statistics.gamesWon / this.statistics.gamesPlayed) * 100);
    }

    /**
     * Get statistics summary
     * @returns {Object} Statistics summary
     */
    getStatisticsSummary() {
        return {
            gamesPlayed: this.statistics.gamesPlayed,
            wins: this.statistics.gamesWon,
            losses: this.statistics.gamesLost,
            draws: this.statistics.gamesDraw,
            winRate: this.getWinRate(),
            currentStreak: this.statistics.winStreak,
            bestStreak: this.statistics.bestWinStreak,
            totalMoves: this.statistics.totalMoves,
            achievements: this.statistics.achievements.length
        };
    }

    /**
     * Update session
     */
    updateSession() {
        this.session.lastActivity = Date.now();
        this.save();
    }

    /**
     * Login user
     * @param {string} token - Authentication token
     */
    login(token) {
        this.session.isLoggedIn = true;
        this.session.token = token;
        this.updateSession();
    }

    /**
     * Logout user
     */
    logout() {
        this.session.isLoggedIn = false;
        this.session.token = null;
        this.save();
    }

    /**
     * Export user state
     * @returns {Object} User state
     */
    export() {
        return {
            profile: this.profile,
            preferences: this.preferences,
            statistics: this.statistics,
            session: { ...this.session, token: null } // Don't export token
        };
    }

    /**
     * Import user state
     * @param {Object} state - User state
     */
    import(state) {
        this.profile = state.profile || this.profile;
        this.preferences = state.preferences || this.preferences;
        this.statistics = state.statistics || this.statistics;
        this.session = { ...this.session, ...state.session };
    }

    /**
     * Save user state to localStorage
     */
    save() {
        try {
            localStorage.setItem('tictactoe_user_state', JSON.stringify(this.export()));
        } catch (e) {
            console.error('Failed to save user state:', e);
        }
    }

    /**
     * Load user state from localStorage
     * @returns {boolean} True if loaded successfully
     */
    load() {
        try {
            const saved = localStorage.getItem('tictactoe_user_state');
            if (saved) {
                this.import(JSON.parse(saved));
                this.applyPreferences();
                return true;
            }
        } catch (e) {
            console.error('Failed to load user state:', e);
        }
        return false;
    }

    /**
     * Reset user state
     */
    reset() {
        this.statistics = {
            gamesPlayed: 0,
            gamesWon: 0,
            gamesLost: 0,
            gamesDraw: 0,
            totalMoves: 0,
            winStreak: 0,
            bestWinStreak: 0,
            achievements: [],
            history: []
        };
        this.save();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserState;
}
