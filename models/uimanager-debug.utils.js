/**
 * Debug information utilities for UIManager
 * Contains functions for displaying debug information and game statistics
 */

/**
 * Draws the debug info text lines
 * @param {UIManager} uiManager - UIManager instance
 */
function drawDebugTextLines(uiManager) {
    let y = 30;
    const ctx = uiManager.world.ctx;
    ctx.fillText(`Character X: ${Math.round(uiManager.world.character.x)}`, 20, y);
    y += 15;
    ctx.fillText(`Character Y: ${Math.round(uiManager.world.character.y)}`, 20, y);
    y += 15;
    ctx.fillText(`Enemies: ${uiManager.world.level.enemies.length}`, 20, y);
    y += 15;
    ctx.fillText(`Endbosses: ${uiManager.world.level.endboss.length}`, 20, y);
    y += 15;
    ctx.fillText(`Coins: ${uiManager.world.character.coins}/${uiManager.world.totalCoinsInLevel}`, 20, y);
    y += 15;
    ctx.fillText(`Bottles: ${uiManager.world.character.bottles}/10`, 20, y);
    y += 15;
    ctx.fillText(`Score: ${uiManager.world.totalScore}`, 20, y);
    y += 15;
    ctx.fillText(`FPS: ${uiManager.world.fps || 'N/A'}`, 20, y);
}
