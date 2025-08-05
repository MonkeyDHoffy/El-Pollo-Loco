/**
 * Game over screen utilities for UIManager
 * Contains functions for rendering game over screens and highscore displays
 */

/**
 * Draws the background overlay for game over screen
 * @param {UIManager} uiManager - UIManager instance
 */
function drawGameOverBackground(uiManager) {
    uiManager.world.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    uiManager.world.ctx.fillRect(0, 0, uiManager.world.canvas.width, uiManager.world.canvas.height);
}

/**
 * Draws the game over texts and highscore info
 * @param {UIManager} uiManager - UIManager instance
 * @param {boolean} isNewHighscore - Whether a new highscore was achieved
 */
function drawGameOverTexts(uiManager, isNewHighscore) {
    const ctx = uiManager.world.ctx;
    const centerX = uiManager.world.canvas.width / 2;
    const centerY = uiManager.world.canvas.height / 2;
    drawGameOverTitle(uiManager, ctx, centerX, centerY);
    drawGameOverScore(uiManager, ctx, centerX, centerY);

    if (isNewHighscore) {
        drawNewHighscoreText(uiManager, ctx, centerX, centerY);
    } else {
        ctx.fillStyle = '#cccccc';
    }
    ctx.fillText(`Highscore: ${uiManager.highscore}`, centerX, centerY + 50);
}

/**
 * Draws the "GAME OVER" title
 * @param {UIManager} uiManager - UIManager instance
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} centerX - Center X coordinate
 * @param {number} centerY - Center Y coordinate
 */
function drawGameOverTitle(uiManager, ctx, centerX, centerY) {
    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 48px Comic Sans MS';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', centerX, centerY - 80);
}

/**
 * Draws the final score text
 * @param {UIManager} uiManager - UIManager instance
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} centerX - Center X coordinate
 * @param {number} centerY - Center Y coordinate
 */
function drawGameOverScore(uiManager, ctx, centerX, centerY) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Comic Sans MS';
    ctx.fillText(`Final Score: ${uiManager.world.totalScore}`, centerX, centerY - 20);
}

/**
 * Draws the new highscore text with pulse effect
 * @param {UIManager} uiManager - UIManager instance
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} centerX - Center X coordinate
 * @param {number} centerY - Center Y coordinate
 */
function drawNewHighscoreText(uiManager, ctx, centerX, centerY) {
    let pulseValue = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(255, 215, 0, ${pulseValue})`;
    ctx.fillText('🎉 NEW HIGHSCORE! 🎉', centerX, centerY + 20);
    ctx.fillStyle = '#FFD700';
}
