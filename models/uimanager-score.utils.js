/**
 * Score display utilities for UIManager
 * Contains functions for rendering score displays and highscore management
 */

/**
 * Calculate score display position and dimensions
 * @param {UIManager} uiManager - UIManager instance
 * @returns {Object} Position and size information
 */
function calculateScorePosition(uiManager) {
    return {
        x: uiManager.world.canvas.width - 120,
        y: 30,
        width: 100,
        height: 35
    };
}

/**
 * Draw background and border for score display
 * @param {UIManager} uiManager - UIManager instance
 * @param {Object} pos - Position and size information
 */
function drawScoreBackground(uiManager, pos) {
    uiManager.world.ctx.fillStyle = '#FF6B35';
    uiManager.roundRect(uiManager.world.ctx, pos.x - 10, pos.y - 20, pos.width, pos.height, 8);
    uiManager.world.ctx.fill();
    uiManager.world.ctx.strokeStyle = '#E63946';
    uiManager.world.ctx.lineWidth = 2;
    uiManager.roundRect(uiManager.world.ctx, pos.x - 10, pos.y - 20, pos.width, pos.height, 8);
    uiManager.world.ctx.stroke();
}

/**
 * Draw score text with shadow effect
 * @param {UIManager} uiManager - UIManager instance
 * @param {Object} pos - Position information
 */
function drawScoreText(uiManager, pos) {
    uiManager.world.ctx.font = 'bold 24px Comic Sans MS';
    uiManager.world.ctx.textAlign = 'center';
    uiManager.world.ctx.fillStyle = '#8B1538';
    uiManager.world.ctx.fillText(`${uiManager.world.totalScore}`, pos.x + 40 + 2, pos.y + 2);
    uiManager.world.ctx.fillStyle = '#FFFFFF';
    uiManager.world.ctx.fillText(`${uiManager.world.totalScore}`, pos.x + 40, pos.y);
}
