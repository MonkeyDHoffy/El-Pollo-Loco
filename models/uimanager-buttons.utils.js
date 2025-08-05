/**
 * Button event handling utilities for UIManager
 * Contains all button-related event listeners and handlers
 */

/**
 * Setup event listeners for canvas buttons
 * @param {UIManager} uiManager - Reference to UIManager instance
 */
function setupButtonEventListeners(uiManager) {
    uiManager.onCanvasClick = createCanvasClickHandler(uiManager);
    uiManager.onTouchStart = createTouchStartHandler(uiManager);
    uiManager.onKeyDown = createKeyDownHandler(uiManager);

    uiManager.world.canvas.addEventListener('click', uiManager.onCanvasClick);
    uiManager.world.canvas.addEventListener('touchstart', uiManager.onTouchStart, { passive: false });
    document.addEventListener('keydown', uiManager.onKeyDown);
}

function handleButtonEvent(x, y, uiManager) {
    if (isPointInButton(x, y, uiManager.buttons.pause)) {
        handlePauseButton(uiManager);
    } else if (isPointInButton(x, y, uiManager.buttons.fullscreen)) {
        handleFullscreenButton(uiManager);
    } else if (isPointInButton(x, y, uiManager.buttons.mute)) {
        handleMuteButton(uiManager);
    }
}

function createCanvasClickHandler(uiManager) {
    return function(event) {
        const { x, y } = getEventCoordinates(event, uiManager);
        handleButtonEvent(x, y, uiManager);
    };
}

function createTouchStartHandler(uiManager) {
    return function(event) {
        event.preventDefault();
        const { x, y } = getTouchCoordinates(event, uiManager);
        handleButtonEvent(x, y, uiManager);
    };
}

function createKeyDownHandler(uiManager) {
    return function(event) {
        if (event.key === 'Escape' || event.keyCode === 27) {
            event.preventDefault();
            handlePauseButton(uiManager);
        }
    };
}

function getEventCoordinates(event, uiManager) {
    let rect = uiManager.world.canvas.getBoundingClientRect();
    let scaleX = uiManager.world.canvas.width / rect.width;
    let scaleY = uiManager.world.canvas.height / rect.height;
    let x = (event.clientX - rect.left) * scaleX;
    let y = (event.clientY - rect.top) * scaleY;
    return { x, y };
}

function getTouchCoordinates(event, uiManager) {
    let rect = uiManager.world.canvas.getBoundingClientRect();
    let touch = event.touches[0];
    let scaleX = uiManager.world.canvas.width / rect.width;
    let scaleY = uiManager.world.canvas.height / rect.height;
    let x = (touch.clientX - rect.left) * scaleX;
    let y = (touch.clientY - rect.top) * scaleY;
    return { x, y };
}

/**
 * Check if point is inside button
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {Object} button - Button configuration
 * @returns {boolean} True if point is inside button
 */
function isPointInButton(x, y, button) {
    return x >= button.x && 
           x <= button.x + button.width &&
           y >= button.y && 
           y <= button.y + button.height;
}

/**
 * Handle pause button click
 * @param {UIManager} uiManager - Reference to UIManager instance
 */
function handlePauseButton(uiManager) {
    if (typeof togglePause === 'function') {
        togglePause();
    } else {
        uiManager.world.isPaused = !uiManager.world.isPaused;
    }
}

/**
 * Handle fullscreen button click
 * @param {UIManager} uiManager - Reference to UIManager instance
 */
function handleFullscreenButton(uiManager) {
    if (typeof toggleFullscreen === 'function') {
        toggleFullscreen();
    } else {
        if (!document.fullscreenElement) {
            uiManager.world.canvas.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
}

/**
 * Handle mute button click
 * @param {UIManager} uiManager - Reference to UIManager instance
 */
function handleMuteButton(uiManager) {
    uiManager.isMuted = !uiManager.isMuted;
    updateMuteState(uiManager);
    localStorage.setItem('elPolloLocoMuted', uiManager.isMuted.toString());
}

/**
 * Update mute state in audio manager
 * @param {UIManager} uiManager - Reference to UIManager instance
 */
function updateMuteState(uiManager) {
    if (uiManager.world.audioManager) {
        uiManager.world.audioManager.setMuted(uiManager.isMuted);
    }
}

/**
 * Remove event listeners (cleanup)
 * @param {UIManager} uiManager - Reference to UIManager instance
 */
function removeEventListeners(uiManager) {
    if (uiManager.onCanvasClick) {
        uiManager.world.canvas.removeEventListener('click', uiManager.onCanvasClick);
    }
    if (uiManager.onTouchStart) {
        uiManager.world.canvas.removeEventListener('touchstart', uiManager.onTouchStart);
    }
    if (uiManager.onKeyDown) {
        document.removeEventListener('keydown', uiManager.onKeyDown);
    }
}
