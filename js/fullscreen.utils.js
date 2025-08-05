/**
 * Fullscreen utility functions for the game
 */

/**
 * Requests fullscreen mode for the game
 */
function requestFullscreen() {
    let canvas = document.getElementById('canvas');
    
    // Return early if canvas is missing
    if (!canvas) {
        return {};
    }
    
    try {
        tryDocumentFullscreen() || tryCanvasFullscreen(canvas);
    } catch (error) {
        console.log('Error trying to enter fullscreen: ', error);
        return {};
    }
}

/**
 * Attempts to enable fullscreen on the document element
 * @returns {boolean} True if attempt was made, false if not supported
 */
function tryDocumentFullscreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
            .catch(err => console.log('Fullscreen failed: ', err));
        return true;
    } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
        return true;
    } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
        return true;
    } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
        return true;
    }
    return false;
}

/**
 * Attempts to enable fullscreen on the canvas element
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @returns {boolean} True if attempt was made, false if not supported
 */
function tryCanvasFullscreen(canvas) {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen()
            .catch(err => console.log('Canvas fullscreen failed: ', err));
        return true;
    } else if (canvas.webkitRequestFullscreen) {
        canvas.webkitRequestFullscreen();
        return true;
    } else if (canvas.mozRequestFullScreen) {
        canvas.mozRequestFullScreen();
        return true;
    } else if (canvas.msRequestFullscreen) {
        canvas.msRequestFullscreen();
        return true;
    } else {
        console.log('Fullscreen API not supported');
        return false;
    }
}

/**
 * Toggles fullscreen mode for the game
 */
function toggleFullscreen() {
    let canvas = document.getElementById('canvas');
    let fullscreenButton = document.getElementById('fullscreenButton');
    let body = document.body;
    
    // Return early if essential elements are missing
    if (!canvas || !body) {
        return {};
    }
    
    if (!document.fullscreenElement) {
        enterFullscreenMode(canvas, fullscreenButton, body);
    } else {
        exitFullscreenMode(canvas, fullscreenButton, body);
    }
}

/**
 * Enters fullscreen mode with proper scaling and styling
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {HTMLElement} fullscreenButton - The fullscreen toggle button
 * @param {HTMLElement} body - The document body
 */
function enterFullscreenMode(canvas, fullscreenButton, body) {
    requestDocumentFullscreen();
    
    let scaleFactor = calculateScaleFactor();
    document.documentElement.style.setProperty('--scale-factor', scaleFactor);
    
    applyFullscreenStyles(canvas, body, fullscreenButton);
}

/**
 * Requests fullscreen for the document using available API
 */
function requestDocumentFullscreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
    }
}

/**
 * Calculates appropriate scale factor for fullscreen
 * @returns {number} The calculated scale factor
 */
function calculateScaleFactor() {
    let scaleX = window.screen.width / 720;
    let scaleY = window.screen.height / 480;
    return Math.min(scaleX, scaleY) * 0.9;
}

/**
 * Applies styling for fullscreen mode
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {HTMLElement} body - The document body
 * @param {HTMLElement} fullscreenButton - The fullscreen toggle button
 */
function applyFullscreenStyles(canvas, body, fullscreenButton) {
    if (canvas) canvas.classList.add('fullscreen');
    if (body) body.classList.add('fullscreen-active');
    if (fullscreenButton) {
        fullscreenButton.textContent = 'EXIT FULLSCREEN';
        fullscreenButton.classList.add('active');
    }
}

/**
 * Exits fullscreen mode and resets styling
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {HTMLElement} fullscreenButton - The fullscreen toggle button
 * @param {HTMLElement} body - The document body
 */
function exitFullscreenMode(canvas, fullscreenButton, body) {
    exitDocumentFullscreen();
    removeFullscreenStyles(canvas, body, fullscreenButton);
    document.documentElement.style.setProperty('--scale-factor', '1');
}

/**
 * Exits fullscreen using available API
 */
function exitDocumentFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

/**
 * Removes fullscreen styling classes
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {HTMLElement} body - The document body
 * @param {HTMLElement} fullscreenButton - The fullscreen toggle button
 */
function removeFullscreenStyles(canvas, body, fullscreenButton) {
    if (canvas) canvas.classList.remove('fullscreen');
    if (body) body.classList.remove('fullscreen-active');
    if (fullscreenButton) {
        fullscreenButton.textContent = 'FULLSCREEN';
        fullscreenButton.classList.remove('active');
    }
}

/**
 * Handles fullscreen change events and updates UI accordingly
 */
function handleFullscreenChange() {
    let canvas = document.getElementById('canvas');
    let fullscreenButton = document.getElementById('fullscreenButton');
    let body = document.body;
    
    // Return early if essential elements are missing
    if (!canvas || !body) {
        return {};
    }
    
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        resetFullscreenUI(canvas, body, fullscreenButton);
    }
}

/**
 * Resets UI elements when exiting fullscreen
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {HTMLElement} body - The document body
 * @param {HTMLElement} fullscreenButton - The fullscreen toggle button
 */
function resetFullscreenUI(canvas, body, fullscreenButton) {
    if (canvas) {
        canvas.classList.remove('fullscreen');
    }
    if (body) {
        body.classList.remove('fullscreen-active');
    }
    if (fullscreenButton) {
        fullscreenButton.textContent = 'FULLSCREEN';
        fullscreenButton.classList.remove('active');
    }
    
    document.documentElement.style.setProperty('--scale-factor', '1');
}

/**
 * Requests fullscreen if not already active on mobile
 */
function requestMobileFullscreen() {
    if (!document.fullscreenElement && 
        !document.webkitFullscreenElement && 
        !document.msFullscreenElement) {
        requestFullscreen();
    }
}

/**
 * Sets up fullscreen handling for mobile devices
 */
function setupMobileFullscreen() {
    if (isMobileDevice()) {
        document.addEventListener('touchstart', enableFullscreen, { once: true });
    }
}

/**
 * Enables fullscreen on touch for mobile devices
 */
function enableFullscreen() {
    if (isMobileDevice()) {
        setTimeout(() => {
            requestFullscreen();
            if (typeof setupResponsiveCanvas === 'function') {
                setupResponsiveCanvas();
            }
        }, 300);
        
        if (typeof enableAudio === 'function') {
            enableAudio();
        }
    }
}

/**
 * Enables fullscreen on touch for mobile devices
 */
function enableFullscreen() {
    if (isMobileDevice()) {
        setTimeout(() => {
            requestFullscreen();
            if (typeof setupResponsiveCanvas === 'function') {
                setupResponsiveCanvas();
            }
        }, 300);
        
        if (typeof enableAudio === 'function') {
            enableAudio();
        }
    }
}

/**
 * Detects if the current device is a mobile device
 * @returns {boolean} True if device is mobile, false otherwise
 */
function isMobileDevice() {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
}

document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

/**
 * Handles escape key to exit fullscreen
 */
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && document.fullscreenElement) {
        toggleFullscreen();
    }
});
