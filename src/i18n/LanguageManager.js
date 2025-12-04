/**
 * LanguageManager.js
 * Manages translations and localization
 */

class LanguageManager {
    constructor() {
        this.currentLanguage = 'pl';
        this.translations = {};
        this.fallbackLanguage = 'en';
    }

    /**
     * Initialize language manager
     */
    async init() {
        // Load default language
        await this.loadLanguage(this.currentLanguage);
    }

    /**
     * Load language file
     * @param {string} lang - Language code
     */
    async loadLanguage(lang) {
        try {
            const response = await fetch(`i18n/locales/${lang}.json`);
            if (response.ok) {
                this.translations[lang] = await response.json();
                this.currentLanguage = lang;
                this.applyTranslations();
            } else {
                console.error(`Failed to load language: ${lang}`);
            }
        } catch (error) {
            console.error(`Error loading language ${lang}:`, error);
        }
    }

    /**
     * Set language
     * @param {string} lang - Language code
     */
    async setLanguage(lang) {
        if (!this.translations[lang]) {
            await this.loadLanguage(lang);
        } else {
            this.currentLanguage = lang;
            this.applyTranslations();
        }
    }

    /**
     * Get translation
     * @param {string} key - Translation key
     * @param {Object} params - Parameters for interpolation
     * @returns {string} Translated text
     */
    t(key, params = {}) {
        const translation = this.translations[this.currentLanguage]?.[key] 
            || this.translations[this.fallbackLanguage]?.[key] 
            || key;

        // Simple parameter interpolation
        return translation.replace(/\{(\w+)\}/g, (match, param) => {
            return params[param] !== undefined ? params[param] : match;
        });
    }

    /**
     * Apply translations to DOM
     */
    applyTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });

        // Update document language
        document.documentElement.lang = this.currentLanguage;
    }

    /**
     * Get current language
     * @returns {string} Current language code
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Detect browser language
     * @returns {string} Browser language code
     */
    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.split('-')[0]; // Get base language code
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}
