/**
 * Manages all UI elements including score display, wave indicators, and buttons
 */
class UIManager {
    /**
     * Initialize UI manager with world reference
     * @param {World} world - Game world instance
     */
    constructor(world) {
        this.world = world;
        this.initializeButtons();
        this.initializeMuteState();
        this.setupButtonEventListeners();
    }

    /**
     * Initialize button definitions with positions and styles
     */
    initializeButtons() {
        this.buttons = {
            pause: this.createButtonConfig(180, 'PAUSE'),
            fullscreen: this.createButtonConfig(120, 'SCREEN'),
            mute: this.createButtonConfig(60, 'MUTE')
        };
    }

    /**
     * Creates button configuration object
     * @param {number} rightOffset - Offset from right edge of canvas
     * @param {string} text - Button text
     * @returns {Object} Button configuration
     */
    createButtonConfig(rightOffset, text) {
        return {
            x: this.world.canvas.width - rightOffset,
            y: 50,
            width: 50,
            height: 25,
            text: text
        };
    }

    /**
     * Initialize mute state from localStorage
     */
    initializeMuteState() {
        this.isMuted = localStorage.getItem('elPolloLocoMuted') === 'true';
        this.updateMuteState();
        this.initializeHighscore();
    }

    /**
     * Initialize highscore from localStorage with default value of 500
     */
    initializeHighscore() {
        const storedHighscore = localStorage.getItem('elPolloLocoHighscore');
        this.highscore = storedHighscore ? parseInt(storedHighscore) : 500;
    }

    /**
     * Update highscore if current score is higher
     * @param {number} currentScore - The current game score
     */
    updateHighscore(currentScore) {
        if (currentScore > this.highscore) {
            this.highscore = currentScore;
            localStorage.setItem('elPolloLocoHighscore', this.highscore.toString());
            return true;
        }
        return false;
    }

    /**
     * Draw all UI elements
     */
    drawUI() {
        this.drawMexicanScore();
        this.drawWaveIndicator();
        this.drawComboIndicator();
        this.drawCanvasButtons();
        if (this.world.isPaused) {
            this.drawPauseOverlay();
        }
        if (this.world.character.showWrongDirectionWarning) {
            this.drawWrongDirectionWarning();
        }
        if (this.waveChangeNotification) {
            this.drawWaveChangeNotification();
        }
    }

    /**
     * Draw the Mexican-styled score display
     */
    drawMexicanScore() {
        this.world.ctx.save();
        let scorePosition = calculateScorePosition(this);
        drawScoreBackground(this, scorePosition);
        drawScoreText(this, scorePosition);
        this.world.ctx.restore();
    }

    /**
     * Draw rounded rectangle helper function
     */
    roundRect(ctx, x, y, width, height, radius) {
        roundRect(ctx, x, y, width, height, radius);
    }

    /**
     * Draw pause overlay
     */
    drawPauseOverlay() {
        drawPauseOverlay(this.world);
    }

    /**
     * Draw wrong direction warning
     */
    drawWrongDirectionWarning() {
        drawWrongDirectionWarning(this.world);
    }

    /**
     * Draw game over screen
     */
    drawGameOverScreen() {
        this.world.ctx.save();
        let isNewHighscore = this.updateHighscore(this.world.totalScore);
        drawGameOverBackground(this);
        drawGameOverTexts(this, isNewHighscore);
        this.world.ctx.restore();
    }

    /**
     * Draw level complete screen
     */
    drawLevelCompleteScreen() {
        drawLevelCompleteScreen(this.world);
    }

    /**
     * Draw debug information
     */
    drawDebugInfo() {
        if (!this.world.debugMode) return;
        this.world.ctx.save();
        this.world.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.world.ctx.fillRect(10, 10, 200, 150);
        this.world.ctx.fillStyle = '#ffffff';
        this.world.ctx.font = '12px Arial';
        this.world.ctx.textAlign = 'left';
        drawDebugTextLines(this);
        this.world.ctx.restore();
    }

    /**
     * Draw wave indicator in the center top of screen
     */
    drawWaveIndicator() {
        if (!this.world.waveManager) return;
        let waveInfo = this.world.waveManager.getWaveInfo();
        this.world.ctx.save();
        let indicatorConfig = calculateWaveIndicatorPosition(this);
        drawWaveIndicatorBackground(this, indicatorConfig, waveInfo);
        drawWaveIndicatorText(this, indicatorConfig, waveInfo);
        this.world.ctx.restore();
    }

    /**
     * Draw combo indicator when combo > 0 or during grace period
     */
    drawComboIndicator() {
        drawComboIndicator(this);
    }

    /**
     * Show wave change notification
     */
    showWaveChangeNotification(wave) {
        this.waveChangeNotification = {
            wave: wave,
            startTime: Date.now(),
            duration: 3000
        };
    }

    /**
     * Draw wave change notification
     */
    drawWaveChangeNotification() {
        if (!this.waveChangeNotification) return;
        let elapsed = Date.now() - this.waveChangeNotification.startTime;
        if (elapsed > this.waveChangeNotification.duration) {
            this.waveChangeNotification = null;
            return;
        }
        this.world.ctx.save();
        let alpha = Math.max(0, 1 - elapsed / this.waveChangeNotification.duration);
        let centerX = this.world.canvas.width / 2;
        let centerY = this.world.canvas.height / 2 - 50;
        this.world.ctx.font = 'bold 36px Comic Sans MS';
        this.world.ctx.textAlign = 'center';
        this.world.ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.8})`;
        this.world.ctx.fillText(`WAVE ${this.waveChangeNotification.wave}`, centerX + 3, centerY + 3);
        this.world.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        this.world.ctx.fillText(`WAVE ${this.waveChangeNotification.wave}`, centerX, centerY);
        this.world.ctx.restore();
    }

    /**
     * Draw canvas buttons (pause, fullscreen, mute)
     */
    drawCanvasButtons() {
        this.world.ctx.save();
        this.buttons.pause.text = this.world.isPaused ? 'RESUME' : 'PAUSE';
        this.buttons.mute.text = this.isMuted ? '🔇' : '🔊';
        Object.values(this.buttons).forEach(button => {
            this.drawButton(button);
        });
        this.world.ctx.restore();
    }

    /**
     * Draw individual button
     */
    drawButton(button) {
        this.world.ctx.fillStyle = '#FF6B35';
        this.roundRect(this.world.ctx, button.x, button.y, button.width, button.height, 5);
        this.world.ctx.fill();
        this.world.ctx.strokeStyle = '#E63946';
        this.world.ctx.lineWidth = 1;
        this.roundRect(this.world.ctx, button.x, button.y, button.width, button.height, 5);
        this.world.ctx.stroke();
        this.world.ctx.fillStyle = 'white';
        this.world.ctx.textAlign = 'center';
        this.drawButtonText(button);
    }

    /**
     * Draw button text (icon or label)
     */
    drawButtonText(button) {
        if (button.text === '🔇' || button.text === '🔊') {
            this.world.ctx.font = 'bold 20px Arial';
            this.world.ctx.fillText(
                button.text,
                button.x + button.width / 2,
                button.y + button.height / 2 + 6
            );
        } else {
            this.world.ctx.font = 'bold 10px Arial';
            this.world.ctx.fillText(
                button.text,
                button.x + button.width / 2,
                button.y + button.height / 2 + 3
            );
        }
    }

    /**
     * Setup event listeners for canvas buttons
     */
    setupButtonEventListeners() {
        setupButtonEventListeners(this);
    }

    /**
     * Check if point is inside button
     */
    isPointInButton(x, y, button) {
        return isPointInButton(x, y, button);
    }

    /**
     * Handle pause button click
     */
    handlePauseButton() {
        handlePauseButton(this);
    }

    /**
     * Handle fullscreen button click
     */
    handleFullscreenButton() {
        handleFullscreenButton(this);
    }

    /**
     * Handle mute button click
     */
    handleMuteButton() {
        handleMuteButton(this);
    }

    /**
     * Update mute state in audio manager
     */
    updateMuteState() {
        updateMuteState(this);
    }

    /**
     * Remove event listeners (cleanup)
     */
    removeEventListeners() {
        removeEventListeners(this);
    }
}
