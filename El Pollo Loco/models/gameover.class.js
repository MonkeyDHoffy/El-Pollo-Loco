class GameOver {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.isActive = false;
        this.showGameOverImage = false;
        this.showReplayScreen = false;
        this.finalScore = 0;
        
        // Load game over image
        this.gameOverImage = new Image();
        this.gameOverImage.src = 'img/img_pollo_locco/img/9_intro_outro_screens/game_over/game over.png';
        
        this.gameOverStartTime = 0;
        this.replayButton = {
            x: 0,
            y: 0,
            width: 200,
            height: 50
        };
        
        this.setupEventListeners();
    }

    /**
     * Start the game over sequence
     */
    startGameOver(finalScore) {
        this.isActive = true;
        this.showGameOverImage = true;
        this.showReplayScreen = false;
        this.finalScore = finalScore;
        this.gameOverStartTime = Date.now();
        
        // Pause the game immediately
        if (world) {
            world.isPaused = true;
        }
        
        console.log('[GameOver] Game Over started with score:', finalScore);
        
        // After 2 seconds, show orange screen with replay button
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
        // Fill entire canvas with orange
        this.ctx.fillStyle = '#FF8C00';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw final score
        this.ctx.save();
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 100);
        
        this.ctx.font = 'bold 32px Arial';
        this.ctx.fillText('Final Score: ' + this.finalScore, this.canvas.width / 2, this.canvas.height / 2 - 50);

        // Draw replay button
        this.drawReplayButton();
        
        this.ctx.restore();
    }

    /**
     * Draw replay button
     */
    drawReplayButton() {
        // Button background
        this.ctx.fillStyle = '#FF4500';
        this.ctx.fillRect(
            this.replayButton.x,
            this.replayButton.y,
            this.replayButton.width,
            this.replayButton.height
        );

        // Button border
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(
            this.replayButton.x,
            this.replayButton.y,
            this.replayButton.width,
            this.replayButton.height
        );

        // Button text
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
     * Setup event listeners
     */
    setupEventListeners() {
        this.onMouseClick = (event) => {
            if (!this.isActive || !this.showReplayScreen) return;

            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            // Check if click is on replay button
            if (x >= this.replayButton.x && 
                x <= this.replayButton.x + this.replayButton.width &&
                y >= this.replayButton.y && 
                y <= this.replayButton.y + this.replayButton.height) {
                this.restartGame();
            }
        };

        this.onKeyDown = (event) => {
            if (!this.isActive || !this.showReplayScreen) return;
            
            if (event.code === 'Space' || event.code === 'Enter') {
                event.preventDefault();
                this.restartGame();
            }
        };

        this.canvas.addEventListener('click', this.onMouseClick);
        document.addEventListener('keydown', this.onKeyDown);
    }

    /**
     * Remove event listeners
     */
    removeEventListeners() {
        this.canvas.removeEventListener('click', this.onMouseClick);
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
