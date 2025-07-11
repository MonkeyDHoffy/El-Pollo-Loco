class UIManager {
    constructor(world) {
        this.world = world;
    }

    /**
     * Draw all UI elements
     */
    drawUI() {
        this.drawMexicanScore();
        
        if (this.world.isPaused) {
            this.drawPauseOverlay();
        }

        if (this.world.character.showWrongDirectionWarning) {
            this.drawWrongDirectionWarning();
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
}
