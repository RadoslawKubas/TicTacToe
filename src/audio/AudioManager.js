/**
 * AudioManager.js
 * Manages game audio and sound effects
 */

class AudioManager {
    constructor() {
        this.enabled = true;
        this.volume = 70;
        this.sounds = {};
        this.musicPlaying = false;
    }

    /**
     * Initialize audio manager
     */
    init() {
        // Preload sounds
        this.loadSound('click', 'assets/sounds/click.mp3');
        this.loadSound('win', 'assets/sounds/win.mp3');
        this.loadSound('lose', 'assets/sounds/lose.mp3');
        this.loadSound('draw', 'assets/sounds/draw.mp3');
        this.loadSound('hover', 'assets/sounds/hover.mp3');
        this.loadSound('error', 'assets/sounds/error.mp3');
        this.loadSound('background', 'assets/sounds/background.mp3');
    }

    /**
     * Load a sound file
     * @param {string} name - Sound name
     * @param {string} path - Path to sound file
     */
    loadSound(name, path) {
        try {
            const audio = new Audio(path);
            audio.volume = this.volume / 100;
            this.sounds[name] = audio;
        } catch (e) {
            console.warn(`Failed to load sound: ${name}`, e);
        }
    }

    /**
     * Play a sound
     * @param {string} name - Sound name
     */
    play(name) {
        if (!this.enabled) return;

        const sound = this.sounds[name];
        if (sound) {
            try {
                sound.currentTime = 0;
                sound.volume = this.volume / 100;
                sound.play().catch(e => {
                    console.warn(`Failed to play sound: ${name}`, e);
                });
            } catch (e) {
                console.warn(`Failed to play sound: ${name}`, e);
            }
        }
    }

    /**
     * Play background music
     */
    playMusic() {
        if (!this.enabled || this.musicPlaying) return;

        const music = this.sounds['background'];
        if (music) {
            try {
                music.loop = true;
                music.volume = (this.volume / 100) * 0.3; // Lower volume for background
                music.play().catch(e => {
                    console.warn('Failed to play background music', e);
                });
                this.musicPlaying = true;
            } catch (e) {
                console.warn('Failed to play background music', e);
            }
        }
    }

    /**
     * Stop background music
     */
    stopMusic() {
        const music = this.sounds['background'];
        if (music) {
            music.pause();
            music.currentTime = 0;
            this.musicPlaying = false;
        }
    }

    /**
     * Set volume
     * @param {number} volume - Volume (0-100)
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(100, volume));
        
        // Update all sound volumes
        Object.values(this.sounds).forEach(sound => {
            if (sound === this.sounds['background']) {
                sound.volume = (this.volume / 100) * 0.3;
            } else {
                sound.volume = this.volume / 100;
            }
        });
    }

    /**
     * Enable/disable sound
     * @param {boolean} enabled - Whether sound is enabled
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        
        if (!enabled) {
            this.stopMusic();
        }
    }

    /**
     * Mute all sounds
     */
    mute() {
        this.setEnabled(false);
    }

    /**
     * Unmute all sounds
     */
    unmute() {
        this.setEnabled(true);
    }

    /**
     * Toggle mute
     */
    toggleMute() {
        this.setEnabled(!this.enabled);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AudioManager;
}
