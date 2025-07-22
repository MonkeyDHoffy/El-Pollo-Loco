/**
 * Start screen with interactive play button and background
 */
class StartScreen {
    /**
     * Creates a new start screen
     * @param {HTMLCanvasElement} canvas - Game canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.isActive = true;
        this.imageLoaded = false;
        this.initializeButton();
        this.initializeAnimation();
        this.loadBackgroundImage();
        this.setupEventListeners();
    }

    /**
     * Sets up play button properties
     */
    initializeButton() {
        this.playButtonX = this.canvas.width / 2 - 100;
        this.playButtonY = 60;
        this.playButtonWidth = 200;
        this.playButtonHeight = 60;
        this.playButtonHovered = false;
    }

    /**
     * Sets up animation properties
     */
    initializeAnimation() {
        this.pulseValue = 0;
        this.glowIntensity = 0.5;
    }

    /**
     * Loads the background image
     */
    loadBackgroundImage() {
        this.startImage = new Image();
        this.startImage.src = 'img/img_pollo_locco/img/9_intro_outro_screens/start/startscreen_1.png';
        
        this.startImage.onload = () => {
            this.imageLoaded = true;
        };
        
        this.startImage.onerror = () => {
            this.imageLoaded = false;
        };
    }
    
    /**
     * Sets up all event listeners for user interaction
     */
    setupEventListeners() {
        this.createMouseHandlers();
        this.createTouchHandlers();
        this.createKeyboardHandlers();
        this.attachEventListeners();
    }

    /**
     * Creates mouse event handlers
     */
    createMouseHandlers() {
        this.onMouseMove = (event) => {
            if (!this.isActive) return;       
            let mousePos = this.getMousePosition(event);
            this.updateButtonHover(mousePos.x, mousePos.y);
        };
        
        this.onMouseClick = (event) => {
            if (!this.isActive) return;        
            let mousePos = this.getMousePosition(event);
            this.handleButtonClick(mousePos.x, mousePos.y);
        };
    }

    /**
     * Creates touch event handlers
     */
    createTouchHandlers() {
        this.onTouchStart = (event) => {
            if (!this.isActive) return;           
            event.preventDefault();
            let touchPos = this.getTouchPosition(event);
            this.handleButtonClick(touchPos.x, touchPos.y);
        };
    }

    /**
     * Creates keyboard event handlers
     */
    createKeyboardHandlers() {
        this.onKeyDown = (event) => {
            if (!this.isActive) return;
            
            if (event.code === 'Space') {
                event.preventDefault();
                this.startGame();
            }
        };
    }

    /**
     * Attaches all event listeners to DOM elements
     */
    attachEventListeners() {
        this.canvas.addEventListener('mousemove', this.onMouseMove);
        this.canvas.addEventListener('click', this.onMouseClick);
        this.canvas.addEventListener('touchstart', this.onTouchStart, { passive: false });
        document.addEventListener('keydown', this.onKeyDown);
    }

    /**
     * Gets scaled mouse position relative to canvas
     * @param {MouseEvent} event - Mouse event
     * @returns {Object} Scaled mouse coordinates
     */
    getMousePosition(event) {
        let rect = this.canvas.getBoundingClientRect();
        let mouseX = event.clientX - rect.left;
        let mouseY = event.clientY - rect.top;
        
        return {
            x: mouseX * (this.canvas.width / rect.width),
            y: mouseY * (this.canvas.height / rect.height)
        };
    }

    /**
     * Gets scaled touch position relative to canvas
     * @param {TouchEvent} event - Touch event
     * @returns {Object} Scaled touch coordinates
     */
    getTouchPosition(event) {
        let rect = this.canvas.getBoundingClientRect();
        let touch = event.touches[0];
        let touchX = touch.clientX - rect.left;
        let touchY = touch.clientY - rect.top;
        
        return {
            x: touchX * (this.canvas.width / rect.width),
            y: touchY * (this.canvas.height / rect.height)
        };
    }

    /**
     * Updates button hover state based on mouse position
     * @param {number} x - Mouse x position
     * @param {number} y - Mouse y position
     */
    updateButtonHover(x, y) {
        this.playButtonHovered = this.isPointInButton(x, y);
        this.canvas.style.cursor = this.playButtonHovered ? 'pointer' : 'default';
    }

    /**
     * Handles button click if click is within button bounds
     * @param {number} x - Click x position
     * @param {number} y - Click y position
     */
    handleButtonClick(x, y) {
        if (this.isPointInButton(x, y)) {
            this.startGame();
        }
    }

    /**
     * Checks if a point is within button bounds
     * @param {number} x - Point x position
     * @param {number} y - Point y position
     * @returns {boolean} True if point is in button
     */
    isPointInButton(x, y) {
        return x >= this.playButtonX &&
               x <= this.playButtonX + this.playButtonWidth &&
               y >= this.playButtonY &&
               y <= this.playButtonY + this.playButtonHeight;
    }
    
    /**
     * Remove event listeners
     */
    removeEventListeners() {
        this.canvas.removeEventListener('mousemove', this.onMouseMove);
        this.canvas.removeEventListener('click', this.onMouseClick);
        this.canvas.removeEventListener('touchstart', this.onTouchStart);
        document.removeEventListener('keydown', this.onKeyDown);
        this.canvas.style.cursor = 'default';
    }
    
    /**
     * Start the game
     */
    startGame() {
        this.isActive = false;
        this.removeEventListeners();
        if (window.onStartGame) {
            window.onStartGame();
        }
    }
    
    /**
     * Update animation values
     */
    update() {
        if (!this.isActive) return;
        this.pulseValue = Math.sin(Date.now() * 0.003) * 0.1 + 1;
        this.glowIntensity = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;
    }
    
    /**
     * Draw the start screen
     */
    draw() {
        if (!this.isActive) return;
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.imageLoaded) {
            this.ctx.drawImage(this.startImage, 0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.ctx.fillStyle = '#87CEEB';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 24px Comic Sans MS';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Loading...', this.canvas.width / 2, this.canvas.height / 2);
        }
        this.drawPlayButton();
        if (window.mobileControls) {
            window.mobileControls.draw();
        }
        this.ctx.restore();
    }
    
    /**
     * Draw the game title
     */
    drawTitle() {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.font = 'bold 48px Comic Sans MS';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('EL POLLO LOCO', this.canvas.width / 2 + 3, 63);
        let gradient = this.ctx.createLinearGradient(0, 30, 0, 70);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(0.5, '#FF8C00');
        gradient.addColorStop(1, '#FF4500');
        this.ctx.fillStyle = gradient;
        this.ctx.fillText('EL POLLO LOCO', this.canvas.width / 2, 60);
        this.ctx.strokeStyle = '#8B0000';
        this.ctx.lineWidth = 3;
        this.ctx.strokeText('EL POLLO LOCO', this.canvas.width / 2, 60);
        this.ctx.restore();
    }
    
    /**
     * Draw the play button
     */
    drawPlayButton() {
        this.ctx.save();
        let hoverScale = this.playButtonHovered ? 1.05 : 1;
        let pulseScale = this.pulseValue;
        let totalScale = hoverScale * pulseScale;
        let buttonX = this.playButtonX + (this.playButtonWidth * (1 - totalScale)) / 2;
        let buttonY = this.playButtonY + (this.playButtonHeight * (1 - totalScale)) / 2;
        let buttonWidth = this.playButtonWidth * totalScale;
        let buttonHeight = this.playButtonHeight * totalScale;
        if (this.playButtonHovered || this.glowIntensity > 0.6) {
            this.ctx.shadowColor = '#FFD700';
            this.ctx.shadowBlur = 15 + (this.glowIntensity * 10);
        }
        let buttonGradient = this.ctx.createLinearGradient(buttonX, buttonY, buttonX, buttonY + buttonHeight);
        let pulseIntensity = this.glowIntensity;
        if (this.playButtonHovered) {
            buttonGradient.addColorStop(0, `rgba(50, 205, 50, ${0.8 + pulseIntensity * 0.2})`);
            buttonGradient.addColorStop(1, `rgba(34, 139, 34, ${0.8 + pulseIntensity * 0.2})`);
        } else {
            buttonGradient.addColorStop(0, `rgba(76, 175, 80, ${0.7 + pulseIntensity * 0.3})`);
            buttonGradient.addColorStop(1, `rgba(56, 142, 60, ${0.7 + pulseIntensity * 0.3})`);
        }
        this.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 15);
        this.ctx.fillStyle = buttonGradient;
        this.ctx.fill();
        let borderIntensity = this.glowIntensity;
        this.ctx.strokeStyle = this.playButtonHovered ?
            `rgba(255, 215, 0, ${0.8 + borderIntensity * 0.2})` :
            `rgba(46, 125, 50, ${0.6 + borderIntensity * 0.4})`;
        this.ctx.lineWidth = 2 + (borderIntensity * 2);
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 28px Comic Sans MS';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillText('PLAY', buttonX + buttonWidth / 2 + 2, buttonY + buttonHeight / 2 + 2);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillText('PLAY', buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
        this.ctx.restore();
    }
    
    /**
     * Draw instructions
     */
    drawInstructions() {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.roundRect(this.canvas.width / 2 - 200, this.canvas.height - 120, 400, 80, 10);
        this.ctx.fill();
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 18px Comic Sans MS';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Click PLAY or press SPACE to start', this.canvas.width / 2, this.canvas.height - 85);
        this.ctx.font = 'bold 14px Comic Sans MS';
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillText('Use ARROW KEYS to move, SPACE to jump, D to throw', this.canvas.width / 2, this.canvas.height - 60);
        this.ctx.restore();
    }
    
    /**
     * Helper function to draw rounded rectangles
     */
    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }
    
    /**
     * Check if start screen is active
     */
    isStartScreenActive() {
        return this.isActive;
    }
    
    /**
     * Hide the start screen
     */
    hide() {
        this.isActive = false;
        this.removeEventListeners();
    }
}
