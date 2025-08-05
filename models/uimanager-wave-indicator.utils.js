/**
 * Wave indicator utilities for UIManager
 * Contains functions for drawing and managing wave indicators
 */

/**
 * Calculate wave indicator position and dimensions
 * @param {UIManager} uiManager - UIManager instance
 * @returns {Object} Indicator configuration
 */
function calculateWaveIndicatorPosition(uiManager) {
    return {
        x: uiManager.world.canvas.width / 2,
        y: 50,
        width: 200,
        height: 50
    };
}

/**
 * Draw background and border for wave indicator
 * @param {UIManager} uiManager - UIManager instance
 * @param {Object} config - Indicator configuration
 * @param {Object} waveInfo - Wave information
 */
function drawWaveIndicatorBackground(uiManager, config, waveInfo) {
    uiManager.world.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    uiManager.roundRect(uiManager.world.ctx, config.x - config.width/2, config.y - 30, config.width, config.height, 10);
    uiManager.world.ctx.fill();
    let borderColor = (waveInfo.maxWaveReached && waveInfo.maxChickensReached) ? '#ff6b35' : '#4ECDC4';
    uiManager.world.ctx.strokeStyle = borderColor;
    uiManager.world.ctx.lineWidth = 3;
    uiManager.roundRect(uiManager.world.ctx, config.x - config.width/2, config.y - 30, config.width, config.height, 10);
    uiManager.world.ctx.stroke();
}

/**
 * Draw wave indicator text content
 * @param {UIManager} uiManager - UIManager instance
 * @param {Object} config - Indicator configuration
 * @param {Object} waveInfo - Wave information
 */
function drawWaveIndicatorText(uiManager, config, waveInfo) {
    drawWaveTitle(uiManager, config, waveInfo);
}

/**
 * Draw wave title with shadow effect
 * @param {UIManager} uiManager - UIManager instance
 * @param {Object} config - Indicator configuration
 * @param {Object} waveInfo - Wave information
 */
function drawWaveTitle(uiManager, config, waveInfo) {
    uiManager.world.ctx.font = 'bold 20px Comic Sans MS';
    uiManager.world.ctx.textAlign = 'center';
    uiManager.world.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    uiManager.world.ctx.fillText(`WAVE ${waveInfo.currentWave}`, config.x + 1, config.y - 5 + 1);
    uiManager.world.ctx.fillStyle = '#FFFFFF';
    uiManager.world.ctx.fillText(`WAVE ${waveInfo.currentWave}`, config.x, config.y - 5);
}
