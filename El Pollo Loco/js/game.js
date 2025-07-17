let canvas;
let world;
let startScreen;
let gameOver;
let keyboard = new Keyboard();
let gameStarted = false;
let mobileControls;

/**
 * Initializes the game and sets up all necessary components
 */
function init() {
    canvas = document.getElementById("canvas");
    let ctx = canvas.getContext('2d');
    
    setupResponsiveCanvas();
    initializeMobileControls(ctx);
    setupMobileFullscreen();
    initializeScreens(ctx);
    setupGameCallbacks();
    startScreenLoop();
    
    console.log('[Game] Start screen initialized');
}

/**
 * Initializes mobile controls and makes necessary objects globally accessible
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 */
function initializeMobileControls(ctx) {
    mobileControls = new MobileControls(canvas, ctx);
    window.keyboard = keyboard;
    window.mobileControls = mobileControls;
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
 * Initializes start screen and game over screen
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 */
function initializeScreens(ctx) {
    startScreen = new StartScreen(canvas, ctx);
    gameOver = new GameOver(canvas, ctx);
}

/**
 * Sets up game callback functions
 */
function setupGameCallbacks() {
    window.onStartGame = function() {
        startGame();
    };
    
    window.onGameRestart = function() {
        restartGame();
    };
}

/**
 * Detects if the current device is a mobile device
 * @returns {boolean} True if device is mobile, false otherwise
 */
function isMobileDevice() {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
}

/**
 * Requests fullscreen mode for the game
 */
function requestFullscreen() {
    const canvas = document.getElementById('canvas');
    
    try {
        tryDocumentFullscreen() || tryCanvasFullscreen(canvas);
    } catch (error) {
        console.log('Error trying to enter fullscreen: ', error);
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
 * Sets up responsive canvas for different screen sizes and mobile devices
 */
function setupResponsiveCanvas() {
    function resizeCanvas() {
        const canvas = document.getElementById('canvas');
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const isMobile = isMobileDevice();
        
        if (isMobile) {
            setupMobileCanvas(canvas, viewportWidth, viewportHeight);
        } else {
            setupDesktopCanvas(canvas);
        }
    }
    
    setupCanvasEventListeners(resizeCanvas);
    resizeCanvas();
}

/**
 * Configures canvas for mobile devices with fullscreen capabilities
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {number} viewportWidth - Current viewport width
 * @param {number} viewportHeight - Current viewport height
 */
function setupMobileCanvas(canvas, viewportWidth, viewportHeight) {
    hideMobileElements();
    setupMobileContainer();
    applyMobileCanvasStyles(canvas);
    handleAspectRatio(canvas, viewportWidth, viewportHeight);
    updateMobileControlsLayout();
    requestMobileFullscreen();
}

/**
 * Hides UI elements on mobile for fullscreen experience
 */
function hideMobileElements() {
    const mexicanTitle = document.querySelector('.mexican-title');
    const brownGround = document.getElementById('brownGround');
    
    if (mexicanTitle) mexicanTitle.style.display = 'none';
    if (brownGround) brownGround.style.display = 'none';
}

/**
 * Sets up container styling for mobile fullscreen
 */
function setupMobileContainer() {
    const container = document.querySelector('.mexican-section');
    if (container) {
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.padding = '0';
        container.style.margin = '0';
    }
}

/**
 * Applies fullscreen styles to canvas for mobile
 * @param {HTMLCanvasElement} canvas - The canvas element
 */
function applyMobileCanvasStyles(canvas) {
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '9999';
    canvas.style.borderRadius = '0';
}
/**
 * Handles aspect ratio preservation for mobile canvas
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {number} viewportWidth - Current viewport width
 * @param {number} viewportHeight - Current viewport height
 */
function handleAspectRatio(canvas, viewportWidth, viewportHeight) {
    const gameAspectRatio = 720 / 480;
    const screenAspectRatio = viewportWidth / viewportHeight;
    
    if (screenAspectRatio > gameAspectRatio) {
        applyHorizontalLetterboxing(canvas, viewportWidth, viewportHeight, gameAspectRatio);
    } else {
        applyVerticalLetterboxing(canvas, viewportWidth, viewportHeight, gameAspectRatio);
    }
}

/**
 * Applies horizontal letterboxing for wider screens
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {number} viewportWidth - Current viewport width
 * @param {number} viewportHeight - Current viewport height
 * @param {number} gameAspectRatio - The game's aspect ratio
 */
function applyHorizontalLetterboxing(canvas, viewportWidth, viewportHeight, gameAspectRatio) {
    const gameHeight = viewportHeight;
    const gameWidth = gameHeight * gameAspectRatio;
    const horizontalPadding = (viewportWidth - gameWidth) / 2;
    
    canvas.style.width = gameWidth + 'px';
    canvas.style.height = viewportHeight + 'px';
    canvas.style.left = horizontalPadding + 'px';
}

/**
 * Applies vertical letterboxing for taller screens
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {number} viewportWidth - Current viewport width
 * @param {number} viewportHeight - Current viewport height
 * @param {number} gameAspectRatio - The game's aspect ratio
 */
function applyVerticalLetterboxing(canvas, viewportWidth, viewportHeight, gameAspectRatio) {
    const gameWidth = viewportWidth;
    const gameHeight = gameWidth / gameAspectRatio;
    const verticalPadding = (viewportHeight - gameHeight) / 2;
    
    canvas.style.width = viewportWidth + 'px';
    canvas.style.height = gameHeight + 'px';
    canvas.style.top = verticalPadding + 'px';
}

/**
 * Updates mobile controls layout if available
 */
function updateMobileControlsLayout() {
    if (mobileControls) {
        mobileControls.updateLayout();
    }
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
 * Configures canvas for desktop with standard dimensions
 * @param {HTMLCanvasElement} canvas - The canvas element
 */
function setupDesktopCanvas(canvas) {
    canvas.style.width = '720px';
    canvas.style.height = '480px';
    canvas.style.position = 'relative';
    canvas.style.transform = 'none';
    canvas.style.borderRadius = '20px';
    
    showDesktopElements();
}

/**
 * Shows UI elements that are hidden on mobile
 */
function showDesktopElements() {
    const mexicanTitle = document.querySelector('.mexican-title');
    const brownGround = document.getElementById('brownGround');
    
    if (mexicanTitle) mexicanTitle.style.display = 'block';
    if (brownGround) brownGround.style.display = 'block';
}

/**
 * Sets up event listeners for canvas resizing
 * @param {Function} resizeCanvas - The resize function to call
 */
function setupCanvasEventListeners(resizeCanvas) {
    resizeCanvas();
    
    window.addEventListener('resize', () => {
        setTimeout(resizeCanvas, 100);
    });
    window.addEventListener('orientationchange', () => {
        setTimeout(resizeCanvas, 300);
    });
    
    document.addEventListener('fullscreenchange', resizeCanvas);
    document.addEventListener('webkitfullscreenchange', resizeCanvas);
    document.addEventListener('msfullscreenchange', resizeCanvas);
}

/**
 * Runs the start screen animation loop
 */
function startScreenLoop() {
    if (startScreen && startScreen.isStartScreenActive()) {
        startScreen.update();
        startScreen.draw();
        requestAnimationFrame(startScreenLoop);
    }
}

/**
 * Starts the main game after initialization
 */
function startGame() {
    if (gameStarted) return;
    
    gameStarted = true;
    console.log('[Game] Starting main game...');
    
    hideStartScreen();
    initializeLevel();
    createWorld();
    setupAudioListeners();
}

/**
 * Hides the start screen when game begins
 */
function hideStartScreen() {
    if (startScreen) {
        startScreen.hide();
    }
}

/**
 * Initializes the game level
 */
function initializeLevel() {
    initLevel1();
    console.log('[Game] Level initialized');
}

/**
 * Creates the game world and starts drawing
 */
function createWorld() {
    world = new World(canvas);
    world.draw();
}

/**
 * Sets up audio activation listeners for first user interaction
 */
function setupAudioListeners() {
    document.addEventListener('click', enableAudio, { once: true });
    document.addEventListener('keydown', enableAudio, { once: true });
}

/**
 * Restarts the game by resetting all game state and creating new instances
 */
function restartGame() {
    console.log('[Game] Restarting game...');
    
    resetGameState();
    clearExistingGame();
    
    setTimeout(() => {
        reinitializeGame();
    }, 100);
}

/**
 * Resets the core game state variables
 */
function resetGameState() {
    gameStarted = false;
}

/**
 * Clears existing world and level data
 */
function clearExistingGame() {
    if (world) {
        world.isPaused = true;
        world = null;
    }
    
    if (typeof level1 !== 'undefined') {
        level1 = null;
    }
}

/**
 * Reinitializes the game with fresh instances
 */
function reinitializeGame() {
    initLevel1();
    console.log('[Game] Level re-initialized');
    
    world = new World(canvas);
    world.isPaused = false;
    world.draw();
    
    gameStarted = true;
    
    console.log('[Game] Game restarted successfully');
}

/**
 * Enables audio on first user interaction
 */
function enableAudio() {
    if (world && world.backgroundMusic) {
        world.startBackgroundMusic();
    }
}

/**
 * Enables fullscreen on touch for mobile devices
 */
function enableFullscreen() {
    if (isMobileDevice()) {
        setTimeout(() => {
            requestFullscreen();
            setupResponsiveCanvas();
        }, 300);
        
        enableAudio();
    }
}

/**
 * Toggles game pause state and updates UI accordingly
 */
function togglePause() {
    if (!gameStarted || !world) return;
    
    if (world) {
        world.togglePause();
        updatePauseButton();
    }
}

/**
 * Updates the pause button text and styling based on game state
 */
function updatePauseButton() {
    let pauseButton = document.getElementById('pauseButton');
    if (world.isPaused) {
        pauseButton.textContent = 'RESUME';
        pauseButton.classList.add('paused');
    } else {
        pauseButton.textContent = 'PAUSE';
        pauseButton.classList.remove('paused');
    }
}

/**
 * Toggles fullscreen mode for the game
 */
function toggleFullscreen() {
    let canvas = document.getElementById('canvas');
    let fullscreenButton = document.getElementById('fullscreenButton');
    let body = document.body;
    
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
    canvas.classList.add('fullscreen');
    body.classList.add('fullscreen-active');
    fullscreenButton.textContent = 'EXIT FULLSCREEN';
    fullscreenButton.classList.add('active');
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
    canvas.classList.remove('fullscreen');
    body.classList.remove('fullscreen-active');
    fullscreenButton.textContent = 'FULLSCREEN';
    fullscreenButton.classList.remove('active');
}

document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

/**
 * Handles fullscreen change events and updates UI accordingly
 */
function handleFullscreenChange() {
    let canvas = document.getElementById('canvas');
    let fullscreenButton = document.getElementById('fullscreenButton');
    let body = document.body;
    
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
    canvas.classList.remove('fullscreen');
    body.classList.remove('fullscreen-active');
    fullscreenButton.textContent = 'FULLSCREEN';
    fullscreenButton.classList.remove('active');
    
    document.documentElement.style.setProperty('--scale-factor', '1');
}

/**
 * Handles escape key to exit fullscreen
 */
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && document.fullscreenElement) {
        toggleFullscreen();
    }
});

/**
 * Event listener for debugging keyboard events
 */
window.addEventListener('keypress', (event) => {
    console.log(event);
});