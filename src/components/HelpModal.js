/**
 * HelpModal.js
 * Help and FAQ modal component
 */

class HelpModal {
    constructor() {
        this.modal = document.getElementById('help-modal');
        this.closeBtn = this.modal?.querySelector('.modal-close');
        
        this.onClose = null;
    }

    /**
     * Initialize help modal
     */
    init() {
        this.attachEventListeners();
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                this.hide();
            });
        }

        // Close on background click
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.hide();
                }
            });
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal?.classList.contains('hidden')) {
                this.hide();
            }
        });

        // Keyboard shortcuts help
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F1' || (e.key === '?' && e.shiftKey)) {
                e.preventDefault();
                this.show();
            }
        });
    }

    /**
     * Show help modal
     */
    show() {
        if (this.modal) {
            this.modal.classList.remove('hidden');
            this.modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Hide help modal
     */
    hide() {
        if (this.modal) {
            this.modal.classList.add('hide');
            setTimeout(() => {
                this.modal.classList.add('hidden');
                this.modal.classList.remove('show', 'hide');
                document.body.style.overflow = '';
                
                if (this.onClose) {
                    this.onClose();
                }
            }, 300);
        }
    }

    /**
     * Toggle help modal
     */
    toggle() {
        if (this.modal?.classList.contains('hidden')) {
            this.show();
        } else {
            this.hide();
        }
    }

    /**
     * Add FAQ item
     * @param {string} question - Question text
     * @param {string} answer - Answer text
     */
    addFAQItem(question, answer) {
        const helpContent = this.modal?.querySelector('.help-content');
        if (!helpContent) return;

        const faqSection = helpContent.querySelector('section:last-child');
        if (!faqSection) return;

        const details = document.createElement('details');
        details.innerHTML = `
            <summary>${question}</summary>
            <p>${answer}</p>
        `;
        
        faqSection.appendChild(details);
    }

    /**
     * Update keyboard shortcuts
     * @param {Array} shortcuts - Array of {key, description} objects
     */
    updateShortcuts(shortcuts) {
        const shortcutsSection = this.modal?.querySelector('.help-content section:nth-child(2) ul');
        if (!shortcutsSection) return;

        shortcutsSection.innerHTML = '';
        
        shortcuts.forEach(shortcut => {
            const li = document.createElement('li');
            li.innerHTML = `<kbd>${shortcut.key}</kbd> - ${shortcut.description}`;
            shortcutsSection.appendChild(li);
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HelpModal;
}
