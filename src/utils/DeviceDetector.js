/**
 * DeviceDetector.js
 * Detects device type and capabilities
 */

class DeviceDetector {
    constructor() {
        this.deviceType = this.detectDeviceType();
        this.isTouchDevice = this.detectTouch();
        this.orientation = this.detectOrientation();
        
        this.init();
    }

    /**
     * Initialize device detector
     */
    init() {
        // Listen for orientation changes
        window.addEventListener('orientationchange', () => {
            this.orientation = this.detectOrientation();
            this.onOrientationChange();
        });

        window.addEventListener('resize', () => {
            this.orientation = this.detectOrientation();
        });
    }

    /**
     * Detect device type
     * @returns {string} 'mobile', 'tablet', or 'desktop'
     */
    detectDeviceType() {
        const width = window.innerWidth;
        
        if (width < 768) {
            return 'mobile';
        } else if (width < 1024) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }

    /**
     * Detect if device supports touch
     * @returns {boolean}
     */
    detectTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    /**
     * Detect screen orientation
     * @returns {string} 'portrait' or 'landscape'
     */
    detectOrientation() {
        return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    }

    /**
     * Check if device is mobile
     * @returns {boolean}
     */
    isMobile() {
        return this.deviceType === 'mobile';
    }

    /**
     * Check if device is tablet
     * @returns {boolean}
     */
    isTablet() {
        return this.deviceType === 'tablet';
    }

    /**
     * Check if device is desktop
     * @returns {boolean}
     */
    isDesktop() {
        return this.deviceType === 'desktop';
    }

    /**
     * Orientation change handler
     */
    onOrientationChange() {
        // Emit custom event
        window.dispatchEvent(new CustomEvent('deviceOrientationChange', {
            detail: { orientation: this.orientation }
        }));
    }

    /**
     * Get device info
     * @returns {Object}
     */
    getInfo() {
        return {
            type: this.deviceType,
            isTouch: this.isTouchDevice,
            orientation: this.orientation,
            width: window.innerWidth,
            height: window.innerHeight
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeviceDetector;
}
