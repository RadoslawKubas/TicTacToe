/**
 * ParticleEffects.js
 * Particle effects for celebrations and visual feedback
 */

class ParticleEffects {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas?.getContext('2d');
        this.particles = [];
        this.isRunning = false;
    }

    /**
     * Initialize particle system
     */
    init() {
        if (!this.canvas || !this.ctx) return;

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    /**
     * Resize canvas to fit container
     */
    resizeCanvas() {
        if (!this.canvas) return;

        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    /**
     * Create confetti particles
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    createConfetti(x, y) {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731', '#5f27cd'];
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10 - 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 5 + 2,
                life: 1.0,
                decay: Math.random() * 0.02 + 0.01
            });
        }

        this.start();
    }

    /**
     * Start particle animation
     */
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }

    /**
     * Stop particle animation
     */
    stop() {
        this.isRunning = false;
    }

    /**
     * Animation loop
     */
    animate() {
        if (!this.isRunning || !this.ctx || !this.canvas) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles = this.particles.filter(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.2; // Gravity
            particle.life -= particle.decay;

            // Draw particle
            if (particle.life > 0) {
                this.ctx.save();
                this.ctx.globalAlpha = particle.life;
                this.ctx.fillStyle = particle.color;
                this.ctx.fillRect(
                    particle.x - particle.size / 2,
                    particle.y - particle.size / 2,
                    particle.size,
                    particle.size
                );
                this.ctx.restore();
                return true;
            }

            return false;
        });

        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.isRunning = false;
        }
    }

    /**
     * Clear all particles
     */
    clear() {
        this.particles = [];
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    /**
     * Create sparkles at position
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    createSparkles(x, y) {
        const colors = ['#ffd700', '#ffed4e', '#ffffff'];
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * 5,
                vy: Math.sin(angle) * 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 3 + 1,
                life: 1.0,
                decay: 0.02
            });
        }

        this.start();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticleEffects;
}
