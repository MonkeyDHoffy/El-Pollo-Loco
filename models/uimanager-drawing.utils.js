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
    let { effectiveCombo, currentCombo, inGracePeriod, comboText, subText, boxHeight } = getComboIndicatorState(uiManager);
    if (effectiveCombo === 0) return;
    let { bgColor, borderColor, textColor } = getComboIndicatorColors(uiManager, effectiveCombo, inGracePeriod);
    let indicatorX = 150;
    let indicatorY = 120;
    let boxWidth = 120;

    drawComboIndicatorBox(uiManager.world.ctx, indicatorX, indicatorY, boxWidth, boxHeight, bgColor, borderColor);

    drawComboIndicatorText(
        uiManager.world.ctx,
        indicatorX,
        indicatorY,
        boxWidth,
        inGracePeriod,
        comboText,
        subText,
        textColor
    );
}

/**
 * Get combo indicator state information
 * @param {UIManager} uiManager - Reference to UIManager instance
 * @returns {Object} Combo state with text, colors, and dimensions
 */
function getComboIndicatorState(uiManager) {
    let effectiveCombo = uiManager.world.character.getEffectiveCombo();
    let currentCombo = uiManager.world.character.comboManager.combo;
    let inGracePeriod = currentCombo === 0 && effectiveCombo > 0;
    let comboText = '';
    let subText = '';
    let boxHeight = 40;
    if (inGracePeriod) {
        ({ comboText, subText, boxHeight } = getGracePeriodComboState(uiManager, effectiveCombo));
    } else {
        comboText = `${effectiveCombo}x`;
        subText = 'COMBO';
    }
    return { effectiveCombo, currentCombo, inGracePeriod, comboText, subText, boxHeight };
}

/**
 * Get combo state during grace period
 * @param {UIManager} uiManager - Reference to UIManager instance
 * @param {number} effectiveCombo - The effective combo multiplier
 * @returns {Object} Grace period combo state with text and dimensions
 */
function getGracePeriodComboState(uiManager, effectiveCombo) {
    let currentTime = Date.now();
    let timeSinceComboEnded = currentTime - uiManager.world.character.comboManager.comboEndTime;
    let remainingTime = Math.max(0, uiManager.world.character.comboManager.comboGracePeriod - timeSinceComboEnded);
    let secondsRemaining = Math.ceil(remainingTime / 1000);
    return {
        comboText: `${effectiveCombo}x`,
        subText: `${secondsRemaining}s`,
        boxHeight: 50
    };
}

/**
 * Get appropriate colors for combo indicator based on combo level and state
 * @param {UIManager} uiManager - Reference to UIManager instance
 * @param {number} effectiveCombo - The effective combo multiplier
 * @param {boolean} inGracePeriod - Whether combo is in grace period
 * @returns {Object} Color configuration with bgColor, borderColor, and textColor
 */
function getComboIndicatorColors(uiManager, effectiveCombo, inGracePeriod) {
    let pulseValue = Math.sin(Date.now() * 0.01) * 0.2 + 0.8;
    if (inGracePeriod) {
        return getGracePeriodColors(uiManager, pulseValue);
    } else if (effectiveCombo >= 10) {
        return getHighComboColors(pulseValue);
    } else if (effectiveCombo >= 5) {
        return getMediumComboColors(pulseValue);
    } else {
        return getLowComboColors(pulseValue);
    }
}

/**
 * Get colors for combo indicator during grace period
 * @param {UIManager} uiManager - Reference to UIManager instance
 * @param {number} pulseValue - Pulse animation value
 * @returns {Object} Grace period color configuration
 */
function getGracePeriodColors(uiManager, pulseValue) {
    let currentTime = Date.now();
    let timeSinceComboEnded = currentTime - uiManager.world.character.comboManager.comboEndTime;
    let fadeProgress = timeSinceComboEnded / uiManager.world.character.comboManager.comboGracePeriod;
    let alpha = Math.max(0.3, 1 - fadeProgress);
    return {
        bgColor: `rgba(255, 140, 0, ${alpha * pulseValue * 0.6})`,
        borderColor: `rgba(255, 165, 0, ${alpha})`,
        textColor: '#FFFFFF'
    };
}

/**
 * Get colors for high combo indicators (10+ combo)
 * @param {number} pulseValue - Pulse animation value
 * @returns {Object} High combo color configuration with rainbow effect
 */
function getHighComboColors(pulseValue) {
    let hue = (Date.now() * 0.1) % 360;
    return {
        bgColor: `hsla(${hue}, 80%, 50%, ${pulseValue * 0.9})`,
        borderColor: `hsla(${hue + 60}, 90%, 60%, 1)`,
        textColor: '#FFFFFF'
    };
}

/**
 * Get colors for medium combo indicators (5-9 combo)
 * @param {number} pulseValue - Pulse animation value
 * @returns {Object} Medium combo color configuration with gold theme
 */
function getMediumComboColors(pulseValue) {
    return {
        bgColor: `rgba(255, 215, 0, ${pulseValue * 0.8})`,
        borderColor: '#FFD700',
        textColor: '#8B0000'
    };
}

/**
 * Get colors for low combo indicators (1-4 combo)
 * @param {number} pulseValue - Pulse animation value
 * @returns {Object} Low combo color configuration with orange theme
 */
function getLowComboColors(pulseValue) {
    return {
        bgColor: `rgba(255, 165, 0, ${pulseValue * 0.7})`,
        borderColor: '#FF8C00',
        textColor: '#FFFFFF'
    };
}

/**
 * Draw the background box for combo indicator
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} width - Box width
 * @param {number} height - Box height
 * @param {string} bgColor - Background color
 * @param {string} borderColor - Border color
 */
function drawComboIndicatorBox(ctx, x, y, width, height, bgColor, borderColor) {
    ctx.save();
    ctx.fillStyle = bgColor;
    roundRect(ctx, x - 10, y - 25, width, height, 12);
    ctx.fill();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 3;
    roundRect(ctx, x - 10, y - 25, width, height, 12);
    ctx.stroke();
    ctx.restore();
}

/**
 * Draw the text content for combo indicator
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} width - Box width
 * @param {boolean} inGracePeriod - Whether combo is in grace period
 * @param {string} comboText - Main combo text (e.g., "5x")
 * @param {string} subText - Sub text (e.g., "COMBO" or "3s")
 * @param {string} textColor - Text color
 */
function drawComboIndicatorText(ctx, x, y, width, inGracePeriod, comboText, subText, textColor) {
    ctx.save();
    ctx.font = 'bold 18px Comic Sans MS';
    ctx.textAlign = 'center';
    if (inGracePeriod) {
        drawComboIndicatorTextShadow(ctx, x, y, width, comboText, subText, true);
        ctx.fillStyle = textColor;
        ctx.font = 'bold 18px Comic Sans MS';
        ctx.fillText(comboText, x + width / 2 - 10, y - 5);
        ctx.font = 'bold 12px Comic Sans MS';
        ctx.fillText('DAMAGE', x + width / 2 - 10, y + 8);
        ctx.fillText(subText, x + width / 2 - 10, y + 20);
    } else {
        drawComboIndicatorTextShadow(ctx, x, y, width, comboText, subText, false);
        ctx.fillStyle = textColor;
        ctx.fillText(subText, x + width / 2 - 10, y - 8);
        ctx.fillText(comboText, x + width / 2 - 10, y + 8);
    }
    ctx.restore();
}

/**
 * Draw shadow effect for combo indicator text
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} width - Box width
 * @param {string} comboText - Main combo text
 * @param {string} subText - Sub text
 * @param {boolean} isGracePeriod - Whether combo is in grace period
 */
function drawComboIndicatorTextShadow(ctx, x, y, width, comboText, subText, isGracePeriod) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    if (isGracePeriod) {
        ctx.fillText(comboText, x + width / 2 - 10 + 1, y - 5 + 1);
        ctx.font = 'bold 12px Comic Sans MS';
        ctx.fillText('DAMAGE', x + width / 2 - 10 + 1, y + 8 + 1);
        ctx.fillText(subText, x + width / 2 - 10 + 1, y + 20 + 1);
        ctx.font = 'bold 18px Comic Sans MS'; 
    } else {
        ctx.fillText(subText, x + width / 2 - 10 + 1, y - 8 + 1);
        ctx.fillText(comboText, x + width / 2 - 10 + 1, y + 8 + 1);
    }
}
