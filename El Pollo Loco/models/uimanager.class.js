class UIManager {
    constructor(world) {
        this.world = world;
        
        // Canvas button definitions
        this.buttons = {
            pause: {
                x: this.world.canvas.width - 180,
                y: 50,
                width: 50,
                height: 25,
                text: 'PAUSE'
            },
            fullscreen: {
                x: this.world.canvas.width - 120,
                y: 50,
                width: 50,
                height: 25,
                text: 'FULL'
            },
            mute: {
                x: this.world.canvas.width - 60,
                y: 50,
                width: 50,
                height: 25,
                text: 'MUTE'
            }
        };
        
        // Load mute state from localStorage
        this.isMuted = localStorage.getItem('elPolloLocoMuted') === 'true';
        this.updateMuteState();
        
        // Setup click event listener
        this.setupButtonEventListeners();
    }

    /**
     * Draw all UI elements
     */
    drawUI() {
        this.drawMexicanScore();
        this.drawWaveIndicator(); // Add wave indicator
        this.drawComboIndicator(); // Add combo indicator
        this.drawCanvasButtons(); // Add canvas buttons
        
        if (this.world.isPaused) {
            this.drawPauseOverlay();
        }

        if (this.world.character.showWrongDirectionWarning) {
            this.drawWrongDirectionWarning();
        }

        // Draw wave change notification if active
        if (this.waveChangeNotification) {
            this.drawWaveChangeNotification();
        }
    }

    /**
     * Draw the Mexican-styled score display
     */
    drawMexicanScore() {
        this.world.ctx.save();
        
        let scoreX = this.world.canvas.width - 120;
        let scoreY = 30;
        let boxWidth = 100;
        let boxHeight = 35;
        
        // Simple rounded background
        this.world.ctx.fillStyle = '#FF6B35';
        this.roundRect(this.world.ctx, scoreX - 10, scoreY - 20, boxWidth, boxHeight, 8);
        this.world.ctx.fill();
        
        // Simple border
        this.world.ctx.strokeStyle = '#E63946';
        this.world.ctx.lineWidth = 2;
        this.roundRect(this.world.ctx, scoreX - 10, scoreY - 20, boxWidth, boxHeight, 8);
        this.world.ctx.stroke();
        
        // Clean text
        this.world.ctx.font = 'bold 24px Comic Sans MS';
        this.world.ctx.textAlign = 'center';
        
        // Text shadow
        this.world.ctx.fillStyle = '#8B1538';
        this.world.ctx.fillText(`${this.world.totalScore}`, scoreX + 40 + 2, scoreY + 2);
        
        // Main text
        this.world.ctx.fillStyle = '#FFFFFF';
        this.world.ctx.fillText(`${this.world.totalScore}`, scoreX + 40, scoreY);
        
        this.world.ctx.restore();
    }

    /**
     * Draw rounded rectangle helper function
     */
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

    /**
     * Draw pause overlay
     */
    drawPauseOverlay() {
        this.world.ctx.save();
        this.world.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.world.ctx.fillRect(0, 0, this.world.canvas.width, this.world.canvas.height);
        
        this.world.ctx.fillStyle = '#fff';
        this.world.ctx.font = Math.min(this.world.canvas.width / 15, 48) + 'px Comic Sans MS';
        this.world.ctx.textAlign = 'center';
        this.world.ctx.fillText('PAUSED', this.world.canvas.width / 2, this.world.canvas.height / 2);
        
        this.world.ctx.restore();
    }

    /**
     * Draw wrong direction warning
     */
    drawWrongDirectionWarning() {
        this.world.ctx.save();
        this.world.ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        this.world.ctx.font = '32px Comic Sans MS';
        this.world.ctx.textAlign = 'center';
        this.world.ctx.fillStyle = '#fff';
        this.world.ctx.strokeStyle = '#ff0000';
        this.world.ctx.lineWidth = 3;
        
        let warningText = 'WRONG DIRECTION!';
        let textX = this.world.canvas.width / 2;
        let textY = this.world.canvas.height / 2 - 100;
        
        this.world.ctx.strokeText(warningText, textX, textY);
        this.world.ctx.fillText(warningText, textX, textY);
        
        this.world.ctx.restore();
    }

    /**
     * Draw game over screen
     */
    drawGameOverScreen() {
        this.world.ctx.save();
        
        // Dark overlay
        this.world.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.world.ctx.fillRect(0, 0, this.world.canvas.width, this.world.canvas.height);
        
        // Game Over text
        this.world.ctx.fillStyle = '#ff0000';
        this.world.ctx.font = 'bold 48px Comic Sans MS';
        this.world.ctx.textAlign = 'center';
        this.world.ctx.fillText('GAME OVER', this.world.canvas.width / 2, this.world.canvas.height / 2 - 50);
        
        // Final score
        this.world.ctx.fillStyle = '#ffffff';
        this.world.ctx.font = 'bold 24px Comic Sans MS';
        this.world.ctx.fillText(`Final Score: ${this.world.totalScore}`, this.world.canvas.width / 2, this.world.canvas.height / 2 + 20);
        
        this.world.ctx.restore();
    }

    /**
     * Draw level complete screen
     */
    drawLevelCompleteScreen() {
        this.world.ctx.save();
        
        // Light overlay
        this.world.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
        this.world.ctx.fillRect(0, 0, this.world.canvas.width, this.world.canvas.height);
        
        // Level Complete text
        this.world.ctx.fillStyle = '#00ff00';
        this.world.ctx.font = 'bold 48px Comic Sans MS';
        this.world.ctx.textAlign = 'center';
        this.world.ctx.fillText('LEVEL COMPLETE!', this.world.canvas.width / 2, this.world.canvas.height / 2 - 50);
        
        // Score
        this.world.ctx.fillStyle = '#ffffff';
        this.world.ctx.font = 'bold 24px Comic Sans MS';
        this.world.ctx.fillText(`Score: ${this.world.totalScore}`, this.world.canvas.width / 2, this.world.canvas.height / 2 + 20);
        
        this.world.ctx.restore();
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
        
        // Position at center top
        let indicatorX = this.world.canvas.width / 2;
        let indicatorY = 50;
        let boxWidth = 200; // Increased width for more info
        let boxHeight = 50; // Increased height for two lines
        
        // Background with gradient effect
        this.world.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.roundRect(this.world.ctx, indicatorX - boxWidth/2, indicatorY - 30, boxWidth, boxHeight, 10);
        this.world.ctx.fill();
        
        // Border with wave-based color
        let borderColor = (waveInfo.maxWaveReached && waveInfo.maxChickensReached) ? '#FF6B35' : '#4ECDC4';
        this.world.ctx.strokeStyle = borderColor;
        this.world.ctx.lineWidth = 3;
        this.roundRect(this.world.ctx, indicatorX - boxWidth/2, indicatorY - 30, boxWidth, boxHeight, 10);
        this.world.ctx.stroke();
        
        // Wave text
        this.world.ctx.font = 'bold 20px Comic Sans MS';
        this.world.ctx.textAlign = 'center';
        
        // Text shadow
        this.world.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.world.ctx.fillText(`WAVE ${waveInfo.currentWave}`, indicatorX + 1, indicatorY - 5 + 1);
        
        // Main text
        this.world.ctx.fillStyle = '#FFFFFF';
        this.world.ctx.fillText(`WAVE ${waveInfo.currentWave}`, indicatorX, indicatorY - 5);
        
        // Info line: Speed, Chicken count, Endboss count, and scaling info
        this.world.ctx.font = 'bold 11px Comic Sans MS';
        this.world.ctx.fillStyle = borderColor;
        
        let infoText = `${waveInfo.speedPercentage}% Speed`;
        if (waveInfo.extraChickens > 0) {
            infoText += ` | +${waveInfo.extraChickens} 🐔`;
        }
        if (waveInfo.extraEndbosses > 0) {
            infoText += ` | +${waveInfo.extraEndbosses} 👑`;
        }
        
        // Add damage/health scaling info for wave 35+
        if (waveInfo.isDamageScaling) {
            infoText += ` | ⚔️${waveInfo.damagePercentage}%`;
            infoText += ` | ❤️${waveInfo.healthPercentage}%`;
        }
        
        this.world.ctx.fillText(infoText, indicatorX, indicatorY + 12);
        
        this.world.ctx.restore();
    }

    /**
     * Draw combo indicator when combo > 0 or during grace period
     */
    drawComboIndicator() {
        let effectiveCombo = this.world.character.getEffectiveCombo();
        let currentCombo = this.world.character.combo;
        
        if (effectiveCombo === 0) return;
        
        this.world.ctx.save();
        
        // Position at left side of screen
        let indicatorX = 150;
        let indicatorY = 120;
        let boxWidth = 120;
        let boxHeight = 40;
        
        // Check if we're in grace period
        let inGracePeriod = currentCombo === 0 && effectiveCombo > 0;
        let comboText = '';
        let subText = '';
        
        if (inGracePeriod) {
            // Calculate remaining grace period time
            let currentTime = Date.now();
            let timeSinceComboEnded = currentTime - this.world.character.comboEndTime;
            let remainingTime = Math.max(0, this.world.character.comboGracePeriod - timeSinceComboEnded);
            let secondsRemaining = Math.ceil(remainingTime / 1000);
            
            comboText = `${effectiveCombo}x`;
            subText = `${secondsRemaining}s`;
            boxHeight = 50; // Make box taller for grace period text
        } else {
            comboText = `${effectiveCombo}x`;
            subText = 'COMBO';
        }
        
        // Pulsing effect based on combo count
        let pulseValue = Math.sin(Date.now() * 0.01) * 0.2 + 0.8;
        let intensity = Math.min(effectiveCombo / 10, 1); // More intense with higher combo
        
        // Dynamic colors based on combo count and grace period
        let bgColor, borderColor, textColor;
        if (inGracePeriod) {
            // Fading orange for grace period
            let currentTime = Date.now();
            let timeSinceComboEnded = currentTime - this.world.character.comboEndTime;
            let fadeProgress = timeSinceComboEnded / this.world.character.comboGracePeriod;
            let alpha = Math.max(0.3, 1 - fadeProgress);
            
            bgColor = `rgba(255, 140, 0, ${alpha * pulseValue * 0.6})`;
            borderColor = `rgba(255, 165, 0, ${alpha})`;
            textColor = '#FFFFFF';
        } else if (effectiveCombo >= 10) {
            // Rainbow/legendary effect for 10+ combo
            let hue = (Date.now() * 0.1) % 360;
            bgColor = `hsla(${hue}, 80%, 50%, ${pulseValue * 0.9})`;
            borderColor = `hsla(${hue + 60}, 90%, 60%, 1)`;
            textColor = '#FFFFFF';
        } else if (effectiveCombo >= 5) {
            // Gold for 5+ combo
            bgColor = `rgba(255, 215, 0, ${pulseValue * 0.8})`;
            borderColor = '#FFD700';
            textColor = '#8B0000';
        } else {
            // Orange for lower combos
            bgColor = `rgba(255, 165, 0, ${pulseValue * 0.7})`;
            borderColor = '#FF8C00';
            textColor = '#FFFFFF';
        }
        
        // Glowing background
        this.world.ctx.fillStyle = bgColor;
        this.roundRect(this.world.ctx, indicatorX - 10, indicatorY - 25, boxWidth, boxHeight, 12);
        this.world.ctx.fill();
        
        // Border with glow effect
        this.world.ctx.strokeStyle = borderColor;
        this.world.ctx.lineWidth = 3;
        this.roundRect(this.world.ctx, indicatorX - 10, indicatorY - 25, boxWidth, boxHeight, 12);
        this.world.ctx.stroke();
        
        // Main text
        this.world.ctx.font = 'bold 18px Comic Sans MS';
        this.world.ctx.textAlign = 'center';
        
        if (inGracePeriod) {
            // Grace period layout
            // Text shadow
            this.world.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.world.ctx.fillText(comboText, indicatorX + boxWidth/2 - 10 + 1, indicatorY - 5 + 1);
            this.world.ctx.font = 'bold 12px Comic Sans MS';
            this.world.ctx.fillText('DAMAGE', indicatorX + boxWidth/2 - 10 + 1, indicatorY + 8 + 1);
            this.world.ctx.fillText(subText, indicatorX + boxWidth/2 - 10 + 1, indicatorY + 20 + 1);
            
            // Main text
            this.world.ctx.fillStyle = textColor;
            this.world.ctx.font = 'bold 18px Comic Sans MS';
            this.world.ctx.fillText(comboText, indicatorX + boxWidth/2 - 10, indicatorY - 5);
            this.world.ctx.font = 'bold 12px Comic Sans MS';
            this.world.ctx.fillText('DAMAGE', indicatorX + boxWidth/2 - 10, indicatorY + 8);
            this.world.ctx.fillText(subText, indicatorX + boxWidth/2 - 10, indicatorY + 20);
        } else {
            // Normal combo layout
            // Text shadow
            this.world.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.world.ctx.fillText(subText, indicatorX + boxWidth/2 - 10 + 1, indicatorY - 8 + 1);
            this.world.ctx.fillText(comboText, indicatorX + boxWidth/2 - 10 + 1, indicatorY + 8 + 1);
            
            // Main text
            this.world.ctx.fillStyle = textColor;
            this.world.ctx.fillText(subText, indicatorX + boxWidth/2 - 10, indicatorY - 8);
            this.world.ctx.fillText(comboText, indicatorX + boxWidth/2 - 10, indicatorY + 8);
        }
        
        this.world.ctx.restore();
    }

    /**
     * Show wave change notification
     */
    showWaveChangeNotification(wave) {
        this.waveChangeNotification = {
            wave: wave,
            startTime: Date.now(),
            duration: 3000 // 3 seconds
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
        
        // Fade effect
        let alpha = Math.max(0, 1 - elapsed / this.waveChangeNotification.duration);
        
        // Center position
        let centerX = this.world.canvas.width / 2;
        let centerY = this.world.canvas.height / 2 - 50;
        
        // Large notification box
        this.world.ctx.fillStyle = `rgba(255, 107, 53, ${alpha * 0.9})`;
        this.roundRect(this.world.ctx, centerX - 200, centerY - 50, 400, 100, 15);
        this.world.ctx.fill();
        
        // Border
        this.world.ctx.strokeStyle = `rgba(230, 57, 70, ${alpha})`;
        this.world.ctx.lineWidth = 4;
        this.roundRect(this.world.ctx, centerX - 200, centerY - 50, 400, 100, 15);
        this.world.ctx.stroke();
        
        // Text
        this.world.ctx.font = 'bold 36px Comic Sans MS';
        this.world.ctx.textAlign = 'center';
        
        // Shadow
        this.world.ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.8})`;
        this.world.ctx.fillText(`WAVE ${this.waveChangeNotification.wave}`, centerX + 2, centerY + 2);
        
        // Main text
        this.world.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        this.world.ctx.fillText(`WAVE ${this.waveChangeNotification.wave}`, centerX, centerY);
        
        // Subtitle with enhanced info
        this.world.ctx.font = 'bold 18px Comic Sans MS';
        this.world.ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
        
        // Get wave info for enhanced subtitle
        if (this.world.waveManager) {
            let waveInfo = this.world.waveManager.getWaveInfo();
            let subtitleText = `${waveInfo.speedPercentage}% Speed`;
            if (waveInfo.extraChickens > 0) {
                subtitleText += ` | +${waveInfo.extraChickens} 🐔`;
            }
            if (waveInfo.extraEndbosses > 0) {
                subtitleText += ` | +${waveInfo.extraEndbosses} 👑`;
            }
            
            // Add scaling info for wave 35+
            if (waveInfo.isDamageScaling) {
                subtitleText += ` | ⚔️${waveInfo.damagePercentage}%`;
                subtitleText += ` | ❤️${waveInfo.healthPercentage}%`;
            }
            
            this.world.ctx.fillText(subtitleText, centerX, centerY + 25);
        } else {
            this.world.ctx.fillText('Enemies are faster!', centerX, centerY + 25);
        }
        
        this.world.ctx.restore();
    }

    /**
     * Draw canvas buttons (pause, fullscreen, mute)
     */
    drawCanvasButtons() {
        this.world.ctx.save();
        
        // Update pause button text
        this.buttons.pause.text = this.world.isPaused ? 'RESUME' : 'PAUSE';
        this.buttons.mute.text = this.isMuted ? '🔇' : '🔊';
        
        // Draw each button
        Object.values(this.buttons).forEach(button => {
            this.drawButton(button);
        });
        
        this.world.ctx.restore();
    }

    /**
     * Draw individual button
     */
    drawButton(button) {
        // Button background
        this.world.ctx.fillStyle = '#FF6B35';
        this.roundRect(this.world.ctx, button.x, button.y, button.width, button.height, 5);
        this.world.ctx.fill();
        
        // Button border
        this.world.ctx.strokeStyle = '#E63946';
        this.world.ctx.lineWidth = 1;
        this.roundRect(this.world.ctx, button.x, button.y, button.width, button.height, 5);
        this.world.ctx.stroke();
        
        // Button text
        this.world.ctx.fillStyle = 'white';
        this.world.ctx.font = 'bold 10px Arial';
        this.world.ctx.textAlign = 'center';
        this.world.ctx.fillText(
            button.text,
            button.x + button.width / 2,
            button.y + button.height / 2 + 3
        );
    }

    /**
     * Setup event listeners for canvas buttons
     */
    setupButtonEventListeners() {
        this.onCanvasClick = (event) => {
            const rect = this.world.canvas.getBoundingClientRect();
            
            // Calculate scale factors for fullscreen mode
            const scaleX = rect.width / this.world.canvas.width;
            const scaleY = rect.height / this.world.canvas.height;
            
            // Convert mouse coordinates to canvas coordinates
            const x = (event.clientX - rect.left) / scaleX;
            const y = (event.clientY - rect.top) / scaleY;
            
            // Check button clicks
            if (this.isPointInButton(x, y, this.buttons.pause)) {
                this.handlePauseButton();
            } else if (this.isPointInButton(x, y, this.buttons.fullscreen)) {
                this.handleFullscreenButton();
            } else if (this.isPointInButton(x, y, this.buttons.mute)) {
                this.handleMuteButton();
            }
        };
        
        this.world.canvas.addEventListener('click', this.onCanvasClick);
    }

    /**
     * Check if point is inside button
     */
    isPointInButton(x, y, button) {
        return x >= button.x && 
               x <= button.x + button.width &&
               y >= button.y && 
               y <= button.y + button.height;
    }

    /**
     * Handle pause button click
     */
    handlePauseButton() {
        if (typeof togglePause === 'function') {
            togglePause();
        } else {
            this.world.isPaused = !this.world.isPaused;
            console.log('Game', this.world.isPaused ? 'paused' : 'resumed');
        }
    }

    /**
     * Handle fullscreen button click
     */
    handleFullscreenButton() {
        if (typeof toggleFullscreen === 'function') {
            toggleFullscreen();
        } else {
            if (!document.fullscreenElement) {
                this.world.canvas.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
    }

    /**
     * Handle mute button click
     */
    handleMuteButton() {
        this.isMuted = !this.isMuted;
        this.updateMuteState();
        localStorage.setItem('elPolloLocoMuted', this.isMuted.toString());
        console.log('Audio', this.isMuted ? 'muted' : 'unmuted');
    }

    /**
     * Update mute state in audio manager
     */
    updateMuteState() {
        if (this.world.audioManager) {
            this.world.audioManager.setMuted(this.isMuted);
        }
    }

    /**
     * Remove event listeners (cleanup)
     */
    removeEventListeners() {
        if (this.onCanvasClick) {
            this.world.canvas.removeEventListener('click', this.onCanvasClick);
        }
    }
}
