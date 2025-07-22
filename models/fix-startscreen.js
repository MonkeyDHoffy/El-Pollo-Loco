/**
 * Adds touch support functionality to the start screen for mobile devices
 */

/**
 * Adds touch event handling to StartScreen for mobile compatibility
 */
function addTouchSupportToStartScreen() {
    let startScreen = window.startScreen;
    
    if (!validateStartScreen(startScreen)) {
        return;
    }
    attachTouchHandler(startScreen);
}

/**
 * Validates if StartScreen object exists and is accessible
 * @param {Object} startScreen - StartScreen object reference
 * @returns {boolean} True if valid, false otherwise
 */
function validateStartScreen(startScreen) {
    if (!startScreen) {
        return false;
    }
    return true;
}

/**
 * Attaches touch event handler to StartScreen canvas
 * @param {Object} startScreen - StartScreen object reference
 */
function attachTouchHandler(startScreen) {
    let touchHandler = createTouchHandler(startScreen);
    startScreen.canvas.addEventListener('touchstart', touchHandler, { passive: false });
}

/**
 * Creates touch event handler function for StartScreen
 * @param {Object} startScreen - StartScreen object reference
 * @returns {Function} Touch event handler
 */
function createTouchHandler(startScreen) {
    return function(event) {
        if (!startScreen.isActive) return;
        event.preventDefault();
        
    let coordinates = calculateTouchCoordinates(event, startScreen);
        if (isTouchOnPlayButton(coordinates, startScreen)) {
            handlePlayButtonTouch(startScreen);
        }
    };
}

/**
 * Calculates scaled touch coordinates relative to canvas
 * @param {TouchEvent} event - Touch event
 * @param {Object} startScreen - StartScreen object reference
 * @returns {Object} Scaled coordinates
 */
function calculateTouchCoordinates(event, startScreen) {
    let rect = startScreen.canvas.getBoundingClientRect();
    let touch = event.touches[0];
    let touchX = touch.clientX - rect.left;
    let touchY = touch.clientY - rect.top;
    let scaleX = startScreen.canvas.width / rect.width;
    let scaleY = startScreen.canvas.height / rect.height;
    return {
        x: touchX * scaleX,
        y: touchY * scaleY
    };
}

/**
 * Checks if touch coordinates are within play button bounds
 * @param {Object} coordinates - Touch coordinates
 * @param {Object} startScreen - StartScreen object reference
 * @returns {boolean} True if touch is on play button
 */
function isTouchOnPlayButton(coordinates, startScreen) {
    return coordinates.x >= startScreen.playButtonX && 
           coordinates.x <= startScreen.playButtonX + startScreen.playButtonWidth &&
           coordinates.y >= startScreen.playButtonY && 
           coordinates.y <= startScreen.playButtonY + startScreen.playButtonHeight;
}

/**
 * Handles play button touch event and starts game
 * @param {Object} startScreen - StartScreen object reference
 */
function handlePlayButtonTouch(startScreen) {
    if (typeof startScreen.startGame === 'function') {
        startScreen.startGame();
    } else if (window.onStartGame) {
        window.onStartGame();
    }
}

/**
 * Initialize touch support when DOM is loaded
 */
function initializeTouchSupport() {
    setTimeout(addTouchSupportToStartScreen, 500);
}

document.addEventListener('DOMContentLoaded', initializeTouchSupport);
