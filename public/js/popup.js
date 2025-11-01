// Universal Popup System
class UniversalPopup {
    constructor() {
        this.createPopupHTML();
        this.bindEvents();
        this.yesCallback = null;
        this.noCallback = null;
    }

    createPopupHTML() {
        // Create popup HTML if it doesn't exist
        if (!document.getElementById('universal-popup')) {
            const popupHTML = `
                <div class="popup-overlay" id="universal-popup">
                    <div class="popup-box">
                        <button class="close-btn" id="popup-close">&times;</button>
                        <h3 id="popup-title">Message</h3>
                        <p id="popup-message">This is a popup message.</p>
                        <div class="popup-buttons" id="popup-buttons">
                            <button class="ok-btn" id="popup-ok">OK</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', popupHTML);
        }
    }

    bindEvents() {
        const popup = document.getElementById('universal-popup');
        const closeBtn = document.getElementById('popup-close');

        // Close popup events
        closeBtn.addEventListener('click', () => this.hide());

        // Close popup if user clicks outside box
        window.addEventListener('click', (e) => {
            if (e.target === popup) {
                this.hide();
            }
        });
    }

    showOK(title = 'Message', message = 'This is a popup message.', type = '') {
        const popup = document.getElementById('universal-popup');
        const popupBox = popup.querySelector('.popup-box');
        const titleElement = document.getElementById('popup-title');
        const messageElement = document.getElementById('popup-message');
        const buttonsContainer = document.getElementById('popup-buttons');

        titleElement.textContent = title;
        messageElement.textContent = message;
        
        // Remove existing type classes and add new one
        popupBox.className = 'popup-box';
        if (type) popupBox.classList.add(type);
        
        // Set OK button
        buttonsContainer.innerHTML = '<button class="ok-btn" id="popup-ok">OK</button>';
        
        // Bind OK button event
        document.getElementById('popup-ok').addEventListener('click', () => this.hide());
        
        popup.classList.add('active');
    }

    showSuccess(message) {
        this.showOK('Success', message, 'success');
    }

    showError(message) {
        this.showOK('Error', message, 'error');
    }

    showWarning(message) {
        this.showOK('Warning', message, 'warning');
    }

    showInfo(message) {
        this.showOK('Info', message, 'info');
    }

    showYesNo(title = 'Confirm', message = 'Are you sure?', yesCallback = null, noCallback = null) {
        const popup = document.getElementById('universal-popup');
        const titleElement = document.getElementById('popup-title');
        const messageElement = document.getElementById('popup-message');
        const buttonsContainer = document.getElementById('popup-buttons');

        titleElement.textContent = title;
        messageElement.textContent = message;
        
        // Set Yes/No buttons
        buttonsContainer.innerHTML = `
            <button class="no-btn" id="popup-no">No</button>
            <button class="yes-btn" id="popup-yes">Yes</button>
        `;
        
        // Bind button events
        document.getElementById('popup-yes').addEventListener('click', () => {
            this.hide();
            if (yesCallback) yesCallback();
        });
        
        document.getElementById('popup-no').addEventListener('click', () => {
            this.hide();
            if (noCallback) noCallback();
        });
        
        popup.classList.add('active');
    }

    hide() {
        const popup = document.getElementById('universal-popup');
        popup.classList.remove('active');
    }

    // Legacy method for backward compatibility
    show(title, message) {
        this.showOK(title, message);
    }
}

// Initialize popup system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.popup = new UniversalPopup();
});

// Global functions for easy access
function showPopup(title, message) {
    if (window.popup) {
        window.popup.showOK(title, message);
    }
}

function showConfirmPopup(title, message, yesCallback, noCallback) {
    if (window.popup) {
        window.popup.showYesNo(title, message, yesCallback, noCallback);
    }
}

// Styled alert functions
function showSuccess(message) {
    if (window.popup) {
        window.popup.showSuccess(message);
    }
}

function showError(message) {
    if (window.popup) {
        window.popup.showError(message);
    }
}

function showWarning(message) {
    if (window.popup) {
        window.popup.showWarning(message);
    }
}

function showInfo(message) {
    if (window.popup) {
        window.popup.showInfo(message);
    }
}