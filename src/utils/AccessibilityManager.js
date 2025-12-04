/**
 * AccessibilityManager.js
 * Manages accessibility features
 */

class AccessibilityManager {
    constructor() {
        this.focusableElements = [];
        this.currentFocusIndex = -1;
    }

    /**
     * Initialize accessibility features
     */
    init() {
        this.setupKeyboardNavigation();
        this.setupARIA();
        this.setupFocusManagement();
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Tab navigation
            if (e.key === 'Tab') {
                this.updateFocusableElements();
            }

            // Arrow key navigation for game board
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                this.handleArrowNavigation(e);
            }

            // Escape to close modals
            if (e.key === 'Escape') {
                this.closeTopModal();
            }

            // Enter to activate
            if (e.key === 'Enter' && e.target.hasAttribute('role')) {
                e.target.click();
            }
        });
    }

    /**
     * Setup ARIA attributes
     */
    setupARIA() {
        // Add ARIA labels to buttons
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(button => {
            if (!button.getAttribute('aria-label')) {
                button.setAttribute('aria-label', button.textContent.trim());
            }
        });

        // Add role to interactive elements
        const interactiveElements = document.querySelectorAll('.game-cell');
        interactiveElements.forEach(element => {
            element.setAttribute('role', 'button');
            element.setAttribute('tabindex', '0');
        });
    }

    /**
     * Setup focus management
     */
    setupFocusManagement() {
        // Track focusable elements
        this.updateFocusableElements();

        // Focus first element on page load
        window.addEventListener('load', () => {
            const firstFocusable = this.focusableElements[0];
            if (firstFocusable) {
                firstFocusable.focus();
            }
        });
    }

    /**
     * Update list of focusable elements
     */
    updateFocusableElements() {
        const selector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        this.focusableElements = Array.from(document.querySelectorAll(selector))
            .filter(el => el.offsetParent !== null); // Filter out hidden elements
    }

    /**
     * Handle arrow key navigation
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleArrowNavigation(e) {
        const gameBoard = document.getElementById('game-board');
        if (!gameBoard || !document.activeElement.classList.contains('game-cell')) {
            return;
        }

        e.preventDefault();
        const cells = Array.from(gameBoard.querySelectorAll('.game-cell'));
        const currentIndex = cells.indexOf(document.activeElement);
        const boardSize = Math.sqrt(cells.length);

        let newIndex = currentIndex;

        switch (e.key) {
            case 'ArrowUp':
                newIndex = currentIndex - boardSize;
                break;
            case 'ArrowDown':
                newIndex = currentIndex + boardSize;
                break;
            case 'ArrowLeft':
                newIndex = currentIndex - 1;
                break;
            case 'ArrowRight':
                newIndex = currentIndex + 1;
                break;
        }

        if (newIndex >= 0 && newIndex < cells.length) {
            cells[newIndex].focus();
        }
    }

    /**
     * Close top modal
     */
    closeTopModal() {
        const modals = document.querySelectorAll('.modal:not(.hidden)');
        if (modals.length > 0) {
            const topModal = modals[modals.length - 1];
            const closeButton = topModal.querySelector('.modal-close');
            if (closeButton) {
                closeButton.click();
            }
        }
    }

    /**
     * Announce to screen reader
     * @param {string} message - Message to announce
     * @param {string} priority - 'polite' or 'assertive'
     */
    announce(message, priority = 'polite') {
        let announcer = document.getElementById('screen-reader-announcer');
        
        if (!announcer) {
            announcer = document.createElement('div');
            announcer.id = 'screen-reader-announcer';
            announcer.setAttribute('aria-live', priority);
            announcer.setAttribute('aria-atomic', 'true');
            announcer.className = 'sr-only';
            announcer.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;';
            document.body.appendChild(announcer);
        }

        announcer.textContent = '';
        setTimeout(() => {
            announcer.textContent = message;
        }, 100);
    }

    /**
     * Set focus trap for modal
     * @param {HTMLElement} modal - Modal element
     */
    trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTabKey = (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        modal.addEventListener('keydown', handleTabKey);
        firstElement.focus();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityManager;
}
