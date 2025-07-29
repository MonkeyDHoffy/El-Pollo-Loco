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
    let wasMobile = this.isMobile;
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
    let isMobileDevice = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    let isSmallScreen = window.innerWidth <= 1024;
        
        return isMobileDevice || isSmallScreen;
    }

    /**
     * Sets up button layout and styling
     */
    setupButtons() {
    let canvasWidth = this.canvas.width;
    let canvasHeight = this.canvas.height;
        
    let styling = this.getButtonStyling();
    let positions = this.calculateButtonPositions(canvasWidth, canvasHeight, styling);
        
        this.createMovementButtons(positions, styling);
        this.createActionButtons(positions, styling, canvasWidth, canvasHeight);
    }

    /**
     * Gets button styling based on screen size
     * @returns {Object} Button styling configuration
     */
    getButtonStyling() {
    let isTabletSize = window.innerWidth >= 768 && window.innerWidth <= 1024;
        
        return {
            isTabletSize,
            buttonStyle: {
                width: isTabletSize ? 90 : 80,
                height: isTabletSize ? 90 : 80,
                radius: 15,
                color: '#E63946', // Mexikanisches Rot
                borderColor: '#FFF700', // Mexikanisches Gelb
                textColor: 'white',
                font: isTabletSize ? 'bold 18px Comic Sans MS' : 'bold 16px Comic Sans MS'
            },
            actionButtonStyle: {
                width: isTabletSize ? 110 : 100,
                height: isTabletSize ? 80 : 70,
                radius: 15,
                color: '#43AA8B', // Mexikanisches Grün
                borderColor: '#F77F00', // Mexikanisches Orange
                textColor: 'white',
                font: isTabletSize ? 'bold 16px Comic Sans MS' : 'bold 14px Comic Sans MS'
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
    let { isTabletSize } = styling;
        
        return {
            margin: isTabletSize ? 40 : 30,
            buttonSpacing: isTabletSize ? 140 : 120, // Increased horizontal spacing between left/right buttons
            actionButtonOffset: isTabletSize ? 90 : 80,
            actionTopOffset: isTabletSize ? 220 : 200, // Much more spacing for jump button
            actionBottomOffset: isTabletSize ? 180 : 120 // Throw button moved even higher
        };
    }

    /**
     * Creates movement control buttons
     * @param {Object} positions - Position configuration
     * @param {Object} styling - Button styling
     */
    createMovementButtons(positions, styling) {
    let { margin, buttonSpacing } = positions;
    let { buttonStyle } = styling;
        
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
    let { margin, actionButtonOffset, actionTopOffset, actionBottomOffset } = positions;
    let { actionButtonStyle } = styling;

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
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        
        // Mouse events for testing
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // Track active touches
        this.activeTouches = new Map();
        this.isMouseDown = false;
    }

    handleTouchStart(e) {
        e.preventDefault();
    let touches = e.touches;
        
        for (let i = 0; i < touches.length; i++) {
    let touch = touches[i];
    let rect = this.canvas.getBoundingClientRect();
    let scaleX = this.canvas.width / rect.width;
    let scaleY = this.canvas.height / rect.height;
            
    let x = (touch.clientX - rect.left) * scaleX;
    let y = (touch.clientY - rect.top) * scaleY;
            
            // Store this touch with its pressed button
    let pressedButton = this.getButtonAtPosition(x, y);
            if (pressedButton) {
                this.activeTouches.set(touch.identifier, pressedButton);
                this.handleButtonPress(x, y, true);
            }
        }
    }

    handleTouchMove(e) {
        e.preventDefault();
    let touches = e.touches;
        
        // First, check which touches are still active
    let currentTouchIds = new Set();
        for (let i = 0; i < touches.length; i++) {
            currentTouchIds.add(touches[i].identifier);
        }
        
        // Release buttons for touches that are no longer active
        for (let [touchId, button] of this.activeTouches) {
            if (!currentTouchIds.has(touchId)) {
                button.pressed = false;
                if (window.keyboard) {
                    window.keyboard[button.key] = false;
                }
                this.activeTouches.delete(touchId);
            }
        }
        
        // Process current touches
        for (let i = 0; i < touches.length; i++) {
    let touch = touches[i];
    let rect = this.canvas.getBoundingClientRect();
    let scaleX = this.canvas.width / rect.width;
    let scaleY = this.canvas.height / rect.height;
            
    let x = (touch.clientX - rect.left) * scaleX;
    let y = (touch.clientY - rect.top) * scaleY;
            
    let currentButton = this.getButtonAtPosition(x, y);
    let previousButton = this.activeTouches.get(touch.identifier);
            
            // If touch moved to a different button
            if (currentButton !== previousButton) {
                // Release previous button
                if (previousButton) {
                    previousButton.pressed = false;
                    if (window.keyboard) {
                        window.keyboard[previousButton.key] = false;
                    }
                }
                
                // Press new button
                if (currentButton) {
                    currentButton.pressed = true;
                    if (window.keyboard) {
                        window.keyboard[currentButton.key] = true;
                    }
                    this.activeTouches.set(touch.identifier, currentButton);
                } else {
                    this.activeTouches.delete(touch.identifier);
                }
            }
        }
    }

    handleTouchEnd(e) {
        e.preventDefault();
    let touches = e.touches;
        
        // Get remaining touch IDs
    let remainingTouchIds = new Set();
        for (let i = 0; i < touches.length; i++) {
            remainingTouchIds.add(touches[i].identifier);
        }
        
        // Release buttons for touches that ended
        for (let [touchId, button] of this.activeTouches) {
            if (!remainingTouchIds.has(touchId)) {
                button.pressed = false;
                if (window.keyboard) {
                    window.keyboard[button.key] = false;
                }
                this.activeTouches.delete(touchId);
            }
        }
    }

    handleMouseDown(e) {
    let rect = this.canvas.getBoundingClientRect();
    let scaleX = this.canvas.width / rect.width;
    let scaleY = this.canvas.height / rect.height;
        
    let x = (e.clientX - rect.left) * scaleX;
    let y = (e.clientY - rect.top) * scaleY;
        
        this.isMouseDown = true;
        this.handleButtonPress(x, y, true);
    }

    handleMouseMove(e) {
        if (!this.isMouseDown) return;
        
    let rect = this.canvas.getBoundingClientRect();
    let scaleX = this.canvas.width / rect.width;
    let scaleY = this.canvas.height / rect.height;
        
    let x = (e.clientX - rect.left) * scaleX;
    let y = (e.clientY - rect.top) * scaleY;
        
        // Release all buttons first
        this.buttons.forEach(button => {
            button.pressed = false;
            if (window.keyboard) {
                window.keyboard[button.key] = false;
            }
        });
        
        // Press button at current position
        this.handleButtonPress(x, y, true);
    }

    handleMouseUp(e) {
        this.isMouseDown = false;
        this.buttons.forEach(button => {
            if (button.pressed) {
                button.pressed = false;
                if (window.keyboard) {
                    window.keyboard[button.key] = false;
                }
            }
        });
    }

    getButtonAtPosition(x, y) {
        return this.buttons.find(button => this.isPointInButton(x, y, button));
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
    let ctx = this.ctx;
        
        // Save context
        ctx.save();
        
        // Set global alpha for 60% transparency (20% more visible)
        ctx.globalAlpha = 0.60;
        
        // Button background - Mexikanische Farbverläufe
    let gradient = ctx.createLinearGradient(
            button.x, button.y, 
            button.x, button.y + button.height
        );
        
        if (button.pressed) {
            // Gedrückte Buttons - dunklere mexikanische Töne
            if (button.id === 'jump' || button.id === 'throw') {
                gradient.addColorStop(0, '#2D7D68'); // Dunkleres Grün
                gradient.addColorStop(1, '#1B4D3E');
            } else {
                gradient.addColorStop(0, '#C62E3A'); // Dunkleres Rot
                gradient.addColorStop(1, '#8B1E2B');
            }
        } else {
            // Normale Buttons - lebendige mexikanische Farben
            if (button.id === 'jump' || button.id === 'throw') {
                gradient.addColorStop(0, '#43AA8B'); // Mexikanisches Grün
                gradient.addColorStop(0.5, '#52C69B'); // Heller in der Mitte
                gradient.addColorStop(1, '#3A9B7A'); // Dunkler unten
            } else {
                gradient.addColorStop(0, '#E63946'); // Mexikanisches Rot
                gradient.addColorStop(0.5, '#F04A5A'); // Heller in der Mitte  
                gradient.addColorStop(1, '#D32F2F'); // Dunkler unten
            }
        }
        
        // Draw button
        ctx.fillStyle = gradient;
        ctx.strokeStyle = button.borderColor;
        ctx.lineWidth = 4; // Dickere Umrandung für mexikanischen Look
        
        this.roundRect(ctx, button.x, button.y, button.width, button.height, button.radius);
        ctx.fill();
        ctx.stroke();
        
        // Mexikanischer Glow-Effekt mit warmen Farben
        ctx.shadowColor = 'rgba(247, 127, 0, 0.4)'; // Orangener Schatten
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 3;
        
        // Button text mit mexikanischem Text-Schatten
        ctx.fillStyle = button.textColor;
        ctx.font = button.font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Doppelter Schatten für mexikanischen 3D-Effekt
        ctx.shadowColor = 'rgba(139, 30, 43, 0.8)'; // Dunkles Rot
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
    let centerX = button.x + button.width / 2;
    let centerY = button.y + button.height / 2;
        
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
    let canvasWidth = this.canvas.width;
    let canvasHeight = this.canvas.height;
    let isTabletSize = window.innerWidth >= 768 && window.innerWidth <= 1024;
        
        // Adjust margins based on screen size
    let margin = isTabletSize ? 40 : 30;
    let buttonSpacing = isTabletSize ? 140 : 120; // Increased horizontal spacing
        
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
                    button.y = canvasHeight - (isTabletSize ? 220 : 200); // Much more spacing
                    button.key = 'UP'; // Ensure key is correct
                    break;
                case 'throw':
                    button.x = canvasWidth - margin - (isTabletSize ? 90 : 80);
                    button.y = canvasHeight - (isTabletSize ? 100 : 80); // More spacing
                    button.key = 'SPACE'; // Ensure key is correct
                    break;
            }
        });
    }
}
