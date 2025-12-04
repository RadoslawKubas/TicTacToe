/**
 * AnimationEngine.js
 * Core animation engine for managing animations
 */

class AnimationEngine {
    constructor() {
        this.animations = [];
        this.isRunning = false;
        this.rafId = null;
    }

    /**
     * Start the animation loop
     */
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.loop();
        }
    }

    /**
     * Stop the animation loop
     */
    stop() {
        this.isRunning = false;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    /**
     * Animation loop
     */
    loop() {
        if (!this.isRunning) return;

        const now = Date.now();
        this.animations = this.animations.filter(anim => {
            if (anim.paused) return true;
            
            if (!anim.startTime) {
                anim.startTime = now;
            }

            const elapsed = now - anim.startTime;
            const progress = Math.min(elapsed / anim.duration, 1);
            const easedProgress = this.easing[anim.easing](progress);

            if (anim.onUpdate) {
                anim.onUpdate(easedProgress);
            }

            if (progress >= 1) {
                if (anim.onComplete) {
                    anim.onComplete();
                }
                return false; // Remove completed animation
            }

            return true; // Keep animation
        });

        this.rafId = requestAnimationFrame(() => this.loop());
    }

    /**
     * Add animation
     * @param {Object} animation - Animation config
     */
    add(animation) {
        const anim = {
            duration: animation.duration || 300,
            easing: animation.easing || 'easeInOut',
            onUpdate: animation.onUpdate,
            onComplete: animation.onComplete,
            startTime: null,
            paused: false
        };

        this.animations.push(anim);
        
        if (!this.isRunning) {
            this.start();
        }

        return anim;
    }

    /**
     * Pause animation
     * @param {Object} animation - Animation to pause
     */
    pause(animation) {
        animation.paused = true;
    }

    /**
     * Resume animation
     * @param {Object} animation - Animation to resume
     */
    resume(animation) {
        animation.paused = false;
    }

    /**
     * Clear all animations
     */
    clear() {
        this.animations = [];
    }

    /**
     * Easing functions
     */
    easing = {
        linear: (t) => t,
        
        easeIn: (t) => t * t,
        easeOut: (t) => t * (2 - t),
        easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        
        easeInCubic: (t) => t * t * t,
        easeOutCubic: (t) => (--t) * t * t + 1,
        easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        
        easeInQuart: (t) => t * t * t * t,
        easeOutQuart: (t) => 1 - (--t) * t * t * t,
        easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
        
        easeInQuint: (t) => t * t * t * t * t,
        easeOutQuint: (t) => 1 + (--t) * t * t * t * t,
        easeInOutQuint: (t) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
        
        elasticOut: (t) => {
            const p = 0.3;
            return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
        },
        
        bounceOut: (t) => {
            if (t < 1 / 2.75) {
                return 7.5625 * t * t;
            } else if (t < 2 / 2.75) {
                return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
            } else if (t < 2.5 / 2.75) {
                return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
            } else {
                return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
            }
        }
    };

    /**
     * Animate element property
     * @param {HTMLElement} element - Element to animate
     * @param {Object} properties - Properties to animate
     * @param {number} duration - Duration in ms
     * @param {string} easing - Easing function name
     * @returns {Object} Animation object
     */
    animateElement(element, properties, duration = 300, easing = 'easeInOut') {
        const startValues = {};
        const endValues = {};

        // Get start values
        for (const prop in properties) {
            const computedStyle = window.getComputedStyle(element);
            startValues[prop] = parseFloat(computedStyle[prop]) || 0;
            endValues[prop] = properties[prop];
        }

        return this.add({
            duration: duration,
            easing: easing,
            onUpdate: (progress) => {
                for (const prop in properties) {
                    const start = startValues[prop];
                    const end = endValues[prop];
                    const value = start + (end - start) * progress;
                    element.style[prop] = value + 'px';
                }
            }
        });
    }

    /**
     * Fade in element
     * @param {HTMLElement} element - Element to fade in
     * @param {number} duration - Duration in ms
     * @returns {Object} Animation object
     */
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';

        return this.add({
            duration: duration,
            easing: 'easeOut',
            onUpdate: (progress) => {
                element.style.opacity = progress;
            }
        });
    }

    /**
     * Fade out element
     * @param {HTMLElement} element - Element to fade out
     * @param {number} duration - Duration in ms
     * @returns {Object} Animation object
     */
    fadeOut(element, duration = 300) {
        return this.add({
            duration: duration,
            easing: 'easeIn',
            onUpdate: (progress) => {
                element.style.opacity = 1 - progress;
            },
            onComplete: () => {
                element.style.display = 'none';
            }
        });
    }

    /**
     * Slide in element
     * @param {HTMLElement} element - Element to slide in
     * @param {string} direction - 'left', 'right', 'top', 'bottom'
     * @param {number} duration - Duration in ms
     * @returns {Object} Animation object
     */
    slideIn(element, direction = 'left', duration = 300) {
        const transforms = {
            left: 'translateX(-100%)',
            right: 'translateX(100%)',
            top: 'translateY(-100%)',
            bottom: 'translateY(100%)'
        };

        element.style.transform = transforms[direction];
        element.style.display = 'block';

        return this.add({
            duration: duration,
            easing: 'easeOut',
            onUpdate: (progress) => {
                const value = 100 * (1 - progress);
                if (direction === 'left') {
                    element.style.transform = `translateX(-${value}%)`;
                } else if (direction === 'right') {
                    element.style.transform = `translateX(${value}%)`;
                } else if (direction === 'top') {
                    element.style.transform = `translateY(-${value}%)`;
                } else {
                    element.style.transform = `translateY(${value}%)`;
                }
            },
            onComplete: () => {
                element.style.transform = '';
            }
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationEngine;
}
