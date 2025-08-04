/**
 * Drawing utilities for UIManager
 * Contains common drawing helper functions and screen overlays
 */

/**
 * Draw rounded rectangle helper function
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate  
 * @param {number} width - Width
 * @param {number} height - Height
 * @param {number} radius - Border radius
 */
function roundRect(ctx, x, y, width, height, radius) {
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
 * @param {World} world - Game world instance
 */
function drawPauseOverlay(world) {
    world.ctx.save();
    world.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    world.ctx.fillRect(0, 0, world.canvas.width, world.canvas.height);
    world.ctx.fillStyle = '#fff';
    world.ctx.font = Math.min(world.canvas.width / 15, 48) + 'px Comic Sans MS';
    world.ctx.textAlign = 'center';
    world.ctx.fillText('PAUSED', world.canvas.width / 2, world.canvas.height / 2);
    world.ctx.restore();
}

/**
 * Draw wrong direction warning
 * @param {World} world - Game world instance
 */
function drawWrongDirectionWarning(world) {
    world.ctx.save();
    world.ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
    world.ctx.font = '32px Comic Sans MS';
    world.ctx.textAlign = 'center';
    world.ctx.fillStyle = '#fff';
    world.ctx.strokeStyle = '#ff0000';
    world.ctx.lineWidth = 3;
    let warningText = 'WRONG DIRECTION!';
    let textX = world.canvas.width / 2;
    let textY = world.canvas.height / 2 - 100;
    world.ctx.strokeText(warningText, textX, textY);
    world.ctx.fillText(warningText, textX, textY);
    world.ctx.restore();
}

/**
 * Draw level complete screen
 * @param {World} world - Game world instance
 */
function drawLevelCompleteScreen(world) {
    world.ctx.save();
    world.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
    world.ctx.fillRect(0, 0, world.canvas.width, world.canvas.height);
    world.ctx.fillStyle = '#00ff00';
    world.ctx.font = 'bold 48px Comic Sans MS';
    world.ctx.textAlign = 'center';
    world.ctx.fillText('LEVEL COMPLETE!', world.canvas.width / 2, world.canvas.height / 2 - 50);
    world.ctx.fillStyle = '#ffffff';
    world.ctx.font = 'bold 24px Comic Sans MS';
    world.ctx.fillText(`Score: ${world.totalScore}`, world.canvas.width / 2, world.canvas.height / 2 + 20);
    world.ctx.restore();
}

/**
 * Draw combo indicator when combo > 0 or during grace period
 * @param {UIManager} uiManager - Reference to UIManager instance
 */
function drawComboIndicator(uiManager) {
    let effectiveCombo = uiManager.world.character.getEffectiveCombo();
    let currentCombo = uiManager.world.character.comboManager.combo;
    if (effectiveCombo === 0) return;
    uiManager.world.ctx.save();
    let indicatorX = 150;
    let indicatorY = 120;
    let boxWidth = 120;
    let boxHeight = 40;
    let inGracePeriod = currentCombo === 0 && effectiveCombo > 0;
    let comboText = '';
    let subText = '';
    if (inGracePeriod) {
        let currentTime = Date.now();
        let timeSinceComboEnded = currentTime - uiManager.world.character.comboManager.comboEndTime;
        let remainingTime = Math.max(0, uiManager.world.character.comboManager.comboGracePeriod - timeSinceComboEnded);
        let secondsRemaining = Math.ceil(remainingTime / 1000);
        comboText = `${effectiveCombo}x`;
        subText = `${secondsRemaining}s`;
        boxHeight = 50;
    } else {
        comboText = `${effectiveCombo}x`;
        subText = 'COMBO';
    }
    let pulseValue = Math.sin(Date.now() * 0.01) * 0.2 + 0.8;
    let intensity = Math.min(effectiveCombo / 10, 1);
    let bgColor, borderColor, textColor;
    if (inGracePeriod) {
        let currentTime = Date.now();
        let timeSinceComboEnded = currentTime - uiManager.world.character.comboManager.comboEndTime;
        let fadeProgress = timeSinceComboEnded / uiManager.world.character.comboManager.comboGracePeriod;
        let alpha = Math.max(0.3, 1 - fadeProgress);
        bgColor = `rgba(255, 140, 0, ${alpha * pulseValue * 0.6})`;
        borderColor = `rgba(255, 165, 0, ${alpha})`;
        textColor = '#FFFFFF';
    } else if (effectiveCombo >= 10) {
        let hue = (Date.now() * 0.1) % 360;
        bgColor = `hsla(${hue}, 80%, 50%, ${pulseValue * 0.9})`;
        borderColor = `hsla(${hue + 60}, 90%, 60%, 1)`;
        textColor = '#FFFFFF';
    } else if (effectiveCombo >= 5) {
        bgColor = `rgba(255, 215, 0, ${pulseValue * 0.8})`;
        borderColor = '#FFD700';
        textColor = '#8B0000';
    } else {
        bgColor = `rgba(255, 165, 0, ${pulseValue * 0.7})`;
        borderColor = '#FF8C00';
        textColor = '#FFFFFF';
    }
    uiManager.world.ctx.fillStyle = bgColor;
    roundRect(uiManager.world.ctx, indicatorX - 10, indicatorY - 25, boxWidth, boxHeight, 12);
    uiManager.world.ctx.fill();
    uiManager.world.ctx.strokeStyle = borderColor;
    uiManager.world.ctx.lineWidth = 3;
    roundRect(uiManager.world.ctx, indicatorX - 10, indicatorY - 25, boxWidth, boxHeight, 12);
    uiManager.world.ctx.stroke();
    uiManager.world.ctx.font = 'bold 18px Comic Sans MS';
    uiManager.world.ctx.textAlign = 'center';
    if (inGracePeriod) {
        uiManager.world.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        uiManager.world.ctx.fillText(comboText, indicatorX + boxWidth/2 - 10 + 1, indicatorY - 5 + 1);
        uiManager.world.ctx.font = 'bold 12px Comic Sans MS';
        uiManager.world.ctx.fillText('DAMAGE', indicatorX + boxWidth/2 - 10 + 1, indicatorY + 8 + 1);
        uiManager.world.ctx.fillText(subText, indicatorX + boxWidth/2 - 10 + 1, indicatorY + 20 + 1);
        uiManager.world.ctx.fillStyle = textColor;
        uiManager.world.ctx.font = 'bold 18px Comic Sans MS';
        uiManager.world.ctx.fillText(comboText, indicatorX + boxWidth/2 - 10, indicatorY - 5);
        uiManager.world.ctx.font = 'bold 12px Comic Sans MS';
        uiManager.world.ctx.fillText('DAMAGE', indicatorX + boxWidth/2 - 10, indicatorY + 8);
        uiManager.world.ctx.fillText(subText, indicatorX + boxWidth/2 - 10, indicatorY + 20);
    } else {
        uiManager.world.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        uiManager.world.ctx.fillText(subText, indicatorX + boxWidth/2 - 10 + 1, indicatorY - 8 + 1);
        uiManager.world.ctx.fillText(comboText, indicatorX + boxWidth/2 - 10 + 1, indicatorY + 8 + 1);
        uiManager.world.ctx.fillStyle = textColor;
        uiManager.world.ctx.fillText(subText, indicatorX + boxWidth/2 - 10, indicatorY - 8);
        uiManager.world.ctx.fillText(comboText, indicatorX + boxWidth/2 - 10, indicatorY + 8);
    }
    uiManager.world.ctx.restore();
}
