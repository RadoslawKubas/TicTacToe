/**
 * Tutorial.js
 * Interactive tutorial component
 */

class Tutorial {
    constructor() {
        this.container = document.getElementById('tutorial');
        this.steps = this.container?.querySelectorAll('.tutorial-step');
        this.currentStep = 1;
        this.totalSteps = this.steps?.length || 4;
        
        this.prevBtn = document.getElementById('tutorial-prev');
        this.nextBtn = document.getElementById('tutorial-next');
        this.closeBtn = document.getElementById('close-tutorial');
        this.progressText = document.getElementById('tutorial-progress');
        
        this.onClose = null;
    }

    /**
     * Initialize tutorial
     */
    init() {
        this.attachEventListeners();
        this.showStep(1);
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.previousStep();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextStep();
            });
        }

        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                this.hide();
                if (this.onClose) {
                    this.onClose();
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.container?.classList.contains('hidden')) {
                if (e.key === 'ArrowLeft') {
                    this.previousStep();
                } else if (e.key === 'ArrowRight') {
                    this.nextStep();
                } else if (e.key === 'Escape') {
                    this.hide();
                    if (this.onClose) {
                        this.onClose();
                    }
                }
            }
        });
    }

    /**
     * Show a specific step
     * @param {number} stepNumber - Step number (1-based)
     */
    showStep(stepNumber) {
        this.currentStep = Math.max(1, Math.min(stepNumber, this.totalSteps));
        
        // Hide all steps
        if (this.steps) {
            this.steps.forEach(step => {
                step.classList.remove('active');
            });
            
            // Show current step
            const currentStepElement = this.container?.querySelector(`[data-step="${this.currentStep}"]`);
            if (currentStepElement) {
                currentStepElement.classList.add('active');
            }
        }
        
        // Update progress
        if (this.progressText) {
            this.progressText.textContent = `${this.currentStep} / ${this.totalSteps}`;
        }
        
        // Update button states
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentStep === 1;
        }
        
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentStep === this.totalSteps;
            this.nextBtn.textContent = this.currentStep === this.totalSteps ? 'Zakończ' : 'Następny →';
        }
    }

    /**
     * Go to next step
     */
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.showStep(this.currentStep + 1);
        } else {
            // Last step - close tutorial
            this.hide();
            if (this.onClose) {
                this.onClose();
            }
        }
    }

    /**
     * Go to previous step
     */
    previousStep() {
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        }
    }

    /**
     * Show tutorial
     */
    show() {
        if (this.container) {
            this.container.classList.remove('hidden');
            this.container.classList.add('animate-fadeIn');
            this.showStep(1);
        }
    }

    /**
     * Hide tutorial
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
     * Reset tutorial to first step
     */
    reset() {
        this.showStep(1);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Tutorial;
}
