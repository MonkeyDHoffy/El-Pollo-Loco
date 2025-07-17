/**
 * Manages game over screen display and replay functionality
 */
class GameOver {
    /**
     * Initialize game over manager
     * @param {HTMLCanvasElement} canvas - Game canvas element
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
     */
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        
        this.initializeGameOverState();
        this.initializeReplayButton();
        this.loadGameOverImage();
        this.setupEventListeners();
    }

    /**
     * Initialize game over state variables
     */
    initializeGameOverState() {
        this.isActive = false;
        this.showGameOverImage = false;
        this.showReplayScreen = false;
        this.finalScore = 0;
        this.gameOverStartTime = 0;
    }

    /**
     * Initialize replay button configuration
     */
    initializeReplayButton() {
        this.replayButton = {
            x: 0,
            y: 0,
            width: 200,
            height: 50
        };
    }

    /**
     * Load game over image asset
     */
    loadGameOverImage() {
        this.gameOverImage = new Image();
        this.gameOverImage.src = 'img/img_pollo_locco/img/9_intro_outro_screens/game_over/game over.png';
    }

    /**
     * Start the game over sequence
     * @param {number} finalScore - Player's final score
     */
    startGameOver(finalScore) {
        this.initializeGameOverSequence(finalScore);
        this.pauseGame();
        this.scheduleReplayScreen();
        
        console.log('[GameOver] Game Over started with score:', finalScore);
    }

    /**
     * Initialize game over sequence state
     * @param {number} finalScore - Player's final score
     */
    initializeGameOverSequence(finalScore) {
        this.isActive = true;
        this.showGameOverImage = true;
        this.showReplayScreen = false;
        this.finalScore = finalScore;
        this.gameOverStartTime = Date.now();
    }

    /**
     * Pause the game immediately
     */
    pauseGame() {
        if (world) {
            world.isPaused = true;
        }
    }

    /**
     * Schedule transition to replay screen after delay
     */
    scheduleReplayScreen() {
        setTimeout(() => {
            this.showGameOverImage = false;
            this.showReplayScreen = true;
            this.setupReplayButton();
        }, 2000);
    }

    /**
     * Setup replay button position
     */
    setupReplayButton() {
        this.replayButton.x = this.canvas.width / 2 - this.replayButton.width / 2;
        this.replayButton.y = this.canvas.height / 2 + 50;
    }

    /**
     * Draw game over screen
     */
    draw() {
        if (!this.isActive) return;

        if (this.showGameOverImage) {
            this.drawGameOverImage();
        } else if (this.showReplayScreen) {
            this.drawReplayScreen();
        }
    }

    /**
     * Draw game over image
     */
    drawGameOverImage() {
        // Draw game over image over entire canvas
        if (this.gameOverImage.complete) {
            this.ctx.drawImage(
                this.gameOverImage,
                0, 0,
                this.canvas.width,
                this.canvas.height
            );
        }
    }

    /**
     * Draw orange replay screen
     */
    drawReplayScreen() {
        this.drawReplayBackground();
        this.drawReplayText();
        this.drawReplayButton();
    }

    /**
     * Draw orange background for replay screen
     */
    drawReplayBackground() {
        this.ctx.fillStyle = '#FF8C00';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draw game over and score text
     */
    drawReplayText() {
        this.ctx.save();
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        
        this.ctx.font = 'bold 48px Arial';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 100);
        
        this.ctx.font = 'bold 32px Arial';
        this.ctx.fillText('Final Score: ' + this.finalScore, this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        this.ctx.restore();
    }

    /**
     * Draw replay button
     */
    drawReplayButton() {
        this.drawButtonBackground();
        this.drawButtonBorder();
        this.drawButtonText();
    }

    /**
     * Draw button background
     */
    drawButtonBackground() {
        this.ctx.fillStyle = '#FF4500';
        this.ctx.fillRect(
            this.replayButton.x,
            this.replayButton.y,
            this.replayButton.width,
            this.replayButton.height
        );
    }

    /**
     * Draw button border
     */
    drawButtonBorder() {
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(
            this.replayButton.x,
            this.replayButton.y,
            this.replayButton.width,
            this.replayButton.height
        );
    }

    /**
     * Draw button text
     */
    drawButtonText() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            'REPLAY',
            this.replayButton.x + this.replayButton.width / 2,
            this.replayButton.y + this.replayButton.height / 2 + 7
        );
    }

    /**
     * Setup event listeners for user interactions
     */
    setupEventListeners() {
        this.createMouseClickHandler();
        this.createTouchHandler();
        this.createKeyboardHandler();
        this.attachEventListeners();
    }

    /**
     * Create mouse click event handler
     */
    createMouseClickHandler() {
        this.onMouseClick = (event) => {
            if (!this.isActive || !this.showReplayScreen) return;

            const coordinates = this.getMouseCoordinates(event);
            if (this.isPointInReplayButton(coordinates.x, coordinates.y)) {
                this.restartGame();
            }
        };
    }

    /**
     * Get mouse coordinates scaled to canvas
     * @param {MouseEvent} event - Mouse event
     * @returns {Object} Scaled coordinates
     */
    getMouseCoordinates(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        return {
            x: (event.clientX - rect.left) * scaleX,
            y: (event.clientY - rect.top) * scaleY
        };
    }
    /**
     * Create touch event handler
     */
    createTouchHandler() {
        this.onTouchStart = (event) => {
            if (!this.isActive || !this.showReplayScreen) return;
            
            event.preventDefault();
            const coordinates = this.getTouchCoordinates(event);
            this.logTouchInfo(coordinates);
            
            if (this.isPointInReplayButton(coordinates.x, coordinates.y)) {
                console.log('[GameOver] Replay button touched!');
                this.restartGame();
            }
        };
    }

    /**
     * Get touch coordinates scaled to canvas
     * @param {TouchEvent} event - Touch event
     * @returns {Object} Scaled coordinates
     */
    getTouchCoordinates(event) {
        const rect = this.canvas.getBoundingClientRect();
        const touch = event.touches[0];
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        return {
            x: (touch.clientX - rect.left) * scaleX,
            y: (touch.clientY - rect.top) * scaleY
        };
    }

    /**
     * Log touch information for debugging
     * @param {Object} coordinates - Touch coordinates
     */
    logTouchInfo(coordinates) {
        console.log('[GameOver] Touch at:', coordinates.x, coordinates.y);
        console.log('[GameOver] Button:', this.replayButton.x, this.replayButton.y, 
                   this.replayButton.width, this.replayButton.height);
    }

    /**
     * Create keyboard event handler
     */
    createKeyboardHandler() {
        this.onKeyDown = (event) => {
            if (!this.isActive || !this.showReplayScreen) return;
            
            if (event.code === 'Space' || event.code === 'Enter') {
                event.preventDefault();
                this.restartGame();
            }
        };
    }

    /**
     * Attach all event listeners to their respective elements
     */
    attachEventListeners() {
        this.canvas.addEventListener('click', this.onMouseClick);
        this.canvas.addEventListener('touchstart', this.onTouchStart, { passive: false });
        document.addEventListener('keydown', this.onKeyDown);
    }

    /**
     * Check if point is within replay button bounds
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} True if point is in button
     */
    isPointInReplayButton(x, y) {
        return x >= this.replayButton.x && 
               x <= this.replayButton.x + this.replayButton.width &&
               y >= this.replayButton.y && 
               y <= this.replayButton.y + this.replayButton.height;
    }

    /**
     * Remove event listeners
     */
    removeEventListeners() {
        this.canvas.removeEventListener('click', this.onMouseClick);
        this.canvas.removeEventListener('touchstart', this.onTouchStart);
        document.removeEventListener('keydown', this.onKeyDown);
    }

    /**
     * Restart the game
     */
    restartGame() {
        console.log('[GameOver] Restarting game...');
        
        // Reset all game over states
        this.isActive = false;
        this.showGameOverImage = false;
        this.showReplayScreen = false;
        this.finalScore = 0;
        
        // Trigger game restart
        if (window.onGameRestart) {
            window.onGameRestart();
        }
    }

    /**
     * Check if game over is active
     */
    isGameOverActive() {
        return this.isActive;
    }
}
