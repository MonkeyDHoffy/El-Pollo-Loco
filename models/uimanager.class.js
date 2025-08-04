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
        let scorePosition = this.calculateScorePosition();
        this.drawScoreBackground(scorePosition);
        this.drawScoreText(scorePosition);
        this.world.ctx.restore();
    }

    /**
     * Calculate score display position and dimensions
     * @returns {Object} Position and size information
     */
    calculateScorePosition() {
        return {
            x: this.world.canvas.width - 120,
            y: 30,
            width: 100,
            height: 35
        };
    }

    /**
     * Draw background and border for score display
     * @param {Object} pos - Position and size information
     */
    drawScoreBackground(pos) {
        this.world.ctx.fillStyle = '#FF6B35';
        this.roundRect(this.world.ctx, pos.x - 10, pos.y - 20, pos.width, pos.height, 8);
        this.world.ctx.fill();
        this.world.ctx.strokeStyle = '#E63946';
        this.world.ctx.lineWidth = 2;
        this.roundRect(this.world.ctx, pos.x - 10, pos.y - 20, pos.width, pos.height, 8);
        this.world.ctx.stroke();
    }

    /**
     * Draw score text with shadow effect
     * @param {Object} pos - Position information
     */
    drawScoreText(pos) {
        this.world.ctx.font = 'bold 24px Comic Sans MS';
        this.world.ctx.textAlign = 'center';
        this.world.ctx.fillStyle = '#8B1538';
        this.world.ctx.fillText(`${this.world.totalScore}`, pos.x + 40 + 2, pos.y + 2);
        this.world.ctx.fillStyle = '#FFFFFF';
        this.world.ctx.fillText(`${this.world.totalScore}`, pos.x + 40, pos.y);
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
        this.world.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.world.ctx.fillRect(0, 0, this.world.canvas.width, this.world.canvas.height);
        this.world.ctx.fillStyle = '#ff0000';
        this.world.ctx.font = 'bold 48px Comic Sans MS';
        this.world.ctx.textAlign = 'center';
        this.world.ctx.fillText('GAME OVER', this.world.canvas.width / 2, this.world.canvas.height / 2 - 80);
        this.world.ctx.fillStyle = '#ffffff';
        this.world.ctx.font = 'bold 24px Comic Sans MS';
        this.world.ctx.fillText(`Final Score: ${this.world.totalScore}`, this.world.canvas.width / 2, this.world.canvas.height / 2 - 20);
        if (isNewHighscore) {
            let pulseValue = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
            this.world.ctx.fillStyle = `rgba(255, 215, 0, ${pulseValue})`;
            this.world.ctx.fillText('🎉 NEW HIGHSCORE! 🎉', this.world.canvas.width / 2, this.world.canvas.height / 2 + 20);
            this.world.ctx.fillStyle = '#FFD700';
        } else {
            this.world.ctx.fillStyle = '#cccccc';
        }
        this.world.ctx.fillText(`Highscore: ${this.highscore}`, this.world.canvas.width / 2, this.world.canvas.height / 2 + 50);
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
        let y = 30;
        this.world.ctx.fillText(`Character X: ${Math.round(this.world.character.x)}`, 20, y);
        y += 15;
        this.world.ctx.fillText(`Character Y: ${Math.round(this.world.character.y)}`, 20, y);
        y += 15;
        this.world.ctx.fillText(`Enemies: ${this.world.level.enemies.length}`, 20, y);
        y += 15;
        this.world.ctx.fillText(`Endbosses: ${this.world.level.endboss.length}`, 20, y);
        y += 15;
        this.world.ctx.fillText(`Coins: ${this.world.character.coins}/${this.world.totalCoinsInLevel}`, 20, y);
        y += 15;
        this.world.ctx.fillText(`Bottles: ${this.world.character.bottles}/10`, 20, y);
        y += 15;
        this.world.ctx.fillText(`Score: ${this.world.totalScore}`, 20, y);
        y += 15;
        this.world.ctx.fillText(`FPS: ${this.world.fps || 'N/A'}`, 20, y);
        this.world.ctx.restore();
    }

    /**
     * Draw wave indicator in the center top of screen
     */
    drawWaveIndicator() {
        if (!this.world.waveManager) return;
        let waveInfo = this.world.waveManager.getWaveInfo();
        this.world.ctx.save();
        let indicatorConfig = this.calculateWaveIndicatorPosition();
        this.drawWaveIndicatorBackground(indicatorConfig, waveInfo);
        this.drawWaveIndicatorText(indicatorConfig, waveInfo);
        this.world.ctx.restore();
    }

    /**
     * Calculate wave indicator position and dimensions
     * @returns {Object} Indicator configuration
     */
    calculateWaveIndicatorPosition() {
        return {
            x: this.world.canvas.width / 2,
            y: 50,
            width: 200,
            height: 50
        };
    }

    /**
     * Draw background and border for wave indicator
     * @param {Object} config - Indicator configuration
     * @param {Object} waveInfo - Wave information
     */
    drawWaveIndicatorBackground(config, waveInfo) {
        this.world.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.roundRect(this.world.ctx, config.x - config.width/2, config.y - 30, config.width, config.height, 10);
        this.world.ctx.fill();
        let borderColor = (waveInfo.maxWaveReached && waveInfo.maxChickensReached) ? '#ff6b35' : '#4ECDC4';
        this.world.ctx.strokeStyle = borderColor;
        this.world.ctx.lineWidth = 3;
        this.roundRect(this.world.ctx, config.x - config.width/2, config.y - 30, config.width, config.height, 10);
        this.world.ctx.stroke();
    }

    /**
     * Draw wave indicator text content
     * @param {Object} config - Indicator configuration
     * @param {Object} waveInfo - Wave information
     */
    drawWaveIndicatorText(config, waveInfo) {
        this.drawWaveTitle(config, waveInfo);
    }

    /**
     * Draw wave title with shadow effect
     * @param {Object} config - Indicator configuration
     * @param {Object} waveInfo - Wave information
     */
    drawWaveTitle(config, waveInfo) {
        this.world.ctx.font = 'bold 20px Comic Sans MS';
        this.world.ctx.textAlign = 'center';
        this.world.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.world.ctx.fillText(`WAVE ${waveInfo.currentWave}`, config.x + 1, config.y - 5 + 1);
        this.world.ctx.fillStyle = '#FFFFFF';
        this.world.ctx.fillText(`WAVE ${waveInfo.currentWave}`, config.x, config.y - 5);
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
