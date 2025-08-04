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
 * Sets up responsive canvas for different screen sizes and mobile devices
 */
function setupResponsiveCanvas() {
    function resizeCanvas() {
    let canvas = document.getElementById('canvas');
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let isMobile = isMobileDevice();
        
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
    let mexicanTitle = document.querySelector('.mexican-title');
    let brownGround = document.getElementById('brownGround');
    
    if (mexicanTitle) mexicanTitle.style.display = 'none';
    if (brownGround) brownGround.style.display = 'none';
}

/**
 * Sets up container styling for mobile fullscreen
 */
function setupMobileContainer() {
    let container = document.querySelector('.mexican-section');
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
    canvas.style.width = viewportWidth + 'px';
    canvas.style.height = viewportHeight + 'px';
    canvas.style.left = '0px';
    canvas.style.top = '0px';
    
    canvas.width = 720;
    canvas.height = 480;
}

/**
 * Applies horizontal letterboxing for wider screens
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {number} viewportWidth - Current viewport width
 * @param {number} viewportHeight - Current viewport height
 * @param {number} gameAspectRatio - The game's aspect ratio
 */
function applyHorizontalLetterboxing(canvas, viewportWidth, viewportHeight, gameAspectRatio) {
    let gameHeight = viewportHeight;
    let gameWidth = gameHeight * gameAspectRatio;
    let horizontalPadding = (viewportWidth - gameWidth) / 2;
    
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
    let gameWidth = viewportWidth;
    let gameHeight = gameWidth / gameAspectRatio;
    let verticalPadding = (viewportHeight - gameHeight) / 2;
    
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
    let mexicanTitle = document.querySelector('.mexican-title');
    let brownGround = document.getElementById('brownGround');
    
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
    if (!pauseButton) return; // Element doesn't exist
    
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
