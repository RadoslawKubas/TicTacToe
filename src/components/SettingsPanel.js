/**
 * SettingsPanel.js
 * Settings and preferences component
 */

class SettingsPanel {
    constructor(userState, audioManager) {
        this.userState = userState;
        this.audioManager = audioManager;
        this.container = document.getElementById('settings-panel');
        this.themeSelect = document.getElementById('theme-select');
        this.boardSizeSelect = document.getElementById('board-size-select');
        this.languageSelect = document.getElementById('language-select');
        this.soundEnabledCheckbox = document.getElementById('sound-enabled');
        this.volumeSlider = document.getElementById('volume-slider');
        this.volumeValue = document.getElementById('volume-value');
        this.animationsEnabledCheckbox = document.getElementById('animations-enabled');
        this.closeBtn = document.getElementById('close-settings');
        
        this.onClose = null;
    }

    /**
     * Initialize settings panel
     */
    init() {
        this.loadSettings();
        this.attachEventListeners();
    }

    /**
     * Load current settings
     */
    loadSettings() {
        if (this.themeSelect) {
            this.themeSelect.value = this.userState.preferences.theme;
        }

        if (this.boardSizeSelect) {
            this.boardSizeSelect.value = this.userState.preferences.boardSize;
        }

        if (this.languageSelect) {
            this.languageSelect.value = this.userState.preferences.language;
        }

        if (this.soundEnabledCheckbox) {
            this.soundEnabledCheckbox.checked = this.userState.preferences.soundEnabled;
        }

        if (this.volumeSlider) {
            this.volumeSlider.value = this.userState.preferences.volume;
        }

        if (this.volumeValue) {
            this.volumeValue.textContent = this.userState.preferences.volume + '%';
        }

        if (this.animationsEnabledCheckbox) {
            this.animationsEnabledCheckbox.checked = this.userState.preferences.animationsEnabled;
        }
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Theme change
        if (this.themeSelect) {
            this.themeSelect.addEventListener('change', (e) => {
                this.changeTheme(e.target.value);
            });
        }

        // Board size change
        if (this.boardSizeSelect) {
            this.boardSizeSelect.addEventListener('change', (e) => {
                this.userState.updatePreferences({ boardSize: parseInt(e.target.value) });
            });
        }

        // Language change
        if (this.languageSelect) {
            this.languageSelect.addEventListener('change', (e) => {
                this.userState.updatePreferences({ language: e.target.value });
            });
        }

        // Sound enabled
        if (this.soundEnabledCheckbox) {
            this.soundEnabledCheckbox.addEventListener('change', (e) => {
                this.userState.updatePreferences({ soundEnabled: e.target.checked });
                if (this.audioManager) {
                    this.audioManager.setEnabled(e.target.checked);
                }
            });
        }

        // Volume change
        if (this.volumeSlider) {
            this.volumeSlider.addEventListener('input', (e) => {
                const volume = parseInt(e.target.value);
                if (this.volumeValue) {
                    this.volumeValue.textContent = volume + '%';
                }
                this.userState.updatePreferences({ volume: volume });
                if (this.audioManager) {
                    this.audioManager.setVolume(volume);
                }
            });
        }

        // Animations enabled
        if (this.animationsEnabledCheckbox) {
            this.animationsEnabledCheckbox.addEventListener('change', (e) => {
                this.userState.updatePreferences({ animationsEnabled: e.target.checked });
                this.toggleAnimations(e.target.checked);
            });
        }

        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                this.hide();
                if (this.onClose) {
                    this.onClose();
                }
            });
        }
    }

    /**
     * Change theme
     * @param {string} theme - Theme name
     */
    changeTheme(theme) {
        const themeLink = document.getElementById('theme-stylesheet');
        if (themeLink) {
            themeLink.href = `styles/themes/${theme}.css`;
        }
        this.userState.updatePreferences({ theme: theme });
    }

    /**
     * Toggle animations
     * @param {boolean} enabled - Whether animations are enabled
     */
    toggleAnimations(enabled) {
        if (enabled) {
            document.body.classList.remove('no-animations');
        } else {
            document.body.classList.add('no-animations');
        }
    }

    /**
     * Show settings panel
     */
    show() {
        if (this.container) {
            this.container.classList.remove('hidden');
            this.container.classList.add('animate-fadeIn');
            this.loadSettings();
        }
    }

    /**
     * Hide settings panel
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
     * Reset settings to default
     */
    resetToDefaults() {
        this.userState.preferences = {
            theme: 'light',
            language: 'pl',
            soundEnabled: true,
            volume: 70,
            animationsEnabled: true,
            boardSize: 3,
            difficulty: 'medium'
        };
        this.userState.save();
        this.loadSettings();
        this.userState.applyPreferences();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SettingsPanel;
}
