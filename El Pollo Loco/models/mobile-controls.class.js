/**
 * Mobile touch controls for game interaction
 */
class MobileControls {
    /**
     * Creates mobile controls system
     * @param {HTMLCanvasElement} canvas - Game canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.buttons = [];
        this.isMobile = this.detectMobile();
        this.isLandscape = window.innerWidth > window.innerHeight;
        
        this.initializeControls();
        this.setupResizeListener();
    }

    /**
     * Initializes mobile controls if on mobile device
     */
    initializeControls() {
        if (this.isMobile) {
            this.setupButtons();
            this.setupEventListeners();
        }
    }

    /**
     * Sets up resize listener for dynamic control management
     */
    setupResizeListener() {
        window.addEventListener('resize', () => {
            this.updateMobileDetection();
        });
    }

    /**
     * Updates mobile detection state on resize
     */
    updateMobileDetection() {
        const wasMobile = this.isMobile;
        this.isMobile = this.detectMobile();
        
        if (!wasMobile && this.isMobile) {
            this.setupButtons();
            this.setupEventListeners();
        } else if (wasMobile && !this.isMobile) {
            this.buttons = [];
        }
    }

    /**
     * Detects if device should show mobile controls
     * @returns {boolean} True if mobile controls should be shown
     */
    detectMobile() {
        const isMobileDevice = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isSmallScreen = window.innerWidth <= 1024;
        
        return isMobileDevice || isSmallScreen;
    }

    /**
     * Sets up button layout and styling
     */
    setupButtons() {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        
        const styling = this.getButtonStyling();
        const positions = this.calculateButtonPositions(canvasWidth, canvasHeight, styling);
        
        this.createMovementButtons(positions, styling);
        this.createActionButtons(positions, styling, canvasWidth, canvasHeight);
    }

    /**
     * Gets button styling based on screen size
     * @returns {Object} Button styling configuration
     */
    getButtonStyling() {
        const isTabletSize = window.innerWidth >= 768 && window.innerWidth <= 1024;
        
        return {
            isTabletSize,
            buttonStyle: {
                width: isTabletSize ? 70 : 60,
                height: isTabletSize ? 70 : 60,
                radius: 15,
                color: '#FF6B35',
                borderColor: '#FFF700',
                textColor: 'white',
                font: isTabletSize ? 'bold 16px Comic Sans MS' : 'bold 14px Comic Sans MS'
            },
            actionButtonStyle: {
                width: isTabletSize ? 90 : 80,
                height: isTabletSize ? 60 : 50,
                radius: 15,
                color: '#FF6B35',
                borderColor: '#FFF700',
                textColor: 'white',
                font: isTabletSize ? 'bold 14px Comic Sans MS' : 'bold 12px Comic Sans MS'
            }
        };
    }

    /**
     * Calculates button positions based on screen size
     * @param {number} canvasWidth - Canvas width
     * @param {number} canvasHeight - Canvas height
     * @param {Object} styling - Button styling configuration
     * @returns {Object} Position configuration
     */
    calculateButtonPositions(canvasWidth, canvasHeight, styling) {
        const { isTabletSize } = styling;
        
        return {
            margin: isTabletSize ? 40 : 30,
            buttonSpacing: isTabletSize ? 100 : 80,
            actionButtonOffset: isTabletSize ? 90 : 80,
            actionTopOffset: isTabletSize ? 140 : 120,
            actionBottomOffset: isTabletSize ? 70 : 60
        };
    }

    /**
     * Creates movement control buttons
     * @param {Object} positions - Position configuration
     * @param {Object} styling - Button styling
     */
    createMovementButtons(positions, styling) {
        const { margin, buttonSpacing } = positions;
        const { buttonStyle } = styling;
        
        this.buttons.push({
            id: 'left',
            x: margin,
            y: this.canvas.height - buttonSpacing,
            ...buttonStyle,
            text: '◀',
            key: 'LEFT'
        });

        this.buttons.push({
            id: 'right',
            x: margin + buttonSpacing,
            y: this.canvas.height - buttonSpacing,
            ...buttonStyle,
            text: '▶',
            key: 'RIGHT'
        });
    }

    /**
     * Creates action control buttons
     * @param {Object} positions - Position configuration
     * @param {Object} styling - Button styling
     * @param {number} canvasWidth - Canvas width
     * @param {number} canvasHeight - Canvas height
     */
    createActionButtons(positions, styling, canvasWidth, canvasHeight) {
        const { margin, actionButtonOffset, actionTopOffset, actionBottomOffset } = positions;
        const { actionButtonStyle } = styling;

        this.buttons.push({
            id: 'jump',
            x: canvasWidth - margin - actionButtonOffset,
            y: canvasHeight - actionTopOffset,
            ...actionButtonStyle,
            text: 'JUMP',
            key: 'UP'
        });

        this.buttons.push({
            id: 'throw',
            x: canvasWidth - margin - actionButtonOffset,
            y: canvasHeight - actionBottomOffset,
            ...actionButtonStyle,
            text: 'THROW',
            key: 'SPACE'
        });
    }

    setupEventListeners() {
        // Touch events
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
        
        // Mouse events for testing
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    }

    handleTouchStart(e) {
        e.preventDefault();
        const touches = e.touches;
        
        for (let i = 0; i < touches.length; i++) {
            const touch = touches[i];
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            
            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;
            
            this.handleButtonPress(x, y, true);
        }
    }

    handleTouchEnd(e) {
        e.preventDefault();
        // Release all buttons on touch end
        this.buttons.forEach(button => {
            if (button.pressed) {
                button.pressed = false;
                if (window.keyboard) {
                    window.keyboard[button.key] = false;
                }
            }
        });
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        this.handleButtonPress(x, y, true);
    }

    handleMouseUp(e) {
        this.buttons.forEach(button => {
            if (button.pressed) {
                button.pressed = false;
                if (window.keyboard) {
                    window.keyboard[button.key] = false;
                }
            }
        });
    }

    handleButtonPress(x, y, isPress) {
        this.buttons.forEach(button => {
            if (this.isPointInButton(x, y, button)) {
                button.pressed = isPress;
                if (window.keyboard) {
                    window.keyboard[button.key] = isPress;
                }
            }
        });
    }

    isPointInButton(x, y, button) {
        return x >= button.x && 
               x <= button.x + button.width && 
               y >= button.y && 
               y <= button.y + button.height;
    }

    draw() {
        if (!this.isMobile) return;

        this.buttons.forEach(button => {
            this.drawButton(button);
        });
    }

    drawButton(button) {
        const ctx = this.ctx;
        
        // Save context
        ctx.save();
        
        // Set global alpha for 60% transparency
        ctx.globalAlpha = 0.6;
        
        // Button background
        const gradient = ctx.createLinearGradient(
            button.x, button.y, 
            button.x, button.y + button.height
        );
        
        if (button.pressed) {
            gradient.addColorStop(0, '#E63946');
            gradient.addColorStop(1, '#DC2626');
        } else {
            gradient.addColorStop(0, '#FF6B35');
            gradient.addColorStop(1, '#E63946');
        }
        
        // Draw button
        ctx.fillStyle = gradient;
        ctx.strokeStyle = button.borderColor;
        ctx.lineWidth = 3;
        
        this.roundRect(ctx, button.x, button.y, button.width, button.height, button.radius);
        ctx.fill();
        ctx.stroke();
        
        // Add glow effect
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetY = 2;
        
        // Button text
        ctx.fillStyle = button.textColor;
        ctx.font = button.font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 2;
        
        const centerX = button.x + button.width / 2;
        const centerY = button.y + button.height / 2;
        
        ctx.fillText(button.text, centerX, centerY);
        
        // Restore context
        ctx.restore();
    }

    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    updateLayout() {
        if (!this.isMobile) return;
        
        // Update button positions based on canvas size
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        const isTabletSize = window.innerWidth >= 768 && window.innerWidth <= 1024;
        
        // Adjust margins based on screen size
        const margin = isTabletSize ? 40 : 30;
        const buttonSpacing = isTabletSize ? 100 : 80;
        
        // Update positions
        this.buttons.forEach(button => {
            switch(button.id) {
                case 'left':
                    button.x = margin;
                    button.y = canvasHeight - buttonSpacing;
                    break;
                case 'right':
                    button.x = margin + buttonSpacing;
                    button.y = canvasHeight - buttonSpacing;
                    break;
                case 'jump':
                    button.x = canvasWidth - margin - (isTabletSize ? 90 : 80);
                    button.y = canvasHeight - (isTabletSize ? 140 : 120);
                    button.key = 'UP'; // Ensure key is correct
                    break;
                case 'throw':
                    button.x = canvasWidth - margin - (isTabletSize ? 90 : 80);
                    button.y = canvasHeight - (isTabletSize ? 70 : 60);
                    button.key = 'SPACE'; // Ensure key is correct
                    break;
            }
        });
    }
}
