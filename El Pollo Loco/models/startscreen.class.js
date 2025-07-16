class StartScreen {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.isActive = true;
        this.startImage = new Image();
        this.startImage.src = 'img/img_pollo_locco/img/9_intro_outro_screens/start/startscreen_1.png';
        this.imageLoaded = false;
        
        // Play button properties
        this.playButtonX = canvas.width / 2 - 100; // Center - half button width
        this.playButtonY = 60; // Moved higher up since no title
        this.playButtonWidth = 200;
        this.playButtonHeight = 60;
        this.playButtonHovered = false;
        
        // Animation properties
        this.pulseValue = 0;
        this.glowIntensity = 0.5;
        
        // Load image
        this.startImage.onload = () => {
            this.imageLoaded = true;
            console.log('[StartScreen] Background image loaded');
        };
        
        this.startImage.onerror = () => {
            console.warn('[StartScreen] Could not load background image');
            this.imageLoaded = false;
        };
        
        // Bind event listeners
        this.setupEventListeners();
        
        console.log('[StartScreen] Initialized');
    }
    
    /**
     * Set up mouse, touch and keyboard event listeners
     */
    setupEventListeners() {
        // Mouse move for button hover
        this.onMouseMove = (event) => {
            if (!this.isActive) return;
            
            let rect = this.canvas.getBoundingClientRect();
            let mouseX = event.clientX - rect.left;
            let mouseY = event.clientY - rect.top;
            
            // Scale mouse position based on canvas scaling
            mouseX = mouseX * (this.canvas.width / rect.width);
            mouseY = mouseY * (this.canvas.height / rect.height);
            
            // Check if mouse is over play button
            this.playButtonHovered = (
                mouseX >= this.playButtonX &&
                mouseX <= this.playButtonX + this.playButtonWidth &&
                mouseY >= this.playButtonY &&
                mouseY <= this.playButtonY + this.playButtonHeight
            );
            
            // Change cursor
            this.canvas.style.cursor = this.playButtonHovered ? 'pointer' : 'default';
        };
        
        // Mouse click for button
        this.onMouseClick = (event) => {
            if (!this.isActive) return;
            
            let rect = this.canvas.getBoundingClientRect();
            let mouseX = event.clientX - rect.left;
            let mouseY = event.clientY - rect.top;
            
            // Scale mouse position based on canvas scaling
            mouseX = mouseX * (this.canvas.width / rect.width);
            mouseY = mouseY * (this.canvas.height / rect.height);
            
            // Check if click is on play button
            if (mouseX >= this.playButtonX &&
                mouseX <= this.playButtonX + this.playButtonWidth &&
                mouseY >= this.playButtonY &&
                mouseY <= this.playButtonY + this.playButtonHeight) {
                this.startGame();
            }
        };
        
        // Touch event for button tap
        this.onTouchStart = (event) => {
            if (!this.isActive) return;
            
            // Prevent default to stop scrolling/zooming
            event.preventDefault();
            
            let rect = this.canvas.getBoundingClientRect();
            let touch = event.touches[0];
            let touchX = touch.clientX - rect.left;
            let touchY = touch.clientY - rect.top;
            
            // Scale touch position based on canvas scaling
            touchX = touchX * (this.canvas.width / rect.width);
            touchY = touchY * (this.canvas.height / rect.height);
            
            console.log('[StartScreen] Touch at:', touchX, touchY);
            console.log('[StartScreen] Button:', this.playButtonX, this.playButtonY, 
                       this.playButtonWidth, this.playButtonHeight);
            
            // Check if touch is on play button
            if (touchX >= this.playButtonX &&
                touchX <= this.playButtonX + this.playButtonWidth &&
                touchY >= this.playButtonY &&
                touchY <= this.playButtonY + this.playButtonHeight) {
                console.log('[StartScreen] Play button touched!');
                this.startGame();
            }
        };
        
        // Keyboard event for spacebar
        this.onKeyDown = (event) => {
            if (!this.isActive) return;
            
            if (event.code === 'Space') {
                event.preventDefault();
                this.startGame();
            }
        };
        
        // Add event listeners
        this.canvas.addEventListener('mousemove', this.onMouseMove);
        this.canvas.addEventListener('click', this.onMouseClick);
        this.canvas.addEventListener('touchstart', this.onTouchStart, { passive: false });
        document.addEventListener('keydown', this.onKeyDown);
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
        console.log('[StartScreen] Starting game...');
        this.isActive = false;
        this.removeEventListeners();
        
        // Trigger game start (will be called by external function)
        if (window.onStartGame) {
            window.onStartGame();
        }
    }
    
    /**
     * Update animation values
     */
    update() {
        if (!this.isActive) return;
        
        // Update pulse animation
        this.pulseValue = Math.sin(Date.now() * 0.003) * 0.1 + 1;
        
        // Update glow intensity
        this.glowIntensity = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;
    }
    
    /**
     * Draw the start screen
     */
    draw() {
        if (!this.isActive) return;
        
        this.ctx.save();
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background image if loaded
        if (this.imageLoaded) {
            this.ctx.drawImage(this.startImage, 0, 0, this.canvas.width, this.canvas.height);
        } else {
            // Fallback background
            this.ctx.fillStyle = '#87CEEB'; // Sky blue
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Loading text
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 24px Comic Sans MS';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Loading...', this.canvas.width / 2, this.canvas.height / 2);
        }
        
        // Draw title
        // this.drawTitle(); // Removed title from start screen
        
        // Draw play button
        this.drawPlayButton();
        
        // Draw instructions
        // this.drawInstructions(); // Removed instructions from start screen
        
        // Draw mobile controls if available
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
        
        // Title shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.font = 'bold 48px Comic Sans MS';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('EL POLLO LOCO', this.canvas.width / 2 + 3, 60 + 3);
        
        // Title main text with gradient effect
        let gradient = this.ctx.createLinearGradient(0, 30, 0, 70);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(0.5, '#FF8C00');
        gradient.addColorStop(1, '#FF4500');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillText('EL POLLO LOCO', this.canvas.width / 2, 60);
        
        // Title outline
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
        
        // Button scaling effect - combine hover and pulse
        let hoverScale = this.playButtonHovered ? 1.05 : 1;
        let pulseScale = this.pulseValue; // Already calculated in update()
        let totalScale = hoverScale * pulseScale;
        
        let buttonX = this.playButtonX + (this.playButtonWidth * (1 - totalScale)) / 2;
        let buttonY = this.playButtonY + (this.playButtonHeight * (1 - totalScale)) / 2;
        let buttonWidth = this.playButtonWidth * totalScale;
        let buttonHeight = this.playButtonHeight * totalScale;
        
        // Glow effect - combine hover and pulse
        if (this.playButtonHovered || this.glowIntensity > 0.6) {
            this.ctx.shadowColor = '#FFD700';
            this.ctx.shadowBlur = 15 + (this.glowIntensity * 10); // Pulsing glow
        }
        
        // Button background with gradient - add pulse effect to colors
        let buttonGradient = this.ctx.createLinearGradient(buttonX, buttonY, buttonX, buttonY + buttonHeight);
        let pulseIntensity = this.glowIntensity; // Use glow intensity for color pulsing
        
        if (this.playButtonHovered) {
            buttonGradient.addColorStop(0, `rgba(50, 205, 50, ${0.8 + pulseIntensity * 0.2})`);
            buttonGradient.addColorStop(1, `rgba(34, 139, 34, ${0.8 + pulseIntensity * 0.2})`);
        } else {
            buttonGradient.addColorStop(0, `rgba(76, 175, 80, ${0.7 + pulseIntensity * 0.3})`);
            buttonGradient.addColorStop(1, `rgba(56, 142, 60, ${0.7 + pulseIntensity * 0.3})`);
        }
        
        // Draw rounded rectangle button
        this.roundRect(buttonX, buttonY, buttonWidth, buttonHeight, 15);
        this.ctx.fillStyle = buttonGradient;
        this.ctx.fill();
        
        // Button border - add pulse effect
        let borderIntensity = this.glowIntensity;
        this.ctx.strokeStyle = this.playButtonHovered ? 
            `rgba(255, 215, 0, ${0.8 + borderIntensity * 0.2})` : 
            `rgba(46, 125, 50, ${0.6 + borderIntensity * 0.4})`;
        this.ctx.lineWidth = 2 + (borderIntensity * 2); // Pulsing border width
        this.ctx.stroke();
        
        // Reset shadow
        this.ctx.shadowBlur = 0;
        
        // Button text
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 28px Comic Sans MS';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Text shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillText('PLAY', buttonX + buttonWidth / 2 + 2, buttonY + buttonHeight / 2 + 2);
        
        // Main text
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillText('PLAY', buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
        
        this.ctx.restore();
    }
    
    /**
     * Draw instructions
     */
    drawInstructions() {
        this.ctx.save();
        
        // Instructions background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.roundRect(this.canvas.width / 2 - 200, this.canvas.height - 120, 400, 80, 10);
        this.ctx.fill();
        
        // Instructions text
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 18px Comic Sans MS';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Click PLAY or press SPACE to start', this.canvas.width / 2, this.canvas.height - 85);
        
        // Controls hint
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
