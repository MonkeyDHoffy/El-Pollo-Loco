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
            actionTopOffset: isTabletSize ? 220 : 200 // Spacing for action buttons
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
        let { margin, actionButtonOffset, actionTopOffset } = positions;
        let { actionButtonStyle } = styling;
        let buttonY = canvasHeight - actionTopOffset;
        let jumpX = canvasWidth - margin - actionButtonOffset;
        this.buttons.push({
            id: 'jump',
            x: jumpX,
            y: buttonY,
            ...actionButtonStyle,
            text: 'JUMP',
            key: 'UP'
        });
        let throwX = jumpX - actionButtonStyle.width - 20;
        this.buttons.push({
            id: 'throw',
            x: throwX,
            y: buttonY, // Gleiche Y-Position wie Jump button
            ...actionButtonStyle,
            text: 'THROW',
            key: 'SPACE'
        });
        console.log('Action buttons created:', {
            jump: { x: jumpX, y: buttonY },
            throw: { x: throwX, y: buttonY }
        });
    }

    setupEventListeners() {
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
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
    let currentTouchIds = new Set();
        for (let i = 0; i < touches.length; i++) {
            currentTouchIds.add(touches[i].identifier);
        }
        for (let [touchId, button] of this.activeTouches) {
            if (!currentTouchIds.has(touchId)) {
                button.pressed = false;
                if (window.keyboard) {
                    window.keyboard[button.key] = false;
                }
                this.activeTouches.delete(touchId);
            }
        }
        for (let i = 0; i < touches.length; i++) {
    let touch = touches[i];
    let rect = this.canvas.getBoundingClientRect();
    let scaleX = this.canvas.width / rect.width;
    let scaleY = this.canvas.height / rect.height;
    let x = (touch.clientX - rect.left) * scaleX;
    let y = (touch.clientY - rect.top) * scaleY;
    let currentButton = this.getButtonAtPosition(x, y);
    let previousButton = this.activeTouches.get(touch.identifier);
            if (currentButton !== previousButton) {
                if (previousButton) {
                    previousButton.pressed = false;
                    if (window.keyboard) {
                        window.keyboard[previousButton.key] = false;
                    }
                }
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
    let remainingTouchIds = new Set();
        for (let i = 0; i < touches.length; i++) {
            remainingTouchIds.add(touches[i].identifier);
        }
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
        this.buttons.forEach(button => {
            button.pressed = false;
            if (window.keyboard) {
                window.keyboard[button.key] = false;
            }
        });
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
        MobileButtonRenderer.drawButton(this.ctx, button);
    }
    updateLayout() {
        if (!this.isMobile) return;
        let canvasWidth = this.canvas.width;
        let canvasHeight = this.canvas.height;
        let isTabletSize = window.innerWidth >= 768 && window.innerWidth <= 1024;
        let margin = isTabletSize ? 40 : 30;
        let buttonSpacing = isTabletSize ? 140 : 120; // Increased horizontal spacing

        this.buttons.forEach(button => {
            this.updateButtonPosition(button, canvasWidth, canvasHeight, margin, buttonSpacing, isTabletSize);
        });
    }

    updateButtonPosition(button, canvasWidth, canvasHeight, margin, buttonSpacing, isTabletSize) {
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
                this.updateJumpButtonLayout(button, canvasWidth, canvasHeight, margin, isTabletSize);
                break;
            case 'throw':
                this.updateThrowButtonLayout(button, canvasWidth, canvasHeight, margin, isTabletSize);
                break;
        }
    }

    updateJumpButtonLayout(button, canvasWidth, canvasHeight, margin, isTabletSize) {
        let jumpX = canvasWidth - margin - (isTabletSize ? 90 : 80);
        let buttonY = canvasHeight - (isTabletSize ? 220 : 200);
        button.x = jumpX;
        button.y = buttonY;
        button.key = 'UP';
    }

    updateThrowButtonLayout(button, canvasWidth, canvasHeight, margin, isTabletSize) {
        let throwJumpX = canvasWidth - margin - (isTabletSize ? 90 : 80);
        let throwButtonY = canvasHeight - (isTabletSize ? 220 : 200);
        let buttonWidth = isTabletSize ? 110 : 100;
        button.x = throwJumpX - buttonWidth - 20; // 20px Abstand
        button.y = throwButtonY; // Gleiche Y-Position wie Jump
        button.key = 'SPACE';
    }
}
